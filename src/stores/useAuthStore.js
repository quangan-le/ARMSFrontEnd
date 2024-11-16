import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(persist(set => ({
    user: null,
    addUser: (payload) => set({ user: payload }),
    removeUser: () => set({ user: null })
}), {
    name: 'authenication',
    storage: createJSONStorage(() => localStorage),
}))