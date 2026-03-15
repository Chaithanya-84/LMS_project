export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  databaseUrl: process.env.DATABASE_URL!,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  cookieDomain: process.env.COOKIE_DOMAIN || "localhost",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "30d",
} as const;
