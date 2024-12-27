import { Address } from "@ton/core";
import axios from "axios";

export const pollTransactionHash = async (
	address,
	targetAmount,
	sentTime,
	destinationAddress
) => {
	const apiUrl = `https://toncenter.com/api/v2/getTransactions`;
	const params = {
		address,
		limit: 10,
		archival: true,
		api_key: "4a34b283d94ab208d77e422550fa92540e06600875319c115bc0ef05bf8e4a22",
	};

	for (let attempts = 0; attempts < 10; attempts++) {
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

function parseUsdtPayload(tx) {
	try {
		if (
			tx.inMessage?.info.type !== "internal" ||
			tx.description.type !== "generic" ||
			tx.description.computePhase?.type !== "vm"
		) {
			return;
		}

		const slice = tx.inMessage.body.beginParse();
		const opcode = slice.loadUint(32);
		if (opcode !== 0x178d4519) {
			// jetton internal transfer
			return;
		}

		slice.loadUint(64);
		const jettonAmount = slice.loadCoins();
		const fromAddress = slice.loadAddress();
		slice.loadAddress();
		slice.loadCoins();
		const forwardPayload = slice.loadMaybeRef();
		if (!forwardPayload) {
			return;
		}

		const payloadSlice = forwardPayload.beginParse();

		const payloadOpcode = payloadSlice.loadUint(32);
		if (payloadOpcode !== 0) {
			return;
		}

		const comment = payloadSlice.loadStringTail();
		if (!isUUID(comment)) {
			return;
		}

		return {
			status: tx.description.computePhase.success ? "succeeded" : "failed",
			hash: tx.hash().toString("hex"),
			usdtAmount: jettonAmount,
			gasUsed: tx.totalFees.coins,
			orderId: comment,
			timestamp: tx.inMessage.info.createdAt,
			fromAddress,
		};
	} catch {
		return;
	}
}

export const pollUsdtTransaction = async (
	address,
	targetAmount,
	sentTime,
	fromAddress,
	orderId
) => {
	const apiUrl = `https://toncenter.com/api/v2/getTransactions`;
	const params = {
		address,
		limit: 10,
		archival: true,
		api_key: "4a34b283d94ab208d77e422550fa92540e06600875319c115bc0ef05bf8e4a22",
	};

	for (let attempts = 0; attempts < 10; attempts++) {
		try {
			const response = await axios.get(apiUrl, { params });
			const transactions = response.data.result;

			// Convert transactions to TonClient Transaction format and parse
			for (const tx of transactions) {
				// Skip transactions before sent time
				if (tx.utime < sentTime) continue;
				console.log(tx);

				const parsedTx = parseUsdtPayload(tx);
				console.log(parsedTx);

				if (
					parsedTx &&
					parsedTx.orderId === orderId &&
					parsedTx.fromAddress.equals(Address.parse(fromAddress)) &&
					parsedTx.usdtAmount === targetAmount
				) {
					return {
						hash: parsedTx.hash,
						status: parsedTx.status,
						gasUsed: parsedTx.gasUsed,
						timestamp: parsedTx.timestamp,
					};
				}
			}

			// Wait before retrying
			await new Promise((resolve) => setTimeout(resolve, 5000));
		} catch (error) {
			console.error("Error polling for USDT transaction:", error);
			// Continue to next attempt
		}
	}

	throw new Error("USDT transaction not confirmed in time.");
};
