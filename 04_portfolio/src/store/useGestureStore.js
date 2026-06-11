import { create } from 'zustand'

export const useGestureStore = create((set) => ({
  mode: 'INACTIVE', // INACTIVE, LOADING, ACTIVE
  particleMultiplier: 1, // 1 normal, 3 amplified
  gestureState: 'IDLE', // IDLE, OPEN_PALM, FIST, PINCH, VICTORY, THUMBS_UP
  handLandmarks: null, // Array of 21 {x, y, z} points or null
  handCursor: { x: 0, y: 0 }, // Mapped screen position of index finger tip

  setMode: (mode) => set({ mode }),
  setParticleMultiplier: (particleMultiplier) => set({ particleMultiplier }),
  setGestureState: (state) => set({ gestureState: state }),
  setHandLandmarks: (landmarks) => set({ handLandmarks: landmarks }),
  setHandCursor: (x, y) => set({ handCursor: { x, y } }),
}))
