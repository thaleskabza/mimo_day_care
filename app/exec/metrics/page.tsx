"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MetricsDashboard from "@/components/exec/MetricsDashboard";

export default function ExecutiveMetricsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Metrics</h1>
            <p className="mt-2 text-sm text-gray-600">
              Aggregated metrics and key performance indicators
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Privacy Notice:</span> All data is aggregated and anonymized. No individual child identifiers are included in these metrics.
            </p>
          </div>

          <MetricsDashboard />
        </div>
      </div>
    </div>
  );
}
