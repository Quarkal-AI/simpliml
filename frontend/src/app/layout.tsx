import type { Metadata } from "next"
import { CookiesProvider } from "next-client-cookies/server"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import RecoilContextProvider from "@/utils/RecoilContextProvider"

import "./globals.css"

export const metadata: Metadata = {
	title: "SimpliML | Full-Stack LLMOps Platform for Gen AI Apps",
	applicationName: "SimpliML",
	robots: "index, follow",
	keywords: [
		"Gen AI",
		"LLM",
		"large language model",
		"production",
		"fine-tuning",
		"deployment",
		"monitoring",
		"private cloud",
		"enterprise",
		"security",
		"efficiency",
		"developers",
		"llm fine-tuning",
		"llm deployment",
		"serverless deployment",
	],
	description:
		"<h2>Bring Your Gen AI Apps to Production Securely with SimpliML.</h2> <p>Empower developers and enterprises with SimpliML, the all-in-one platform for:</p> <ul> <li>Fine-tuning LLM models</li> <li>Deploying LLM models to production</li> <li>Monitoring LLM performance</li> <li>Private cloud deployment</li> </ul> <p>Unlock the power of Gen AI with SimpliML.</p>",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<head>
				<link
					href="https://api.fontshare.com/v2/css?f[]=general-sans@500,301,300,401,400&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="w-full relative">
				<RecoilContextProvider>
					<CookiesProvider>
						<ToastContainer theme="dark" />
						<div>{children}</div>
					</CookiesProvider>
				</RecoilContextProvider>
			</body>
		</html>
	)
}
