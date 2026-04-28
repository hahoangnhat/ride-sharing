# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev           # Start dev server (http://localhost:3000/en)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint (flat config)
pnpm format       # Format with Prettier
pnpm storybook    # Start Storybook (:6006)
pnpm build-storybook  # Build static Storybook
pnpm clean        # Remove .next and node_modules
```

## Architecture

### Tech Stack
- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** with shadcn/ui (base-maia style)
- **@base-ui/react** for UI primitives
- **@hugeicons/react** for icons
- **next-intl** for i18n (en, vi locales)
- **Serwist** for PWA/service worker
- **Vitest + Playwright + Storybook** for testing

### Key Paths
- `src/app/` — Next.js App Router pages and layouts
- `src/app/[locale]/` — Locale-routed pages (en, vi)
- `src/components/ui/` — shadcn/ui components
- `src/hooks/` — Custom React hooks (add your own)
- `src/utils/` — Utility functions (cn.ts, barrel export)
- `messages/` — Translation files (en/, vi/)
- `src/stories/` — Storybook stories

### Project Structure
Empty directories use `.gitkeep` to preserve structure in git:
- `src/components/`, `src/constants/`, `src/hooks/`, `src/modules/`, `src/schemas/`, `src/types/`
- Add actual files when you need them (e.g., `src/hooks/use-media-query.ts`)

### Next.js Config
- React Compiler enabled (`reactCompiler: true`)
- Serwist wraps the config: `withSerwist(withNextIntl(nextConfig))`
- PWA features only activate in production builds

## Conventions

### shadcn/ui
Components are added via CLI. Run `npx shadcn@latest info` for project context.

**Critical rules:**
- Use **semantic colors** (`bg-primary`, `text-muted-foreground`) — never raw values (`bg-blue-500`)
- **`className` for layout only** — don't override component colors
- No `space-x-*` or `space-y-*` — use `flex` with `gap-*`
- Use `cn()` for conditional classes
- No manual `z-index` on overlay components (Dialog, Sheet, Popover, etc.)
- Icons in Button use `data-icon="inline-start"` or `data-icon="inline-end"`, no sizing classes

### Icons
Import from `@hugeicons/react` (configured iconLibrary). Example:
```tsx
import { SearchIcon } from "@hugeicons/react"
```

### i18n
- Supported locales: `en`, `vi`
- Root `/` redirects to `/en`
- Use `next-intl/navigation` for locale-aware links
- Translations in `messages/{locale}/`

### Testing
- Storybook runs with Vitest plugin (Chromatic, a11y, docs addons)
- Stories in `src/**/*.stories.tsx`

## PWA
- Service worker: `src/app/sw.ts`
- Manifest: `src/app/manifest.ts` (served at `/manifest.webmanifest`)
- Offline fallback: `src/app/[locale]/~offline/page.tsx`
