import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	zIndices: {
		modal: 900, // Lower modal z-index for drawers
	},
});

export default theme;
