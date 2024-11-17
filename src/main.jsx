import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import WebApp from "@twa-dev/sdk";
import { ChakraProvider } from "@chakra-ui/react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

// Initialize WebApp
WebApp.ready();

// Create a basic theme (optional)

// Try wrapping the render in a try-catch to see if there are any errors
try {
	ReactDOM.createRoot(document.getElementById("root")).render(
		<React.StrictMode>
			<ChakraProvider>
				<TonConnectUIProvider manifestUrl="https://api.jsonbin.io/v3/b/6739d5f3ad19ca34f8cb7947">
					<App />
				</TonConnectUIProvider>
			</ChakraProvider>
		</React.StrictMode>
	);
} catch (error) {
	console.error("Render error:", error);
}
