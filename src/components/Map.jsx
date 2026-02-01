import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Child component to update map center when props change
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
        map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Component to handle flying to location
const FlyToLocation = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 15, {
                duration: 2
            });
        }
    }, [coords, map]);
    return null;
};

// Utility to Geocode Address
const geocodeAddress = async (address) => {
    if (!address) return null;
    
    // Helper to fetch from OSM
    const fetchCoords = async (query) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }
        } catch (e) {
            console.error("Geocode error:", e);
        }
        return null;
    };

    // 1. Try with strict "Salem, India" suffix
    let coords = await fetchCoords(`${address}, Salem, India`);
    if (coords) return coords;

    // 2. Try with just "Salem" suffix (looser)
    coords = await fetchCoords(`${address}, Salem`);
    if (coords) return coords;

    // 3. Try exact address (rarely works but good fallback)
    coords = await fetchCoords(address);
    if (coords) return coords;

    return null;
};

// Fix map rendering issues when inside animations/tabs
const ResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
        map.invalidateSize();
    }, 400); // Wait for animation to finish
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// Utility to Reverse Geocode (Coords -> Address)
const reverseGeocode = async (lat, lon) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        if (data && data.display_name) {
            // Simplify address: Take first 3 parts for brevity
            return data.display_name.split(',').slice(0, 3).join(',');
        }
    } catch (error) {
        console.error("Reverse geocode failed", error);
    }
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`; // Fallback to coords
};

// Component to handle bounds
const BoundsUpdater = ({ markers }) => {
    const map = useMap();
    useEffect(() => {
        if (markers.length > 0) {
            const group = new L.FeatureGroup(markers.map(pos => L.marker(pos)));
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }, [markers, map]);
    return null;
};

const Map = ({ 
  center = [11.6643, 78.1460], // Default to Salem
  zoom = 13, 
  drivers = [],
  onLocationFound,
  onDistanceChange,
  onPickupChange, // NEW: Update parent text
  onDropChange,   // NEW: Update parent text
  pickup,
  drop
}) => {
  const [userLocation, setUserLocation] = React.useState(null);
  const [loadingLoc, setLoadingLoc] = React.useState(false);
  const [tracking, setTracking] = React.useState(false);
  const [mapStyle, setMapStyle] = React.useState('dark'); // dark, light, satellite
  
  const [pickupPos, setPickupPos] = React.useState(null);
  const [dropPos, setDropPos] = React.useState(null);
  const [routePolyline, setRoutePolyline] = React.useState([]);

  const watchId = React.useRef(null);

  const [isSearching, setIsSearching] = React.useState(false);

  // Geocode Pickup & Drop when they change strings
  useEffect(() => {
     const resolveLocations = async () => {
         setIsSearching(true);
         
         // Only geocode if it looks like a real address (longer than 3 chars)
         if (pickup && pickup.length > 3 && pickup !== "Current Location (GPS)") {
             const coords = await geocodeAddress(pickup);
             if (coords) {
                 setPickupPos(coords);
             } else {
                 // Optional: toast.error("Pickup location not found");
             }
         } else if (pickup === "Current Location (GPS)" && userLocation) {
             setPickupPos(userLocation);
         }

         if (drop && drop.length > 3) {
             const coords = await geocodeAddress(drop);
             if (coords) {
                 setDropPos(coords);
             }
         }
         
         setIsSearching(false);
     };

     // Debounce slightly to avoid API spam
     const timer = setTimeout(resolveLocations, 1000);
     return () => clearTimeout(timer);
  }, [pickup, drop, userLocation]);

  // Calculate Distance and Line
  useEffect(() => {
      if (pickupPos && dropPos) {
          setRoutePolyline([pickupPos, dropPos]);
          
          // Haversine Distance Calculation
          const R = 6371; // Radius of the earth in km
          const dLat = (dropPos[0] - pickupPos[0]) * (Math.PI/180);
          const dLon = (dropPos[1] - pickupPos[1]) * (Math.PI/180); 
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(pickupPos[0] * (Math.PI/180)) * Math.cos(dropPos[0] * (Math.PI/180)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          const d = R * c; // Distance in km
          
          if (onDistanceChange) onDistanceChange(d.toFixed(1));

      } else {
          setRoutePolyline([]);
          if (onDistanceChange) onDistanceChange(0);
      }
  }, [pickupPos, dropPos, onDistanceChange]);


  // Stop tracking on unmount
  useEffect(() => {
    return () => {
        if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const handleLocateUser = () => {
    setLoadingLoc(true);
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        setLoadingLoc(false);
        return;
    }
    
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    watchId.current = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const newPos = [latitude, longitude];
            
            setUserLocation(newPos);
            setLoadingLoc(false);
            setTracking(true);
            if (onLocationFound && !pickup) onLocationFound(newPos); // Only auto-fill if empty
        },
        (err) => {
            console.warn("GPS Error:", err);
            setLoadingLoc(false);
        },
        options
    );
  };

  // Custom Pulsing Icon for User
  const userIcon = L.divIcon({
    className: 'custom-user-icon',
    html: `<div style="width: 20px; height: 20px; background: #00FF00; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px #00FF00; animation: pulse 1.5s infinite;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const pickupIcon = L.divIcon({
      className: 'pickup-icon',
      html: `<div style="color: #00FF00; font-size: 24px; filter: drop-shadow(0 0 5px black);">📍</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24]
  });

  const dropIcon = L.divIcon({
      className: 'drop-icon',
      html: `<div style="color: #FF0000; font-size: 24px; filter: drop-shadow(0 0 5px black);">🏁</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24]
  });

  // Get Tile Layer URL based on style
  const getTileLayer = () => {
      switch(mapStyle) {
          case 'light':
              return {
                  url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                  attr: '&copy; OpenStreetMap &copy; CARTO'
              };
          case 'satellite':
              return {
                  url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                  attr: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              };
          case 'dark':
          default:
              return {
                  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                  attr: '&copy; OpenStreetMap &copy; CARTO'
              };
      }
  };

  const currentLayer = getTileLayer();
  const allMarkers = [pickupPos, dropPos].filter(Boolean);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-[--app-primary]/30 shadow-[0_0_30px_rgba(0,255,0,0.2)] relative z-10 group bg-[#121212]">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        attributionControl={false}
        zoomControl={false} // Disable default top-left zoom
        className="w-full h-full"
        style={{ background: '#121212' }}
      >
        <TileLayer
          key={mapStyle} 
          attribution={currentLayer.attr}
          url={currentLayer.url}
        />
        
        <ZoomControl position="bottomright" /> {/* Move Zoom to Bottom Right */}

        <ResizeHandler />
        {!userLocation && allMarkers.length === 0 && <MapUpdater center={center} />}
        {allMarkers.length > 0 && <BoundsUpdater markers={allMarkers} />}
        
        <FlyToLocation coords={userLocation} />

        {/* Route Line - Blue Dashed Line */}
        {pickupPos && dropPos && (
             <React.Fragment>
                <Polyline 
                    positions={[pickupPos, dropPos]} 
                    color="#0088FF" // Solid Blue
                    weight={5}
                    opacity={0.9}
                />
                {/* Pickup Marker */}
                <Marker 
                    position={pickupPos} 
                    icon={pickupIcon} 
                    zIndexOffset={900}
                    draggable={true}
                    eventHandlers={{
                        dragend: async (e) => {
                            const { lat, lng } = e.target.getLatLng();
                            setPickupPos([lat, lng]);
                            if (onPickupChange) {
                                const addr = await reverseGeocode(lat, lng);
                                onPickupChange(addr);
                            }
                        }
                    }}
                >
                    <Popup>Pickup: {pickup}<br/><span style={{fontSize: '10px', color: '#666'}}>(Drag to adjust)</span></Popup>
                </Marker>
                {/* Drop Marker */}
                <Marker 
                    position={dropPos} 
                    icon={dropIcon} 
                    zIndexOffset={900}
                    draggable={true}
                    eventHandlers={{
                        dragend: async (e) => {
                             const { lat, lng } = e.target.getLatLng();
                             setDropPos([lat, lng]);
                             if (onDropChange) {
                                 const addr = await reverseGeocode(lat, lng);
                                 onDropChange(addr);
                             }
                        }
                    }}
                >
                    <Popup>Drop: {drop}<br/><span style={{fontSize: '10px', color: '#666'}}>(Drag to adjust)</span></Popup>
                </Marker>
            </React.Fragment>
        )}

        {/* User GPS Marker */}
        {userLocation && (
            <Marker position={userLocation} icon={userIcon} zIndexOffset={1000}>
                <Popup>You are here</Popup>
            </Marker>
        )}

        {/* Mock Drivers */}
        {drivers.map((driver) => (
            <Marker key={driver.id} position={driver.position} icon={DefaultIcon}>
                <Popup>{driver.name} - {driver.vehicle}</Popup>
            </Marker>
        ))}

      </MapContainer>
      
      {/* Map Controls (Style Switcher) - Horizontal Top Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] flex gap-2">
          <div className="bg-black/80 backdrop-blur-md rounded-full border border-white/20 p-1.5 flex gap-1 shadow-2xl">
             <button 
                onClick={(e) => { e.stopPropagation(); setMapStyle('dark'); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mapStyle === 'dark' ? 'bg-[--app-primary] text-black shadow-[0_0_15px_rgba(0,255,0,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
             >
                Dark
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); setMapStyle('light'); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mapStyle === 'light' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
             >
                Light
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); setMapStyle('satellite'); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mapStyle === 'satellite' ? 'bg-blue-600 text-white shadow-[0_0_15px_blue]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
             >
                3D Sat
             </button>
          </div>
      </div>
      
      {/* Live Badge - Top Right */}
      {/* Geocoding Loading Indicator */}
      {isSearching && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-black/80 px-4 py-2 rounded-full text-white font-bold text-xs flex items-center gap-2 shadow-lg">
             <div className="w-4 h-4 rounded-full border-2 border-[--app-primary] border-t-transparent animate-spin"/>
             Searching Location...
          </div>
      )}

      <div className="absolute top-4 right-4 z-[1000] bg-black/80 backdrop-blur text-[--app-primary] px-3 py-1 rounded-full text-xs font-bold border border-[--app-primary]/50 pointer-events-none">
        LIVE MAP
      </div>

      {/* GPS Button - Bottom Right (Stacked above Zoom Controls) */}
      <button 
        onClick={handleLocateUser}
        className="absolute bottom-24 right-3 z-[1000] bg-black text-white p-2 rounded-md shadow-lg border-2 border-white/20 hover:bg-[--app-primary] hover:text-black hover:border-black transition-all active:scale-95 flex items-center justify-center"
        title="Use my current location"
      >
        {loadingLoc ? (
           <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        )}
      </button>

      {/* Helper Text - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/90 backdrop-blur text-white px-4 py-2 rounded-xl text-xs font-medium border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-[200px]">
         Click the target icon to find your location instantly.
      </div>
    </div>
  );
};

export default Map;
