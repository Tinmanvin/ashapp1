import { create } from 'zustand'

export interface ProcessingAsset {
  id: number
  name: string
  type: 'VIDEO' | 'IMAGE' | 'CLIP'
  ratio: 'landscape' | 'portrait' | 'square'
  duration?: string
}

interface ProcessingStore {
  selectedAssets: ProcessingAsset[]
  selectedPlatforms: string[]
  setProcessingJob: (assets: ProcessingAsset[], platforms: string[]) => void
  clear: () => void
}

export const useProcessingStore = create<ProcessingStore>((set) => ({
  selectedAssets: [],
  selectedPlatforms: [],
  setProcessingJob: (assets, platforms) => set({ selectedAssets: assets, selectedPlatforms: platforms }),
  clear: () => set({ selectedAssets: [], selectedPlatforms: [] }),
}))
