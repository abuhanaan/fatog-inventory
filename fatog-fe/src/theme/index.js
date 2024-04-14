import { extendTheme } from "@chakra-ui/react";
import styles from "./styles";

const theme = extendTheme({
    styles,
    fonts: {
        heading: `Montserrat, sans-serif`,
        body: `Montserrat, sans-serif`,
    },
});

export default theme;