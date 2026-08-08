import crypto from 'crypto';

export function generateUniqueToken(length: number): string {
  const timestamp = Date.now().toString(16); // Get current timestamp in hexadecimal format
  const randomBytes = crypto.randomBytes(Math.ceil(length / 2)).toString('hex'); // Generate random bytes

  // Concatenate timestamp and random bytes
  let token = timestamp + randomBytes;

  // Trim the token to the specified length
  token = token.slice(0, length);

  return token;
}

// get request info for socket
// adapted from express
export const socketInfo = function (socket) {
  var headers = socket.request.headers || {};
  var o = {
    headers: headers,
    user: socket.user || null,
    address: null,
  };
  var ip = getHeader('X-Forwarded-For', headers);
  ip = ip ? ip.split(/ *, */) : [];
  var conn = socket.request.connection;
  o.address = ip[0] || conn.remoteAddress || conn.localAddress || null;
  return o;
};

// get http header from headers
// taken from express
export function getHeader(name, headers) {
  switch ((name = name.toLowerCase())) {
    case 'referer':
    case 'referrer':
      return headers.referrer || headers.referer;
    default:
      return headers[name];
  }
}

export const emptyCheck = function <T>(
  value: T | null | undefined,
  message: string,
  error: any,
): boolean | void {
  message = message || 'Some error occured';
  error = error || Error;

  if (!value || typeof value == 'undefined') throw new error(message);

  return true;
};

export const initDefaultValue = function <T>(
  value: T | null | undefined,
  default_value,
): T {
  if (value && typeof value !== null && typeof value == 'undefined') {
    return value as T;
  }

  return value || (default_value as T);
};

export const isNotNull = function <T>(value: T | null): value is T {
  return value !== null;
};

export function isString(x: any): boolean {
  return typeof x === 'string' && x !== null && x !== undefined;
}

export function isSet(obj: any, propertyName: string): boolean {
  return (
    obj !== null &&
    obj !== undefined &&
    obj.hasOwnProperty(propertyName) &&
    obj[propertyName] !== null &&
    obj[propertyName] !== undefined
  );
}

export function unSet<T>(obj: T, propertyName: string): void {
  if (
    typeof obj === 'object' &&
    obj !== null &&
    Object.prototype.hasOwnProperty.call(obj, propertyName)
  ) {
    delete obj[propertyName];
  }
}
