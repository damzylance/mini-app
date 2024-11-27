import { useTonConnectUI } from "@tonconnect/ui-react";
import { TonClient, toNano, beginCell, Address } from "@ton/core";
import { TokenTransfer } from "../wrappers/TokenTransfer"; // Adjust path as needed
import { JettonWalletTemplate } from "../build/TokenTransfer/tact_JettonWalletTemplate";

const tonClient = new TonClient();

export const useTokenTransfer = () => {
	const { connected, wallet, sendTransaction } = useTonConnectUI();

	const interactWithTokenTransfer = async ({
		action,
		params,
	}: {
		action: "initialize" | "deposit" | "changeMaster" | "transferJetton";
		params: any;
	}) => {
		if (!connected || !wallet) {
			throw new Error("Wallet not connected");
		}

		try {
			switch (action) {
				case "initialize": {
					const { masterAddress, ownerAddress } = params;
					const tokenTransferContract = new TokenTransfer(
						new Address(masterAddress),
						new Address(ownerAddress)
					);

					const deployTransaction = await tokenTransferContract.deploy({
						value: toNano("0.05"),
					});

					return sendTransaction(deployTransaction);
				}

				case "deposit": {
					const { userAddress, depositAmount } = params;
					const tokenTransferContract = new TokenTransfer(
						new Address(userAddress)
					);

					const depositTransaction =
						tokenTransferContract.createDepositTransaction({
							value: toNano(depositAmount),
						});

					return sendTransaction(depositTransaction);
				}

				case "changeMaster": {
					const { currentOwnerAddress, newMasterAddress } = params;
					const tokenTransferContract = new TokenTransfer(
						new Address(currentOwnerAddress)
					);

					const changeMasterTransaction = tokenTransferContract.changeMaster({
						value: toNano("10"),
						newMaster: new Address(newMasterAddress),
					});

					return sendTransaction(changeMasterTransaction);
				}

				case "transferJetton": {
					const {
						userWalletAddress,
						destinationAddress,
						amount,
						forwardPayload,
					} = params;
					const userJettonWallet = new JettonWalletTemplate(
						new Address(userWalletAddress)
					);

					const transferTransaction =
						userJettonWallet.createTransferTransaction({
							value: toNano("1"),
							amount: toNano(amount),
							destination: new Address(destinationAddress),
							forwardPayload: beginCell()
								.storeBuffer(Buffer.from(forwardPayload))
								.endCell(),
						});

					return sendTransaction(transferTransaction);
				}

				default:
					throw new Error("Unsupported action");
			}
		} catch (error) {
			console.error(`Error in ${action} action:`, error);
			throw new Error(`Failed to execute ${action} action.`);
		}
	};

	return { interactWithTokenTransfer };
};
