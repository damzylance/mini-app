import axios from "axios";

export const pollTransactionHash = async (
	address,
	targetAmount,
	sentTime,
	destinationAddress,
	uniquePayload
) => {
	const apiUrl = `https://testnet.toncenter.com/api/v2/getTransactions`;
	const params = {
		address,
		limit: 10,
		api_key: "4a34b283d94ab208d77e422550fa92540e06600875319c115bc0ef05bf8e4a22",
	};

	for (let attempts = 0; attempts < 30; attempts++) {
		const response = await axios.get(apiUrl, { params });
		const transactions = response.data.result;

		// Iterate through transactions to find the matching one
		const matchingTx = transactions.find((tx) => {
			// Check destination, amount, and time range
			const isValidDestination = tx.in_msg?.destination === destinationAddress;
			const isValidAmount =
				parseFloat(tx.out_msgs[0]?.value || "0") ===
				parseFloat(targetAmount) * 1e9;
			const isRecent = tx.utime >= sentTime;

			// Optional: Match against a unique payload if available
			const hasMatchingPayload = uniquePayload
				? tx.in_msg?.msg_data?.body?.includes(uniquePayload)
				: true;

			return (
				isValidDestination && isValidAmount && isRecent && hasMatchingPayload
			);
		});

		if (matchingTx) {
			// Return the transaction hash
			return matchingTx.transaction_id.hash;
		}

		// Wait before retrying
		await new Promise((resolve) => setTimeout(resolve, 5000));
	}

	throw new Error("Transaction not confirmed in time.");
};
