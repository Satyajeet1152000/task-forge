import eslintComments from "eslint-plugin-eslint-comments";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import tailwindcss from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";

export default tseslint.config(
	// ── Global ignores ───────────────────────────────────────────
	{
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/.next/**",
			"**/build/**",
			"**/coverage/**",
			"**/*.generated.ts",
		],
	},

	// ── Global: applies to ALL .ts/.tsx across entire monorepo ───
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			...tseslint.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
		],
		plugins: {
			"eslint-comments": eslintComments,
			import: importPlugin,
		},
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
		rules: {
			// typescript
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-floating-promises": "error",
			"@typescript-eslint/no-misused-promises": "error",
			"@typescript-eslint/no-unsafe-assignment": "warn",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"no-multiple-empty-lines": [
				"error",
				{
					max: 1, // max 1 consecutive empty line anywhere
					maxEOF: 0, // no empty lines at end of file
					maxBOF: 0, // no empty lines at beginning of file
				},
			],
			"@typescript-eslint/unbound-method": [
				"error",
				{
					ignoreStatic: true,
				},
			],
			"lines-between-class-members": [
				"error",
				"always",
				{
					exceptAfterSingleLine: true,
				},
			],

			// general
			"class-methods-use-this": "off",
			"max-classes-per-file": "off",
			"no-console": "warn",
			"no-underscore-dangle": "off",
			"no-var": "error",
			"prefer-const": "error",
			eqeqeq: "error",

			// eslint-comments
			"eslint-comments/disable-enable-pair": "off",

			"import/extensions": "off",
			"import/prefer-default-export": "off",
			"no-duplicate-imports": "off",
			"import/no-duplicates": "error",
			"import/no-extraneous-dependencies": [
				"error",
				{
					devDependencies: true,
				},
			],
			"import/order": [
				"error",
				{
					alphabetize: {
						caseInsensitive: true,
						order: "asc",
					},
					groups: [
						"builtin",
						"external",
						"internal",
						"parent",
						"sibling",
						"index",
					],
					"newlines-between": "always",
				},
			],
		},
	},

	// ── Backend only ─────────────────────────────────────────────
	{
		files: ["apps/backend/**/*.ts"],
		rules: {
			"no-console": "off", // use app.log / request.log
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/explicit-function-return-type": "warn",
		},
	},

	// ── Frontend only ────────────────────────────────────────────
	{
		files: ["apps/frontend/**/*.{ts,tsx}"],
		plugins: {
			"react-hooks": reactHooks,
			tailwindcss: tailwindcss,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"no-console": "warn",
			"tailwindcss/classnames-order": "warn",
			"tailwindcss/no-custom-classname": "off",
			"import/no-extraneous-dependencies": "off",
		},
	},

	// ── Shared package — strictest rules ─────────────────────────
	{
		files: ["packages/shared/**/*.ts"],
		rules: {
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/no-explicit-any": "error",
			"no-console": "error",
		},
	},

	// ── Test files — relaxed rules ────────────────────────────────
	{
		files: ["**/*.test.ts", "**/*.spec.ts", "test/**"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unused-expressions": "off",
		},
	},
);
