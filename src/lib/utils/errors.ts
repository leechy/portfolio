import type { ApiError } from '../types.js';

// =============================================================================
// Error Classes
// =============================================================================

export class AppError extends Error {
	public readonly code: string;
	public readonly statusCode: number;
	public readonly isOperational: boolean;
	public readonly timestamp: string;
	public readonly context?: Record<string, unknown>;

	constructor(
		message: string,
		code = 'UNKNOWN_ERROR',
		statusCode = 500,
		isOperational = true,
		context?: Record<string, unknown>
	) {
		super(message);
		this.name = 'AppError';
		this.code = code;
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.timestamp = new Date().toISOString();
		this.context = context;

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError);
		}
	}
}

export class AppValidationError extends AppError {
	public readonly field: string;
	public readonly fields?: string[];

	constructor(message: string, field: string, fields?: string[]) {
		super(message, 'VALIDATION_ERROR', 400);
		this.name = 'AppValidationError';
		this.field = field;
		this.fields = fields;
	}
}

export class DatabaseError extends AppError {
	public readonly query?: string;
	public readonly table?: string;

	constructor(message: string, query?: string, table?: string) {
		super(message, 'DATABASE_ERROR', 500);
		this.name = 'DatabaseError';
		this.query = query;
		this.table = table;
	}
}

export class NotFoundError extends AppError {
	public readonly resource: string;
	public readonly id?: string | number;

	constructor(resource: string, id?: string | number) {
		const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;

		super(message, 'NOT_FOUND', 404);
		this.name = 'NotFoundError';
		this.resource = resource;
		this.id = id;
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = 'Unauthorized access') {
		super(message, 'UNAUTHORIZED', 401);
		this.name = 'UnauthorizedError';
	}
}

export class ForbiddenError extends AppError {
	constructor(message = 'Forbidden access') {
		super(message, 'FORBIDDEN', 403);
		this.name = 'ForbiddenError';
	}
}

export class ConflictError extends AppError {
	public readonly conflictingField?: string;

	constructor(message: string, conflictingField?: string) {
		super(message, 'CONFLICT', 409);
		this.name = 'ConflictError';
		this.conflictingField = conflictingField;
	}
}

export class RateLimitError extends AppError {
	public readonly limit: number;
	public readonly windowMs: number;
	public readonly resetTime?: Date;

	constructor(limit: number, windowMs: number, resetTime?: Date) {
		super('Too many requests', 'RATE_LIMIT_EXCEEDED', 429);
		this.name = 'RateLimitError';
		this.limit = limit;
		this.windowMs = windowMs;
		this.resetTime = resetTime;
	}
}

// =============================================================================
// Error Handling Utilities
// =============================================================================

/**
 * Convert any error to ApiError format
 */
export function toApiError(error: unknown): ApiError {
	if (error instanceof AppError) {
		return {
			code: error.code,
			message: error.message,
			details: {
				statusCode: error.statusCode,
				timestamp: error.timestamp,
				...error.context
			},
			timestamp: error.timestamp
		};
	}

	if (error instanceof Error) {
		return {
			code: 'INTERNAL_ERROR',
			message: error.message,
			details: {
				name: error.name,
				stack:
					process.env.NODE_ENV === 'development'
						? error.stack || 'No stack trace'
						: 'Hidden in production'
			},
			timestamp: new Date().toISOString()
		};
	}

	return {
		code: 'UNKNOWN_ERROR',
		message: 'An unknown error occurred',
		details: {
			originalError: String(error)
		},
		timestamp: new Date().toISOString()
	};
}

/**
 * Safe error handler that prevents error details from leaking in production
 */
export function handleError(error: unknown, context?: string): ApiError {
	// Log error for debugging (ESLint disabled for debugging purposes)
	// eslint-disable-next-line no-console
	console.error('Error occurred:', {
		error,
		context,
		timestamp: new Date().toISOString()
	});

	const apiError = toApiError(error);

	// In production, sanitize sensitive information
	if (process.env.NODE_ENV === 'production') {
		if (apiError.code === 'INTERNAL_ERROR' || apiError.code === 'UNKNOWN_ERROR') {
			return {
				...apiError,
				message: 'An internal error occurred',
				details: undefined
			};
		}
	}

	return apiError;
}

/**
 * Async error boundary wrapper for functions
 */
export function asyncErrorHandler<T extends unknown[], R>(
	fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
	return async (...args: T): Promise<R> => {
		try {
			return await fn(...args);
		} catch (error) {
			throw new AppError(
				error instanceof Error ? error.message : 'Unknown error occurred',
				'ASYNC_ERROR',
				500,
				true,
				{ originalError: error }
			);
		}
	};
}

/**
 * Validation helper functions
 */
export const validate = {
	required: (value: unknown, fieldName: string): AppValidationError | null => {
		if (!value || (typeof value === 'string' && value.trim() === '')) {
			return new AppValidationError(`${fieldName} is required`, fieldName);
		}
		return null;
	},

	email: (value: string, fieldName = 'email'): AppValidationError | null => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			return new AppValidationError(`${fieldName} must be a valid email address`, fieldName);
		}
		return null;
	},

	minLength: (value: string, minLength: number, fieldName: string): AppValidationError | null => {
		if (value.length < minLength) {
			return new AppValidationError(
				`${fieldName} must be at least ${minLength} characters long`,
				fieldName
			);
		}
		return null;
	},

	maxLength: (value: string, maxLength: number, fieldName: string): AppValidationError | null => {
		if (value.length > maxLength) {
			return new AppValidationError(
				`${fieldName} must be no more than ${maxLength} characters long`,
				fieldName
			);
		}
		return null;
	},

	url: (value: string, fieldName = 'url'): AppValidationError | null => {
		try {
			new URL(value);
			return null;
		} catch {
			return new AppValidationError(`${fieldName} must be a valid URL`, fieldName);
		}
	},

	slug: (value: string, fieldName = 'slug'): AppValidationError | null => {
		const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
		if (!slugRegex.test(value)) {
			return new AppValidationError(
				`${fieldName} must be a valid slug (lowercase letters, numbers, and hyphens only)`,
				fieldName
			);
		}
		return null;
	}
};

/**
 * Validate multiple fields and return all errors
 */
export function validateFields(
	data: Record<string, unknown>,
	validators: Record<
		string,
		Array<(value: unknown, fieldName: string) => AppValidationError | null>
	>
): AppValidationError[] {
	const errors: AppValidationError[] = [];

	for (const [fieldName, fieldValidators] of Object.entries(validators)) {
		const value = data[fieldName];

		for (const validator of fieldValidators) {
			const error = validator(value, fieldName);
			if (error) {
				errors.push(error);
				break; // Stop at first error for this field
			}
		}
	}

	return errors;
}

/**
 * Database error helpers
 */
export function handleDatabaseError(error: unknown): DatabaseError {
	let message = 'Database operation failed';
	let table: string | undefined;
	let query: string | undefined;

	if (error instanceof Error) {
		message = error.message;

		// Extract table name from common SQLite error patterns
		const tableMatch = error.message.match(/table (\w+)/i);
		if (tableMatch) {
			table = tableMatch[1];
		}

		// Extract constraint information
		if (error.message.includes('UNIQUE constraint failed')) {
			message = 'A record with this information already exists';
		} else if (error.message.includes('FOREIGN KEY constraint failed')) {
			message = 'Cannot perform this operation due to related data';
		} else if (error.message.includes('NOT NULL constraint failed')) {
			message = 'Required field is missing';
		}
	}

	return new DatabaseError(message, query, table);
}

/**
 * Retry wrapper for database operations
 */
export async function withRetry<T>(
	operation: () => Promise<T>,
	maxAttempts = 3,
	delayMs = 1000
): Promise<T> {
	let lastError: Error | undefined;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));

			if (attempt === maxAttempts) {
				break;
			}

			// Wait before retrying
			await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
		}
	}

	throw new AppError(
		`Operation failed after ${maxAttempts} attempts: ${lastError?.message}`,
		'MAX_RETRIES_EXCEEDED',
		500,
		true,
		{ originalError: lastError, attempts: maxAttempts }
	);
}

/**
 * Rate limiting helpers
 */
export function createRateLimiter(limit: number, windowMs: number) {
	const requests = new Map<string, number[]>();

	return {
		check: (key: string): { allowed: boolean; resetTime?: Date } => {
			const now = Date.now();
			const windowStart = now - windowMs;

			// Get existing requests for this key
			let keyRequests = requests.get(key) || [];

			// Remove expired requests
			keyRequests = keyRequests.filter(time => time > windowStart);

			if (keyRequests.length >= limit) {
				// Rate limit exceeded
				const oldestRequest = Math.min(...keyRequests);
				const resetTime = new Date(oldestRequest + windowMs);
				return { allowed: false, resetTime };
			}

			// Allow request and track it
			keyRequests.push(now);
			requests.set(key, keyRequests);

			return { allowed: true };
		},

		reset: (key: string): void => {
			requests.delete(key);
		},

		clear: (): void => {
			requests.clear();
		}
	};
}

/**
 * Error boundary for Svelte components
 */
export function createErrorBoundary() {
	let error: Error | null = null;
	let errorId: string | null = null;

	return {
		catch: (err: Error): void => {
			error = err;
			errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

			// Log error (ESLint disabled for debugging purposes)
			// eslint-disable-next-line no-console
			console.error('Component error:', {
				error: err,
				errorId,
				timestamp: new Date().toISOString()
			});
		},

		clear: (): void => {
			error = null;
			errorId = null;
		},

		get error(): Error | null {
			return error;
		},

		get errorId(): string | null {
			return errorId;
		},

		get hasError(): boolean {
			return error !== null;
		}
	};
}
