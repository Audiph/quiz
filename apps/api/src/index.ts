import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import gradeRoute from './routes/grade';
import quizRoute from './routes/quiz';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use('*', logger());

app.use('/api/*', (c, next) => {
  // Get CORS configuration from environment variables
  const env = c.env;
  const allowedOrigins = env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  const allowCredentials = env.CORS_ALLOW_CREDENTIALS === 'true';
  const allowedHeaders = env.CORS_ALLOWED_HEADERS?.split(',') || ['Content-Type', 'Authorization'];
  const allowedMethods = env.CORS_ALLOWED_METHODS?.split(',') || ['GET', 'POST', 'OPTIONS'];

  return cors({
    origin: allowedOrigins,
    credentials: allowCredentials,
    allowHeaders: allowedHeaders,
    allowMethods: allowedMethods,
  })(c, next);
});
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
