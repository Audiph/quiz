# Quiz Web Application

A modern, interactive quiz application built with Next.js 16, React 19, and TypeScript. This web app provides an engaging quiz-taking experience with real-time feedback, multiple question types, and comprehensive results tracking.

## Features

### Core Functionality

- **Interactive Quiz Interface**: Clean, responsive UI built with Audiph UI component library
- **Multiple Question Types**:
  - Text input questions (free-form answers)
  - Radio button questions (single choice)
  - Checkbox questions (multiple choice)
- **Real-Time Progress Tracking**: Visual indicators for quiz progress and answered questions
- **Timed Challenges**: Configurable countdown timer with automatic submission
- **Instant Results**: Detailed performance feedback with score breakdown
- **Customizable Settings**: Configure question count, time limits, and shuffling options

### Technical Features

- **Server-Side Actions**: Next.js server actions for secure quiz operations
- **Type-Safe API Integration**: Full TypeScript support with Zod schema validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS v4
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Form Validation**: Real-time validation with helpful error feedback
- **Loading States**: Optimistic UI updates and loading indicators
- **Toast Notifications**: Contextual feedback using Sonner toast system

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 10.19.0 or higher
- API server running (defaults to http://localhost:8787)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables (optional)
cp .env.example .env.local
```

### Development

```bash
# Start the development server
pnpm dev

# The app will be available at http://localhost:3001
```

### Production Build

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

### Type Checking & Linting

```bash
# Type check the codebase
pnpm check-types

# Run ESLint
pnpm lint
```

## Project Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page entry point
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── actions/           # Server actions
│   │   └── quiz.actions.ts  # Quiz start and submission actions
│   ├── components/        # React components
│   │   ├── question-card.tsx    # Question display component
│   │   ├── quiz-form.tsx        # Main quiz form container
│   │   ├── quiz-progress.tsx    # Progress indicator
│   │   ├── quiz-results.tsx     # Results display
│   │   └── quiz-timer.tsx       # Countdown timer
│   └── schemas/           # Zod validation schemas
│       └── quiz.schema.ts       # Quiz data validation
├── common/                # Shared utilities and handlers
│   ├── api-handlers/      # API communication layer
│   │   ├── quiz.ts             # Quiz API endpoints
│   │   └── utils.ts            # HTTP request utilities
│   ├── config/            # Configuration
│   │   └── api.ts              # API endpoints and defaults
│   ├── page-components/   # Page-level components
│   │   └── quiz.tsx            # Main quiz page component
│   ├── types/             # TypeScript type definitions
│   │   └── api.ts              # API response types
│   └── utils/             # Utility functions
│       └── calculate-percentage.ts  # Score calculation
├── public/                # Static assets
├── package.json          # Dependencies and scripts
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── postcss.config.js     # PostCSS configuration
└── eslint.config.js      # ESLint configuration
```

## Architecture

### Component Architecture

The application follows a layered component architecture:

1. **Page Components** (`common/page-components/`): High-level page logic and state management
2. **Feature Components** (`app/components/`): Reusable quiz-specific components
3. **UI Components** (`@audiph/ui`): Shared design system components

### Data Flow

```
User Input → Server Actions → API Handlers → External API
                ↓
           Validation (Zod)
                ↓
           State Update
                ↓
           UI Re-render
```

### State Management

- **Form State**: React `useActionState` for server action integration
- **Local State**: React hooks (`useState`, `useEffect`) for component state
- **Quiz State**: Managed through server actions with optimistic updates

## Configuration

### Environment Variables

```env
API_URL=http://localhost:8787  # API server URL (optional, defaults to localhost)
```

### Quiz Configuration Defaults

Located in `common/config/api.ts`:

```typescript
QUIZ_DEFAULTS = {
  QUESTION_LIMIT: 10, // Number of questions
  TIME_LIMIT: 300, // Time in seconds (5 minutes)
  SHUFFLE_QUESTIONS: true, // Randomize question order
  SHUFFLE_CHOICES: true, // Randomize answer choices
};
```

## API Integration

### Endpoints

The app communicates with the following API endpoints:

- `GET /api/quiz` - Fetch a new quiz with questions
- `POST /api/grade` - Submit quiz answers for grading
- `GET /health` - API health check

### Request/Response Types

All API types are defined in `common/types/api.ts`:

- `GetQuizResponse`: Quiz questions and configuration
- `GradeResponse`: Quiz results and scoring
- `ErrorResponse`: Standardized error format

## Key Components

### QuizForm

Main quiz container that manages:

- Question navigation
- Answer collection
- Form submission
- Timer integration
- Validation feedback

### QuestionCard

Renders different question types:

- Text input with placeholder
- Radio buttons for single choice
- Checkboxes for multiple choice
- Error state display

### QuizTimer

Countdown timer with:

- Visual progress indicator
- Color coding based on remaining time
- Automatic submission on timeout
- Pause capability

### QuizResults

Comprehensive results display:

- Overall score and percentage
- Pass/fail status (70% threshold)
- Question-by-question breakdown
- Performance statistics
- Retry option

## Validation

### Client-Side Validation

- Required field checks
- Type validation using Zod schemas
- Real-time error feedback
- Answer completeness verification

### Server-Side Validation

- Schema validation in server actions
- API response validation
- Error boundary protection

## Error Handling

The app implements multiple layers of error handling:

1. **Form Validation**: Immediate feedback for invalid inputs
2. **Server Actions**: Try-catch blocks with user-friendly messages
3. **API Errors**: Standardized error responses with fallback messages
4. **UI Feedback**: Toast notifications and inline error displays

## Performance Optimizations

- **Code Splitting**: Automatic with Next.js App Router
- **Lazy Loading**: Components loaded on demand
- **Optimistic Updates**: UI updates before server confirmation
- **Memoization**: `useCallback` for expensive operations
- **Efficient Re-renders**: Granular state updates

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## Development Notes

### TypeScript

- Build errors are currently ignored (`ignoreBuildErrors: true`)
- Full type safety with strict mode
- Generated types from API responses

### Styling

- Tailwind CSS v4 with PostCSS
- Shared configuration from `@audiph/tailwind-config`
- Component styles imported from `@audiph/ui/styles.css`
- Dark mode support via Tailwind classes

### Testing

Currently, no test suite is implemented. Recommended additions:

- Unit tests for utilities and schemas
- Component testing with React Testing Library
- E2E tests with Playwright/Cypress
- API integration tests

## Deployment

The app is configured for deployment on Vercel or any Node.js hosting platform:

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```
