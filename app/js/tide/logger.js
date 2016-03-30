export class LogDispatcher{
  static on_all(loggers, f_name, args){
    for(let logger of loggers){
      let f = logger[f_name];
      f.apply(logger, args);
    }
  }

  constructor(){
    this.loggers = [];
  }

  register(logger) {
    this.loggers.push(logger);
  }

  info(...params){
    LogDispatcher.on_all(this.loggers, 'info', params)
  }

  warn(...params) {
    LogDispatcher.on_all(this.loggers, 'warn', params)
  }

  debug(...params) {
    LogDispatcher.on_all(this.loggers, 'debug', params)
  }

  error(...params) {
    LogDispatcher.on_all(this.loggers, 'error', params)
  }

}

export class ConsoleLogger{
  warn(...params){ console.log(...params) }
  info(...params){ console.log(...params) }
  debug(...params){ console.log(...params) }
  error(...params){ console.log(...params) }
}

const default_logger = new LogDispatcher();
default_logger.register(new ConsoleLogger());


export default default_logger;


