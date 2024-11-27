import axios from "axios";

export const bet9jaTopup = async (data) => {
	try {
		console.log("Bet9ja topup data:", data);
		const response = await axios.post(
			`${import.meta.env.VITE_BASE_URL}bet/validate-customer/`,
			data
		);
		console.log("Bet9ja topup response:", response.data);
		return response;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			// Axios-specific error handling
			console.error("Axios error:", error.response?.data || error.message);
		} else if (error instanceof Error) {
			// Generic error handling
			console.error("Error:", error.message);
		} else {
			console.error("Unexpected error:", error);
		}
		return error;
	}
};
