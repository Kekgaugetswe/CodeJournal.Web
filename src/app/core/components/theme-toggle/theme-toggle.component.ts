import { Component, inject, signal } from '@angular/core';
import { ThemeService, ThemeMode } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css'],
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  readonly themeMode = this.themeService.themeMode;
  readonly effectiveTheme = this.themeService.effectiveTheme;

  /** Controls the mobile dropdown visibility. */
  readonly dropdownOpen = signal(false);

  setTheme(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
    this.dropdownOpen.set(false);
  }

  toggleDropdown(): void {
    this.dropdownOpen.update((open) => !open);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }
}
