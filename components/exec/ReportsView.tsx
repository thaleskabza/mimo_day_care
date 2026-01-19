"use client";

import { useState, useEffect } from "react";

type ReportType = "overview" | "enrollment" | "application" | "capacity" | "financial";

export default function ReportsView() {
  const [reportType, setReportType] = useState<ReportType>("overview");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/exec/reports?type=${reportType}`);
      const data = await response.json();

      if (response.ok) {
        setReport(data.report);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selector */}
      <div>
        <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
          Select Report Type
        </label>
        <select
          id="reportType"
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)}
          className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="overview">Overview Report</option>
          <option value="enrollment">Enrollment Report</option>
          <option value="application">Application Report</option>
          <option value="capacity">Capacity Report</option>
          <option value="financial">Financial Report</option>
        </select>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="text-gray-600">Loading report...</div>
      ) : report ? (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {report.type} Report
              </h3>
              <span className="text-sm text-gray-500">
                Generated: {new Date(report.generatedAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-6">
            {report.type === "overview" && <OverviewReport data={report} />}
            {report.type === "enrollment" && <EnrollmentReport data={report} />}
            {report.type === "application" && <ApplicationReport data={report} />}
            {report.type === "capacity" && <CapacityReport data={report} />}
            {report.type === "financial" && <FinancialReport data={report} />}
          </div>
        </div>
      ) : (
        <div className="text-gray-600">No report data available</div>
      )}
    </div>
  );
}

function OverviewReport({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="border border-gray-200 rounded p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Enrollments</h4>
        <p className="text-2xl font-bold text-gray-900">{data.summary.enrollments.total}</p>
        <p className="text-sm text-gray-600">Active: {data.summary.enrollments.active}</p>
      </div>
      <div className="border border-gray-200 rounded p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Applications</h4>
        <p className="text-2xl font-bold text-gray-900">{data.summary.applications.total}</p>
      </div>
      <div className="border border-gray-200 rounded p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Programs</h4>
        <p className="text-2xl font-bold text-gray-900">{data.summary.programs.total}</p>
      </div>
      <div className="border border-gray-200 rounded p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Classes</h4>
        <p className="text-2xl font-bold text-gray-900">{data.summary.classes.total}</p>
      </div>
      <div className="border border-gray-200 rounded p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Teachers</h4>
        <p className="text-2xl font-bold text-gray-900">{data.summary.staff.totalTeachers}</p>
      </div>
    </div>
  );
}

function EnrollmentReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Enrollments by Status</h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {data.byStatus.map((item: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              <p className="text-sm text-gray-600 capitalize">{item.status.toLowerCase()}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Enrollments by Program</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-700">Program</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Total</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Active</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Pending</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Paused</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Ended</th>
              </tr>
            </thead>
            <tbody>
              {data.byProgram.map((program: any, index: number) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 text-sm text-gray-900">{program.programName}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{program.total}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{program.active}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{program.pending}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{program.paused}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{program.ended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ApplicationReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Conversion Rate:</span> {data.conversionRate}% of submitted applications are approved
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Applications by Status</h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {data.byStatus.map((item: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              <p className="text-sm text-gray-600 capitalize">{item.status.replace('_', ' ').toLowerCase()}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Applications by Program</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-700">Program</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Total</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Approved</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Waitlisted</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Rejected</th>
              </tr>
            </thead>
            <tbody>
              {data.byProgram.map((program: any, index: number) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 text-sm text-gray-900">{program.programName}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{program.total}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{program.approved}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{program.waitlisted}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{program.rejected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CapacityReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="border border-gray-200 rounded p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{data.summary.totalCapacity}</p>
          <p className="text-sm text-gray-600">Total Capacity</p>
        </div>
        <div className="border border-gray-200 rounded p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{data.summary.totalEnrolled}</p>
          <p className="text-sm text-gray-600">Enrolled</p>
        </div>
        <div className="border border-gray-200 rounded p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{data.summary.totalAvailable}</p>
          <p className="text-sm text-gray-600">Available</p>
        </div>
        <div className="border border-gray-200 rounded p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{data.summary.overallUtilization}%</p>
          <p className="text-sm text-gray-600">Utilization</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Capacity by Class</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-700">Class</th>
                <th className="text-left py-2 text-sm font-medium text-gray-700">Program</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Capacity</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Enrolled</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Available</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {data.byClass.map((cls: any, index: number) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 text-sm text-gray-900">{cls.className}</td>
                  <td className="py-2 text-sm text-gray-600">{cls.programName}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{cls.capacity}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{cls.enrolled}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{cls.available}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{cls.utilizationPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FinancialReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      {data.note && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-sm text-yellow-900">{data.note}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-gray-200 rounded p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            ${data.summary.totalMonthlyRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Total Monthly Revenue</p>
        </div>
        <div className="border border-gray-200 rounded p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{data.summary.totalActiveEnrollments}</p>
          <p className="text-sm text-gray-600">Active Enrollments</p>
        </div>
        <div className="border border-gray-200 rounded p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            ${data.summary.averageRevenuePerEnrollment.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Average Revenue/Enrollment</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Revenue by Program</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-700">Program</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Enrollments</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Monthly Revenue</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Average Fee</th>
              </tr>
            </thead>
            <tbody>
              {data.byProgram.map((program: any, index: number) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 text-sm text-gray-900">{program.programName}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">{program.activeEnrollments}</td>
                  <td className="py-2 text-sm text-gray-600 text-right">
                    ${program.monthlyRevenue.toFixed(2)}
                  </td>
                  <td className="py-2 text-sm text-gray-600 text-right">
                    ${program.averageFee.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
