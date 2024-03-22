export class LogEntryEvent {
  static eventName = 'LogEntryEvent';
  constructor(
    public readonly type = 'say-hello-name',
    public readonly text?: string,
  ) {}
}
