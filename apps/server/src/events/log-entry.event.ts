export class LogEntryEvent {
  static eventName = 'LogEntryEvent';
  constructor(
    public readonly text?: string,
    public readonly type = 'say-hello-name',
  ) {}
}
