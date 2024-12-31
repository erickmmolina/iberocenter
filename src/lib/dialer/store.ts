import { create } from 'zustand';

interface DialerState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useDialer = create<DialerState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));