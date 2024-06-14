import axios from "axios"

const prodURL = "http://localhost:3001/api/v1"
const devURL = "http://localhost:3001/api/v1"

const URL = process.env.NODE_ENV === "development" ? devURL : prodURL

const API = axios.create({
	withCredentials: true,
	baseURL: URL,
})

export default API
