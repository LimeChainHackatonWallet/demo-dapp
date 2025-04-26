'use client';

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode
} from 'react';

type AppStateContextType = {
  address: string | null;
  setAddress: Dispatch<SetStateAction<string | null>>;
};

const StateContext = createContext<AppStateContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const StateProvider = ({ children }: Props) => {
  const [address, setAddress] = useState<string | null>(null);

  return (
    <StateContext.Provider value={{ address, setAddress }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};