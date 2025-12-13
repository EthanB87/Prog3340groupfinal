export interface UserSummary {
  id: number;
  username: string;
  email?: string;
  role?: string;
}

export const fetchUsers = async (
  apiBaseUrl: string
): Promise<UserSummary[]> => {
  const response = await fetch(`${apiBaseUrl}/api/users`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load users: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
