import { Injectable, signal } from '@angular/core';

/** Estado compartido para abrir el widget de voz desde cualquier parte de la web. */
@Injectable({ providedIn: 'root' })
export class VoiceWidgetState {
  readonly abierto = signal(false);

  abrir(): void { this.abierto.set(true); }
  cerrar(): void { this.abierto.set(false); }
  alternar(): void { this.abierto.update((v) => !v); }
}
