import { environment } from '../../environments/environment';
import { isArray } from 'util';

/**
 *  OFF = 0, ERROR = 1, WARN = 2, INFO = 3,
 * DEBUG = 4, TRACE = 5, ... = 6 (to log everything)
 */
enum LogLevel {
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE',
  ERROR = 'ERROR',
  WARN = 'WARN',
  OFF = 'OFF',
}

const headerCSS = {
  error: [ 'color: #F20404, font-weight: bold;' ],
  warn: [ 'color: orange, font-weight: bold;' ],
  info: [ 'color: #4CAF50, font-weight: bold;' ],
  debug: [ 'color: #9E9E9E, font-weight: bold;' ],
  trace: [ 'color: #24292e, font-weight: bold;' ],
};

export class Logger {
  private clazz: string;
  private logLevel = environment.loglevel !== undefined ?
    environment.loglevel : 1;

  constructor ( clazz ) {
    this.clazz = clazz;
  }

  public static getInstance ( clazz ) {
    return new Logger( clazz );
  }

  public setLogLevel ( loglevel ) {
    this.logLevel = loglevel;
  }

  public error ( ...message ) {
    if ( this.logLevel < 1 ) {
      return;
    }
    this.log( LogLevel.ERROR, ...message );
  }

  public warn ( ...message ) {
    if ( this.logLevel < 2 ) {
      return;
    }
    this.log( LogLevel.WARN, ...message );
  }

  public info ( ...message ) {
    if ( this.logLevel < 3 ) {
      return;
    }
    this.log( LogLevel.INFO, ...message );
  }

  public debug ( ...message ) {
    if ( this.logLevel < 4 ) {
      return;
    }
    this.log( LogLevel.DEBUG, ...message );
  }

  public trace ( ...message ) {
    if ( this.logLevel < 5 ) {
      return;
    }
    this.log( LogLevel.TRACE, ...message );
  }

  private log ( level: string, ...message ) {
    const date = new Date(),
      time = date.toLocaleTimeString() + ':' + date.getMilliseconds();
    console[level.toLowerCase()](
      `%c[${time}] ${level} [${this.clazz}] | ${message.join( ', ' )}`,
      ...headerCSS[level.toLowerCase()]
    );
  }
}
