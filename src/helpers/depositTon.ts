import { Address, ContractProvider, Sender } from "@ton/core";
import { Deposit } from "../Contracts/contractUtils";
import { BitgiftyTokenTransfer } from "../Contracts/wrapper";

// Fixed smart contract address
const CONTRACT_ADDRESS = Address.parse(
	"EQAr5N43T85g8qzHkCiC4uDcxLZCOvNe0Zkv7_A4GbPLCqZ0"
);

export async function makeDeposit(
	provider: ContractProvider,
	sender: Sender,
	depositAmount: bigint
) {
	// Create a contract instance from the fixed address
	const contract = BitgiftyTokenTransfer.fromAddress(CONTRACT_ADDRESS);
	const queryId = BigInt(Date.now()); // Generate a unique queryId

	// Define the deposit message
	const depositMessage: Deposit = {
		$$type: "Deposit", // Ensure it matches the expected type in the wrapper
		amount: depositAmount,
		queryId: queryId,
	};

	// Send the deposit message
	await contract.send(
		provider,
		sender,
		{ value: BigInt(1_000_000) }, // Ensure enough gas is provided
		depositMessage
	);

	console.log(
		`Deposit of ${depositAmount} to ${CONTRACT_ADDRESS.toString()} initiated successfully.`
	);
}
