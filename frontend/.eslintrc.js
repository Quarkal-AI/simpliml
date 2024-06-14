module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: ["eslint:recommended", "next/core-web-vitals", "prettier"],
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			parserOptions: {
				project: ["./tsconfig.json"],
				tsconfigRootDir: __dirname,
			},
			extends: [
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",

				//declaring 'next/core-web-vitals' and 'prettier' again in case
				//the two plugin:... configs above overrode any of their rules
				//Also, 'prettier' needs to be last in any extends array
				"next/core-web-vitals",
				"prettier",
			],
			rules: {
				"@typescript-eslint/no-unsafe-assignment": "warn",
				"@typescript-eslint/no-unsafe-member-access": "warn",
				"@typescript-eslint/no-unused-vars": "warn",
				"@typescript-eslint/no-explicit-any": "warn",
				"@typescript-eslint/no-unsafe-call": "warn",
				"@typescript-eslint/no-floating-promises": "warn",
				"prefer-const": "warn",
				"@typescript-eslint/no-misused-promises": "warn",
				"@typescript-eslint/no-unsafe-argument": "warn",
				"@typescript-eslint/no-unsafe-return": "warn",
				"no-var": "warn",
				"@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
				"no-empty": "warn",
				"@typescript-eslint/require-await": "warn",
				"valid-typeof": "warn",
				"@typescript-eslint/ban-ts-comment": "warn",
			},
		},
	],
}
