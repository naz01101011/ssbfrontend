import React from 'react';

// Generic error boundary. Catches render/lifecycle errors thrown by its
// children (e.g. the react-adsense widget throwing when a slot has no
// width) and swallows them instead of letting them unmount the whole app.
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // eslint-disable-next-line no-console
        console.error('ErrorBoundary caught an error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || null;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
