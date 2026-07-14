import { Category } from '../../features/category/models/category-model.model';

export interface CategoryVisual {
  icon: string;
  accent: string;
}

const DEFAULT_VISUAL: CategoryVisual = {
  icon: 'bi bi-folder',
  accent: '#818cf8'
};

/**
 * Predefined visual mapping for known categories.
 * Keyed by normalized slug (lowercase, spaces/special chars → hyphens).
 */
export const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  'dotnet-csharp': { icon: 'bi bi-code-slash', accent: '#6366f1' },
  'net-c': { icon: 'bi bi-code-slash', accent: '#6366f1' },
  'net-csharp': { icon: 'bi bi-code-slash', accent: '#6366f1' },
  'angular': { icon: 'bi bi-code-slash', accent: '#dd0031' },
  'javascript': { icon: 'bi bi-filetype-js', accent: '#f7df1e' },
  'typescript': { icon: 'bi bi-filetype-tsx', accent: '#3178c6' },
  'css': { icon: 'bi bi-filetype-css', accent: '#264de4' },
  'html': { icon: 'bi bi-filetype-html', accent: '#e34f26' },
  'python': { icon: 'bi bi-filetype-py', accent: '#3776ab' },
  'sql-databases': { icon: 'bi bi-database', accent: '#38bdf8' },
  'sql': { icon: 'bi bi-database', accent: '#38bdf8' },
  'database': { icon: 'bi bi-database', accent: '#38bdf8' },
  'apis': { icon: 'bi bi-plug', accent: '#fb7185' },
  'authentication': { icon: 'bi bi-shield-lock', accent: '#34d399' },
  'devops-cloud': { icon: 'bi bi-cloud', accent: '#0ea5e9' },
  'devops': { icon: 'bi bi-cloud', accent: '#0ea5e9' },
  'windows': { icon: 'bi bi-windows', accent: '#38bdf8' },
  'macos': { icon: 'bi bi-apple', accent: '#94a3b8' },
  'vmware': { icon: 'bi bi-cpu', accent: '#64748b' },
  'troubleshooting': { icon: 'bi bi-tools', accent: '#f59e0b' },
  'tutorials': { icon: 'bi bi-journal-code', accent: '#a78bfa' },
  'tips-tricks': { icon: 'bi bi-lightbulb', accent: '#facc15' },
  'tips': { icon: 'bi bi-lightbulb', accent: '#facc15' },
  'frontend-ui-ux': { icon: 'bi bi-palette', accent: '#f472b6' },
  'frontend': { icon: 'bi bi-palette', accent: '#f472b6' },
  'ai-development': { icon: 'bi bi-robot', accent: '#22d3ee' },
  'ai': { icon: 'bi bi-robot', accent: '#22d3ee' },
  'git-github': { icon: 'bi bi-git', accent: '#f97316' },
  'git': { icon: 'bi bi-git', accent: '#f97316' },
  'nodejs': { icon: 'bi bi-hdd-network', accent: '#339933' },
  'node-js': { icon: 'bi bi-hdd-network', accent: '#339933' },
};

/**
 * Normalize a string to a slug for lookup.
 * "Frontend UI/UX" → "frontend-ui-ux"
 * ".NET & C#" → "net-c"
 */
function normalizeToSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.#&]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get the visual (icon + accent) for a category.
 * Resolution: urlHandle → normalized name → accentColor override → fallback.
 */
export function getCategoryVisual(category: Category): CategoryVisual {
  // Try urlHandle first (it's the slug)
  const bySlug = CATEGORY_VISUALS[category.urlHandle?.toLowerCase()];
  if (bySlug) {
    return applyAccentOverride(bySlug, category.accentColor);
  }

  // Try normalized name
  const normalized = normalizeToSlug(category.name);
  const byName = CATEGORY_VISUALS[normalized];
  if (byName) {
    return applyAccentOverride(byName, category.accentColor);
  }

  // Fallback — use accentColor from DB if available
  return {
    icon: DEFAULT_VISUAL.icon,
    accent: category.accentColor || DEFAULT_VISUAL.accent
  };
}

function applyAccentOverride(visual: CategoryVisual, accentColor?: string): CategoryVisual {
  if (accentColor) {
    return { icon: visual.icon, accent: accentColor };
  }
  return visual;
}
