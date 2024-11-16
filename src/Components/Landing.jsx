import { Button, HStack, Image, Select, Text, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Bet9jaLogo from "../assets/images/Bet9jaLogo.png";
import dottedBg from "../assets/images/dottedBg.png";
import isolatedRight from "../assets/images/Isolation_Mode.png";
import groupLeft from "../assets/images/group_left.png";
import groupRight from "../assets/images/group_right.png";

const Landing = () => {
	const tg = window.Telegram?.WebApp;

	useEffect(() => {
		// Initialize Telegram WebApp
		if (tg) {
			// Expand to full height
			tg.expand();

			// Set theme based on Telegram theme
			if (tg.colorScheme === "dark") {
				// Your dark theme logic if needed
			}

			// Set the main button if needed
			tg.MainButton.setParams({
				text: "PROCEED TO TOPUP",
				color: "#0D7B3C",
			});
		}
	}, []);

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
				<Image
					src={Bet9jaLogo}
					alt="Bet9ja Logo"
					loading="eager" // Prioritize logo loading
				/>

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

				<Button
					width="full"
					py="30px"
					size="lg"
					bg="#0D7B3C"
					color="white"
					_hover={{ bg: "#0D7B3C" }}
					onClick={() => {
						// Handle button click
						if (tg?.MainButton) {
							tg.MainButton.show();
						}
					}}
				>
					Bet9ja Topup
				</Button>
			</VStack>

			{/* Background Images - Optimized loading */}
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
