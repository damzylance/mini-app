import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	Text,
	VStack,
} from "@chakra-ui/react";
import TopUpForm from "./TopupForm/TopUpForm";

export const UtilityDrawer = (props) => {
	return (
		<Drawer
			closeOnOverlayClick={false}
			isOpen={props.isOpen}
			onClose={props.onClose}
			placement={"bottom"}
		>
			<DrawerOverlay />
			<DrawerContent borderTopRadius={"24px"} bg={"#272A2F"}>
				<DrawerCloseButton />
				<DrawerBody>
					<VStack width={"full"}>
						<TopUpForm telco={""} onClose={props.action} name={""} />
					</VStack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
