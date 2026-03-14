import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="library-shell">
          <div className="library-notice library-error" role="alert">
            <h2>Something went wrong</h2>
            <p>The application encountered an error. Please refresh the page to continue.</p>
            {process.env.NODE_ENV === "development" && (
              <details style={{ marginTop: "1rem", fontSize: "0.85rem", textAlign: "left" }}>
                <summary>Error details</summary>
                <pre style={{ background: "rgba(0,0,0,0.1)", padding: "0.5rem", borderRadius: "0.3rem", overflow: "auto" }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
