import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Viewport {
  center: [number, number];
  zoom: number;
}

export interface AnalysisContextType {
  aoi: any | null; // GeoJSON
  setAoi: (aoi: any | null) => void;
  dateRange: [string, string];
  setDateRange: (range: [string, string]) => void;
  sensors: string[];
  setSensors: (sensors: string[]) => void;
  cloudMax: number;
  setCloudMax: (cloudMax: number) => void;
  query: string | null;
  setQuery: (query: string | null) => void;
  selectedTileIds: string[];
  setSelectedTileIds: (ids: string[]) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aoi, setAoi] = useState<any | null>(null);
  const [dateRange, setDateRange] = useState<[string, string]>(['2023-01-01', '2024-01-01']);
  const [sensors, setSensors] = useState<string[]>(['Sentinel-2']);
  const [cloudMax, setCloudMax] = useState<number>(30);
  const [query, setQuery] = useState<string | null>(null);
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>({ center: [0, 0], zoom: 2 });

  return (
    <AnalysisContext.Provider value={{
      aoi, setAoi,
      dateRange, setDateRange,
      sensors, setSensors,
      cloudMax, setCloudMax,
      query, setQuery,
      selectedTileIds, setSelectedTileIds,
      selectedEventId, setSelectedEventId,
      viewport, setViewport
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
