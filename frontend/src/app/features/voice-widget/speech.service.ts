import { Injectable, NgZone, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Envuelve la Web Speech API nativa del navegador:
 *  - Speech-to-Text  (SpeechRecognition)
 *  - Text-to-Speech  (speechSynthesis)
 * No genera costos de telefonia: todo ocurre en el dispositivo del cliente.
 */
@Injectable({ providedIn: 'root' })
export class SpeechService {
  readonly escuchando = signal(false);
  readonly hablando = signal(false);
  readonly soportado = signal(this.detectarSoporte());

  private recognition: any;

  constructor(private zone: NgZone) {}

  private detectarSoporte(): boolean {
    const w = window as any;
    return !!(w.SpeechRecognition || w.webkitSpeechRecognition) && 'speechSynthesis' in window;
  }

  /** Inicia el reconocimiento y emite la transcripcion final. */
  escuchar(lang = 'es-PE'): Observable<string> {
    const salida = new Subject<string>();
    const w = window as any;
    const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!Rec) {
      salida.error(new Error('El navegador no soporta reconocimiento de voz'));
      return salida.asObservable();
    }

    this.recognition = new Rec();
    this.recognition.lang = lang;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = false;

    this.recognition.onresult = (e: any) => {
      const texto = e.results[e.results.length - 1][0].transcript.trim();
      this.zone.run(() => salida.next(texto));
    };
    this.recognition.onerror = (e: any) =>
      this.zone.run(() => salida.error(new Error(e.error || 'Error de reconocimiento')));
    this.recognition.onend = () =>
      this.zone.run(() => {
        this.escuchando.set(false);
        salida.complete();
      });

    this.zone.run(() => this.escuchando.set(true));
    this.recognition.start();
    return salida.asObservable();
  }

  detener(): void {
    this.recognition?.stop();
    this.escuchando.set(false);
  }

  /** Lee un texto en voz alta (confirmacion del asistente). */
  hablar(texto: string, lang = 'es-PE'): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) return resolve();
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = lang;
      u.rate = 1.02;
      u.pitch = 1;
      u.onstart = () => this.zone.run(() => this.hablando.set(true));
      u.onend = () => {
        this.zone.run(() => this.hablando.set(false));
        resolve();
      };
      window.speechSynthesis.speak(u);
    });
  }
}
