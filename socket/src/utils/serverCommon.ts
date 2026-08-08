// Normalize a port into a number, string, or false
export function normalizePort(val: string): number | string | boolean {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val; // named pipe
    if (port >= 0) return port; // port number
    return false;
  }