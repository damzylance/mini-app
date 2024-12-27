import {
	Button,
	HStack,
	Image,
	Select,
	Text,
	VStack,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
	TonConnectButton,
	useTonAddress,
	useTonConnectUI,
} from "@tonconnect/ui-react";
import Bet9jaLogo from "../assets/images/Bet9jaLogo.png";
import dottedBg from "../assets/images/dottedBg.png";
import isolatedRight from "../assets/images/Isolation_Mode.png";
import groupLeft from "../assets/images/group_left.png";
import groupRight from "../assets/images/group_right.png";
import axios from "axios";
import { UtilityDrawer } from "./UtilityModal";
import TransactionHistory from "./History/History";
import { FaArrowRightLong } from "react-icons/fa6";

const Landing = () => {
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: historyIsOpen,
		onOpen: historyOnOpen,
		onClose: historyOnClose,
	} = useDisclosure();

	const [tg, setTg] = useState(null);
	const address = useTonAddress();
	const [tonConnectUI] = useTonConnectUI();
	const [balance, setBalance] = useState(0);
	// Initialize Telegram WebApp
	useEffect(() => {
		if (window.Telegram?.WebApp) {
			const tgApp = window.Telegram.WebApp;
			setTg(tgApp);
			tgApp.ready();
			tgApp.expand();
		}
	}, []);

	const fetchTonBalance = async () => {
		if (address) {
			try {
				const response = await axios.get(
					`https://toncenter.com/api/v2/getAddressInformation`,
					{
						params: {
							address: address,
							api_key: `${import.meta.env.VITE_TON_API}`,
						},
					}
				);
				// Balance is returned in nanoTON (1 TON = 10^9 nanoTON)
				const balanceNanoTon = response.data.result.balance;
				const balanceTon = balanceNanoTon / 1e9; // Convert to TON
				setBalance(balanceTon);
			} catch (error) {
				console.error("Error fetching TON balance:", error);
				return 0; // Return 0 if there's an error
			}
		}
	};

	const transactionRequest = {
		validUntil: Math.floor(Date.now() / 1000) + 600, // Valid for 10 minutes
		messages: [
			{
				address: "0QCpvCoYE9WRETYCHgnVXU_dBZCmO3t7KTU7zleKLkVAKqXX", // Verify this address
				amount: "100000000", // in nanoTON
				// payload: "", // Optional: add payload if required
				// state_init: null, // Optional: include if deploying a contract
			},
		],
	};

	const handleSendTon = async () => {
		const transactionRequest = {
			validUntil: Math.floor(Date.now() / 1000) + 600, // Valid for 10 minutes
			messages: [
				{
					address: "0QCpvCoYE9WRETYCHgnVXU_dBZCmO3t7KTU7zleKLkVAKqXX", // Verify this address
					amount: (0.1 * 1e9).toString(), // in nanoTON
					// payload: "", // Optional: add payload if required
					// state_init: null, // Optional: include if deploying a contract
				},
			],
		};
		try {
			const txHash = await tonConnectUI.sendTransaction(transactionRequest);
			console.log(txHash);
			toast({
				title: "Transaction Sent",
				description: "Your Bet9ja top-up was successful.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			console.error("Error sending transaction:", error);
			toast({
				title: "Transaction Failed",
				description: error.message || "An error occurred while sending TON.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	useEffect(() => {
		fetchTonBalance();
	}, [address]);
	return (
		<VStack
			width="full"
			maxW="600px"
			mx="auto"
			minH="100vh"
			bg="#242424"
			position="relative"
			spacing={0}
		>
			<VStack
				width="full"
				gap="20px"
				pt="20px"
				px="10px"
				justifyContent="center"
				zIndex={1}
			>
				<Image src={Bet9jaLogo} alt="Bet9ja Logo" loading="eager" />

				<Text fontSize="16px" color="white" fontWeight="500" textAlign="center">
					Instant and secure way to topup your Bet9ja account.
				</Text>

				<HStack
					alignItems="center"
					color="white"
					width="full"
					justifyContent="space-between"
					border="1px solid #07940A"
					padding="10px 20px"
					borderRadius="12px"
					bg="whiteAlpha.50"
					backdropFilter="blur(5px)"
				>
					<VStack alignItems="flex-start">
						<Text fontSize="12px">Your Current Balance</Text>
						<Text fontSize="30px" fontWeight="500">
							₦{(balance * 9216).toFixed(2)}
						</Text>
					</VStack>
					<HStack>
						<Text fontSize="16px" fontWeight="900">
							{balance.toFixed(2)}
						</Text>
						<Select
							borderRadius="full"
							bg="transparent"
							_hover={{ bg: "whiteAlpha.100" }}
						>
							<option value="TON">TON</option>
						</Select>
					</HStack>
				</HStack>
				<HStack width={"full"} justifyContent={"space-between"}>
					<TonConnectButton />
					{address && (
						<HStack
							onClick={() => {
								historyOnOpen();
							}}
							color={"#fff"}
						>
							<Text>History</Text>
							<FaArrowRightLong />
						</HStack>
					)}
				</HStack>

				<Button
					width="full"
					py="30px"
					size="lg"
					bg="#0D7B3C"
					color="white"
					_hover={{ bg: "#0D7B3C" }}
					isDisabled={!address}
					onClick={() => {
						onOpen();
					}}
				>
					Bet9ja Topup
				</Button>
			</VStack>

			{/* Background Images */}
			<Image
				src={groupRight}
				position="absolute"
				bottom={0}
				right={0}
				loading="lazy"
				alt=""
			/>
			<Image
				src={groupLeft}
				position="absolute"
				bottom={0}
				left={0}
				loading="lazy"
				alt=""
			/>
			<Image
				src={isolatedRight}
				position="absolute"
				bottom={0}
				right={0}
				loading="lazy"
				alt=""
			/>
			<Image
				src={dottedBg}
				position="absolute"
				bottom={0}
				width="full"
				loading="lazy"
				alt=""
			/>
			<TransactionHistory isOpen={historyIsOpen} onClose={historyOnClose} />

			<UtilityDrawer
				isOpen={isOpen}
				onClose={() => {
					onClose();
				}}
			/>
		</VStack>
	);
};

export default Landing;
