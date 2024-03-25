import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, Card, CardBody, useDisclosure } from '@chakra-ui/react';
import Breadcrumb from '../../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Modal from '../../../components/Modal';
import UserField from '../../../components/UserField';
import Tabs from '../../../components/Tabs';
import OrdersTable from '../../../components/OrdersTable';
import { requireAuth } from '../../../hooks/useAuth';
import { getCustomer } from '../../../api/customers';
import { deleteUser, activateUser, deactivateUser } from '../../../api/users';
import { useToastHook } from '../../../hooks/useToast';
import { isUnauthorized } from '../../../utils';
import FetchError from '../../../components/FetchError';

export async function loader({ request }) {
    await requireAuth(request);
    const response = await getCustomer();

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode
        };
    }

    const data = {
        id: response.customerId,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        phone: response.phoneNumber,
        email: response.user.email,
        category: response.user.category,
        role: response.user.role,
        active: response.user.active,
        orders: response.orders,
    }

    return data;
}

const Customer = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const customer = useLoaderData();
    const { orders } = customer;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [error, setError] = useState({
        error: customer.error ?? '',
        message: customer.message ?? '',
        statusCode: customer.statusCode ?? ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Customers', ref: '/customers' },
        { name: 'Customer', ref: `/customers/${customer.id}` },
    ];

    const tabTitles = ['Bio Data', 'Orders'];
    const tabPanels = [
        <GeneralInfo customer={customer} />,
        <OrdersTable orders={orders} />
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

    async function userDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE user endpoint
        const response = await deleteUser(customer.id);

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

    const userActivate = async (e) => {
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
            navigate(`/customers/${customerId}`);
        }, 6000);
    }

    const userDeactivate = async (e) => {
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
            navigate(`/customers/${customerId}`);
        }, 6000);
    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button
                onClick={userDelete}
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
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize={{ base: '2xl', md: '3xl' }} color='blue.700'>{(customer.firstName && customer.lastName) ? `${customer.firstName} ${customer.lastName}` : 'Customer'}</Heading>
                    <HStack spacing='2'>
                        <Tooltip hasArrow label='Create customer' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/users/create' icon={<HiOutlinePlus />} colorScheme='blue' />
                        </Tooltip>

                        <Tooltip hasArrow label='Edit customer' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/users/create' state={{ currentUser: customer, entity: 'customer' }} icon={<MdOutlineEdit />} colorScheme='orange' />
                        </Tooltip>

                        <Tooltip hasArrow label='Delete customer' placement='bottom' borderRadius='md'>
                            <IconButton icon={<MdDeleteOutline />} size={{ base: 'sm', md: 'md' }} data-customer-id={customer.id} onClick={onOpen} colorScheme='red' />
                        </Tooltip>

                        {
                            customer.active ?
                                <Tooltip hasArrow label='Deactivate staff' placement='left'>
                                    <IconButton
                                        icon={<FaUserXmark />}
                                        size={{ base: 'sm', md: 'md' }}
                                        data-customer-id={customer.id}
                                        onClick={userDeactivate}
                                        colorScheme='red'
                                        aria-label='Deactivate customer'
                                        isLoading={isActivating ? true : false}
                                        loadingText='Deactivating...'
                                        spinnerPlacement='end'
                                        spinner={<Spinner
                                            thickness='4px'
                                            speed='0.5s'
                                            emptyColor='gray.200'
                                            color='blue.300'
                                            size='md'
                                        />}
                                    />
                                </Tooltip> :
                                <Tooltip hasArrow label='Activate customer' placement='left' borderRadius='md'>
                                    <IconButton
                                        icon={<FaUserCheck />}
                                        size={{ base: 'sm', md: 'md' }}
                                        data-customer-id={customer.id}
                                        onClick={userActivate}
                                        colorScheme='green'
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
                                    />
                                </Tooltip>
                        }
                    </HStack>

                    <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Customer'>
                        <Box>
                            <Text>Proceed to delete customer?</Text>
                        </Box>
                    </Modal>
                </HStack>
                <Box marginTop='8'>
                    <Tabs titles={tabTitles} panels={tabPanels} variant='enclosed' />
                </Box >
            </Stack >
    )
}

const GeneralInfo = ({ customer }) => {
    const getCustomerArray = (customer) => {
        const customerArray = [];
        for (const [key, value] of Object.entries(customer)) {
            if (key === 'orders' || key === 'id') {
                continue;
            }

            if (key === 'active') {
                customerArray.push({ key, value: value ? 'Active' : 'Inactive' });
                continue;
            }
            customerArray.push({ key, value });
        }

        return customerArray;
    }

    return (
        <Card variant='elevated'>
            <CardBody>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                    {
                        getCustomerArray(customer).map((field, index) => (
                            <UserField key={index} field={field} />
                        ))
                    }
                </SimpleGrid>
            </CardBody>
        </Card>
    )
}

export default Customer;