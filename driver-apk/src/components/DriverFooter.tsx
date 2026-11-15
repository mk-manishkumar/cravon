import { Heart } from "lucide-react";

interface DriverFooterProps {
  className?: string;
}

export default function DriverFooter({ className = "" }: DriverFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-auto bg-white border-t border-gray-200/80 py-5 sm:py-6 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center text-center">
        <p className="text-xs sm:text-[13px] font-medium text-gray-500 flex items-center justify-center gap-1.5 flex-wrap">
          <span>&copy; {currentYear} Cravon Inc. Driver Partner Network. Made with</span>
          <Heart className="w-3.5 h-3.5 text-[#FF3D57] fill-[#FF3D57] inline shrink-0" />
          <span>for drivers.</span>
        </p>
      </div>
    </footer>
  );
}
