const API_URL = "http://127.0.0.1:8000";

export async function getDashboardAnalytics(
  token: string
) {
  const response = await fetch(
    `${API_URL}/analytics/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}