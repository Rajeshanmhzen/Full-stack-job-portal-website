import React from 'react';
import { Button, Card, Alert } from '@mantine/core';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <FaExclamationTriangle className="mx-auto text-red-500 mb-4" size={48} />
            
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert color="red" className="mb-4 text-left">
                <details>
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="text-xs mt-2 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </Alert>
            )}

            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={this.handleReset}
                leftSection={<FaRedo size={14} />}
              >
                Try Again
              </Button>
              <Button 
                onClick={this.handleReload}
                leftSection={<FaRedo size={14} />}
              >
                Reload Page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;