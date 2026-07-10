import { Injectable, signal, computed, effect, OnDestroy } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';
const VALID_MODES: Set<string> = new Set(['light', 'dark', 'system']);

/** Whether we are running in a browser environment. */
const isBrowser = globalThis.window !== undefined;

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  /** The user-selected mode. */
  readonly themeMode = signal<ThemeMode>(this.loadStoredMode());

  /** The resolved theme applied to the DOM. */
  readonly effectiveTheme = computed<EffectiveTheme>(() => {
    const mode = this.themeMode();
    if (mode === 'light') return 'light';
    if (mode === 'dark') return 'dark';
    return this.systemPreference();
  });

  /** Reactive signal tracking the OS preference. */
  private readonly systemPreference = signal<EffectiveTheme>(this.detectSystemPreference());

  private readonly mediaQuery: MediaQueryList | null =
    isBrowser && globalThis.window.matchMedia
      ? globalThis.window.matchMedia('(prefers-color-scheme: dark)')
      : null;

  private readonly mediaListener = (e: MediaQueryListEvent) => {
    this.systemPreference.set(e.matches ? 'dark' : 'light');
  };

  private readonly applyEffect = effect(() => {
    const theme = this.effectiveTheme();
    if (!isBrowser) return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  });

  constructor() {
    this.mediaQuery?.addEventListener('change', this.mediaListener);
  }

  ngOnDestroy(): void {
    this.mediaQuery?.removeEventListener('change', this.mediaListener);
  }

  /** Public method to change the theme mode. */
  setTheme(mode: ThemeMode): void {
    this.themeMode.set(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // localStorage may be unavailable (quota exceeded, private browsing)
    }
  }

  private loadStoredMode(): ThemeMode {
    if (!isBrowser) return 'system';
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && VALID_MODES.has(stored)) {
        return stored as ThemeMode;
      }
    } catch {
      // localStorage may be unavailable
    }
    return 'system';
  }

  private detectSystemPreference(): EffectiveTheme {
    if (!isBrowser || !globalThis.window.matchMedia) {
      return 'light';
    }
    return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
