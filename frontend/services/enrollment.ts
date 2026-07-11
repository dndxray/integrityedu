const API_URL = "http://127.0.0.1:8000";

export async function joinClass(
  token: string,
  classCode: string
) {
  const response = await fetch(
    `${API_URL}/enrollments/join`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_code: classCode,
      }),
    }
  );

  return response.json();
}