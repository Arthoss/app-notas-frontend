import { createContext, ReactNode, useContext, useState } from 'react';

export type Estudiante = {
  id: number;
  cedula: string;
  nombre: string;
  correo: string;
  celular: string;
  materia: string;
};

export type Nota = {
  id: number;
  cedula: string;
  materia: string;
  nota1: number;
  nota2: number;
  nota3: number;
  nota4: number;
  definitiva: number;
};

export type ResultadoConsulta = {
  estudiante: Estudiante;
  notas: Nota[];
};

type ContextType = {
  resultado: ResultadoConsulta | null;
  setResultado: (r: ResultadoConsulta | null) => void;
};

const NotasContext = createContext<ContextType>({
  resultado: null,
  setResultado: () => {}
});

export const NotasProvider = ({ children }: { children: ReactNode }) => {
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(null);
  return (
    <NotasContext.Provider value={{ resultado, setResultado }}>
      {children}
    </NotasContext.Provider>
  );
};

export const useNotas = () => useContext(NotasContext);
