export function getOrCreateSessionToken() {
  if (typeof window === "undefined") {
    return null;
  }
  let token = localStorage.getItem('sessionToken');

  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('sessionToken', token);
  }

  return token;
}