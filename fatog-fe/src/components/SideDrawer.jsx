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
            size='sm'
        >
            <DrawerOverlay />
            <DrawerContent px='0'>
                <DrawerCloseButton />
                <DrawerHeader px='2'>
                    <Logo />
                </DrawerHeader>

                <DrawerBody p='0' flex='1'>
                    <Flex direction='column'>
                        <SideNavLinks />
                        <Spacer />
                    </Flex>
                </DrawerBody>

                <DrawerFooter borderTopWidth='1px' p='0' justifyContent='flex-start'>
                    <LogoutBtn display={{ base: 'block', md: 'none' }} />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default SideDrawer;