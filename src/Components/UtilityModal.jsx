import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import TopUpForm from "./TopupForm/TopUpForm";

export const UtilityDrawer = (props) => {
	const [isFormLoading, setIsFormLoading] = useState(false);

	const handleClose = () => {
		if (!isFormLoading) {
			props.onClose();
		}
	};

	return (
		<Drawer
			closeOnOverlayClick={!isFormLoading}
			isOpen={props.isOpen}
			onClose={handleClose}
			placement={"bottom"}
		>
			<DrawerOverlay zIndex={"900 !important"} />
			<DrawerContent
				zIndex={"900 !important"}
				borderTopRadius={"24px"}
				color={"#fff"}
				bg={"#272A2F"}
			>
				<DrawerCloseButton isDisabled={isFormLoading} />
				<DrawerBody>
					<VStack width={"full"}>
						<TopUpForm
							telco={""}
							onClose={props.onClose}
							name={""}
							onLoadingChange={setIsFormLoading}
							address={props.address}
						/>
					</VStack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
