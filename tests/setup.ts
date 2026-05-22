process.env.DATABASE_URL ??=
  "postgresql://test:test@localhost:5432/test?sslmode=require";
process.env.BETTER_AUTH_SECRET ??= "test-secret-not-used-in-unit-tests-0123456789";
process.env.BETTER_AUTH_URL ??= "http://localhost:3000";
