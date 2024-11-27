import { useEffect, useState } from "react";
import { Address, OpenedContract } from "@ton/ton";
import { useInit } from "./useInit";
import { useTonClient } from "./useTonClient";
import { BitgiftyTokenTransfer } from "../Contracts/wrapper";

export function useContractWrapper() {
	const client = useTonClient();

	const [contractData, setContractData] = useState<null | {
		recent_sender: Address;
		number: number;
	}>();

	BitgiftyTokenTransfer.fromInit;
}
