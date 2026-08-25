"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-[#A24B50] text-sm font-medium mb-1">Something went wrong</p>
              <p className="text-[#A9908D] text-xs">{this.state.error?.message}</p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="mt-3 px-3 py-1.5 rounded text-xs text-[#A24B50] bg-[#A24B50]/10 hover:bg-[#A24B50]/20 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
