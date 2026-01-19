"use client";

import { useState, useEffect } from "react";

interface Metrics {
  enrollments: {
    total: number;
    active: number;
    pending: number;
    paused: number;
    ended: number;
    activePercent: number;
  };
  applications: {
    total: number;
    submitted: number;
    underReview: number;
    approved: number;
    waitlisted: number;
    rejected: number;
    approvalRate: number;
  };
  programs: {
    total: number;
    breakdown: Array<{
      name: string;
      capacity: number;
      classCount: number;
      applicationCount: number;
    }>;
  };
  classes: {
    total: number;
    averageUtilization: number;
    utilization: Array<{
      className: string;
      programName: string;
      capacity: number;
      enrolled: number;
      utilizationPercent: number;
    }>;
  };
  staff: {
    totalTeachers: number;
    averageClassesPerTeacher: number;
  };
  trends: {
    recentApplications30Days: number;
    recentEnrollments30Days: number;
    recentMessages30Days: number;
    activeThreads30Days: number;
  };
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/v1/exec/metrics");
      const data = await response.json();

      if (response.ok) {
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading metrics...</div>;
  }

  if (!metrics) {
    return <div className="text-gray-600">Failed to load metrics</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Active Enrollments</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{metrics.enrollments.active}</div>
          <div className="mt-2 text-sm text-gray-600">
            {metrics.enrollments.activePercent}% of total ({metrics.enrollments.total})
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Total Applications</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{metrics.applications.total}</div>
          <div className="mt-2 text-sm text-gray-600">
            {metrics.applications.approvalRate}% approval rate
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Class Utilization</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics.classes.averageUtilization}%
          </div>
          <div className="mt-2 text-sm text-gray-600">{metrics.classes.total} classes</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">Teaching Staff</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{metrics.staff.totalTeachers}</div>
          <div className="mt-2 text-sm text-gray-600">
            {metrics.staff.averageClassesPerTeacher} avg classes/teacher
          </div>
        </div>
      </div>

      {/* Enrollment Breakdown */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Enrollment Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">{metrics.enrollments.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-yellow-600">{metrics.enrollments.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-600">{metrics.enrollments.paused}</div>
              <div className="text-sm text-gray-600">Paused</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-600">{metrics.enrollments.ended}</div>
              <div className="text-sm text-gray-600">Ended</div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Pipeline */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Application Pipeline</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600">{metrics.applications.submitted}</div>
              <div className="text-sm text-gray-600">Submitted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-yellow-600">{metrics.applications.underReview}</div>
              <div className="text-sm text-gray-600">Under Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">{metrics.applications.approved}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-600">{metrics.applications.waitlisted}</div>
              <div className="text-sm text-gray-600">Waitlisted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-red-600">{metrics.applications.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Programs Overview</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Program</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-700">Capacity</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-700">Classes</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-700">Applications</th>
                </tr>
              </thead>
              <tbody>
                {metrics.programs.breakdown.map((program, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-900">{program.name}</td>
                    <td className="py-2 text-sm text-gray-600 text-right">{program.capacity}</td>
                    <td className="py-2 text-sm text-gray-600 text-right">{program.classCount}</td>
                    <td className="py-2 text-sm text-gray-600 text-right">{program.applicationCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity (Last 30 Days)</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600">
                {metrics.trends.recentApplications30Days}
              </div>
              <div className="text-sm text-gray-600">New Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">
                {metrics.trends.recentEnrollments30Days}
              </div>
              <div className="text-sm text-gray-600">New Enrollments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-purple-600">
                {metrics.trends.recentMessages30Days}
              </div>
              <div className="text-sm text-gray-600">Messages Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-indigo-600">
                {metrics.trends.activeThreads30Days}
              </div>
              <div className="text-sm text-gray-600">Active Conversations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
