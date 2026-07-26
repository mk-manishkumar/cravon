"use client";


export default function CustomerFooter() {
  return (
    <footer className="bg-[#FFFBF8] border-t border-[#F1E1D6] py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-[14px] text-[#8A6F68] text-center">
          &copy; {new Date().getFullYear()} Cravon Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
