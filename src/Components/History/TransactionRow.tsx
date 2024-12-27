import { useState } from "react";
import {
	HStack,
	Text,
	VStack,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useDisclosure,
	Spinner,
	Flex,
	Box,
	Icon,
} from "@chakra-ui/react";

import {
	FaBolt,
	FaGlobe,
	FaMobile,
	FaMoneyBillWave,
	FaTv,
	FaCircleCheck,
} from "react-icons/fa6";
import axios from "axios";
import React from "react";

type Props = {
	id: number;
	type: string;
	amount: string;
	tokenAmount: string;
	date: string;
	status: string;
	ref?: string;
	country: string;
};

type TransactionData = {
	id: number;
	amount: number;
	currency: string;
	currency_type: string;
	crypto_amount: number;
	bank_name: string | null;
	account_name: string | null;
	status: string;
	time: string;
	transaction_type: string;
	transaction_hash: string;
	wallet_address: string;
	email: string | null;
	ref: string | null;
	customer: string | null;
	biller_code: string | null;
	item_code: string | null;
	bill_type: string;
	country: string;
	short_code: string | null;
	error_message: string | null;
	token: string | null;
};

const TransactionRow: React.FC<Props> = ({
	type,
	amount,
	tokenAmount,
	date,
	status,
	id,
	country,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [transactionData, setTransactionData] =
		useState<TransactionData | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const transactionIcon = () => {
		if (type.toLowerCase() === "airtime") {
			return <FaMobile size={24} />;
		} else if (type.toLocaleLowerCase() === "mobiledata") {
			return <FaGlobe size={24} />;
		} else if (type.toLocaleLowerCase() === "electricity") {
			return <FaBolt size={24} />;
		} else if (type.toLocaleLowerCase() === "cable") {
			return <FaTv size={24} />;
		} else {
			return <FaMoneyBillWave size={24} />;
		}
	};

	function formatDate(dateString: string) {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		// Convert the input string to a Date object
		const date = new Date(dateString);

		// Extract month, day, and time components
		const month = months[date.getUTCMonth()]; // Get month name
		const day = date.getUTCDate(); // Get day
		const hours = date.getUTCHours().toString().padStart(2, "0");
		const minutes = date.getUTCMinutes().toString().padStart(2, "0");
		const seconds = date.getUTCSeconds().toString().padStart(2, "0");

		// Append "st", "nd", "rd", "th" to the day
		const getDaySuffix = (day: number) => {
			if (day > 3 && day < 21) return "th";
			switch (day % 10) {
				case 1:
					return "st";
				case 2:
					return "nd";
				case 3:
					return "rd";
				default:
					return "th";
			}
		};

		const formattedDate = `${month} ${day}${getDaySuffix(
			day
		)}, ${hours}:${minutes}:${seconds}`;
		return formattedDate;
	}

	const getCurrencySymbol = (country: string) => {
		switch (country) {
			case "NG":
			case "nigeria":
				return "₦";
			case "GH":
				return "₵";
			case "KE":
				return "KSh";
			case "ZA":
				return "R";
			default:
				return "";
		}
	};

	function shortenHashAddress(value: string): string {
		if (value.length <= 8) {
			return value;
		} else {
			return `${value.slice(0, 4)}...${value.slice(-4)}`;
		}
	}
	const getTransactionSign = (type: string) => {
		let transactionSign = "-";
		if (type === "refund" || type === "cashback") {
			transactionSign = "+";
		}
		return transactionSign;
	};

	const formattedDate = formatDate(date);

	const handleTransactionClick = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${id}/`
			);
			setTransactionData(response.data);
			onOpen();
		} catch (error) {
			console.error("Error fetching transaction data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<HStack
				py={2}
				px={1}
				borderWidth={1}
				borderColor="gray.200"
				borderRadius="md"
				cursor="pointer"
				justifyContent={"space-between"}
				onClick={handleTransactionClick}
				width={"full"}
			>
				<HStack gap={"4px"}>
					<Box
						padding={"12px"}
						borderRadius={"50%"}
						bg={"#dfe6f2"}
						fontSize={"xs"}
						color={"rgb(16, 61, 150)"}
					>
						{transactionIcon()}
					</Box>
					<VStack align="start" spacing={0}>
						<Text fontSize={"xs"} textTransform="capitalize">
							{type.toLowerCase()}
						</Text>
						<Text color="gray.500" fontSize={"xs"}>
							{formattedDate}
						</Text>
					</VStack>
				</HStack>

				<VStack alignItems={"end"}>
					<Text fontSize={"xs"}>
						{getTransactionSign(type)} {getCurrencySymbol(country)}
						{amount}
					</Text>
					<Text fontSize={"xs"}>
						{tokenAmount} {transactionData?.currency}
					</Text>
					<Box>
						<Text
							px={2}
							py={1}
							borderRadius="md"
							bg={status === "success" ? "green.100" : "red.100"}
							color={status === "success" ? "green.700" : "red.700"}
							fontSize={"xs"}
						>
							{status}
						</Text>
					</Box>
				</VStack>
			</HStack>

			<Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth="1px" textAlign={"center"}>
						Transaction Receipt
					</DrawerHeader>
					<DrawerCloseButton />
					<DrawerBody bg={"#dfe6f2"}>
						{transactionData ? (
							<VStack width={"full"} p={"10px"} spacing={6}>
								<VStack
									width={"full"}
									borderRadius={"12px"}
									bg={"#fff"}
									p={"10px"}
								>
									<Text textTransform={"capitalize"} fontWeight={"700"}>
										{transactionData.bill_type}
									</Text>
									<Text fontWeight={"700"} fontSize={"xx-large"}>
										{getCurrencySymbol(transactionData.country)}
										{transactionData.amount.toLocaleString()}
									</Text>
									<Text>
										{transactionData.crypto_amount} {transactionData.currency}
									</Text>

									<Flex align="center" gap={2}>
										{transactionData.status === "success" && (
											<Icon as={FaCircleCheck} color="green.500" />
										)}
										<Text
											fontWeight="bold"
											textTransform={"capitalize"}
											color={
												transactionData.status === "success"
													? "green.500"
													: "red.500"
											}
										>
											{transactionData.status}
										</Text>
									</Flex>
								</VStack>

								<VStack
									alignItems={"flex-start"}
									width={"full"}
									borderRadius={"12px"}
									bg={"#fff"}
									p={"20px"}
									gap={4}
								>
									<Text fontWeight={"700"}>Transaction Details</Text>
									<Flex width={"full"} justify="space-between" fontSize={"sm"}>
										<Text>Customer</Text>
										<Text fontWeight={"700"}>{transactionData.customer}</Text>
									</Flex>
									<Flex width={"full"} justify="space-between" fontSize={"sm"}>
										<Text>Reference</Text>
										<Text fontWeight={"700"}>{transactionData.ref}</Text>
									</Flex>
									<Flex width={"full"} justify="space-between" fontSize={"sm"}>
										<Text>Time</Text>
										<Text fontWeight={"700"}>
											{formatDate(transactionData.time)}
										</Text>
									</Flex>
									<Flex width={"full"} justify="space-between" fontSize={"sm"}>
										<Text>TxHash</Text>
										<a
											href={`https://celoscan.io/tx/${transactionData.transaction_hash}`}
										>
											<Text fontWeight={"700"}>
												{shortenHashAddress(transactionData.transaction_hash)}
											</Text>
										</a>
									</Flex>
								</VStack>

								{transactionData.token && (
									<VStack
										width={"full"}
										borderRadius={"12px"}
										bg={"#fff"}
										p={"20px"}
									>
										<Flex
											width={"full"}
											justify="space-between"
											fontSize={"sm"}
										>
											<Text>Token</Text>
											<Text fontWeight={"700"}>{transactionData.token}</Text>
										</Flex>
									</VStack>
								)}
							</VStack>
						) : (
							<Flex justify="center" align="center" h="full">
								{isLoading ? (
									<Spinner />
								) : (
									<Text>Click to fetch transaction details</Text>
								)}
							</Flex>
						)}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default TransactionRow;
