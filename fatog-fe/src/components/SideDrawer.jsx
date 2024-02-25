import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';
import SideNavLinks from './SideNavLinks';
import Logo from './Logo';

const SideDrawer = ({ isOpen, onClose, btnRef }) => {
    return (
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
            finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            <DrawerContent paddingX='0'>
                <DrawerCloseButton />
                <DrawerHeader paddingX='2'>
                    <Logo />
                </DrawerHeader>

                <DrawerBody padding='0'>
                    <SideNavLinks />
                </DrawerBody>

                <DrawerFooter alignSelf='flex-start' padding='0'>
                    Drawer Footer
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default SideDrawer;