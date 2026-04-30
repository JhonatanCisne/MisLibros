import { create } from 'zustand';
import { Libro } from '../modelos/Libro';
import { obtenerTodosLosLibros, actualizarLibro, eliminarLibro } from '../api/baseDeDatos';

interface BibliotecaEstado {
  libros: Libro[];
  cargando: boolean;
  modoNoche: boolean;
  
  // Acciones (Capa de Aplicación)
  cargarBiblioteca: () => Promise<void>;
  alternarModoNoche: () => void;
  actualizarLibroEnEstado: (libro: Libro) => Promise<void>;
  eliminarLibroEnEstado: (idLibro: string) => Promise<void>;
}

export const useBibliotecaStore = create<BibliotecaEstado>((set) => ({
  libros: [],
  cargando: false,
  modoNoche: false,

  cargarBiblioteca: async () => {
    set({ cargando: true });
    try {
      // llamamos a la infraestructura (SQLite)
      const librosDesdeDB = await obtenerTodosLosLibros();
      set({ libros: librosDesdeDB, cargando: false });
    } catch (error) {
      console.error("Error al cargar biblioteca en el Store:", error);
      set({ cargando: false });
    }
  },

  alternarModoNoche: () => set((state) => ({ modoNoche: !state.modoNoche })),

  actualizarLibroEnEstado: async (libroActualizado) => {
    try {
      // Actualizar en la base de datos
      actualizarLibro(libroActualizado);
      
      // Actualizar en el estado
      set((state) => ({
        libros: state.libros.map((l) => l.id === libroActualizado.id ? libroActualizado : l)
      }));
    } catch (error) {
      console.error('Error al actualizar libro:', error);
    }
  },

  eliminarLibroEnEstado: async (idLibro) => {
    try {
      // Eliminar de la base de datos
      eliminarLibro(idLibro);
      
      // Eliminar del estado
      set((state) => ({
        libros: state.libros.filter((l) => l.id !== idLibro)
      }));
    } catch (error) {
      console.error('Error al eliminar libro:', error);
    }
  },
}));