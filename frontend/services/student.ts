// const API_URL = "http://127.0.0.1:8000";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getMyClasses(token: string) {
  const response = await fetch(
    `${API_URL}/enrollment/my-classes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function joinClass(
  token: string,
  class_code: string
) {
  const response = await fetch(
    `${API_URL}/enrollment/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        class_code,
      }),
    }
  );

  return response.json();
}