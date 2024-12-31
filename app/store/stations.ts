// app/store/stations.ts
import { create } from 'zustand';
import { IStation, StationProgress } from '@/app/types/station';
import { ModuleStatus } from '@/app/types/planet'; 

interface StationsState {
  stations: Record<string, IStation[]>;
  loadStations: (planetId: string) => Promise<void>;
  updateStationProgress: (stationId: string, progress: StationProgress) => void;
  getNextAvailableStation: (planetId: string) => IStation | null;
}

export const useStationsStore = create<StationsState>((set, get) => ({
  stations: {},
  
  loadStations: async (planetId: string) => {
    try {
      // This would be your API call to fetch all stations for a planet
      const response = await fetch(`/api/planets/${planetId}/stations`);
      const stationData = await response.json();
      
      set((state) => ({
        stations: {
          ...state.stations,
          [planetId]: stationData
        }
      }));
    } catch (error) {
      console.error('Failed to load stations:', error);
    }
  },

  updateStationProgress: (stationId: string, progress: StationProgress) => {
    set((state) => {
      const updatedStations = { ...state.stations };
      
      // Update the specific station's progress
      Object.keys(updatedStations).forEach(planetId => {
        updatedStations[planetId] = updatedStations[planetId].map(station => 
          station._id === stationId 
            ? { ...station, progress, completionStatus: progress.isComplete ? ModuleStatus.COMPLETED : station.completionStatus }
            : station
        );
      });

      return { stations: updatedStations };
    });
  },

  getNextAvailableStation: (planetId: string) => {
    const planetStations = get().stations[planetId] || [];
    return planetStations.find(station => 
      station.completionStatus === ModuleStatus.UNLOCKED ||
      station.completionStatus === ModuleStatus.IN_PROGRESS
    ) || null;
  },
}));