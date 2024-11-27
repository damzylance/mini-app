import {
	ABIGetter,
	ABIReceiver,
	ABIType,
	Address,
	beginCell,
	Builder,
	Cell,
	StateInit,
	storeStateInit,
} from "@ton/core";

export type BitgiftyTokenTransfer_init_args = {
	$$type: "BitgiftyTokenTransfer_init_args";
	master: Address;
	owner: Address;
};

export function initBitgiftyTokenTransfer_init_args(
	src: BitgiftyTokenTransfer_init_args
) {
	return (builder: Builder) => {
		let b_0 = builder;
		b_0.storeAddress(src.master);
		b_0.storeAddress(src.owner);
	};
}
export const BitgiftyTokenTransfer_types: ABIType[] = [
	{
		name: "StateInit",
		header: null,
		fields: [
			{ name: "code", type: { kind: "simple", type: "cell", optional: false } },
			{ name: "data", type: { kind: "simple", type: "cell", optional: false } },
		],
	},
	{
		name: "StdAddress",
		header: null,
		fields: [
			{
				name: "workchain",
				type: { kind: "simple", type: "int", optional: false, format: 8 },
			},
			{
				name: "address",
				type: { kind: "simple", type: "uint", optional: false, format: 256 },
			},
		],
	},
	{
		name: "VarAddress",
		header: null,
		fields: [
			{
				name: "workchain",
				type: { kind: "simple", type: "int", optional: false, format: 32 },
			},
			{
				name: "address",
				type: { kind: "simple", type: "slice", optional: false },
			},
		],
	},
	{
		name: "Context",
		header: null,
		fields: [
			{
				name: "bounced",
				type: { kind: "simple", type: "bool", optional: false },
			},
			{
				name: "sender",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "value",
				type: { kind: "simple", type: "int", optional: false, format: 257 },
			},
			{ name: "raw", type: { kind: "simple", type: "slice", optional: false } },
		],
	},
	{
		name: "SendParameters",
		header: null,
		fields: [
			{
				name: "bounce",
				type: { kind: "simple", type: "bool", optional: false },
			},
			{
				name: "to",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "value",
				type: { kind: "simple", type: "int", optional: false, format: 257 },
			},
			{
				name: "mode",
				type: { kind: "simple", type: "int", optional: false, format: 257 },
			},
			{ name: "body", type: { kind: "simple", type: "cell", optional: true } },
			{ name: "code", type: { kind: "simple", type: "cell", optional: true } },
			{ name: "data", type: { kind: "simple", type: "cell", optional: true } },
		],
	},
	{
		name: "Deploy",
		header: 2490013878,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
		],
	},
	{
		name: "DeployOk",
		header: 2952335191,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
		],
	},
	{
		name: "FactoryDeploy",
		header: 1829761339,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "cashback",
				type: { kind: "simple", type: "address", optional: false },
			},
		],
	},
	{
		name: "ChangeOwner",
		header: 2174598809,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "newOwner",
				type: { kind: "simple", type: "address", optional: false },
			},
		],
	},
	{
		name: "ChangeOwnerOk",
		header: 846932810,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "newOwner",
				type: { kind: "simple", type: "address", optional: false },
			},
		],
	},
	{
		name: "JettonDefaultWallet$Data",
		header: null,
		fields: [
			{
				name: "balance",
				type: { kind: "simple", type: "int", optional: false, format: 257 },
			},
			{
				name: "owner",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "master",
				type: { kind: "simple", type: "address", optional: false },
			},
		],
	},
	{
		name: "MakePayment",
		header: 4125634107,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "payeeAddress",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "payeeJettonState",
				type: { kind: "simple", type: "StateInit", optional: false },
			},
			{
				name: "masterJettonState",
				type: { kind: "simple", type: "StateInit", optional: false },
			},
			{
				name: "jettonMasterAddress",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "amount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
		],
	},
	{
		name: "Deposit",
		header: 1836540992,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "amount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
		],
	},
	{
		name: "ChangeMaster",
		header: 176167272,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "newMaster",
				type: { kind: "simple", type: "address", optional: false },
			},
		],
	},
	{
		name: "JettonTransfer",
		header: 260734629,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "amount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "destination",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "responseDestination",
				type: { kind: "simple", type: "address", optional: true },
			},
			{
				name: "customPayload",
				type: { kind: "simple", type: "cell", optional: true },
			},
			{
				name: "forwardTonAmount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "forwardPayload",
				type: {
					kind: "simple",
					type: "slice",
					optional: false,
					format: "remainder",
				},
			},
		],
	},
	{
		name: "TokenTransfer",
		header: 260734629,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "amount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "destination",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "responseDestination",
				type: { kind: "simple", type: "address", optional: true },
			},
			{
				name: "customPayload",
				type: { kind: "simple", type: "cell", optional: true },
			},
			{
				name: "forwardTonAmount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "forwardPayload",
				type: {
					kind: "simple",
					type: "slice",
					optional: false,
					format: "remainder",
				},
			},
		],
	},
	{
		name: "TokenTransferInternal",
		header: 395134233,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "amount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "from",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "responseAddress",
				type: { kind: "simple", type: "address", optional: true },
			},
			{
				name: "forwardTonAmount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "forwardPayload",
				type: {
					kind: "simple",
					type: "slice",
					optional: false,
					format: "remainder",
				},
			},
		],
	},
	{
		name: "TokenNotification",
		header: 1935855772,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "amount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "from",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "forwardPayload",
				type: {
					kind: "simple",
					type: "slice",
					optional: false,
					format: "remainder",
				},
			},
		],
	},
	{
		name: "TokenBurn",
		header: 1499400124,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "amount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "owner",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "responseAddress",
				type: { kind: "simple", type: "address", optional: true },
			},
		],
	},
	{
		name: "TokenBurnNotification",
		header: 2078119902,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "amount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "owner",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "responseAddress",
				type: { kind: "simple", type: "address", optional: true },
			},
		],
	},
	{
		name: "TokenBurnConfirmation",
		header: 4107491466,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "amount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
		],
	},
	{
		name: "SafeTokenBurn",
		header: 3823045169,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
			{
				name: "amount",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "owner",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "responseAddress",
				type: { kind: "simple", type: "address", optional: true },
			},
		],
	},
	{
		name: "TokenExcesses",
		header: 3576854235,
		fields: [
			{
				name: "queryId",
				type: { kind: "simple", type: "uint", optional: false, format: 64 },
			},
		],
	},
	{
		name: "TokenUpdateContent",
		header: 201882270,
		fields: [
			{
				name: "content",
				type: { kind: "simple", type: "cell", optional: true },
			},
		],
	},
	{
		name: "JettonData",
		header: null,
		fields: [
			{
				name: "totalSupply",
				type: { kind: "simple", type: "int", optional: false, format: 257 },
			},
			{
				name: "mintable",
				type: { kind: "simple", type: "bool", optional: false },
			},
			{
				name: "owner",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "content",
				type: { kind: "simple", type: "cell", optional: true },
			},
			{
				name: "walletCode",
				type: { kind: "simple", type: "cell", optional: false },
			},
		],
	},
	{
		name: "JettonWalletData",
		header: null,
		fields: [
			{
				name: "balance",
				type: { kind: "simple", type: "int", optional: false, format: 257 },
			},
			{
				name: "owner",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "master",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "walletCode",
				type: { kind: "simple", type: "cell", optional: false },
			},
		],
	},
	{
		name: "InternalJettonWalletData",
		header: null,
		fields: [
			{
				name: "status",
				type: { kind: "simple", type: "uint", optional: false, format: 4 },
			},
			{
				name: "balance",
				type: {
					kind: "simple",
					type: "uint",
					optional: false,
					format: "coins",
				},
			},
			{
				name: "ownerAddress",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "jettonMasterAddress",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "jettonWalletCode",
				type: { kind: "simple", type: "cell", optional: false },
			},
		],
	},
	{
		name: "BitgiftyTokenTransfer$Data",
		header: null,
		fields: [
			{
				name: "owner",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "master",
				type: { kind: "simple", type: "address", optional: false },
			},
			{
				name: "stopped",
				type: { kind: "simple", type: "bool", optional: false },
			},
		],
	},
];
export const BitgiftyTokenTransfer_getters: ABIGetter[] = [
	{
		name: "master",
		arguments: [],
		returnType: { kind: "simple", type: "address", optional: false },
	},
	{
		name: "balance",
		arguments: [],
		returnType: { kind: "simple", type: "string", optional: false },
	},
	{
		name: "stopped",
		arguments: [],
		returnType: { kind: "simple", type: "bool", optional: false },
	},
	{
		name: "owner",
		arguments: [],
		returnType: { kind: "simple", type: "address", optional: false },
	},
];
export const BitgiftyTokenTransfer_getterMapping: { [key: string]: string } = {
	master: "getMaster",
	balance: "getBalance",
	stopped: "getStopped",
	owner: "getOwner",
};
export const BitgiftyTokenTransfer_errors: {
	[key: number]: { message: string };
} = {
	2: { message: `Stack underflow` },
	3: { message: `Stack overflow` },
	4: { message: `Integer overflow` },
	5: { message: `Integer out of expected range` },
	6: { message: `Invalid opcode` },
	7: { message: `Type check error` },
	8: { message: `Cell overflow` },
	9: { message: `Cell underflow` },
	10: { message: `Dictionary error` },
	11: { message: `'Unknown' error` },
	12: { message: `Fatal error` },
	13: { message: `Out of gas error` },
	14: { message: `Virtualization error` },
	32: { message: `Action list is invalid` },
	33: { message: `Action list is too long` },
	34: { message: `Action is invalid or not supported` },
	35: { message: `Invalid source address in outbound message` },
	36: { message: `Invalid destination address in outbound message` },
	37: { message: `Not enough TON` },
	38: { message: `Not enough extra-currencies` },
	39: { message: `Outbound message does not fit into a cell after rewriting` },
	40: { message: `Cannot process a message` },
	41: { message: `Library reference is null` },
	42: { message: `Library change action error` },
	43: {
		message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree`,
	},
	50: { message: `Account state size exceeded limits` },
	128: { message: `Null reference exception` },
	129: { message: `Invalid serialization prefix` },
	130: { message: `Invalid incoming message` },
	131: { message: `Constraints error` },
	132: { message: `Access denied` },
	133: { message: `Contract stopped` },
	134: { message: `Invalid argument` },
	135: { message: `Code of a contract was not found` },
	136: { message: `Invalid address` },
	137: { message: `Masterchain support is not enabled for this contract` },
	4429: { message: `Invalid sender` },
	13650: { message: `Invalid bounced message` },
	16059: { message: `Invalid value` },
	30311: { message: `Invaid sender` },
	40368: { message: `Contract stopped` },
	42049: { message: `Insufficient value for transaction` },
	53296: { message: `Contract not stopped` },
	57978: { message: `Invalid balance after burn` },
	62972: { message: `Invalid balance` },
};

export const BitgiftyTokenTransfer_receivers: ABIReceiver[] = [
	{ receiver: "internal", message: { kind: "empty" } },
	{ receiver: "internal", message: { kind: "typed", type: "Deposit" } },
	{ receiver: "internal", message: { kind: "typed", type: "MakePayment" } },
	{ receiver: "internal", message: { kind: "typed", type: "ChangeMaster" } },
	{ receiver: "internal", message: { kind: "typed", type: "Deploy" } },
	{ receiver: "internal", message: { kind: "text", text: "Resume" } },
	{ receiver: "internal", message: { kind: "text", text: "Stop" } },
];

export async function BitgiftyTokenTransfer_init(
	master: Address,
	owner: Address
) {
	const __code = Cell.fromBase64(
		"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"
	);
	const __system = Cell.fromBase64(
		"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"
	);
	let builder = beginCell();
	builder.storeRef(__system);
	builder.storeUint(0, 1);
	initBitgiftyTokenTransfer_init_args({
		$$type: "BitgiftyTokenTransfer_init_args",
		master,
		owner,
	})(builder);
	const __data = builder.endCell();
	return { code: __code, data: __data };
}

export type Deposit = {
	$$type: "Deposit";
	queryId: bigint;
	amount: bigint;
};
export function storeDeposit(src: Deposit) {
	return (builder: Builder) => {
		let b_0 = builder;
		b_0.storeUint(1836540992, 32);
		b_0.storeUint(src.queryId, 64);
		b_0.storeCoins(src.amount);
	};
}
export type MakePayment = {
	$$type: "MakePayment";
	queryId: bigint;
	payeeAddress: Address;
	payeeJettonState: StateInit;
	masterJettonState: StateInit;
	jettonMasterAddress: Address;
	amount: bigint;
};

export function storeMakePayment(src: MakePayment) {
	return (builder: Builder) => {
		let b_0 = builder;
		b_0.storeUint(4125634107, 32);
		b_0.storeUint(src.queryId, 64);
		b_0.storeAddress(src.payeeAddress);
		b_0.store(storeStateInit(src.payeeJettonState));
		let b_1 = new Builder();
		b_1.store(storeStateInit(src.masterJettonState));
		b_1.storeAddress(src.jettonMasterAddress);
		b_1.storeCoins(src.amount);
		b_0.storeRef(b_1.endCell());
	};
}

export type ChangeMaster = {
	$$type: "ChangeMaster";
	queryId: bigint;
	newMaster: Address;
};

export function storeChangeMaster(src: ChangeMaster) {
	return (builder: Builder) => {
		let b_0 = builder;
		b_0.storeUint(176167272, 32);
		b_0.storeUint(src.queryId, 64);
		b_0.storeAddress(src.newMaster);
	};
}

export type TransferNotification = {
	$$type: "TransferNotification";
	queryId: bigint;
	amount: bigint;
	sender: Address;
	forwardPayload: Cell | null;
};
export function storeTransferNotification(src: TransferNotification) {
	return (builder: Builder) => {
		let b_0 = builder;
		b_0.storeUint(1935855772, 32);
		b_0.storeUint(src.queryId, 64);
		b_0.storeCoins(src.amount);
		b_0.storeAddress(src.sender);
		if (src.forwardPayload !== null && src.forwardPayload !== undefined) {
			b_0.storeBit(true).storeRef(src.forwardPayload);
		} else {
			b_0.storeBit(false);
		}
	};
}
export type Deploy = {
	$$type: "Deploy";
	queryId: bigint;
};

export function storeDeploy(src: Deploy) {
	return (builder: Builder) => {
		let b_0 = builder;
		b_0.storeUint(2490013878, 32);
		b_0.storeUint(src.queryId, 64);
	};
}
