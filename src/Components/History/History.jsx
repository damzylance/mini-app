"use client";
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
import { useTonWallet } from "@tonconnect/ui-react";
import { Address } from "@ton/core";

const TransactionHistory = ({ isOpen, onClose, walletAddress }) => {
	const [isLoading, setIsloading] = useState(true);
	const [transactions, setTransactions] = useState([]);
	const wallet = useTonWallet();
	const walletAddress = Address.parse(wallet.account.address).toString();

	useEffect(() => {
		if (walletAddress) {
			axios
				.get(
					`${process.env.NEXT_PUBLIC_BASE_URL}/transactions/?search=${walletAddress}&limit=15`
				)
				.then((response) => {
					setIsloading(false);
					setTransactions(response.data.results);
				})
				.catch((error) => {
					setIsloading(false);
					console.log(error);
				});
		} else {
			setIsloading(false);
		}
	}, [walletAddress]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="lg">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Transaction History</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack
						borderRadius="12px"
						p="10px"
						width="full"
						bg="#fff"
						maxH="60vh"
						overflowY="auto"
					>
						{isLoading ? (
							<Spinner />
						) : transactions.length > 0 ? (
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
						) : (
							<Text fontSize="xs">No transactions </Text>
						)}
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default TransactionHistory;
