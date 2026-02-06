import { defineConfig } from "vite";
import path from "node:path";

const config = defineConfig({
	root: "src/",
	base: "/systems/starlight-journals/",
	publicDir: path.resolve(__dirname, "public"),

	server: {
		port: 30001,
		open: "/",
		proxy: {
			"^(?!/systems/starlight-journals)": "http:///localhost:30000/",
			"/socket.io": {
				target: "ws://localhost:30000/",
				ws: true,
			},
		},
	},

	optimizeDeps: {
		rolldownOptions: {
			output: {
				keepNames: true,
			},

			platform: "browser",
		},
	},

	oxc: {
		assumptions: {
			setPublicClassFields: true,
		},

		typescript: {
			removeClassFieldsWithoutInitializer: true,
		},
	},

	build: {
		outDir: path.resolve(__dirname, "dist"),
		emptyOutDir: false,
		sourcemap: true,

		lib: {
			name: "starlight-journals",
			entry: path.resolve(__dirname, "src/starlight-journals.ts"),
			formats: ["es"],
			fileName: "starlight-journals",
			cssFileName: "style",
		},
	},
});

export default config;
