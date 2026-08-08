import { Request,NextFunction} from 'express';

interface SessionData {
    flash: { [key: string]: any };
}

interface Session extends Partial<SessionData> {}

declare module 'express-session' {
    interface SessionData {
        flash: { [key: string]: any };
        returnTo: string
    }
}

function _flash(this: Request, type: string, msg?: string | string[]): number | string[] | { [key: string]: any } {
    if (this.session === undefined) throw new Error('req.flash() requires sessions');
    const msgs = this.session.flash = this.session.flash || {};
    if (type && msg) {
        if (Array.isArray(msg)) {
            msg.forEach(val => {
                (msgs[type] = msgs[type] || []).push(val);
            });
            return msgs[type].length;
        }
        return (msgs[type] = msgs[type] || []).push(msg);
    } else if (type) {
        const arr = msgs[type];
        delete msgs[type];
        return arr || [];
    } else {
        this.session.flash = {};
        return msgs;
    }
}

export function flash(options: { unsafe?: boolean } = {}) {
    const safe = options.unsafe === undefined ? true : !options.unsafe;
  
    return function(req: Request, res: Response, next: NextFunction) {
        if (req.flash && safe) {
            return next();
        }
        req.flash = _flash;
        next();
    };
}