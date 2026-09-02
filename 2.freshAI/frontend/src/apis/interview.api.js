import api from "../utils/axios"

export const startInterview = async (data) => {
    const response = await api.post("/api/interview/start", data)
    return response.data
}

export const getInterview = async (id) => {
    const response = await api.get(`/api/interview/${id}`)
    return response.data
}