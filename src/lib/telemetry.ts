/**
 * Telemetry / error reporting hook.
 *
 * OpenBuild ships with a no-op reporter by default — your data never leaves the
 * browser unless you explicitly wire up a sink. Drop in a Sentry/Bugsnag/Datadog
 * adapter via `setTelemetryReporter()` to capture errors and product analytics.
 *
 * Design goals:
 *  - Zero PII by default (we never pass user content into the reporter)
 *  - Synchronous error capture from Vue's app.config.errorHandler and window.onerror
 *  - Light-weight: a single interface, no transport baked in
 */

export type TelemetrySeverity = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface TelemetryContext {
  /** Arbitrary serialisable metadata. Avoid PII. */
  readonly tags?: Readonly<Record<string, string>>;
  /** Component / module that originated the event. */
  readonly scope?: string;
  /** Additional structured data — must be JSON-serialisable. */
  readonly extra?: Readonly<Record<string, unknown>>;
}

export interface TelemetryReporter {
  captureException(error: unknown, context?: TelemetryContext): void;
  captureMessage(message: string, severity: TelemetrySeverity, context?: TelemetryContext): void;
  identify?(user: { id: string; email?: string }): void;
}

const noopReporter: TelemetryReporter = {
  captureException(error, context) {
    if (import.meta.env.DEV) {
      console.error('[telemetry]', context?.scope ?? 'unknown', error, context);
    }
  },
  captureMessage(message, severity, context) {
    if (import.meta.env.DEV) {
      const fn = severity === 'error' || severity === 'fatal' ? console.error : console.info;
      fn('[telemetry]', `[${severity}]`, context?.scope ?? 'app', message, context);
    }
  },
};

let active: TelemetryReporter = noopReporter;

export function setTelemetryReporter(reporter: TelemetryReporter | null): void {
  active = reporter ?? noopReporter;
}

export function getTelemetryReporter(): TelemetryReporter {
  return active;
}

export const telemetry = {
  captureException(error: unknown, context?: TelemetryContext): void {
    try {
      active.captureException(error, context);
    } catch {
      // Telemetry must never throw into product code.
    }
  },
  captureMessage(message: string, severity: TelemetrySeverity = 'info', context?: TelemetryContext): void {
    try {
      active.captureMessage(message, severity, context);
    } catch {
      // Telemetry must never throw into product code.
    }
  },
  identify(user: { id: string; email?: string }): void {
    try {
      active.identify?.(user);
    } catch {
      // Telemetry must never throw into product code.
    }
  },
};
