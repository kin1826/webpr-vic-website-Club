export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string>;
  readonly retryAfterSeconds?: number;
  readonly nextAllowedAt?: string;
  readonly latestConfig?: unknown;
  readonly outcomeUnknown?: boolean;

  constructor(options: {
    message: string;
    status: number;
    code: string;
    fieldErrors?: Record<string, string>;
    retryAfterSeconds?: number;
    nextAllowedAt?: string;
    latestConfig?: unknown;
    outcomeUnknown?: boolean;
    cause?: unknown;
  }) {
    super(options.message, { cause: options.cause });
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
    this.retryAfterSeconds = options.retryAfterSeconds;
    this.nextAllowedAt = options.nextAllowedAt;
    this.latestConfig = options.latestConfig;
    this.outcomeUnknown = options.outcomeUnknown;
  }
}
