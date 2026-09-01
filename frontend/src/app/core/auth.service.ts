import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from './models';

const KEY = 'cw.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sesion = signal<AuthResponse | null>(this.leer());

  readonly usuario = computed(() => this.sesion());
  readonly autenticado = computed(() => this.sesion() !== null);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(tap((r) => this.guardar(r)));
  }

  logout(): void {
    localStorage.removeItem(KEY);
    this.sesion.set(null);
  }

  get token(): string | null {
    return this.sesion()?.token ?? null;
  }

  private guardar(r: AuthResponse): void {
    localStorage.setItem(KEY, JSON.stringify(r));
    this.sesion.set(r);
  }
  private leer(): AuthResponse | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AuthResponse) : null;
    } catch {
      return null;
    }
  }
}
