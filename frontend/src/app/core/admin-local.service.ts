import { Injectable } from '@angular/core';
import { EstadoPedido, Pedido, Plato } from './models';
const PRODUCTS_KEY = 'cw.admin.products';
const ORDERS_KEY = 'cw.admin.orders';
const DEMO_PRODUCTS: Plato[] = [
  { id: 1, codigo: 'CHF-001', nombre: 'Arroz Chaufa Especial', descripcion: 'Arroz salteado con pollo, chancho, langostinos y huevo.', precio: 24.9, disponible: true, destacado: true, categoria: 'Chaufas', presentaciones: [] },
  { id: 2, codigo: 'POL-002', nombre: 'Aeropuerto de Pollo', descripcion: 'Arroz chaufa con tallarin, pollo y verduras.', precio: 22.5, disponible: true, destacado: false, categoria: 'Platos de fondo', presentaciones: [] },
  { id: 3, codigo: 'POL-003', nombre: 'Pollo Tipakay Clasico', descripcion: 'Pollo crocante en salsa agridulce de la casa.', precio: 26.9, disponible: true, destacado: true, categoria: 'Platos de fondo', presentaciones: [] },
  { id: 4, codigo: 'TAL-004', nombre: 'Tallarin Saltado Criollo', descripcion: 'Tallarin salteado con carne, tomate y cebolla.', precio: 23.9, disponible: false, destacado: false, categoria: 'Saltados', presentaciones: [] },
];
@Injectable({ providedIn: 'root' })
export class AdminLocalService {
  products(): Plato[] { return this.read(PRODUCTS_KEY, DEMO_PRODUCTS); }
  saveProducts(products: Plato[]): void { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }
  orders(): Pedido[] { return this.read(ORDERS_KEY, []); }
  saveOrders(orders: Pedido[]): void { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }
  nextId(items: { id: number }[]): number { return Math.max(0, ...items.map((x) => x.id)) + 1; }
  updateOrderStatus(id: number, estado: EstadoPedido): Pedido | undefined {
    const orders = this.orders(); const order = orders.find((x) => x.id === id);
    if (!order) return undefined;
    order.estado = estado; this.saveOrders(orders); return order;
  }
  private read<T>(key: string, fallback: T): T {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
  }
}
