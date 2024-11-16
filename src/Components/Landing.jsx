import {
	Button,
	HStack,
	Image,
	Select,
	Text,
	VStack,
	useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TonConnect } from "@tonconnect/sdk";
import Bet9jaLogo from "../assets/images/Bet9jaLogo.png";
import dottedBg from "../assets/images/dottedBg.png";
import isolatedRight from "../assets/images/Isolation_Mode.png";
import groupLeft from "../assets/images/group_left.png";
import groupRight from "../assets/images/group_right.png";

const Landing = () => {
	const tg = window.Telegram?.WebApp;
	const toast = useToast();
	const [connector, setConnector] = useState(null);
	const [walletAddress, setWalletAddress] = useState("");
	const [isConnecting, setIsConnecting] = useState(false);

	useEffect(() => {
		// Initialize Telegram WebApp
		if (tg) {
			tg.expand();
			if (tg.colorScheme === "dark") {
				// Dark theme logic if needed
			}
		}

		// Initialize TonConnector
		const initConnector = new TonConnect({
			manifestUrl: "https://bitgiftytg.vercel.app/tonconnect-manifest.json", // Replace with your manifest URL
		});
		setConnector(initConnector);

		// Listen for wallet connection events
		if (initConnector) {
			initConnector.onStatusChange((wallet) => {
				if (wallet) {
					setWalletAddress(wallet.account.address);
					toast({
						title: "Wallet Connected",
						description: "Successfully connected to TON wallet",
						status: "success",
						duration: 3000,
						isClosable: true,
					});
				} else {
					setWalletAddress("");
				}
			});
		}
	}, []);

	const handleWalletConnect = async () => {
		try {
			setIsConnecting(true);
			if (!connector) {
				throw new Error("Connector not initialized");
			}

			// Generate connection link
			const universalLink = connector.connect();

			// Open TON Wallet
			if (tg?.openTonWallet) {
				await tg.openTonWallet();
			} else {
				// Fallback for desktop or when TON Wallet is not available
				window.open(universalLink, "_blank");
			}
		} catch (error) {
			toast({
				title: "Connection Error",
				description: error.message || "Failed to connect wallet",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsConnecting(false);
		}
	};

	const handleDisconnect = async () => {
		try {
			await connector?.disconnect();
			setWalletAddress("");
			toast({
				title: "Wallet Disconnected",
				status: "info",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Disconnect Error",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

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
							N8632.50
						</Text>
					</VStack>
					<HStack>
						<Text fontSize="16px" fontWeight="900">
							5.72
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

				{/* Wallet Connect Button */}
				<Button
					width="full"
					py="30px"
					size="lg"
					bg={walletAddress ? "#444" : "#0D7B3C"}
					color="white"
					_hover={{ bg: walletAddress ? "#555" : "#0D7B3C" }}
					onClick={walletAddress ? handleDisconnect : handleWalletConnect}
					isLoading={isConnecting}
					loadingText="Connecting..."
				>
					{walletAddress
						? `Disconnect Wallet (${walletAddress.slice(
								0,
								6
						  )}...${walletAddress.slice(-4)})`
						: "Connect TON Wallet"}
				</Button>

				<Button
					width="full"
					py="30px"
					size="lg"
					bg="#0D7B3C"
					color="white"
					_hover={{ bg: "#0D7B3C" }}
					isDisabled={!walletAddress}
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
		</VStack>
	);
};

export default Landing;
