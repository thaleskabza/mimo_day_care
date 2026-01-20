"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center px-4 max-w-2xl">
        <div className="mb-6">
          <svg
            className="w-24 h-24 text-red-600 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Something Went Wrong</h1>
        <p className="text-xl text-gray-600 mb-2">
          We&apos;re sorry, but an unexpected error occurred.
        </p>
        {error.digest && (
          <p className="text-sm text-gray-500 mb-8">
            Error ID: {error.digest}
          </p>
        )}
        <div className="bg-white rounded-lg p-6 mb-8 border border-red-200">
          <h3 className="font-semibold text-gray-900 mb-2">Error Details:</h3>
          <p className="text-sm text-gray-700 font-mono">
            {error.message || "An unknown error occurred"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-red-600 border-2 border-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-8">
          If this problem persists, please{" "}
          <Link href="/contact" className="text-red-600 hover:text-red-700 underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
