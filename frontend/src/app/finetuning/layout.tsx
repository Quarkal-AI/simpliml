import type { Metadata } from "next"

import RecoilContextProvider from "@/utils/RecoilContextProvider"

import "../globals.css"

export const metadata: Metadata = {
	title: "SimpliML",
	description:
		"Experience hassle-free machine learning deployment without the need for coding expertise. Simplify your AI projects with our effortless solution and enjoy the added benefit of pay-as-you-use pricing",
}

export default function FinetuningLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<section className="">
			<RecoilContextProvider>{children}</RecoilContextProvider>
		</section>
	)
}
