const API_URL = "http://127.0.0.1:8000";

export async function getAssignments(
    token: string,
    classId: number
) {

    const response = await fetch(
        `${API_URL}/assignments/student/${classId}`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    return response.json();

}