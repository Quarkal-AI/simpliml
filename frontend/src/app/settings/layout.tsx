import type { Metadata } from "next"

import RecoilContextProvider from "@/utils/RecoilContextProvider"

// import { Inter } from "next/font/google";
import "../globals.css"

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SimpliML",
	description:
		"Experience hassle-free machine learning deployment without the need for coding expertise. Simplify your AI projects with our effortless solution and enjoy the added benefit of pay-as-you-use pricing",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className="">
			<RecoilContextProvider>{children}</RecoilContextProvider>
		</section>
	)
}
