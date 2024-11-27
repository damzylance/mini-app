import axios from "axios";

export const pollTransactionHash = async (address, boc) => {
	const apiUrl = `https://testnet.toncenter.com/api/v2/getTransactions`;
	const params = {
		address,
		limit: 10, // Adjust as needed
	};

	for (let attempts = 0; attempts < 30; attempts++) {
		const response = await axios.get(apiUrl, { params });
		const transactions = response.data.result;

		// Check for the transaction matching the boc
		const matchingTx = transactions.find(
			(tx) => tx.in_msg && tx.in_msg.boc === boc
		);

		if (matchingTx) {
			// Calculate and return the transaction hash
			return matchingTx.transaction_id.hash;
		}

		// Wait for a bit before retrying
		await new Promise((resolve) => setTimeout(resolve, 5000));
	}

	throw new Error("Transaction not confirmed in time.");
};
