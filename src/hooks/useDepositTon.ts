import { beginCell, Address, toNano } from "@ton/core";
import { useTonConnectUI } from "@tonconnect/ui-react";

export const useHandleDeposit = () => {
	const [tonConnectUI] = useTonConnectUI();

	return async (amount) => {
		try {
			const amountInNanograms = BigInt(Math.round(amount * 1e9));

			const depositPayload = {
				$$type: "Deposit",
				queryId: BigInt(Date.now()),
				amount: amountInNanograms,
			};

			const depositCell = beginCell()
				.storeUint(1836540992, 32) // Method ID for Deposit
				.storeUint(depositPayload.queryId, 64)
				.storeCoins(depositPayload.amount)
				.endCell();

			const transaction = {
				validUntil: Date.now() + 1000 * 60, // 1-minute expiration
				messages: [
					{
						address: "EQAr5N43T85g8qzHkCiC4uDcxLZCOvNe0Zkv7_A4GbPLCqZ0", // Contract address
						amount: (amountInNanograms + BigInt(0.05 * 1e9)).toString(), // Including fees
						payload: depositCell.toBoc().toString("base64"),
					},
				],
			};

			await tonConnectUI.sendTransaction(transaction);
			console.log("Deposit successful!");
		} catch (error) {
			console.error("Error during deposit:", error);
		}
	};
};

// TransferNotification Method ID
