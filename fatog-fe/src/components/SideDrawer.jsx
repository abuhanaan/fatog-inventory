import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Flex,
    Spacer
} from '@chakra-ui/react';
import SideNavLinks from './SideNavLinks';
import Logo from './Logo';
import LogoutBtn from './LogoutBtn';

const SideDrawer = ({ isOpen, onClose, btnRef }) => {
    return (
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
            finalFocusRef={btnRef}
            isFullHeight={true}
        >
            <DrawerOverlay />
                <DrawerContent paddingX='0'>
                    <DrawerCloseButton />
                    <DrawerHeader paddingX='2'>
                        <Logo />
                    </DrawerHeader>

                    <DrawerBody padding='0' flex='1'>
                        <Flex direction='column'>
                            <SideNavLinks />
                            <Spacer />
                            <LogoutBtn display={{ base: 'block', md: 'none' }} />
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
        </Drawer>
    )
}

export default SideDrawer;