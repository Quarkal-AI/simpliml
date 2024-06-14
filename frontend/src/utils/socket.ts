import { io } from "socket.io-client"

const prodURL = "http://localhost:3001"
const devURL = "http://localhost:3001"

const URL = process.env.NODE_ENV === "development" ? devURL : prodURL

export const socket = io(URL, {
	autoConnect: false
})
