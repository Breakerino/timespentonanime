export type LogLevel = 'info' | 'debug' | 'warn' | 'error' | 'table';

export const LOG_LEVELS: LogLevel[] = ['info', 'debug', 'warn', 'error', 'table']

const useLogger = (label = '', prefix = '') => {
	// @ts-expect-error IDK
	const logMessage = (type: LogLevel, message: string | unknown, ...data: unknown) => {
		if (['debug'].includes(type) && ! import.meta.env.DEBUG_MODE) {
			return;
		}

		// @ts-expect-error IDK
		console[type](`[${prefix}${label ? ` - ${label}` : ''}] ${message}`, ...(data as unknown ?? undefined));
	}

	const logTable = (data: unknown, keys?: string[]) => {
		if (! import.meta.env.DEBUG_MODE) {
			return;
		}
		console.table(data, keys);
	}

	return {
		...Object.fromEntries([
				// @ts-expect-error IDK
			...LOG_LEVELS.map(type => [type, (message: string, ...data: Record<string, string>) => logMessage(type, message, data)]),
			['table', logTable]
		]),
	}
}

export default useLogger;