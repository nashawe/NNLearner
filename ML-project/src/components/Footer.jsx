export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center text-gray-600 text-sm">
        <div className="mb-4 md:mb-0">
          © 2025 YourSiteName. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-black transition-colors">
            About
          </a>
          <a href="#" className="hover:text-black transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
