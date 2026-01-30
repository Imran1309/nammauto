import React from 'react';
import { Star } from 'lucide-react';

const Reviews = () => {
  const reviews = [
    { name: "Priya Sharma", role: "Daily Commuter", rating: 5, text: "NammAuto has changed my daily travel. The drivers are polite and the app is super fast!" },
    { name: "Rahul Verma", role: "Student", rating: 4, text: "Great app for college students. Affordable prices and quick booking." },
    { name: "Anitha Raj", role: "Office Worker", rating: 5, text: "I feel safe using NammAuto late at night. The live tracking is a lifesaver." },
    { name: "David John", role: "Tourist", rating: 5, text: "Easiest way to get around the city. Love the vibrant design of the app too!" },
    { name: "Karthik N", role: "Driver Partner", rating: 5, text: "As a driver, I earn better with NammAuto. Payments are on time and support is good." },
    { name: "Sneha P", role: "Teacher", rating: 4, text: "Reliable service. Would love to see more auto options in the future." },
  ];

  return (
    <div className="pt-24 min-h-screen bg-[--app-bg] font-[--font-body]">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-[--font-display] font-bold mb-4 text-[--app-primary]">What people say</h1>
          <p className="text-xl text-[--app-secondary]/80 font-medium">Trusted by thousands of riders and drivers</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="p-6 md:p-8 rounded-3xl bg-[--app-surface] hover:bg-[--app-surface]/80 border border-[--app-primary]/10 hover:border-[--app-primary] hover:shadow-xl hover:shadow-[--app-primary]/10 transition-all hover:-translate-y-1">
              <div className="flex gap-1 text-[--app-secondary] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-[--app-primary]/20"} />
                ))}
              </div>
              <p className="text-[--app-primary]/80 font-medium text-lg leading-relaxed mb-6">"{review.text}"</p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[--app-primary] to-[--app-secondary] flex items-center justify-center text-black font-bold text-lg border border-[--app-primary]">
                    {review.name.charAt(0)}
                 </div>
                 <div>
                    <div className="font-bold text-[--app-secondary]">{review.name}</div>
                    <div className="text-xs font-bold text-[--app-primary]/50 uppercase">{review.role}</div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
