"use client"

import axios from "axios"
import { deleteCookie } from "cookies-next"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { toast } from "react-toastify"

// global error handler
export const errorHandler = (error: unknown, router: AppRouterInstance) => {
	if (error) {
		// axios error
		if (axios.isAxiosError(error)) {
			// status code 401 -> lacking credentials
			if (error.response?.status == 401) {
				unauthorizedErrorHandler(router)
			}

			// status code 403 -> forbidden, resource not meant to be accessed by the current user
			else if (error.response?.status == 403) {
				accessDeniedErrorHandler()
			}

			// handle other errors
			else {
				const message = error.response?.data?.message
					? error.response?.data?.message
					: error.response?.statusText
				message && toast.error(message)
				process.env.NODE_ENV === "development" && console.error(error)
			}
		} else {
			if (error instanceof Error) {
				process.env.NODE_ENV === "development" &&
					console.error(
						"Error message:\n" +
							error?.message +
							"\n\nError name:\n" +
							error?.name +
							"\n\nError stack:\n" +
							error?.stack,
					)
			} else {
				process.env.NODE_ENV === "development" && console.error(error)
			}
		}
	}
}

// unauthorized error handler
export const unauthorizedErrorHandler = (router: AppRouterInstance) => {
	localStorage.clear()
	deleteCookie("token")
	router.push("/signin")
}

export const accessDeniedErrorHandler = () => {
	// TODO: do neccessary stuff
}
