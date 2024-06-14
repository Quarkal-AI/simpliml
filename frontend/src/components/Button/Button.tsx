import { ReactNode } from "react"

interface ButtonProps {
	children: ReactNode
	className?: string
	onClick?: (...args: any) => any // eslint-disable-line
}

function Button({ children, onClick, className }: ButtonProps) {
	return (
		<button
			className={`flex flex-row justify-center items-center px-8 py-3 text-sm rounded-full m-0 ${className}`}
			onClick={onClick}
			style={{
				background: "linear-gradient(to right, #1440b5, #00aaf0)",
			}}
		>
			{children}
		</button>
	)
}

export default Button
