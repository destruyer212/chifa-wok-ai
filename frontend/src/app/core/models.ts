export interface AuthResponse {
  token: string;
  tipo: string;
  expiraEnMinutos: number;
  nombre: string;
  rol: string;
}

export interface Presentacion { id: number; nombre: string; precio: number; predeterminada: boolean; }

export interface Plato {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  destacado: boolean;
  imagenUrl?: string;
  tiempoPreparacionMin?: number;
  categoria: string;
  presentaciones: Presentacion[];
}

export interface CategoriaConPlatos {
  id: number;
  nombre: string;
  descripcion?: string;
  icono?: string;
  platos: Plato[];
}

export type EstadoPedido =
  | 'BORRADOR' | 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION'
  | 'LISTO' | 'EN_CAMINO' | 'ENTREGADO' | 'CANCELADO';

export interface PedidoItem {
  id: number; codigoPlato: string; nombrePlato: string;
  cantidad: number; precioUnitario: number; subtotal: number; notas?: string;
}

export interface Pedido {
  id: number; codigo: string; clienteNombre: string; canal: string;
  estado: EstadoPedido; tipoEntrega: string; metodoPago: string;
  subtotal: number; costoEnvio: number; descuento: number; total: number;
  notas?: string; creadoEn: string; items: PedidoItem[];
}

export interface ItemSugerido {
  codigoPlato: string; nombre: string; cantidad: number;
  presentacion?: string; precioUnitario: number; subtotal: number;
}

export interface VozResponse {
  sesionUuid: string;
  intencion: string;
  respuestaAsistente: string;
  requiereConfirmacion: boolean;
  items: ItemSugerido[];
  total: number;
  latenciaMs: number;
}

export interface DashboardDTO {
  resumen: {
    pedidosHoy: number; pedidosEnPreparacion: number; ventasHoy: number;
    sesionesVozHoy: number; tasaConversionVozPct: number;
  };
  ventas7dias: { fecha: string; numPedidos: number; totalVendido: number }[];
  topPlatos: { nombre: string; unidades: number; ingresos: number }[];
}
