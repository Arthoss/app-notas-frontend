import { createContext, ReactNode, useState } from 'react';

type Pokemon = {
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
};

type ContextType = {
  pokemon: Pokemon | null;
  setPokemon: (p: Pokemon) => void;
};

export const PokemonContext = createContext<ContextType>({
  pokemon: null,
  setPokemon: () => {}
});

export const PokemonProvider = ({ children }: { children: ReactNode }) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  return (
    <PokemonContext.Provider value={{ pokemon, setPokemon }}>
      {children}
    </PokemonContext.Provider>
  );
};