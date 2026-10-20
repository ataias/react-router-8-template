import type { DataStrategyResult, MiddlewareFunction } from "react-router";

export const timingMiddleware: MiddlewareFunction<Record<string, DataStrategyResult>> = async (
  _,
  next,
) => {
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  console.log(`Navigation took ${duration}ms`);
};
