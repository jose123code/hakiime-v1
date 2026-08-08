export interface SessionPayload{
    userId: string,
    expiresAt: string,
    email: string,
    username: string,
    applications: string[]
}

export interface UserPayload {
    id: string;
    email: string;
  }
export interface LicensePayload {
    auth: string;
  }
  

// Define the structure of the user payload
export interface TokenVerify {
  verify: boolean;
  data: UserPayload | SessionPayload| LicensePayload;
}
