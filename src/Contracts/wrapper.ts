import {
	Address,
	beginCell,
	Cell,
	Contract,
	ContractABI,
	contractAddress,
	ContractProvider,
	Sender,
	Slice,
	TupleBuilder,
} from "@ton/core";
import {
	BitgiftyTokenTransfer_errors,
	BitgiftyTokenTransfer_getters,
	BitgiftyTokenTransfer_init,
	BitgiftyTokenTransfer_receivers,
	BitgiftyTokenTransfer_types,
	ChangeMaster,
	Deploy,
	Deposit,
	storeChangeMaster,
	storeDeploy,
	storeDeposit,
	storeTransferNotification,
	TransferNotification,
} from "./contractUtils";

export class BitgiftyTokenTransfer implements Contract {
	static async init(master: Address, owner: Address) {
		return await BitgiftyTokenTransfer_init(master, owner);
	}

	static async fromInit(master: Address, owner: Address) {
		const init = await BitgiftyTokenTransfer_init(master, owner);
		const address = contractAddress(0, init);
		return new BitgiftyTokenTransfer(address, init);
	}

	static fromAddress(address: Address) {
		return new BitgiftyTokenTransfer(address);
	}

	readonly address: Address;
	readonly init?: { code: Cell; data: Cell };
	readonly abi: ContractABI = {
		types: BitgiftyTokenTransfer_types,
		getters: BitgiftyTokenTransfer_getters,
		receivers: BitgiftyTokenTransfer_receivers,
		errors: BitgiftyTokenTransfer_errors,
	};

	private constructor(address: Address, init?: { code: Cell; data: Cell }) {
		this.address = address;
		this.init = init;
	}

	async send(
		provider: ContractProvider,
		via: Sender,
		args: { value: bigint; bounce?: boolean | null | undefined },
		message:
			| null
			| Deposit
			| TransferNotification
			| ChangeMaster
			| Deploy
			| "Resume"
			| "Stop"
	) {
		let body: Cell | null = null;
		if (message === null) {
			body = new Cell();
		}
		if (
			message &&
			typeof message === "object" &&
			!(message instanceof Slice) &&
			message.$$type === "Deposit"
		) {
			body = beginCell().store(storeDeposit(message)).endCell();
		}
		if (
			message &&
			typeof message === "object" &&
			!(message instanceof Slice) &&
			message.$$type === "TransferNotification"
		) {
			body = beginCell().store(storeTransferNotification(message)).endCell();
		}
		if (
			message &&
			typeof message === "object" &&
			!(message instanceof Slice) &&
			message.$$type === "ChangeMaster"
		) {
			body = beginCell().store(storeChangeMaster(message)).endCell();
		}
		if (
			message &&
			typeof message === "object" &&
			!(message instanceof Slice) &&
			message.$$type === "Deploy"
		) {
			body = beginCell().store(storeDeploy(message)).endCell();
		}
		if (message === "Resume") {
			body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
		}
		if (message === "Stop") {
			body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
		}
		if (body === null) {
			throw new Error("Invalid message type");
		}

		await provider.internal(via, { ...args, body: body });
	}

	async getMaster(provider: ContractProvider) {
		let builder = new TupleBuilder();
		let source = (await provider.get("master", builder.build())).stack;
		let result = source.readAddress();
		return result;
	}

	async getBalance(provider: ContractProvider) {
		let builder = new TupleBuilder();
		let source = (await provider.get("balance", builder.build())).stack;
		let result = source.readString();
		return result;
	}

	async getStopped(provider: ContractProvider) {
		let builder = new TupleBuilder();
		let source = (await provider.get("stopped", builder.build())).stack;
		let result = source.readBoolean();
		return result;
	}

	async getOwner(provider: ContractProvider) {
		let builder = new TupleBuilder();
		let source = (await provider.get("owner", builder.build())).stack;
		let result = source.readAddress();
		return result;
	}
}
