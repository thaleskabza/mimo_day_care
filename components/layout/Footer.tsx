import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-white text-2xl font-bold mb-4">MiMo Day Care</h3>
            <p className="text-gray-400 text-sm">
              Providing quality care and education for children in a safe, nurturing environment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-400 hover:text-white text-sm">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/fees" className="text-gray-400 hover:text-white text-sm">
                  Fees
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-gray-400 hover:text-white text-sm">
                  Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* For Parents */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              For Parents
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-gray-400 hover:text-white text-sm">
                  Apply Now
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white text-sm">
                  Parent Portal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Contact Info
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>123 Care Street</li>
              <li>City, State 12345</li>
              <li className="mt-4">Phone: (555) 123-4567</li>
              <li>Email: info@mimodaycare.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            &copy; {currentYear} MiMo Day Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
