const path = require("path")

const eslintCommand = (filenames) =>
	`next lint --file ${filenames
		.map((f) => path.relative(process.cwd(), f))
		.join(" --file ")}`

const formatCommand = "prettier --write"

module.exports = {
	"*.{js,jsx,ts,tsx}": [formatCommand, eslintCommand],
}
