const API_URL = "http://127.0.0.1:8000";

export async function submitAssignment(
  token: string,
  assignmentId: number,
  answer: string
) {
  const response = await fetch(
    `${API_URL}/submissions/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignment_id: assignmentId,
        answer,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ?? "Failed to submit assignment."
    );
  }

  return data;
}

export async function checkSubmission(
  token: string,
  assignmentId: number
) {
  const response = await fetch(
    `${API_URL}/submissions/check/${assignmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function uploadAssignment(
    token: string,
    assignmentId: number,
    answer: string,
    file: File | null,
    questionAnswers: string[]
)
{
  const formData = new FormData();

  formData.append(
    "assignment_id",
    assignmentId.toString()
  );

  formData.append(
    "answer",
    answer
  );
  formData.append(
    "question_answers",
    JSON.stringify(questionAnswers)
  );

  if (file) {
    formData.append(
      "file",
      file
    );
  }

  const response = await fetch(
    `${API_URL}/submissions/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}

export async function getSubmissions(
  token: string,
  assignmentId: number
) {
  const response = await fetch(
    `${API_URL}/submissions/${assignmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function getSubmissionDetail(
  token: string,
  submissionId: number
) {
  const response = await fetch(
    `${API_URL}/submissions/detail/${submissionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ?? "Failed to load submission."
    );
  }

  return data;
}

export async function generateQuestions(
  token: string,
  file: File
) {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const response = await fetch(
    `${API_URL}/submissions/generate-questions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return response.json();
}