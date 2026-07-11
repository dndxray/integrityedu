const API_URL = "http://127.0.0.1:8000";

export async function saveTypingLog(
  token: string,
  data: any
) {
  const response = await fetch(
    `${API_URL}/typing/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function getTypingLog(
  token: string,
  submissionId: number
) {
  const response = await fetch(
    `${API_URL}/typing/${submissionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}