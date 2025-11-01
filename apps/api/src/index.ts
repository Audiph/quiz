import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import gradeRoute from './routes/grade';
import quizRoute from './routes/quiz';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use('*', logger());

app.use(
  '/api/*',
  cors({
    origin: ['http://localhost:3001', 'http://localhost:3000', '*'],
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  }),
);
app.get('/health', c => c.json({ status: 'ok', timestamp: Date.now() }));
app.route('/api/quiz', quizRoute);
app.route('/api/grade', gradeRoute);
app.notFound(c => {
  return c.json(
    {
      error: 'Not Found',
      message: `Route ${c.req.path} not found`,
      availableRoutes: ['GET /health', 'GET /api/quiz', 'POST /api/grade'],
    },
    404,
  );
});
app.onError((err, c) => {
  console.error(`[Error] ${err.message}`, err);
  const isDev = c.req.header('CF-Ray') === undefined;
  return c.json(
    {
      error: 'Internal Server Error',
      message: isDev ? err.message : 'An error occurred',
    },
    500,
  );
});

export default app;
