// const API_URL = "http://127.0.0.1:8000";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getAssignments(
  token: string,
  classId: number
) {
  const response = await fetch(
    `${API_URL}/assignments/class/${classId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function createAssignment(
  token: string,
  data: {
    class_id: number;
    title: string;
    description: string;
    deadline: string;
  }
) {
  const response = await fetch(
    `${API_URL}/assignments/`,
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

export async function getAssignmentDetail(
  token: string,
  assignmentId: number
) {
  const response = await fetch(
    `${API_URL}/assignments/${assignmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function getMyAssignments(token: string) {
  const response = await fetch(
    `${API_URL}/assignments/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}
