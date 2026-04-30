export interface Libro{
    id: string;
    nombreArchivo: string;
    titulo: string;
    rutaCompleta: string;
    formato: 'pdf'| 'epub';
    portadaUri: string;

    //metadatos y progreso
    paginasTotales: number;
    paginaActual:number;
    progresoPorcentaje: number;

    //estado de usuario
    estadoOculto: boolean;
    ultimoAbierto: Date|null;
    fechaAgregado: Date;

    idCarpeta: string;
}