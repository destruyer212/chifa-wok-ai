import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cliente { id: number; nombre: string; iniciales: string; telefono: string; distrito: string; pedidos: number; gasto: number; canal: 'VOZ' | 'WEB'; favorito: string; vip: boolean; }
const CLIENTES: Cliente[] = [
  { id: 1, nombre: 'Carlos Mendoza', iniciales: 'CM', telefono: '+51 987 654 321', distrito: 'Miraflores', pedidos: 28, gasto: 1840, canal: 'VOZ', favorito: 'Chaufa Especial + Wantan', vip: true },
  { id: 2, nombre: 'Lucía Salazar', iniciales: 'LS', telefono: '+51 912 345 678', distrito: 'San Isidro', pedidos: 14, gasto: 820, canal: 'VOZ', favorito: 'Pollo Tipakay', vip: false },
  { id: 3, nombre: 'Jorge Alva', iniciales: 'JA', telefono: '+51 999 888 777', distrito: 'Surco', pedidos: 11, gasto: 690, canal: 'WEB', favorito: 'Tallarin Saltado Lomo', vip: false },
  { id: 4, nombre: 'Ana María Wong', iniciales: 'AW', telefono: '+51 945 112 233', distrito: 'San Borja', pedidos: 22, gasto: 1410, canal: 'VOZ', favorito: 'Aeropuerto Especial', vip: true },
  { id: 5, nombre: 'Diego Morales', iniciales: 'DM', telefono: '+51 933 221 144', distrito: 'Magdalena', pedidos: 2, gasto: 115, canal: 'VOZ', favorito: 'Kam Lu Wantán', vip: false },
];
@Component({ selector: 'cw-clients', standalone: true, imports: [CommonModule], templateUrl: './clients.component.html' })
export class ClientsComponent {
  readonly busqueda = signal(''); readonly seleccionado = signal<Cliente>(CLIENTES[0]);
  readonly kpis = [{ label: 'Total clientes', value: '1,420', note: '+12% este mes' }, { label: 'Tasa de recurrencia', value: '68.4%', note: 'Clientes habituales' }, { label: 'Ticket promedio', value: 'S/ 54.80', note: 'Por comensal' }, { label: 'Canal preferido', value: '61% Voice AI', note: '39% Web / App' }];
  readonly filtrados = computed(() => CLIENTES.filter(c => !this.busqueda() || (c.nombre + c.telefono + c.distrito).toLowerCase().includes(this.busqueda().toLowerCase())));
  seleccionar(cliente: Cliente) { this.seleccionado.set(cliente); }
}
