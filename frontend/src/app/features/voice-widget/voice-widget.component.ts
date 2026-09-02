import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SpeechService } from './speech.service';
import { VoiceWidgetState } from './voice-widget.state';
import { VoiceApiService } from '../../core/voice-api.service';
import { ClienteLocalService } from '../../core/cliente-local.service';
import { ItemSugerido } from '../../core/models';

interface Mensaje { rol: 'usuario' | 'asistente'; texto: string; }

@Component({
  selector: 'cw-voice-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- FAB -->
    <button
      *ngIf="!estado.abierto()"
      (click)="abrir()"
      class="fixed bottom-lg right-lg w-16 h-16 rounded-full bg-gradient-to-br from-tertiary-container to-[#003c73]
             text-on-tertiary shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50 pulse-animation"
      aria-label="Abrir asistente de voz">
      <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">mic</span>
    </button>

    <!-- Modal -->
    <div *ngIf="estado.abierto()"
         class="fixed inset-0 z-50 bg-on-background/40 flex items-center justify-center p-margin-mobile"
         (click)="cerrar()">
      <div class="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
           (click)="$event.stopPropagation()">

        <!-- Header -->
        <header class="flex items-center justify-between px-md py-sm border-b border-outline-variant">
          <div class="flex items-center gap-sm">
            <span class="material-symbols-outlined text-tertiary" [class.pulse-animation]="speech.escuchando()"
                  style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
            <span class="font-headline-md text-headline-md text-tertiary">{{ titulo() }}</span>
          </div>
          <button (click)="cerrar()" aria-label="Cerrar" class="text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
        </header>

        <!-- Conversacion -->
        <div class="flex-1 overflow-y-auto p-md space-y-md min-h-[180px]">
          <p *ngIf="!mensajes().length"
             class="font-body-md text-body-md text-on-surface-variant text-center py-lg">
            Toca el microfono y dime tu pedido.<br>
            Ej: "Quiero un arroz chaufa especial y una Inka Kola de litro".
          </p>

          <ng-container *ngFor="let m of mensajes()">
            <!-- Usuario -->
            <div *ngIf="m.rol === 'usuario'" class="flex flex-col items-end">
              <span class="font-label-sm text-label-sm text-on-surface-variant mb-xs mr-xs">Tu</span>
              <div class="bg-surface-container-high text-on-surface rounded-lg rounded-tr-none p-sm max-w-[80%]">
                <p class="font-body-md text-body-md">{{ m.texto }}</p>
              </div>
            </div>
            <!-- Asistente -->
            <div *ngIf="m.rol === 'asistente'" class="flex flex-col items-start">
              <span class="flex items-center gap-xs font-label-sm text-label-sm text-tertiary mb-xs">
                <span class="material-symbols-outlined text-[16px]">support_agent</span> Asistente Wok
              </span>
              <div class="bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg rounded-tl-none p-sm max-w-[85%]">
                <p class="font-body-md text-body-md">{{ m.texto }}</p>
              </div>
            </div>
          </ng-container>

          <!-- Resumen del carrito -->
          <ul *ngIf="items().length" class="border-t border-outline-variant pt-sm space-y-xs">
            <li *ngFor="let it of items()" class="flex justify-between font-label-sm text-label-sm text-on-surface">
              <span>{{ it.cantidad }}x {{ it.nombre }}</span>
              <span>S/ {{ it.subtotal | number: '1.2-2' }}</span>
            </li>
            <li class="flex justify-between font-label-md text-label-md text-primary pt-xs border-t border-outline-variant">
              <span>Total</span><span>S/ {{ total() | number: '1.2-2' }}</span>
            </li>
          </ul>

          <!-- Telefono para confirmar -->
          <div *ngIf="pidiendoTelefono()" class="space-y-xs">
            <label class="font-label-sm text-label-sm text-on-surface-variant">Tu numero de celular para el pedido</label>
            <input [(ngModel)]="telefono" name="tel" inputmode="tel" placeholder="999 999 999"
                   class="w-full rounded-lg border border-outline px-sm py-sm font-body-md text-body-md" />
          </div>

          <!-- Confirmado -->
          <div *ngIf="confirmado() as cod" class="bg-surface-container-low rounded-lg p-sm text-center">
            <p class="font-label-md text-label-md text-primary font-bold">Pedido {{ cod }} registrado</p>
            <button (click)="verSeguimiento()" class="font-label-sm text-label-sm text-tertiary underline mt-xs">
              Ver el seguimiento
            </button>
          </div>

          <p *ngIf="!speech.soportado()" class="font-label-sm text-label-sm text-error">
            Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.
          </p>
        </div>

        <!-- Footer -->
        <footer class="px-md py-sm border-t border-outline-variant flex items-center gap-sm">
          <button
            (click)="toggleMic()"
            [disabled]="procesando() || confirmando() || !speech.soportado()"
            class="w-11 h-11 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
            [class]="speech.escuchando() ? 'bg-error text-on-error pulse-animation' : 'bg-tertiary-container text-on-tertiary'"
            [attr.aria-label]="speech.escuchando() ? 'Detener' : 'Hablar'">
            <span class="material-symbols-outlined">{{ speech.escuchando() ? 'stop' : 'mic' }}</span>
          </button>

          <span class="flex-1 font-label-sm text-label-sm text-on-surface-variant truncate">{{ subtitulo() }}</span>

          <button (click)="cerrar()"
                  class="border border-outline text-on-surface-variant font-label-md text-label-md px-md py-sm rounded-full hover:bg-surface-container transition-colors">
            Cancelar
          </button>
          <button (click)="onConfirmar()"
                  [disabled]="!items().length || confirmando() || !!confirmado()"
                  class="bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-full font-bold
                         flex items-center gap-xs hover:opacity-90 transition-opacity disabled:opacity-40">
            <span class="material-symbols-outlined text-[18px]">check_circle</span>
            {{ confirmando() ? 'Registrando...' : 'Confirmar Pedido' }}
          </button>
        </footer>
      </div>
    </div>
  `,
})
export class VoiceWidgetComponent {
  readonly speech = inject(SpeechService);
  readonly estado = inject(VoiceWidgetState);
  private readonly api = inject(VoiceApiService);
  private readonly clienteLocal = inject(ClienteLocalService);
  private readonly router = inject(Router);

  readonly procesando = signal(false);
  readonly confirmando = signal(false);
  readonly confirmado = signal<string | null>(null);
  readonly pidiendoTelefono = signal(false);
  readonly mensajes = signal<Mensaje[]>([]);
  readonly items = signal<ItemSugerido[]>([]);
  readonly total = signal(0);
  telefono = '';
  private sesionUuid?: string;

  titulo(): string {
    if (this.speech.escuchando()) return 'Escuchando...';
    if (this.procesando()) return 'Procesando...';
    return 'Asistente Wok';
  }

  subtitulo(): string {
    if (this.speech.escuchando()) return 'Habla ahora, te escucho';
    if (this.speech.hablando()) return 'Respondiendo...';
    if (this.pidiendoTelefono()) return 'Ingresa tu celular y confirma';
    if (this.items().length) return 'Puedes seguir agregando o confirmar';
    return 'Toca el microfono para empezar';
  }

  abrir(): void { this.estado.abrir(); }

  cerrar(): void {
    this.speech.detener();
    this.estado.cerrar();
  }

  toggleMic(): void {
    if (this.speech.escuchando()) { this.speech.detener(); return; }
    this.confirmado.set(null);
    this.speech.escuchar().subscribe({
      next: (texto) => this.enviar(texto),
      error: (e) => this.push('asistente', e.message),
    });
  }

  private enviar(transcripcion: string): void {
    this.push('usuario', transcripcion);
    this.procesando.set(true);
    this.api.interpretar(transcripcion, this.sesionUuid).subscribe({
      next: (r) => {
        this.sesionUuid = r.sesionUuid;
        this.items.set(r.items);
        this.total.set(r.total);
        this.push('asistente', r.respuestaAsistente);
        this.speech.hablar(r.respuestaAsistente);
        this.procesando.set(false);
      },
      error: () => {
        this.push('asistente', 'Disculpa, tuve un problema. Intenta de nuevo.');
        this.procesando.set(false);
      },
    });
  }

  onConfirmar(): void {
    if (!this.items().length) return;
    if (!this.pidiendoTelefono() && this.telefono.length < 6) {
      this.pidiendoTelefono.set(true);
      return;
    }
    if (this.telefono.replace(/\D/g, '').length < 6) return;

    this.confirmando.set(true);
    this.api.confirmar(this.sesionUuid!, this.telefono, this.items()).subscribe({
      next: (r) => {
        this.clienteLocal.set(r.clienteId);
        this.confirmado.set(r.pedidoCodigo);
        this.pidiendoTelefono.set(false);
        this.confirmando.set(false);
        const msg = `Listo. Tu pedido ${r.pedidoCodigo} quedo registrado. Total ${r.total.toFixed(2)} soles.`;
        this.push('asistente', msg);
        this.speech.hablar(msg);
      },
      error: () => {
        this.confirmando.set(false);
        this.push('asistente', 'No pude registrar el pedido. Revisa tu numero e intenta otra vez.');
      },
    });
  }

  verSeguimiento(): void {
    this.cerrar();
    this.router.navigate(['/mis-pedidos']);
  }

  private push(rol: Mensaje['rol'], texto: string): void {
    this.mensajes.update((m) => [...m, { rol, texto }]);
  }
}
