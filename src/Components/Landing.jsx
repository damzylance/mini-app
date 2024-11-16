import { Button, HStack, Image, Select, Text, VStack } from "@chakra-ui/react";
import React from "react";
import Bet9jaLogo from "../assets/images/Bet9jaLogo.png";
import dottedBg from "../assets/images/dottedBg.png";
import isolatedRight from "../assets/images/Isolation_Mode.png";
import groupLeft from "../assets/images/group_left.png";
import groupRight from "../assets/images/group_right.png";

const Landing = () => {
	return (
		<VStack
			width={"full"}
			maxW={"600px"}
			mx={"auto"}
			h={"100vh"}
			bg={"#242424"}
			spacing={0}
		>
			{/* Top Section */}
			<VStack
				width={"full"}
				gap={"40px"}
				height={"50%"}
				px={"10px"}
				justifyContent={"center"}
			>
				<Image src={Bet9jaLogo} />
				<Text fontSize={"16px"} color={"#fff"} fontWeight={"500"}>
					Instant and secure way to topup your Bet9ja account.
				</Text>
				<HStack
					alignItems={"center"}
					color={"#fff"}
					width={"full"}
					justifyContent={"space-between"}
					border={"1px solid #07940A"}
					padding={"10px 20px"}
					borderRadius={"12px"}
				>
					<VStack alignItems={"flex-start"}>
						<Text fontSize={"12px"}>Your Current Balance</Text>
						<Text fontSize={"30px"} fontWeight={"500"}>
							N8632.50
						</Text>
					</VStack>
					<HStack>
						<Text fontSize={"16px"} fontWeight={"900"}>
							5.72
						</Text>
						<Select borderRadius={"full"}>
							<option>TON</option>
						</Select>
					</HStack>
				</HStack>
				<Button
					width={"full"}
					py={"30px"}
					size={"lg"}
					bg={"#0D7B3C"}
					color={"#fff"}
					_hover={{ background: "#0D7B3C" }}
				>
					Bet9ja Topup
				</Button>
			</VStack>

			{/* Bottom Section with overlapping images */}
			<VStack width={"full"} height={"50%"} position={"relative"} p={0}>
				<Image
					src={dottedBg}
					position={"absolute"}
					bottom={0}
					left={0}
					width={"full"}
					height={"full"}
					objectFit={"cover"}
				/>
				<Image
					src={groupLeft}
					position={"absolute"}
					bottom={0}
					left={0}
					height={"auto"}
				/>
				<Image
					src={groupRight}
					position={"absolute"}
					bottom={0}
					right={0}
					height={"auto"}
				/>
				<Image
					src={isolatedRight}
					position={"absolute"}
					bottom={-1}
					left={"50%"}
					transform={"translateX(-50%)"}
					height={"auto"}
					zIndex={1}
				/>
			</VStack>
		</VStack>
	);
};

export default Landing;
