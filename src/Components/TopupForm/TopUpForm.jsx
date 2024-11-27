import React, { useState } from "react";
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
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { bet9jaTopup } from "../../helpers/topup";
const TopUpForm = () => {
	const address = useTonAddress();
	const [tonConnectUI] = useTonConnectUI();

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

	const handleAmountChange = (e) => {
		const tempNairaAmount = e.target.value;
		setNairaAmount(tempNairaAmount);
		if (currency === "CUSD" || currency === "USDT" || currency == "USDC") {
			setTokenAmount(tempNairaAmount / tokenToNairaRate);
		} else {
			setTokenAmount(tempNairaAmount / 9216);
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
						console.log(response.data);
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

		// setIsValidated(true);
	};
	const handleSendTon = async (amountTon) => {
		const formattedAmount = parseFloat(amountTon).toFixed(4);
		if (address) {
			const transactionRequest = {
				validUntil: Math.floor(Date.now() / 1000) + 600, // Valid for 10 minutes
				messages: [
					{
						address: "0QCpvCoYE9WRETYCHgnVXU_dBZCmO3t7KTU7zleKLkVAKqXX", // Verify this address
						amount: (formattedAmount * 1e9).toString(), // in nanoTON
						// payload: "", // Optional: add payload if required
						// state_init: null, // Optional: include if deploying a contract
					},
				],
			};
			setLoading(true);
			try {
				const txHash = await tonConnectUI.sendTransaction(transactionRequest);
				console.log(txHash);

				const data = {
					chain: "ton",
					wallet_address: address,
					country: "NG",
					amount: nairaAmount,
					crypto_amount: formattedAmount,
					transaction_hash: txHash.boc,
					token: validationToken,
					account_holder: accountHolder,
					client_id: clientId,
				};

				console.log(data);
				const purchaseResponse = await bet9jaTopup(data);
				console.log("purchase response", purchaseResponse);
				if (purchaseResponse?.status === 200) {
					// addBeneficiary(billType.toLowerCase() as BillType, {
					// 	phoneNumber: phoneNumber,
					// 	provider: selectedProvider as ProviderType,
					// });
					toast({
						title: getSuccessMessage(productName),
						status: "success",
					});
					setLoading(false);
				} else {
					setLoading(false);
				}
			} catch (error) {
				console.error("Error sending transaction:", error);
				setLoading(false);
				toast({
					title: "Transaction Failed",
					description: error.message || "An error occurred while sending TON.",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		} else {
			toast({
				title: "Wallet not connected",
				description: "Connect wallet to perform this transaction",
				status: "error",
				duration: 3000,
				isClosable: true,
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
				// onSubmit={handleSubmit(() => handleSendTon(0.1))}
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
