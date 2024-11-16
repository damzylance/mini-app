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

// const manifestConfiguration = {
// 	manifestUrl: "https://bitgiftytg.vercel.app/tonconnect-manifest.json",
// 	checkNetworkId: false, // Set this to true if you want to check network ID
// };

const Landing = () => {
	const toast = useToast();
	const [tg, setTg] = useState(null);
	const [connector, setConnector] = useState(null);
	const [walletAddress, setWalletAddress] = useState("");
	const [isConnecting, setIsConnecting] = useState(false);

	// Initialize Telegram WebApp
	useEffect(() => {
		if (window.Telegram?.WebApp) {
			const tgApp = window.Telegram.WebApp;
			setTg(tgApp);
			tgApp.ready();
			tgApp.expand();
		}
	}, []);

	// Initialize TON Connect
	useEffect(() => {
		const connector = new TonConnect({
			manifestUrl: "https://bitgiftytg.vercel.app/tonconnect-manifest.json",
		});
		setConnector(connector);

		// Check if wallet is already connected
		const loadWallet = async () => {
			try {
				const walletInfo = await connector.getWallets();
				if (walletInfo) {
					const activeWallet = await connector.account;
					if (activeWallet) {
						setWalletAddress(activeWallet.address);
						console.log("Connected wallet:", activeWallet);
					}
				}
			} catch (error) {
				console.error("Error loading wallet:", error);
			}
		};

		loadWallet();

		// Subscribe to wallet changes
		const unsubscribe = connector.onStatusChange(async (wallet) => {
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

		// Cleanup subscription
		return () => {
			unsubscribe();
		};
	}, []);

	const handleWalletConnect = async () => {
		const walletConnectionSource = {
			universalLink: "https://app.tonkeeper.com/ton-connect",
			bridgeUrl: "https://bridge.tonapi.io/bridge",
		};
		try {
			setIsConnecting(true);

			if (!connector) {
				throw new Error("Wallet connector not initialized");
			}

			if (tg?.openTonWallet) {
				// Use Telegram's native TON wallet if available
				await tg.openTonWallet();
			} else {
				// Generate connection link for desktop or other wallets
				const universalLink = await connector.connect(walletConnectionSource);
				// window.open(walletConnectionSource.universal_url, "_blank");
			}
		} catch (error) {
			console.error("Wallet connection error:", error);
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
			console.error("Wallet disconnection error:", error);
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
