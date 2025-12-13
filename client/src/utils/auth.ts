const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");

  // If a JWT is found, return the Bearer header
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // If no token, return standard headers (relying on cookie)
  return {
    "Content-Type": "application/json",
  };
};

// This function performs a fetch request, automatically including the JWT if available.
export const authFetch = (url: string, options?: RequestInit) => {
  const headers = getAuthHeaders();

  const mergedHeaders = {
    ...headers,
    ...options?.headers,
  };

  return fetch(url, {
    ...options,
    headers: mergedHeaders as HeadersInit,
    credentials: "include",
  });
};

// Utility to save the token after successful local login
export const saveTokenToStorage = (token: string) => {
  localStorage.setItem("authToken", token);
};
