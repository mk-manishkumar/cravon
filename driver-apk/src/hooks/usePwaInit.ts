import { useEffect } from "react";
import { usePwaStore, type BeforeInstallPromptEvent } from "../store/pwaStore";

export function usePwaInit() {
  const { setDeferredPrompt, setIsStandalone, setIsMobile, setIsIos } = usePwaStore();

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobileUA = /android|iphone|ipad|ipod|mobile/i.test(userAgent);
    const isSmallViewport = window.innerWidth < 768;
    const isMobileDevice = isMobileUA || isSmallViewport;
    setIsMobile(isMobileDevice);

    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const checkStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(checkStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [setDeferredPrompt, setIsStandalone, setIsMobile, setIsIos]);
}
