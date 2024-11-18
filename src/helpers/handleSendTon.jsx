import { TonConnect } from "@tonconnect/ui-react";
import { useToast } from "@chakra-ui/react";

const handleSendTon = async (recipientAddress, amountTon) => {
	const toast = useToast();
	try {
		// Ensure TON Connect is initialized
		const connector = new TonConnect();

		// Check if the user is connected
		const wallet = connector.account;
		if (!wallet) throw new Error("Wallet not connected!");

		// Create a transaction request
		const transactionRequest = {
			valid_until: Math.floor(Date.now() / 1000) + 600, // Valid for 10 minutes
			messages: [
				{
					address: recipientAddress,
					amount: (amountTon * 1e9).toString(), // Convert TON to nanoTON
				},
			],
		};

		// Send transaction request to the wallet
		await connector.sendTransaction(transactionRequest);

		console.log(`Transaction of ${amountTon} TON sent to ${recipientAddress}`);
	} catch (error) {
		toast({ title: error, status: error });
		console.error("Transaction Error:", error);
	}
};

export default handleSendTon;
