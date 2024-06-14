interface MyComponentProps {
	description: string | undefined
}

export default function Subheading({ description }: MyComponentProps) {
	return (
		<>
			<div className="text-center mt-4">
				<p>{description}</p>
			</div>
		</>
	)
}
