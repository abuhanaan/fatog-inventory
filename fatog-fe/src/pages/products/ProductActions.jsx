import { useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// import ListingsTable from '../../components/Table';
import { HStack, Box, useDisclosure, IconButton, Icon, Button, Text, Spinner, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaEllipsisVertical } from "react-icons/fa6";
import Modal from '../../components/Modal';
import { deleteProduct } from '../../api/products';
import { useToastHook } from '../../hooks/useToast';
import { isUnauthorized } from '../../utils';

const ProductActions = ({ row }) => {
    const product = row.original;
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);

    function viewProduct(e) {
        e.preventDefault();

        const dataProductId = e.currentTarget.getAttribute('data-product-id');
        navigate(`./${dataProductId}`);
    }

    async function productDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE product endpoint
        const response = await deleteProduct(product.id);

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
            description: 'Product deleted successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsDeleting(false);
        closeModalRef.current.click();

        setTimeout(() => {
            navigate(`/products`);
        }, 6000);

    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button
                onClick={productDelete}
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
                    <MenuItem icon={<IoEyeOutline />} data-product-id={product.id} onClick={viewProduct}>
                        Preview
                    </MenuItem>

                    <MenuItem as={Link} to='create' icon={<MdOutlineEdit />} state={{ currentProduct: product }}>
                        Edit Product
                    </MenuItem>

                    <MenuItem icon={<MdDeleteOutline />} data-product-id={product.id} onClick={onOpen}>
                        Delete Product
                    </MenuItem>
                </MenuList>
            </Menu>

            <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Product'>
                <Box>
                    <Text>Proceed to delete product?</Text>
                </Box>
            </Modal>
        </>
    )
}

export default ProductActions;