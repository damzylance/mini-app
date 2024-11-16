import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import WebApp from "@twa-dev/sdk";
import { ChakraProvider } from "@chakra-ui/react";

// Initialize WebApp
WebApp.ready();

// Create a basic theme (optional)

// Try wrapping the render in a try-catch to see if there are any errors
try {
	ReactDOM.createRoot(document.getElementById("root")).render(
		<React.StrictMode>
			<ChakraProvider>
				<App />
			</ChakraProvider>
		</React.StrictMode>
	);
} catch (error) {
	console.error("Render error:", error);
}
