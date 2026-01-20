import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About MiMo Day Care</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Providing exceptional care and early education for children since our founding
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                At MiMo Day Care, we believe every child deserves a nurturing environment where they can
                learn, grow, and thrive. Our mission is to provide high-quality early childhood education
                that fosters creativity, curiosity, and confidence.
              </p>
              <p className="text-lg text-gray-700">
                We partner with families to support each child&apos;s unique developmental journey through
                play-based learning, structured activities, and compassionate care.
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Values</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="text-gray-700">Safety and well-being of every child</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="text-gray-700">Inclusive and diverse learning environment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="text-gray-700">Strong family partnerships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="text-gray-700">Qualified and caring educators</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span className="text-gray-700">Continuous improvement and learning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              What Makes Us Different
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Curriculum Excellence</h3>
                <p className="text-gray-600">
                  Research-based curriculum that balances structured learning with creative play
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Educators</h3>
                <p className="text-gray-600">
                  Certified teachers with specialized training in early childhood development
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe Environment</h3>
                <p className="text-gray-600">
                  Secure facilities with strict safety protocols and health monitoring
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accreditation & Licensing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gray-100 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Accreditation & Licensing</h2>
            <p className="text-lg text-gray-700 mb-4">
              MiMo Day Care is fully licensed and meets all state requirements for child care facilities.
              Our programs are designed to exceed industry standards for safety, education, and care.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">State Licensed Facility</h4>
                  <p className="text-gray-600">Meeting all regulatory requirements</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Background Checked Staff</h4>
                  <p className="text-gray-600">All employees undergo thorough screening</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">CPR & First Aid Certified</h4>
                  <p className="text-gray-600">Every teacher trained in emergency response</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Health & Safety Compliance</h4>
                  <p className="text-gray-600">Regular inspections and maintenance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
