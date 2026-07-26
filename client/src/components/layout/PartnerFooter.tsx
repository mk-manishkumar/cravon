"use client";

import Link from "next/link";

export default function PartnerFooter() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1F1F1F] py-8 mt-auto">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-[12px] text-[#666666] text-center">
          &copy; {new Date().getFullYear()} Cravon Partners. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
