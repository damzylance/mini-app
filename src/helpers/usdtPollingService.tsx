import { Address, JettonMaster, TonClient, Transaction } from "@ton/ton";
import { retry } from "./common-helpers";

export class UsdtTransactionPoller {
	private lastIndexedLt?: string;

	constructor(
		private readonly client: TonClient,
		private readonly usdtMasterAddress: Address,
		private readonly invoiceWalletAddress: Address
	) {}

	async pollForTransaction(
		senderAddress: Address,
		orderId: string,
		sentTime: number,
		maxAttempts = 30
	): Promise<{ hash: string; status: "succeeded" | "failed" } | null> {
		const jettonMaster = this.client.open(
			JettonMaster.create(this.usdtMasterAddress)
		);
		const usdtWalletAddress = await jettonMaster.getWalletAddress(
			this.invoiceWalletAddress
		);

		let attempts = 0;

		while (attempts < maxAttempts) {
			try {
				const transactions = await retry(
					() =>
						this.client.getTransactions(usdtWalletAddress, {
							limit: 20,
							archival: true,
						}),
					{ retries: 10, delay: 1000 }
				);

				// Look for matching transaction
				for (const tx of transactions) {
					const parsedTx = this.parseUsdtTransaction(
						tx,
						senderAddress,
						orderId
					);
					if (parsedTx && tx.now >= sentTime) {
						console.log(tx.endStatus);
						return {
							hash: tx.hash().toString("hex"),
							status: "succeeded",
						};
					}
				}

				// Wait 3 seconds before next attempt
				await new Promise((resolve) => setTimeout(resolve, 3000));
				attempts++;
			} catch (error) {
				console.error("Polling error:", error);
				await new Promise((resolve) => setTimeout(resolve, 3000));
				attempts++;
			}
		}

		return null;
	}

	private parseUsdtTransaction(
		tx: Transaction,
		senderAddress: Address,
		targetOrderId: string
	) {
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

			slice.loadUint(64); // query id
			slice.loadCoins(); // amount
			const fromAddress = slice.loadAddress();
			slice.loadAddress(); // response address
			slice.loadCoins(); // forward amount
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

			// Check if this transaction matches our criteria
			if (
				comment === targetOrderId &&
				fromAddress.toString() === senderAddress.toString()
			) {
				return {
					status: tx.description.computePhase.success ? "succeeded" : "failed",
					hash: tx.hash().toString("hex"),
				};
			}
		} catch {
			return;
		}
	}
}
