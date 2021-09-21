export interface PedidoProducto {
  _id: string;
  clientes: Clientes;
  usuarios: Clientes;
  productos: Producto[];
  fechaCreacion: string;
  fechaAprobacion: string;
  aprobadoPor: string;
  estado: string;
  __v: number;
}

export interface Producto {
  nombre: string;
  cantidad: number;
}

export interface Clientes {
  _id: string;
  nombre: string;
}