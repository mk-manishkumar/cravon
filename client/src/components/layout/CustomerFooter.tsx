"use client";

import Link from "next/link";

export default function CustomerFooter() {
  return (
    <footer className="bg-[#FFFBF8] border-t border-[#F1E1D6] py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[14px] text-[#8A6F68] text-center md:text-left">&copy; {new Date().getFullYear()} Cravon Inc. All rights reserved.</p>
        <Link href="/partner/register" className="text-[14px] font-bold text-[#FF7A30] hover:text-[#e65c00] transition-colors">
          Apply for Partner
        </Link>
      </div>
    </footer>
  );
}
