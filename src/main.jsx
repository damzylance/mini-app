import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import WebApp from "@twa-dev/sdk";
import { ChakraProvider } from "@chakra-ui/react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import theme from "../theme.js";
import * as Buffer from "buffer";
window.Buffer = Buffer.Buffer;

// Initialize WebApp
WebApp.ready();

// Create a basic theme (optional)

// Try wrapping the render in a try-catch to see if there are any errors
try {
	ReactDOM.createRoot(document.getElementById("root")).render(
		<React.StrictMode>
			<ChakraProvider theme={theme}>
				<TonConnectUIProvider
					manifestUrl={
						"https://damzylance.github.io/manifest-test/tonconnect-manifest.json"
					}
				>
					<App />
				</TonConnectUIProvider>
			</ChakraProvider>
		</React.StrictMode>
	);
} catch (error) {
	console.error("Render error:", error);
}
