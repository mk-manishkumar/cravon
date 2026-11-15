import { useState } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";
import { usePwaStore } from "../store/pwaStore";

export default function InstallPrompt() {
  const { deferredPrompt, isStandalone, isMobile, isIos, isDismissed, dismissBanner, triggerInstall } = usePwaStore();
  const [showIosGuide, setShowIosGuide] = useState(false);

  // Only show on mobile screens, not already standalone, and not dismissed
  if (!isMobile || isStandalone || isDismissed) {
    return null;
  }

  // Show if Android install prompt is ready OR on iOS
  if (!deferredPrompt && !isIos) {
    return null;
  }

  const handleInstallClick = async () => {
    const outcome = await triggerInstall();
    if (outcome === "ios") {
      setShowIosGuide(true);
    }
  };

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#1A1A1E] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#FF3D57] to-[#FF7A30] flex items-center justify-center text-white shrink-0 shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">Install Driver App</h4>
            <p className="text-[11px] text-gray-400">Full-screen delivery navigation & instant order alerts</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={handleInstallClick} className="flex items-center gap-1.5 bg-[#FF3D57] hover:bg-[#E22B45] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button type="button" onClick={dismissBanner} className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer" aria-label="Dismiss banner">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari instructions tooltip */}
      {showIosGuide && (
        <div className="mt-2 bg-[#222228] border border-white/15 rounded-xl p-3 text-xs text-gray-300 shadow-xl animate-in fade-in">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-semibold text-white mb-1">
              <Share className="w-3.5 h-3.5 text-[#FF3D57]" /> Install on iPhone:
            </div>
            <button type="button" onClick={() => setShowIosGuide(false)} className="text-gray-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-gray-300">
            Tap the <span className="font-bold text-white">Share</span> button at the bottom of Safari, then select <span className="font-bold text-white">&apos;Add to Home Screen&apos; ➕</span>.
          </p>
        </div>
      )}
    </div>
  );
}
