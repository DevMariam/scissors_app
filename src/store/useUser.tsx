import { create } from "zustand";

// Define the type for the user
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

// Define the type for the state
interface UserState {
  user: User | null;
  setUser: (user: User) => void;
}

// Create the Zustand store
export const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
