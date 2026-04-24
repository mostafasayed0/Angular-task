import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = typeof localStorage !== 'undefined' ? localStorage : null;
  readonly dark = signal(this.storage?.getItem('darkMode') === 'true');

  constructor() {
    this.apply();
  }

  toggleTheme(): void {
    this.dark.set(!this.dark());
    this.storage?.setItem('darkMode', String(this.dark()));
    this.apply();
  }

  private apply(): void {
    this.document.documentElement.classList.toggle('dark', this.dark());
  }
}
