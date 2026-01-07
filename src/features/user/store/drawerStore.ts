// store/drawerStore.ts (or uiStore.ts)
import { create } from "zustand";

type DrawerState =
  | "results"
  | "details"
  | "directions"
  | "requesetAppointment"
  | null;

interface DrawerStore {
  activeDrawer: DrawerState;
  hasStartDirections: boolean;
  setActiveDrawer: (drawer: DrawerState) => void;
  openResults: () => void;
  openDetails: () => void;
  openDirections: () => void;
  openRequestAppointment: () => void;
  startDirections: () => void;
  endDirections: () => void;

  closeAll: () => void;
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  activeDrawer: "results",
  hasStartDirections: false,

  setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),
  startDirections: () => set({ hasStartDirections: true }),
  endDirections: () => set({ hasStartDirections: false }),
  openRequestAppointment: () => set({ activeDrawer: "requesetAppointment" }),
  openResults: () => set({ activeDrawer: "results" }),
  openDetails: () => set({ activeDrawer: "details" }),
  openDirections: () => set({ activeDrawer: "directions" }),

  closeAll: () => set({ activeDrawer: null }),
}));
