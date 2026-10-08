/* Lightweight browser logger.
 *
 * The application imports `authLogger`, `routerLogger` and `logAppStart`.
 * Everything goes to the console; never log credentials or tokens here.
 */

type LogLevel = 'info' | 'success' | 'warn' | 'error'

const PREFIX = '[ComplianceCheckpoint]'

function emit(scope: string, level: LogLevel, message: string, detail?: unknown) {
  const line = `${PREFIX} [${scope}] ${message}`
  if (level === 'error') {
    console.error(line, detail ?? '')
  } else if (level === 'warn') {
    console.warn(line, detail ?? '')
  } else {
    console.log(line, detail ?? '')
  }
}

function createLogger(scope: string) {
  return {
    info: (message: string, detail?: unknown) => emit(scope, 'info', message, detail),
    success: (message: string, detail?: unknown) => emit(scope, 'success', message, detail),
    warn: (message: string, detail?: unknown) => emit(scope, 'warn', message, detail),
    error: (message: string, detail?: unknown) => emit(scope, 'error', message, detail),
    auth: (message: string, detail?: unknown) => emit(scope, 'info', `auth: ${message}`, detail),
    // Log a named piece of state without dumping sensitive values.
    state: (key: string, value: unknown) => emit(scope, 'info', `${key} = ${String(value)}`),
    nav: (path: string, detail?: string) =>
      emit(scope, 'info', `nav ${path}${detail ? ` (${detail})` : ''}`),
  }
}

export const authLogger = createLogger('auth')
export const routerLogger = createLogger('router')
export const apiLogger = createLogger('api')

export function logAppStart() {
  emit('app', 'info', 'application starting')
}
