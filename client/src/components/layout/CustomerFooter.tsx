"use client";

import Link from "next/link";

export default function CustomerFooter() {
  const displayFont = "'Baloo 2', 'Poppins', 'Segoe UI', sans-serif";

  return (
    <footer className="mt-auto flex flex-col">
      {/* Upper Footer */}
      <div className="bg-[#FFFBF8] border-t border-[#F1E1D6] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center">
              <span className="text-[36px] font-extrabold text-[#FF3D57]" style={{ fontFamily: displayFont }}>
                Cravon
              </span>
            </Link>
            <p className="text-[14px] font-medium text-[#8A6F68] mt-1 text-center md:text-left">Discover &amp; Order Delicious Food</p>
          </div>

          {/* Apply for Partner Link */}
          <div className="flex flex-col items-center md:items-end">
            <Link href="/partner/register" className="text-[15px] font-bold text-white bg-linear-to-r from-[#FF3D57] to-[#FF7A30] hover:from-[#E22B45] hover:to-[#E06020] px-8 py-3 rounded-full shadow-md transition-all active:scale-95">
              Apply for Partner
            </Link>
          </div>
        </div>
      </div>

      {/* Lower Footer  */}
      <div className="bg-[#Fdf2ea] border-t border-[#F1E1D6] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <p className="text-[14px] text-[#8A6F68] font-medium text-center">&copy; {new Date().getFullYear()} Cravon Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
