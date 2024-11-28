import axios from "axios";

export const pollTransactionHash = async (
	address,
	targetAmount,
	sentTime,
	destinationAddress
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

		// Find the transaction with matching criteria
		for (const tx of transactions) {
			// Check the transaction time
			if (tx.utime < sentTime) continue;

			// Look for a matching `out_msg`
			const matchingOutMsg = tx.out_msgs.find(
				(msg) =>
					msg.destination === destinationAddress &&
					parseInt(msg.value || "0", 10) === Math.round(targetAmount * 1e9)
			);

			if (matchingOutMsg) {
				// Return the transaction hash
				return tx.transaction_id.hash;
			}
		}

		// Wait before retrying
		await new Promise((resolve) => setTimeout(resolve, 5000));
	}

	throw new Error("Transaction not confirmed in time.");
};
