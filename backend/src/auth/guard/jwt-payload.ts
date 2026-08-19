export interface JwtPayload {
  id: number;
  email: string;
  table: 'cliente';
}
// NUEVO: para guests
export interface GuestPayload {
  sessionToken: string;
}

export type IdentityPayload = JwtPayload | GuestPayload;
