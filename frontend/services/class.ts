// const API_URL = "http://127.0.0.1:8000";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function createClass(
  token: string,
  data: {
    class_name: string;
    description: string;
  }
) {
  const response = await fetch(`${API_URL}/classes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function getClassDetail(
  token: string,
  id: number
) {
  const response = await fetch(
    `http://127.0.0.1:8000/classes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function getStudentClassDetail(
  token: string,
  classId: number
) {
  const response = await fetch(
    `${API_URL}/classes/student/${classId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}