export const logger = {
  info(message: string, meta?: unknown) {
    console.info(`[safety-platform] ${message}`, meta ?? '');
  },
  warn(message: string, meta?: unknown) {
    console.warn(`[safety-platform] ${message}`, meta ?? '');
  },
  error(message: string, meta?: unknown) {
    console.error(`[safety-platform] ${message}`, meta ?? '');
  },
};
