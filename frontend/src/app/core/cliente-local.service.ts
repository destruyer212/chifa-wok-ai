import { Injectable, signal } from '@angular/core';

const KEY = 'cw.clienteId';

/** Recuerda el id del cliente en el navegador (pedidos anonimos por voz/web). */
@Injectable({ providedIn: 'root' })
export class ClienteLocalService {
  private readonly _id = signal<number | null>(this.leer());
  readonly clienteId = this._id.asReadonly();

  set(id: number): void {
    try { localStorage.setItem(KEY, String(id)); } catch { /* ignore */ }
    this._id.set(id);
  }

  private leer(): number | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Number(raw) : null;
    } catch {
      return null;
    }
  }
}
