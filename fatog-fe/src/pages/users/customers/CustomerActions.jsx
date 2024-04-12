import { useRef, useState, useEffect } from 'react';
import { useNavigate, useNavigation, Link, useLoaderData, useLocation } from 'react-router-dom';
import { Stack, HStack, VStack, Box, useDisclosure, IconButton, Icon, Button, Heading, Text, Spinner, Menu, MenuButton, MenuList, MenuItem, Badge, Tooltip } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaEllipsisVertical, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Modal from '../../../components/Modal';
import { activateUser, deactivateUser } from '../../../api/users';
import { useToastHook } from '../../../hooks/useToast';
import { isUnauthorized } from '../../../utils';

const CustomerActions = ({ row }) => {
    const customer = row.original;
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const { pathname } = useLocation();
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    function viewCustomer(e) {
        e.preventDefault();

        const dataCustomerId = e.currentTarget.getAttribute('data-customer-id');
        navigate(`./${dataCustomerId}`);
    }

    async function customerDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE customer endpoint
        const response = await deleteCustomer(customer.id);

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
            description: 'Customer deleted successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsDeleting(false);
        closeModalRef.current.click();

        setTimeout(() => {
            navigate(`/customers`);
        }, 6000);

    }

    const customerActivate = async (e) => {
        e.preventDefault();

        setIsActivating(true);

        const customerId = e.currentTarget.getAttribute('data-customer-id');

        const response = await activateUser(customerId);

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsActivating(false);

            setTimeout(() => {
                isUnauthorized(response, navigate, pathname);
            }, 6000);

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Customer activated successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsActivating(false);

        setTimeout(() => {
            navigate(`/customers`);
        }, 6000);
    }

    const customerDeactivate = async (e) => {
        e.preventDefault();

        setIsActivating(true);

        const customerId = e.currentTarget.getAttribute('data-customer-id');

        const response = await deactivateUser(customerId);

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsActivating(false);

            setTimeout(() => {
                isUnauthorized(response, navigate, pathname);
            }, 6000);

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Customer deactivated successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsActivating(false);

        setTimeout(() => {
            navigate(`/customers`);
        }, 6000);
    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button
                onClick={customerDelete}
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
                    <MenuItem icon={<IoEyeOutline />} data-customer-id={customer.id} onClick={viewCustomer}>
                        Preview
                    </MenuItem>

                    <MenuItem as={Link} to='/users/create' icon={<MdOutlineEdit />} state={{ currentUser: customer, entity: 'customers' }}>
                        Edit Customer
                    </MenuItem>

                    {
                        customer.active ?
                            <MenuItem
                                as={Button}
                                icon={<FaUserXmark />}
                                data-customer-id={customer.id}
                                onClick={customerDeactivate}
                                size='sm'
                                _hover={{ bg: 'gray.100' }}
                                borderRadius='0'
                                fontWeight='normal'
                                closeOnSelect={false}
                                aria-label='Deactivate customer'
                                isLoading={isActivating}
                                loadingText='Deactivating...'
                                spinnerPlacement='end'
                                spinner={< Spinner
                                    thickness='4px'
                                    speed='0.5s'
                                    emptyColor='gray.200'
                                    color='blue.300'
                                    size='md'
                                />}
                            >
                                Deactivate Customer
                            </MenuItem> :
                            <MenuItem
                                as={Button}
                                icon={<FaUserCheck />}
                                size='sm'
                                data-customer-id={customer.id}
                                onClick={customerActivate}
                                _hover={{ bg: 'gray.100' }}
                                borderRadius='0'
                                fontWeight='normal'
                                closeOnSelect={false}
                                aria-label='Activate customer'
                                isLoading={isActivating ? true : false}
                                loadingText='Activating...'
                                spinnerPlacement='end'
                                spinner={<Spinner
                                    thickness='4px'
                                    speed='0.5s'
                                    emptyColor='gray.200'
                                    color='blue.300'
                                    size='md'
                                />}
                            >
                                Activate Customer
                            </MenuItem>
                    }
                    {/* <MenuItem icon={<MdDeleteOutline />} data-customer-id={customer.id} onClick={onOpen}>
                        Delete Customer
                    </MenuItem> */}
                </MenuList>
            </Menu>

            <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Customer'>
                <Box>
                    <Text>Proceed to delete customer?</Text>
                </Box>
            </Modal>
        </>
    )
}

export const CustomerOrderActions = ({ order, path }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function viewOrder(e) {
        e.preventDefault();

        const dataOrderId = e.currentTarget.getAttribute('data-order-id');
        navigate(`${path}/${dataOrderId}`, { state: { from: pathname } });
    }

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
                    <MenuItem icon={<IoEyeOutline />} data-order-id={order.id} onClick={viewOrder}>
                        Preview
                    </MenuItem>

                    {/* {
                        pathname.includes('orders') &&
                        <MenuItem as={RouterLink} to={`/orders/${order.orderId}/orderlist/${order.id}/edit`} icon={<MdOutlineEdit />} state={{ orderItem: order }}>
                            Edit
                        </MenuItem>
                    } */}
                </MenuList>
            </Menu>
        </>
    )
}

export default CustomerActions;