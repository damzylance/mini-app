import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		basicSsl(),
		nodePolyfills({
			include: ["buffer"],
		}),
	],
	resolve: {
		alias: {
			buffer: "buffer/",
			process: "process/browser",
		},
	},
	optimizeDeps: {
		include: ["buffer"],
	},
	server: {
		port: 3000,
	},
});
