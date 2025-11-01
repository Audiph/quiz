# Quiz API

A RESTful quiz application API built with Hono framework running on Cloudflare Workers. This API provides endpoints to fetch quiz questions and grade user submissions.

## Features

- **Multiple Question Types**: Supports text input, single choice (radio), and multiple choice (checkbox) questions
- **Deterministic Shuffling**: Questions and choices can be shuffled consistently using seed-based randomization
- **Automatic Grading**: Validates and grades user answers with detailed results
- **Mock Data**: 12 diverse quiz questions covering various topics (no database required)
- **CORS Support**: Configured for frontend integration
- **Type Safety**: Built with TypeScript for full type safety
- **Edge Runtime**: Optimized for Cloudflare Workers edge computing
- **Comprehensive Testing**: Unit tests for grading logic, validation, and shuffling

## Installation

```bash
# Navigate to the API directory
cd apps/api

# Install dependencies
pnpm install

# Generate TypeScript types for Cloudflare bindings
pnpm cf-typegen
```

## Development

```bash
# Start development server (runs on http://localhost:8787)
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Type checking (via TypeScript compiler)
pnpm check-types

# Lint code
pnpm lint
```

## API Endpoints

### GET `/health`

Health check endpoint to verify the API is running.

**Response:**

```json
{
  "status": "ok",
  "timestamp": 1699123456789
}
```

### GET `/api/quiz`

Fetches a randomized quiz with 8-12 questions. Questions are returned without correct answers to prevent cheating.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Number of questions to return (8-12) |
| `seed` | string | timestamp | Seed for deterministic shuffling |
| `shuffle` | boolean | true | Whether to shuffle questions |
| `timeLimit` | number | 300 | Quiz time limit in seconds |

**Example Request:**

```bash
GET /api/quiz?limit=10&seed=user123&timeLimit=600
```

**Response (200 OK):**

```json
{
  "questions": [
    {
      "id": "q1",
      "type": "text",
      "question": "What is the capital city of France?"
    },
    {
      "id": "q4",
      "type": "radio",
      "question": "What is the largest planet in our solar system?",
      "choices": ["Earth", "Jupiter", "Saturn", "Mars"]
    },
    {
      "id": "q8",
      "type": "checkbox",
      "question": "Which of the following are primary colors?",
      "choices": ["Red", "Green", "Blue", "Yellow", "Purple"]
    }
  ],
  "config": {
    "timeLimit": 600,
    "shuffleQuestions": true,
    "shuffleChoices": true,
    "seed": "user123"
  },
  "quizId": "dXNlcjEyMy0xNjk5MTIzNDU2Nzg5"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server error

### POST `/api/grade`

Grades user-submitted quiz answers and returns the score with detailed results.

**Request Body:**

```json
{
  "answers": [
    {
      "id": "q1",
      "value": "Paris"
    },
    {
      "id": "q4",
      "value": 1
    },
    {
      "id": "q8",
      "value": [0, 2, 3]
    }
  ],
  "quizId": "dXNlcjEyMy0xNjk5MTIzNDU2Nzg5"
}
```

**Answer Value Types:**

- **Text questions**: `string` value
- **Radio questions**: `number` value (index of selected choice)
- **Checkbox questions**: `number[]` array (indices of selected choices)

**Response (200 OK):**

```json
{
  "score": 8,
  "total": 10,
  "results": [
    {
      "id": "q1",
      "correct": true
    },
    {
      "id": "q4",
      "correct": true
    },
    {
      "id": "q8",
      "correct": false
    }
  ]
}
```

**Error Responses:**

- `400 Bad Request`: Invalid request format or missing required fields
- `500 Internal Server Error`: Server error

## Question Types

### 1. Text Questions

Questions that require a text input answer.

```typescript
{
  "id": "q1",
  "type": "text",
  "question": "What is the capital city of France?"
}
```

**Grading:**

- Case-insensitive by default (configurable per question)
- Whitespace is trimmed from both ends

### 2. Radio Questions (Single Choice)

Questions with multiple options where only one answer is correct.

```typescript
{
  "id": "q4",
  "type": "radio",
  "question": "What is the largest planet?",
  "choices": ["Earth", "Jupiter", "Saturn", "Mars"]
}
```

**Answer format:** Single number representing the index of the selected choice (0-based)

### 3. Checkbox Questions (Multiple Choice)

Questions where multiple answers can be correct.

```typescript
{
  "id": "q8",
  "type": "checkbox",
  "question": "Select all primary colors:",
  "choices": ["Red", "Green", "Blue", "Yellow", "Purple"]
}
```

**Answer format:** Array of numbers representing indices of selected choices
**Grading:** All correct choices must be selected, no incorrect choices allowed

## Mock Data

The API includes 12 pre-defined questions covering various topics:

- Geography (capitals, continents)
- History (World War II)
- Science (chemistry, physics, astronomy)
- Art (famous painters)
- Technology (programming languages, web frameworks, HTTP)
- Mathematics (prime numbers)

## Project Structure

```
apps/api/
├── src/
│   ├── index.ts              # Main application entry point
│   ├── types/
│   │   ├── quiz.ts          # Quiz-related TypeScript types
│   │   └── api.ts           # API request/response types
│   ├── data/
│   │   └── questions.ts     # Mock quiz questions
│   ├── utils/
│   │   ├── validation.ts    # Request validation logic
│   │   ├── shuffle.ts       # Deterministic shuffling algorithm
│   │   └── grading.ts       # Answer grading logic
│   ├── routes/
│   │   ├── quiz.ts          # GET /api/quiz handler
│   │   └── grade.ts         # POST /api/grade handler
│   └── tests/
│       ├── grading.test.ts  # Grading logic tests
│       ├── validation.test.ts # Validation tests
│       └── shuffle.test.ts  # Shuffling algorithm tests
├── package.json              # Dependencies and scripts
├── vitest.config.ts         # Test configuration
├── wrangler.jsonc           # Cloudflare Workers configuration
└── tsconfig.json            # TypeScript configuration
```

## Deployment

### Deploy to Cloudflare Workers

```bash
# Deploy to production
pnpm deploy

# Deploy to a specific environment
wrangler deploy --env staging
```

### Environment Configuration

Configure your deployment in `wrangler.jsonc`:

```json
{
  "name": "quiz-api",
  "main": "src/index.ts",
  "compatibility_date": "2025-10-31",
  "observability": {
    "enabled": true
  }
}
```

## Testing

The API includes comprehensive unit tests for core functionality:

### Run Tests

```bash
# Run all tests
pnpm test

# Run with coverage report
pnpm test:coverage

# Watch mode for development
pnpm test:watch
```

### Test Coverage

- **Grading Logic**: Text, radio, and checkbox answer validation
- **Validation**: Request format and parameter validation
- **Shuffling**: Deterministic randomization algorithm
- **Edge Cases**: Empty answers, invalid inputs, missing questions

## CORS Configuration

The API is configured to accept requests from:

- `http://localhost:3001` (Next.js development server)
- `http://localhost:3000` (Alternative development server)
- Any origin (`*`) for development flexibility

For production, update the CORS origins in `src/index.ts`:

```typescript
cors({
  origin: ['https://your-domain.com'],
  credentials: true,
});
```

## Error Handling

All errors are handled gracefully with appropriate HTTP status codes:

- **200 OK**: Successful request
- **400 Bad Request**: Invalid input or validation errors
- **404 Not Found**: Route not found
- **500 Internal Server Error**: Unexpected server errors

Error responses include descriptive messages to help debug issues:

```json
{
  "error": "Invalid request",
  "message": "Answers must be an array"
}
```

## Performance Considerations

- **Edge Runtime**: Runs on Cloudflare's global edge network for low latency
- **Stateless Design**: No database queries, all data is in-memory
- **Efficient Shuffling**: O(n) Fisher-Yates algorithm with seeded randomization
- **Minimal Dependencies**: Only uses Hono framework for lightweight deployment

## Future Enhancements

Potential improvements for production use:

- [ ] Database integration (Cloudflare D1 or KV storage)
- [ ] User authentication and session management
- [ ] Question categories and difficulty levels
- [ ] Time tracking per question
- [ ] Partial credit for checkbox questions
- [ ] Question explanations after grading
- [ ] Admin API for question management
- [ ] Rate limiting and abuse prevention
- [ ] Websocket support for real-time quizzes
- [ ] Analytics and reporting

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
