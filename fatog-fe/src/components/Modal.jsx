import {
    Modal as ChakraModal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';

const Modal = ({children, isOpen, onClose, footer, title}) => {
    return (
        <>
            <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {children}
                    </ModalBody>

                    <ModalFooter>
                        {footer}
                    </ModalFooter>
                </ModalContent>
            </ChakraModal>
        </>
    )
}

export default Modal;