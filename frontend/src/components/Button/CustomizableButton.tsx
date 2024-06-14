import { ReactNode } from "react"

interface ButtonProps {
	children: ReactNode
	className?: string
	onClick?: (...args: any) => any // eslint-disable-line
	disabled?: boolean
}

function CustomizableButton({
	children,
	onClick,
	className,
	disabled,
}: ButtonProps) {
	return (
		<button
			className={`flex gap-2flex-row justify-center items-center px-8 py-3 text-sm rounded-full m-0 ${className}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	)
}

export default CustomizableButton
