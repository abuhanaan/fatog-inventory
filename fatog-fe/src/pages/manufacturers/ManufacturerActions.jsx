import { useRef, useState } from 'react';
import { useNavigate, useNavigation, Link, useLocation } from 'react-router-dom';
import { HStack, Box, useDisclosure, IconButton, Icon, Button, Text, Spinner, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaEllipsisVertical } from "react-icons/fa6";
import Modal from '../../components/Modal';
import { deleteManufacturer } from '../../api/manufacturers';
import { useToastHook } from '../../hooks/useToast';
import { isUnauthorized } from '../../utils';

const ManufacturerActions = ({ row }) => {
    const manufacturer = row.original;
    const navigate = useNavigate();
    const { state } = useNavigation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { pathname } = useLocation();
    const closeModalRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);

    function viewManufacturer(e) {
        e.preventDefault();

        const dataManufacturerId = e.currentTarget.getAttribute('data-manufacturer-id');
        navigate(`./${dataManufacturerId}`);
    }

    async function manufacturerDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE manufacturer endpoint
        const response = await deleteManufacturer(manufacturer.id);

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsDeleting(false);
            closeModalRef.current.click();

            setTimeout(() => {
                isUnauthorized(response, navigate, pathname);
            }, 6000);

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Manufacturer deleted successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsDeleting(false);
        closeModalRef.current.click();

        setTimeout(() => {
            navigate(`/manufacturers`);
        }, 6000);

    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button
                onClick={manufacturerDelete}
                colorScheme='blue'
                isLoading={isDeleting ? true : false}
                loadingText='Deleting...'
                spinnerPlacement='end'
                spinner={<Spinner
                    thickness='4px'
                    speed='0.5s'
                    emptyColor='gray.200'
                    color='blue.300'
                    size='md'
                />}
            >
                Delete
            </Button>
        </HStack>

    return (
        <>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<FaEllipsisVertical />}
                    variant='unstyled'
                />
                <MenuList py='0'>
                    <MenuItem icon={<IoEyeOutline />} data-manufacturer-id={manufacturer.id} onClick={viewManufacturer}>
                        Preview
                    </MenuItem>

                    <MenuItem as={Link} to='create' icon={<MdOutlineEdit />} state={{ currentManufacturer: manufacturer }}>
                        Edit Manufacturer
                    </MenuItem>

                    <MenuItem icon={<MdDeleteOutline />} data-manufacturer-id={manufacturer.id} onClick={onOpen}>
                        Delete Manufacturer
                    </MenuItem>
                </MenuList>
            </Menu>

            <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Manufacturer'>
                <Box>
                    <Text>Proceed to delete manufacturer?</Text>
                </Box>
            </Modal>
        </>
    )
}

export default ManufacturerActions;