import React, { useEffect, useState } from "react";
import {
	Spinner,
	Text,
	VStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
} from "@chakra-ui/react";
import axios from "axios";
import TransactionRow from "./TransactionRow";
import { Address } from "@ton/core";

const TransactionList = ({ transactions }) => {
	if (!transactions.length) {
		return <Text fontSize="xs">No transactions</Text>;
	}

	return (
		<>
			{transactions.map((transaction) => (
				<TransactionRow
					key={transaction.id}
					amount={transaction.amount.toFixed(0)}
					tokenAmount={transaction.crypto_amount}
					type={transaction?.transaction_type || ""}
					status={transaction.status}
					date={transaction.time}
					id={transaction.id}
					country={transaction.country}
				/>
			))}
		</>
	);
};

const TransactionHistory = ({ isOpen, onClose, address }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		const fetchTransactions = async () => {
			if (!address) {
				setIsLoading(false);
				return;
			}
			const parsedAddress = Address.parse(address).toString();
			try {
				const response = await axios.get(
					`${
						import.meta.env.VITE_BASE_URL
					}transactions/?search=${parsedAddress}&limit=15`
				);
				setTransactions(response.data.results);
			} catch (error) {
				console.error("Error fetching transactions:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTransactions();
	}, [address]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="lg">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Transaction History</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack
						borderRadius="12px"
						p="4"
						width="full"
						bg="white"
						maxH="60vh"
						overflowY="auto"
						spacing="4"
					>
						{isLoading ? (
							<Spinner />
						) : (
							<TransactionList transactions={transactions} />
						)}
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default TransactionHistory;
