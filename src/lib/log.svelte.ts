const logWaitTime = 1000;

export enum LogSeverity {
	Error,
	Warning,
	Info,
	Debug
}

class LogMessage {
	timestamp: number = Date.now();
	message: string;
	severity: LogSeverity;
	constructor(msg: string, severity: LogSeverity) {
		this.message = msg;
		this.severity = severity;
	}
}

class Logger {
	log: LogMessage[] = $state([]);
	currentMessage: LogMessage | null = $state(null);

	private lastPostedTime: number = Date.now();
	private logMessage(msg: string, severity: LogSeverity) {
		const logMessage = new LogMessage(msg, severity);
		this.lastPostedTime = logMessage.timestamp;
		this.log.push(logMessage);
		this.currentMessage = logMessage;
		setTimeout(() => {
			if (Date.now() >= this.lastPostedTime + logWaitTime) this.currentMessage = null;
		}, logWaitTime);
	}

	logError(err: string) {
		this.logMessage(err, LogSeverity.Error);
	}
}

const logger = $state(new Logger());
export default logger;
