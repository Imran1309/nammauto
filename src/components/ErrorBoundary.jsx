
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#121212', color: '#00FF00', minHeight: '100vh', fontFamily: 'monospace', overflow: 'auto' }}>
          <h1 style={{color: 'red'}}>CRITICAL ERROR</h1>
          <h2 style={{color: 'white'}}>{this.state.error && this.state.error.toString()}</h2>
          <pre style={{ color: '#aaa', whiteSpace: 'pre-wrap', marginTop: '20px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => {
                localStorage.clear();
                window.location.reload();
            }}
            style={{ marginTop: '20px', padding: '15px 30px', background: '#00FF00', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', borderRadius: '8px' }}
          >
            CLEAR CACHE & RELOAD
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
