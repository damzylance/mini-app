export const bet9jaTopup = async (data) => {
	console.log(data);
	try {
		const response = await axios.post(
			`${process.env.VITE_BASE_URL}bet/create-deposit-notification/`,
			data
		);
		console.log(response.data);
		return response;
	} catch (error) {
		console.error("Error:", error);
		return error;
	}
};
