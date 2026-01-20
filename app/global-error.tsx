"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Critical Error</h1>
            <p className="text-lg text-gray-700 mb-4">
              A critical error occurred. Please refresh the page.
            </p>
            {error.digest && (
              <p className="text-sm text-gray-500 mb-6">Error ID: {error.digest}</p>
            )}
            <button
              onClick={reset}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
