import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';

const FormDrawer = ({children, isOpen, onClose, size, title, footer}) => {
    return (
        <Drawer isOpen={isOpen} onClose={onClose} size={size} closeOnOverlayClick={false}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>{title}</DrawerHeader>

                <DrawerBody>
                    {children}
                </DrawerBody>

                <DrawerFooter>
                    {footer}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default FormDrawer