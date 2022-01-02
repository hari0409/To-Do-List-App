import { useColorMode } from "@chakra-ui/react";
import { CgDarkMode } from "react-icons/cg";

function Themes() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
      <header>
        <CgDarkMode onClick={toggleColorMode} size="2.25em" cursor="pointer" color="#F2789F">
          {colorMode === 'light' ? 'Dark' : 'Light'}
        </CgDarkMode>
      </header>
    )
}
export default Themes;