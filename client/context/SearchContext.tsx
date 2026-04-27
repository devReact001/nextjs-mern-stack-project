"use client";
import { createContext, useContext, useState } from "react";

interface SearchContextType {
  search: string;
  setSearch: (s: string) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const SearchContext = createContext<SearchContextType>({
  search: "",
  setSearch: () => {},
  refreshKey: 0,
  triggerRefresh: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <SearchContext.Provider value={{ search, setSearch, refreshKey, triggerRefresh }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);