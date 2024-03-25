import { useRef, useState, useEffect } from 'react';
import { useNavigate, useNavigation, Link, useLoaderData, useLocation } from 'react-router-dom';
import ListingsTable from '../../../components/Table';
import { Stack, HStack, VStack, Box, useDisclosure, IconButton, Icon, Button, Heading, Text, Spinner, Menu, MenuButton, MenuList, MenuItem, Tooltip } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaEllipsisVertical, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Modal from '../../../components/Modal';
import Breadcrumb from '../../../components/Breadcrumb';
import { EmptySearch } from '../../../components/EmptySearch';
import AddButton from '../../../components/AddButton';
import { activateUser, deactivateUser } from '../../../api/users';
import { getCustomers } from '../../../api/customers';
import { useToastHook } from '../../../hooks/useToast';
import { requireAuth } from '../../../hooks/useAuth';
import { isUnauthorized } from '../../../utils';
import FetchError from '../../../components/FetchError';

const columns = [
    { id: 'S/N', header: 'S/N' },
    { id: 'firstName', header: 'First Name' },
    { id: 'lastName', header: 'Last Name' },
    { id: 'email', header: 'Email' },
    { id: 'phoneNumber', header: 'Phone' },
    { id: 'role', header: 'Role' },
    { id: 'active', header: 'Status' },
    { id: 'actions', header: '' },
];

export async function loader({ request }) {
    await requireAuth(request);
    const response = await getCustomers();

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode
        };
    }

    const data = response.map(customer => ({
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phoneNumber,
        email: customer.user.email,
        role: customer.user.role,
        category: customer.user.category,
        active: customer.user.active
    }));

    return data;
}

const Customers = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [toastState, setToastState] = useToastHook();
    const customers = useLoaderData();
    const [error, setError] = useState({
        error: customers.error ?? '',
        message: customers.message ?? '',
        statusCode: customers.statusCode ?? ''
    });
    const [customersFilter, setCustomersFilter] = useState(customers ?? null);
    const [buttonState, setButtonState] = useState('');
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Customers', ref: '/customers' },
    ];

    useEffect(() => {
        if (error.error || error.message) {
            setToastState({
                title: error.error,
                description: error.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setTimeout(() => {
                isUnauthorized(error, navigate, pathname);
            }, 6000);
        }
    }, []);

    const filterData = (key) => {
        setButtonState(key);
        setCustomersFilter(() => {
            const data = customers.filter(customer => {
                if (key === 'active') return customer.active === true
                if (key === 'inactive') return customer.active === false
                if (key === null) return customer
            });

            return data;
        });
    }

    return (
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Customers</Heading>
                    <AddButton navigateTo='/users/create' state={{ entity: 'customers' }}>Add Customer</AddButton>
                </HStack>
                <Box marginTop='8'>
                    {
                        customers.length === 0 ?
                            <EmptySearch headers={['S/N', 'FIRST NAME', 'LAST NAME', 'EMAIL', 'PHONE', 'ROLE', 'STATUS']} type='staff' /> :
                            <ListingsTable data={customersFilter} columns={columns} fileName='customers-data.csv' filterData={filterData} buttonState={buttonState} render={(customer) => (
                                <ActionButtons customer={customer} />
                            )} />
                    }
                </Box>
            </Stack>
    )
}

const ActionButtons = ({ customer }) => {
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

        // if (response.unAuthorize) {
        //     sessionStorage.removeItem('customer');
        //     navigate(`/?message=${response.message}. Please log in to continue&redirectTo=${pathname}`);
        // }

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

        // if (response.unAuthorize) {
        //     sessionStorage.removeItem('user');
        //     navigate(`/?message=${response.message}. Please log in to continue&redirectTo=${pathname}`);
        // }

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

        // if (response.unAuthorize) {
        //     sessionStorage.removeItem('user');
        //     navigate(`/?message=${response.message}. Please log in to continue&redirectTo=${pathname}`);
        // }

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

export default Customers;