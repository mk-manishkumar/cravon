import { create } from "zustand";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface PwaState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isStandalone: boolean;
  isMobile: boolean;
  isIos: boolean;
  isDismissed: boolean;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setIsStandalone: (standalone: boolean) => void;
  setIsMobile: (mobile: boolean) => void;
  setIsIos: (ios: boolean) => void;
  dismissBanner: () => void;
  triggerInstall: () => Promise<"accepted" | "dismissed" | "ios" | "manual">;
}

export const usePwaStore = create<PwaState>((set, get) => ({
  deferredPrompt: null,
  isStandalone: false,
  isMobile: false,
  isIos: false,
  isDismissed: sessionStorage.getItem("driver_pwa_dismissed") === "true",

  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
  setIsStandalone: (standalone) => set({ isStandalone: standalone }),
  setIsMobile: (mobile) => set({ isMobile: mobile }),
  setIsIos: (ios) => set({ isIos: ios }),
  dismissBanner: () => {
    sessionStorage.setItem("driver_pwa_dismissed", "true");
    set({ isDismissed: true });
  },

  triggerInstall: async () => {
    const { deferredPrompt, isIos } = get();

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          set({ deferredPrompt: null, isDismissed: true });
          return "accepted";
        }
        return "dismissed";
      } catch (err) {
        console.warn("PWA install prompt failed:", err);
        return "manual";
      }
    }

    if (isIos) {
      return "ios";
    }

    return "manual";
  },
}));
