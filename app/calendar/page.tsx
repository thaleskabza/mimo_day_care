import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function CalendarPage() {
  const currentYear = new Date().getFullYear();

  const events = [
    {
      month: "January",
      items: [
        { date: "1", name: "New Year's Day - Closed" },
        { date: "15", name: "Martin Luther King Jr. Day - Closed" },
      ],
    },
    {
      month: "February",
      items: [
        { date: "14", name: "Valentine's Day Celebration" },
        { date: "19", name: "Presidents' Day - Closed" },
      ],
    },
    {
      month: "March",
      items: [
        { date: "17", name: "St. Patrick's Day Activities" },
        { date: "20", name: "Spring Begins - Outdoor Week" },
      ],
    },
    {
      month: "April",
      items: [
        { date: "7", name: "Spring Break Week" },
        { date: "22", name: "Earth Day Activities" },
      ],
    },
    {
      month: "May",
      items: [
        { date: "10", name: "Mother's Day Celebration" },
        { date: "27", name: "Memorial Day - Closed" },
      ],
    },
    {
      month: "June",
      items: [
        { date: "15", name: "Father's Day Celebration" },
        { date: "21", name: "Summer Begins - Water Play Week" },
      ],
    },
    {
      month: "July",
      items: [
        { date: "4", name: "Independence Day - Closed" },
        { date: "15-19", name: "Summer Camp Week" },
      ],
    },
    {
      month: "August",
      items: [
        { date: "15", name: "Back to School Preparation" },
        { date: "29", name: "New Semester Open House" },
      ],
    },
    {
      month: "September",
      items: [
        { date: "2", name: "Labor Day - Closed" },
        { date: "23", name: "Fall Begins - Harvest Week" },
      ],
    },
    {
      month: "October",
      items: [
        { date: "14", name: "Columbus Day - Closed" },
        { date: "31", name: "Halloween Costume Party" },
      ],
    },
    {
      month: "November",
      items: [
        { date: "11", name: "Veterans Day - Closed" },
        { date: "28-29", name: "Thanksgiving Break - Closed" },
      ],
    },
    {
      month: "December",
      items: [
        { date: "15", name: "Winter Concert" },
        { date: "24-31", name: "Winter Break - Closed" },
      ],
    },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Calendar & Events</h1>
            <p className="text-xl text-indigo-100 max-w-3xl">
              Important dates, holidays, and special events for {currentYear}
            </p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-7 h-7 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Operating Hours
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium">Monday - Friday</span>
                  <span>6:30 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium">Saturday</span>
                  <span>Closed</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
                <p className="text-sm text-yellow-900">
                  <span className="font-semibold">Note:</span> Extended hours available upon request for enrolled families.
                  Please contact the office for arrangements.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-7 h-7 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Holiday Closures
              </h2>
              <p className="text-gray-700 mb-4">
                We are closed on major federal holidays to allow our staff time with their families.
                Tuition remains the same during holiday closures.
              </p>
              <div className="bg-indigo-50 border border-indigo-200 rounded p-4">
                <p className="text-sm text-indigo-900 mb-2 font-semibold">
                  Scheduled Closures:
                </p>
                <ul className="text-sm text-indigo-900 space-y-1">
                  <li>• New Year&apos;s Day</li>
                  <li>• Martin Luther King Jr. Day</li>
                  <li>• Presidents&apos; Day</li>
                  <li>• Memorial Day</li>
                  <li>• Independence Day</li>
                  <li>• Labor Day</li>
                  <li>• Columbus Day</li>
                  <li>• Veterans Day</li>
                  <li>• Thanksgiving & Day After</li>
                  <li>• Winter Break (Dec 24-31)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Annual Calendar */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {currentYear} Events Calendar
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((monthData) => (
                <div key={monthData.month} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4">
                    <h3 className="text-xl font-bold">{monthData.month}</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {monthData.items.map((event, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded text-sm mr-3 flex-shrink-0">
                            {event.date}
                          </span>
                          <span className="text-gray-700 text-sm">{event.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Programs */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recurring Programs</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Music Time</h3>
                <p className="text-gray-600 text-center text-sm mb-3">Every Tuesday & Thursday</p>
                <p className="text-gray-700 text-sm">
                  Interactive music sessions with singing, dancing, and instrument exploration.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Story Hour</h3>
                <p className="text-gray-600 text-center text-sm mb-3">Daily at 2:00 PM</p>
                <p className="text-gray-700 text-sm">
                  Daily reading sessions to foster a love of books and develop literacy skills.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Outdoor Play</h3>
                <p className="text-gray-600 text-center text-sm mb-3">Daily (weather permitting)</p>
                <p className="text-gray-700 text-sm">
                  Structured outdoor activities promoting physical development and social skills.
                </p>
              </div>
            </div>
          </div>

          {/* Parent Engagement */}
          <div className="mt-16 bg-indigo-50 border border-indigo-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Parent Engagement Opportunities</h2>
            <p className="text-gray-700 mb-6">
              We encourage parent involvement and offer various opportunities throughout the year:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Quarterly parent-teacher conferences</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Monthly family events and celebrations</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Volunteer opportunities in the classroom</span>
                </li>
              </ul>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Workshops on parenting and child development</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Annual family picnic and field day</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Seasonal concerts and performances</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
