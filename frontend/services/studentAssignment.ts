// const API_URL = "http://127.0.0.1:8000";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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