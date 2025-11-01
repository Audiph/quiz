# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo using pnpm workspaces with a Next.js application, Cloudflare Worker API, and shared UI components library. The stack includes TypeScript, Tailwind CSS v4, React 19, and Hono framework for the API.

## Repository Structure

```
.
├── apps/
│   ├── web/              # Next.js application (port 3001)
│   └── api/              # Cloudflare Worker API with Hono
├── packages/
│   ├── ui/              # Shared React component library with Tailwind
│   ├── eslint-config/   # Shared ESLint configuration
│   ├── tailwind-config/ # Shared Tailwind configuration
│   └── typescript-config/ # Shared TypeScript configurations
```

## Common Development Commands

### Installation and Setup

```bash
pnpm install  # Install all dependencies across the monorepo
```

### Development

```bash
pnpm dev      # Start all apps in development mode (web app runs on port 3001)
```

### Building

```bash
pnpm build    # Build all packages and apps
```

### Code Quality

```bash
pnpm lint         # Run ESLint across all packages
pnpm check-types  # Type check all TypeScript files
pnpm format       # Format all .ts, .tsx, and .md files with Prettier
```

### Running Commands in Specific Workspaces

```bash
pnpm --filter web dev        # Run dev server for web app only
pnpm --filter api dev        # Run dev server for API (Cloudflare Worker)
pnpm --filter @audiph/ui build  # Build UI package only
```

### API-Specific Commands

```bash
pnpm --filter api deploy     # Deploy API to Cloudflare Workers
pnpm --filter api cf-typegen # Generate TypeScript types from Cloudflare bindings
```

## Architecture Patterns

### Monorepo Structure

- **Turborepo** manages the build pipeline and caching
- **pnpm workspaces** handle dependency management across packages
- All workspace packages are referenced using `workspace:*` protocol
- Turbo tasks are configured with proper dependency ordering (`^build` notation)

### UI Component Library (@audiph/ui)

- Components are built with TypeScript and compiled to the `dist/` directory
- Styles are compiled separately from `src/styles.css` to `dist/index.css`
- Components use `class-variance-authority` for variant management
- All Tailwind classes in the UI package use a `ui-` prefix to prevent conflicts
- Components are consumed directly via `exports` field in package.json

### Next.js Applications

- Apps use the App Router (located in `app/` directory)
- TypeScript build errors are currently ignored (`ignoreBuildErrors: true` in next.config.ts)
- Tailwind CSS v4 with PostCSS configuration
- Direct consumption of UI package components without transpilation

### Cloudflare Worker API Architecture

- **Framework**: Hono - lightweight web framework designed for edge computing
- **Runtime**: Cloudflare Workers edge runtime
- **Configuration**: wrangler.jsonc for deployment and environment settings
- **Type Safety**: TypeScript with generated types from Cloudflare bindings
- **Static Assets**: Configured with assets binding for serving static files
- **Observability**: Enabled for monitoring and debugging in production
- **Current Endpoints**: `/message` - Returns a simple "Hello Hono!" message
- **Development**: Local development uses Wrangler dev server

### Styling Architecture

- Tailwind CSS v4 with shared configuration in `@audiph/tailwind-config`
- Each app imports the compiled UI styles via `@audiph/ui/styles.css`
- Apps can extend the base Tailwind config for app-specific styles
- The UI package maintains its own Tailwind build process

## Package Dependencies

### Key Technologies

- **Runtime**: Node.js >=18, pnpm 10.19.0
- **Web Framework**: Next.js 16, React 19.2
- **API Framework**: Hono 4.10.4 (Cloudflare Workers)
- **Edge Runtime**: Cloudflare Workers with Wrangler 4.45.3
- **Styling**: Tailwind CSS 4.1.5 with PostCSS
- **Type System**: TypeScript 5.9.2
- **Code Quality**: ESLint 9, Prettier 3.6

### Internal Package Structure

- `@audiph/ui`: Shared component library
- `@audiph/eslint-config`: ESLint rules and plugins
- `@audiph/tailwind-config`: Base Tailwind configuration
- `@audiph/typescript-config`: TSConfig presets for different environments

## Build Pipeline

Turbo handles the build orchestration with:

- Automatic dependency graph resolution
- Caching of build outputs (dist/, .next/)
- Parallel execution where possible
- Environment variable awareness (.env\* files)
