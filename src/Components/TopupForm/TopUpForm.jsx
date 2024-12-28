import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	InputGroup,
	InputLeftAddon,
	Text,
	VStack,
	useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { IoNotificationsOffCircleOutline } from "react-icons/io5";
import { useTonWallet, useTonConnectUI, CHAIN } from "@tonconnect/ui-react";
import { bet9jaTopup } from "../../helpers/topup";
import {
	pollTransactionHash,
	pollUsdtTransaction,
} from "../../helpers/pollTransactions";
import { useHandleDeposit } from "../../hooks/useDepositTon";
import {
	INVOICE_WALLET_ADDRESS,
	USDT_MASTER_ADDRESS,
} from "../../constants/common-constants";
import { JETTON_TRANSFER_GAS_FEES } from "../../constants/fees.constants";
import { JettonWallet } from "../../wrappers/JettonWallet";
import { Address, beginCell, JettonMaster, TonClient } from "@ton/ton";
import { calculateUsdtAmount } from "../../helpers/common-helpers";
import { useGenerateId } from "../../hooks/useGenerateId";
import { useTonClient } from "../../hooks/useTonClient";

const TopUpForm = (props) => {
	const wallet = useTonWallet();
	console.log(wallet);
	const [tonConnectUI] = useTonConnectUI();
	const tonClient = useTonClient();
	const address = Address.parse(wallet.account.address);
	console.log(address);

	const toast = useToast();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [loading, setLoading] = useState(false);
	const [isValidated, setIsValidated] = useState(false);
	const [validationToken, setValidationToken] = useState("");
	const [accountHolder, setAccountHolder] = useState("");
	const [clientId, setClientId] = useState("");
	const [nairaAmount, setNairaAmount] = useState(0);
	const [tokenAmount, setTokenAmount] = useState(0);
	const [currency, setCurrency] = useState("TON");
	const handleDeposit = useHandleDeposit();
	const orderId = useGenerateId();

	// Update parent component when loading state changes
	useEffect(() => {
		props.onLoadingChange(loading);
	}, [loading, props.onLoadingChange]);

	const handleAmountChange = (e) => {
		const tempNairaAmount = e.target.value;
		setNairaAmount(tempNairaAmount);
		if (currency === "CUSD" || currency === "USDT" || currency == "USDC") {
			setTokenAmount(tempNairaAmount / tokenToNairaRate);
		} else {
			setTokenAmount(tempNairaAmount / 6000);
		}
	};

	const handleCompletePayment = async () => {
		try {
			if (!tonClient || !address) {
				if (!tonClient) {
					console.log("no client");
				}
				if (!address) {
					console.log("no address");
				}
				return;
			}

			const jettonMaster = tonClient.open(
				JettonMaster.create(USDT_MASTER_ADDRESS)
			);
			const usersUsdtAddress = await jettonMaster.getWalletAddress(address);

			const sender = {
				address,
				send: async (args) => {
					await tonConnectUI.sendTransaction({
						validUntil: Date.now() + 5 * 60 * 1000,
						messages: [
							{
								address: args.to.toString(),
								amount: args.value.toString(),
								payload: args.body?.toBoc().toString("base64"),
							},
						],
					});
				},
			};

			const jettonWallet = tonClient.open(
				JettonWallet.createFromAddress(usersUsdtAddress)
			);

			const amount = calculateUsdtAmount(1 * 100);

			const payload = beginCell()
				.storeUint(0x0f8a7ea5, 32)
				.storeUint(0, 64)
				.storeCoins(amount)
				.storeAddress(INVOICE_WALLET_ADDRESS)
				.storeAddress(sender.address)
				.storeUint(0, 1)
				.storeCoins(1n)
				.storeUint(1, 1)
				.storeRef(
					beginCell().storeUint(0, 32).storeStringTail(orderId).endCell()
				)
				.endCell();

			const sentTime = Math.floor(Date.now() / 1000);

			setLoading(true);

			// Send the transaction
			await sender.send({
				to: usersUsdtAddress,
				value: JETTON_TRANSFER_GAS_FEES,
				body: payload,
			});

			// Initialize the poller
			const poller = new UsdtTransactionPoller(
				tonClient,
				USDT_MASTER_ADDRESS,
				INVOICE_WALLET_ADDRESS
			);

			// Poll for the transaction
			const result = await poller.pollForTransaction(
				address,
				orderId,
				sentTime,
				30 // max attempts
			);

			if (result) {
				console.log(
					`Transaction found! Hash: ${result.hash}, Status: ${result.status}`
				);
				// Send the hash to your backend here
				await sendToBackend({
					transactionHash: result.hash,
					status: result.status,
					orderId: orderId,
				});
			} else {
				console.log("Transaction not found after maximum attempts");
				// Handle timeout case
			}

			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log("Error during transaction:", error);
		}
	};

	const validateBetUser = async (data) => {
		if (address) {
			data.phone = `234${data.phone}`;
			try {
				setLoading(true);
				await axios
					.post(`${import.meta.env.VITE_BASE_URL}bet/validate-customer/`, data)
					.then((response) => {
						setValidationToken(response.data.token);
						setAccountHolder(
							`${response.data.firstName} ${response.data.lastName}`
						);
						setIsValidated(true);
						setClientId(data.client_id);
						setLoading(false);
					})
					.catch((error) => {
						toast({
							title: error.response.data.error,
							status: "warning",
						});
						setIsValidated(false);
						setLoading(false);
					});
			} catch (error) {
				toast({ title: "Error validating details", status: "warning" });
				console.log(error);
				setLoading(false);
			}
		} else {
			toast({
				title: "Wallet not connected",
				description: "Connect wallet to perform this action",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleSendTon = async (amountTon) => {
		const formattedAmount = parseFloat(amountTon).toFixed(4);
		if (address) {
			const transactionRequest = {
				validUntil: Math.floor(Date.now() / 1000) + 600, // Valid for 10 minutes
				messages: [
					{
						address: "UQAZwumuEzbQi9o2x99jM0OBXF6B4TbiMPA2U92-q8MFTdlL",
						amount: (formattedAmount * 1e9).toString(), // in nanoTON
					},
				],
			};
			const sentTime = Math.floor(Date.now() / 1000);

			setLoading(true);

			try {
				await tonConnectUI.sendTransaction(transactionRequest);
				console.log("Transaction sent, polling for confirmation...");

				// Poll for transaction confirmation
				const transactionHash = await pollTransactionHash(
					address,
					formattedAmount,
					sentTime,
					"UQAZwumuEzbQi9o2x99jM0OBXF6B4TbiMPA2U92-q8MFTdlL"
				);
				console.log("Transaction Hash:", transactionHash);

				// Prepare data for backend
				const data = {
					chain: "ton",
					wallet_address: address,
					country: "NG",
					amount: nairaAmount,
					crypto_amount: formattedAmount,
					transaction_hash: transactionHash,
					token: validationToken,
					account_holder: accountHolder,
					client_id: clientId,
				};

				const purchaseResponse = await bet9jaTopup(data);
				console.log("Purchase Response:", purchaseResponse);

				if (purchaseResponse?.status === 200) {
					toast({ title: "Transaction Successful", status: "success" });
				} else {
					throw new Error("Purchase failed");
				}
			} catch (error) {
				console.error("Error:", error);
				toast({ title: "Error", description: error.message, status: "error" });
			} finally {
				setLoading(false);
				props.onClose();
			}
		} else {
			toast({
				title: "Wallet not connected",
				description: "Please connect your wallet to proceed.",
				status: "error",
			});
		}
	};

	return (
		<VStack my={"20px"} gap={"10px"} width={"full"} color={"#FBFCFC"}>
			<HStack width={"full"} alignItems={"center"}>
				<HStack width={"full"} justifyContent={"cener"}>
					<Text
						fontSize={"24px"}
						fontWeight={"700"}
						textTransform={"uppercase"}
						width={"full"}
						textAlign={"center"}
					>
						Bet9ja Topup
					</Text>
				</HStack>
			</HStack>

			<form
				style={{ width: "100%" }}
				onSubmit={
					isValidated
						? handleSubmit(() => {
								console.log(tokenAmount);
								handleSendTon(tokenAmount);
						  })
						: handleSubmit(validateBetUser)
				}
				// onSubmit={handleSubmit(() => handleSendTon(1))}
			>
				<VStack width={"full"} gap={"20px"}>
					<FormControl>
						<FormLabel fontSize={"sm"}>Phone Number</FormLabel>
						<InputGroup size={"md"}>
							<InputLeftAddon color={"#000"}>{"+234"}</InputLeftAddon>
							<Input
								fontSize={"16px"}
								border={"1px solid #506DBB"}
								outline={"none"}
								isDisabled={isValidated}
								type="number"
								inputMode={"numeric"}
								required
								{...register("phone", {
									minLength: {
										value: 10,
										message: "Account ID must be 10 digits",
									},
									maxLength: {
										value: 10,
										message: "Account ID must be 10 digits",
									},
								})}
							/>
						</InputGroup>
						<HStack width={"fulll"} justifyContent={"flex-end"}>
							<Text color={"red"} fontSize={"xs"}>
								{errors.phone && errors.phone.message}
							</Text>
						</HStack>
					</FormControl>
					<FormControl>
						<FormLabel fontSize={"sm"}>Bet9ja Account ID</FormLabel>
						<Input
							fontSize={"16px"}
							border={"1px solid #506DBB"}
							isDisabled={isValidated}
							outline={"none"}
							type="number"
							inputMode={"numeric"}
							required
							{...register(
								"client_id"
								// 	 {
								// 	minLength: { value: 7, message: "Account ID must be 7 digits" },
								// 	maxLength: { value: 7, message: "Account ID must be 7 digits" },
								// }
							)}
						/>
						<HStack width={"fulll"} justifyContent={"space-between"} mt={"4px"}>
							<Text fontSize={"xs"}>{accountHolder}</Text>
							<Text color={"red"} fontSize={"xs"}>
								{errors.client_id && errors.client_id.message}
							</Text>
						</HStack>
					</FormControl>

					{isValidated ? (
						<>
							<FormControl>
								<HStack width={"full"} justifyContent={"space-between"}>
									{" "}
									<FormLabel fontSize={"sm"}>Amount (₦)</FormLabel>
									{/* <Text fontSize={"xs"} color={"#000"}>
										Balance ({userCurrencyTicker}):{" "}
										{(
											parseFloat(tokenBalance) *
											parseFloat(tokenToNairaRate.toString())
										).toFixed(2)}
									</Text> */}
								</HStack>

								<Input
									border={"1px solid #506DBB"}
									outline={"none"}
									fontSize={"16px"}
									type="number"
									inputMode={"numeric"}
									required
									{...register("amount", {
										onChange: handleAmountChange,

										// max: {
										// 	value: parseFloat(tokenBalance) * tokenToNairaRate,
										// 	message: "Insufficient balance",
										// },
										min: {
											value: 100,
											message: `Minimum recharge amount is ₦100`,
										},
									})}
								/>
								<HStack
									width={"full"}
									alignItems={"center"}
									justifyContent={"space-between"}
									mt={"5px"}
								>
									<Text fontSize={"xs"} textAlign={"right"}>
										≈ {tokenAmount.toFixed(4)} {currency}
										<br />
									</Text>
									<Text color={"red"} fontSize={"xx-small"}>
										{errors.amount && errors.amount.message}
									</Text>
								</HStack>

								<FormErrorMessage>
									{errors.amount && errors.amount.message}
								</FormErrorMessage>
							</FormControl>
							<Button
								isLoading={loading}
								loadingText={"loadingText"}
								isDisabled={!isValidated}
								type="submit"
								size={"lg"}
								width={"full"}
								borderRadius={"full"}
								color={"#fff"}
								bg="#0D7B3C"
								_hover={{
									background: "#0D7B3C",
								}}
								variant={"solid"}
							>
								Topup
							</Button>
						</>
					) : (
						<Button
							isLoading={loading}
							loadingText={"loadingText"}
							isDisabled={isValidated}
							type="submit"
							color={"#fff"}
							size={"lg"}
							width={"full"}
							borderRadius={"full"}
							background={"#0D7B3C"}
							_hover={{
								background: "#0D7B3C",
							}}
							variant={"solid"}
						>
							Validate
						</Button>
					)}

					<HStack fontSize={"sm"} fontWeight={400} color={"#fff"}>
						{" "}
						<IoNotificationsOffCircleOutline />{" "}
						<Text>This may take up to 15 seconds</Text>{" "}
					</HStack>
				</VStack>
			</form>
			<Box width="full" height={"200px"}></Box>
		</VStack>
	);
};

export default TopUpForm;
