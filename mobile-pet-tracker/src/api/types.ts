export interface HealthResponse {
  postgres: 'ok' | 'error';
}

export interface FieldError {
  path: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  country: string;
  timezone?: string;
  termsAccepted: true;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  timezone: string;
  createdAt: string;
}
