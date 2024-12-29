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
		api_key: `${import.meta.env.VITE_TON_API}`,
	};

	// Convert targetAmount to nanotons
	const targetAmountNano = Math.round(targetAmount * 1e9);

	// Normalize the destination address
	const normalizedTargetAddress = destinationAddress
		.toString()
		.replace(/[^a-zA-Z0-9]/g, "");

	for (let attempts = 0; attempts < 10; attempts++) {
		console.log(`Polling attempt ${attempts + 1}/10`);

		try {
			const response = await axios.get(apiUrl, { params });
			const transactions = response.data.result;

			for (const tx of transactions) {
				// Check if transaction is newer than sent time
				const isAfterSentTime = parseInt(tx.utime) >= parseInt(sentTime);

				if (!isAfterSentTime) {
					console.log(
						`Skipping older transaction from ${tx.utime} (sent at ${sentTime})`
					);
					continue;
				}

				if (tx.out_msgs && tx.out_msgs.length > 0) {
					for (const msg of tx.out_msgs) {
						// Normalize the transaction destination address
						const normalizedTxAddress = msg.destination
							.toString()
							.replace(/[^a-zA-Z0-9]/g, "");

						const isDestinationMatch =
							normalizedTxAddress === normalizedTargetAddress;
						const isAmountMatch = msg.value === targetAmountNano.toString();

						console.log(
							`Checking transaction ${tx.transaction_id.hash}:
              Time: ${tx.utime} (${new Date(tx.utime * 1000).toISOString()})
              Sent Time: ${sentTime} (${new Date(
								sentTime * 1000
							).toISOString()})
              Is After Sent Time: ${isAfterSentTime}
              Destination (normalized): ${normalizedTxAddress}
              Expected (normalized): ${normalizedTargetAddress}
              Amount: ${msg.value}
              Expected: ${targetAmountNano}
              Matches Destination: ${isDestinationMatch}
              Matches Amount: ${isAmountMatch}`
						);

						if (isDestinationMatch && isAmountMatch && isAfterSentTime) {
							console.log(`Match found! Hash: ${tx.transaction_id.hash}`);
							return tx.transaction_id.hash;
						}
					}
				}
			}

			console.log("No matching transaction found, waiting 7 seconds...");
			await new Promise((resolve) => setTimeout(resolve, 7000));
		} catch (error) {
			console.error("Error polling for transaction:", error);
			await new Promise((resolve) => setTimeout(resolve, 7000));
		}
	}

	throw new Error("Transaction not confirmed within the timeout period.");
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
