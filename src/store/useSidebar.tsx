import { create } from "zustand";

// Define the type for the state
interface SidebarState {
  isOpen: boolean;
  single: boolean;
  autoScroll: boolean;
  setSingle(single: boolean): void;
  setAutoScroll(autoScroll: boolean): void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

// Create the Zustand store
export const useSidebar = create<SidebarState>((set) => ({
  isOpen: true,
  single: false,
  autoScroll: false,
  setAutoScroll: (autoScroll) => set({ autoScroll }),
  setSingle: (single) => set({ single }),
  openSidebar: () => set({ isOpen: true }),
  closeSidebar: () => set({ isOpen: false }),
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));
