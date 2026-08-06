export function getOrCreateSessionToken() {
  if (typeof window === "undefined") {
    return null;
  }
  let token = localStorage.getItem('sessionToken');

  console.log("Token en localStorage:", token);

  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('sessionToken', token);
  } else {
    console.log("Token existente:", token);
  }

  return token;
}