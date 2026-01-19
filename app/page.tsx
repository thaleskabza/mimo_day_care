import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome to MiMo Day Care
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Where every child&apos;s journey begins with care, learning, and endless possibilities
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/apply"
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg text-lg"
                >
                  Apply Now
                </Link>
                <Link
                  href="/programs"
                  className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors border-2 border-white text-lg"
                >
                  View Programs
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose MiMo Day Care?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide a nurturing environment where children thrive through play-based learning and expert care
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-lg bg-blue-50">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Expert Curriculum</h3>
                <p className="text-gray-700">
                  Research-based programs designed for each developmental stage, from infants to pre-K
                </p>
              </div>

              <div className="text-center p-8 rounded-lg bg-purple-50">
                <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Qualified Teachers</h3>
                <p className="text-gray-700">
                  Certified educators with specialized training in early childhood development
                </p>
              </div>

              <div className="text-center p-8 rounded-lg bg-pink-50">
                <div className="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Safe & Secure</h3>
                <p className="text-gray-700">
                  State-licensed facility with strict safety protocols and health monitoring
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Platform</h2>
              <p className="text-xl text-gray-600">
                Comprehensive tools for parents, teachers, and administrators
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">For Parents</h3>
                <ul className="space-y-2 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Online application and enrollment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Direct messaging with teachers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Track child progress and activities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Access important documents</span>
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Parent Portal
                </Link>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">👩‍🏫</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">For Teachers</h3>
                <ul className="space-y-2 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Access class rosters</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>View child profiles and allergies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Communicate with parents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Manage classroom activities</span>
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="block w-full text-center bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
                >
                  Teacher Portal
                </Link>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">⚙️</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">For Administrators</h3>
                <ul className="space-y-2 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">✓</span>
                    <span>Review and approve applications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">✓</span>
                    <span>Manage enrollments and classes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">✓</span>
                    <span>Oversee staff and programs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">✓</span>
                    <span>Generate reports and metrics</span>
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="block w-full text-center bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition-colors font-medium"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our community of families and give your child the best start in life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/apply"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg text-lg"
              >
                Apply for Enrollment
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors border-2 border-white text-lg"
              >
                Schedule a Tour
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
