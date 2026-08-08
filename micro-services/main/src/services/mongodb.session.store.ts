import { EventEmitter } from 'events';
import { Store, SessionData } from 'express-session';
import { ISessionRepository } from '../interfaces';
import { Session } from '../app/entities/Session';
import { Options, OptionsData, defaultOptions } from './OptionsData';


export class MongoDBStore extends Store {
  private repo: ISessionRepository;
  private _emitter: EventEmitter;
  private options: OptionsData;
  private _errorHandler: (
    error: Error,
    callback?: (error: Error) => void,
  ) => void;

  constructor(
    sessionRepository: ISessionRepository,
  ) {
    super();
    this.options = defaultOptions;
    this.repo = sessionRepository;
    this._emitter = new EventEmitter();
    this._errorHandler = this.handleError.bind(this);
  }
  setOption(options: Options) {
    this.options = defaultOptions.modify(options);
    return this;
  }
  get(
    sid: string,
    callback: (err: any, session?: SessionData | null | undefined) => void,
  ): void {
    const _this = this;
    this.repo
      .getById(sid)
      .then((session) => {
        if (session) {
          if (!session.expires || new Date() < session.expires) {
            return process.nextTick(() => callback(null, session.session));
          } else {
            return _this.destroy(sid, callback);
          }
        } else {
          return process.nextTick(() => callback(null, null));
        }
      })
      .catch((error) => {
        const e = new Error('Error finding ' + sid + ': ' + error.message);
        return _this._errorHandler(e, callback);
      });
  }
  set(
    sid: string,
    session: SessionData,
    callback?: ((err?: any) => void) | undefined,
  ): void {
    const _this = this;
    var expires: Date = new Date();
    if (session && session.cookie && session.cookie.expires) {
      expires = new Date(session.cookie.expires);
    } else {
      expires = new Date(expires.getTime() + this.options.expires);
    }
    const sessionDoc: Session = { idSession: sid, session, expires };
    this.repo
      .update(sid, sessionDoc)
      .then(() => {
        _this.emit('set', sid);
        process.nextTick(() => callback && callback());
      })
      .catch((error) => {
        const e = new Error(
          'Error setting ' +
            sid +
            ' to ' +
            require('util').inspect(session) +
            ': ' +
            error.message,
        );
        return _this._errorHandler(e, callback);
      });
  }
  destroy(sid: string, callback?: ((err?: any) => void) | undefined): void {
    const _this = this;

    this.repo
      .delete(sid)
      .then(() => {
        _this.emit('destroy', sid);
        process.nextTick(() => callback && callback());
      })
      .catch((error) => {
        const e = new Error('Error destroying ' + sid + ': ' + error.message);
        return _this._errorHandler(e, callback);
      });
  }

touch(sid: string, session: SessionData, callback?: ((err?:any) => void) | undefined): void {
    const _this = this;
    var expires: Date = new Date();
    if (session && session.cookie && session.cookie.expires) {
      expires = new Date(session.cookie.expires);
    } else {
      expires = new Date(expires.getTime() + this.options.expires);
    }

    const sessionDoc: Session = { idSession: sid, session, expires };

    this.repo
      .update(sid, sessionDoc)
      .then(() => {
        _this.emit('touch', sid, session);
        process.nextTick(() => callback && callback());
      })
      .catch((error) => {
        const e = new Error(
          'Error setting ' +
            sid +
            ' to ' +
            require('util').inspect(session) +
            ': ' +
            error.message,
        );
        return _this._errorHandler(e, callback);
      });

  }

  private handleError(error: Error, callback?: (error: Error) => void): void {
    if (this._emitter.listeners('error').length) {
      this.emit('error', error);
    }

    if (callback) {
      callback(error);
    }

    if (!this._emitter.listeners('error').length && !callback) {
      throw error;
    }
  }
}
