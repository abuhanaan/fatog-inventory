import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, Card, CardBody, useDisclosure } from '@chakra-ui/react';
import Breadcrumb from '../../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Modal from '../../../components/Modal';
import UserField from '../../../components/UserField';
import Tabs from '../../../components/Tabs';
import SalesTable from '../../../components/SalesTable';
import StocksTable from '../../../components/StocksTable';
import OrdersTable from '../../../components/OrdersTable';
import { requireAuth } from '../../../hooks/useAuth';
import { getStaffData } from '../../../api/staff';
import { deleteUser, activateUser, deactivateUser } from '../../../api/users';
import { useToastHook } from '../../../hooks/useToast';

export async function loader({ request }) {
    await requireAuth(request);
    const response = await getStaffData(request);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message
        };
    }

    // console.log(response);

    const data = {
        id: response.staffId,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        phone: response.phoneNumber,
        email: response.user.email,
        category: response.user.category,
        role: response.user.role,
        active: response.user.active,
        orders: response.orders,
        sales: response.sales,
        stocks: response.stocks
    }

    return data;
}

const StaffView = () => {
    const navigate = useNavigate();
    const staff = useLoaderData();
    const { sales, stocks, orders } = staff;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [error, setError] = useState({
        error: staff.error ?? '',
        message: staff.message ?? ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Staff List', ref: '/staff' },
        { name: 'Staff', ref: `/staff/${staff.id}` },
    ];

    const stocksColumns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'totalAmount', header: 'Total Amount' },
        { id: 'totalNoOfBags', header: 'No. of Bags' },
        { id: 'totalWeight', header: 'Total Weight' },
        { id: 'date', header: 'Date' },
        { id: 'actions', header: '' },
    ];

    const tabTitles = ['Bio Data', 'Sales', 'Stocks', 'Orders'];
    const tabPanels = [
        <GeneralInfo staff={staff} />,
        <SalesTable sales={sales} />,
        <StocksTable stocks={stocks} columns={stocksColumns} path='/stocks' />,
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
        }
    }, []);

    async function userDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE user endpoint
        const response = await deleteUser(staff.id);

        if (response.unAuthorize) {
            sessionStorage.removeItem('user');
            navigate(`/?message=${response.message}. Please log in to continue&redirectTo=${pathname}`);
        }

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsDeleting(false);
            closeModalRef.current.click();

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Staff deleted successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsDeleting(false);
        closeModalRef.current.click();

        setTimeout(() => {
            navigate(`/staff`);
        }, 6000);
    }

    const userActivate = async (e) => {
        e.preventDefault();

        setIsActivating(true);

        const staffId = e.currentTarget.getAttribute('data-staff-id');

        const response = await activateUser(staffId);

        if (response.unAuthorize) {
            sessionStorage.removeItem('user');
            navigate(`/?message=${response.message}. Please log in to continue&redirectTo=${pathname}`);
        }

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsActivating(false);

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Staff activated successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsActivating(false);

        setTimeout(() => {
            navigate(`/staff/${staffId}`);
        }, 6000);
    }

    const userDeactivate = async (e) => {
        e.preventDefault();

        setIsActivating(true);

        const staffId = e.currentTarget.getAttribute('data-staff-id');

        const response = await deactivateUser(staffId);

        if (response.unAuthorize) {
            sessionStorage.removeItem('user');
            navigate(`/?message=${response.message}. Please log in to continue&redirectTo=${pathname}`);
        }

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsActivating(false);

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Staff deactivated successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsActivating(false);

        setTimeout(() => {
            navigate(`/staff/${staffId}`);
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
            <VStack h='30rem' justifyContent='center'>
                <Heading>{error.error}</Heading>
                <Text>{error.message}</Text>
                <Button colorScheme='blue' onClick={() => window.location.reload()} mt='6'>Refresh</Button>
            </VStack> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize={{ base: '2xl', md: '3xl' }} color='blue.700'>{(staff.firstName && staff.lastName) ? `${staff.firstName} ${staff.lastName}` : 'Staff'}</Heading>
                    <HStack spacing='2'>
                        <Tooltip hasArrow label='Create staff' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/users/create' icon={<HiOutlinePlus />} colorScheme='blue' />
                        </Tooltip>

                        <Tooltip hasArrow label='Edit staff' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/users/create' state={{ currentUser: staff, entity: 'staff' }} icon={<MdOutlineEdit />} colorScheme='orange' />
                        </Tooltip>

                        <Tooltip hasArrow label='Delete staff' placement='bottom' borderRadius='md'>
                            <IconButton icon={<MdDeleteOutline />} size={{ base: 'sm', md: 'md' }} data-staff-id={staff.id} onClick={onOpen} colorScheme='red' />
                        </Tooltip>

                        {
                            staff.active ?
                                <Tooltip hasArrow label='Deactivate staff' placement='left'>
                                    <IconButton
                                        icon={<FaUserXmark />}
                                        size={{ base: 'sm', md: 'md' }}
                                        data-staff-id={staff.id}
                                        onClick={userDeactivate}
                                        colorScheme='red'
                                        aria-label='Deactivate staff'
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
                                <Tooltip hasArrow label='Activate staff' placement='left' borderRadius='md'>
                                    <IconButton
                                        icon={<FaUserCheck />}
                                        size={{ base: 'sm', md: 'md' }}
                                        data-staff-id={staff.id}
                                        onClick={userActivate}
                                        colorScheme='green'
                                        aria-label='Activate staff'
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

                    <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Staff'>
                        <Box>
                            <Text>Proceed to delete staff?</Text>
                        </Box>
                    </Modal>
                </HStack>
                <Box marginTop='8'>
                    <Tabs titles={tabTitles} panels={tabPanels} variant='enclosed' />
                </Box >
            </Stack >
    )
}

const GeneralInfo = ({ staff }) => {
    const getUserArray = (staff) => {
        const userArray = [];
        for (const [key, value] of Object.entries(staff)) {
            if (key === 'orders' || key === 'sales' || key === 'stocks' || key === 'id') {
                continue;
            }

            if (key === 'active') {
                userArray.push({ key, value: value ? 'Active' : 'Inactive' });
                continue;
            }
            userArray.push({ key, value });
        }

        return userArray;
    }

    return (
        <Card variant='elevated'>
            <CardBody>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                    {
                        getUserArray(staff).map((field, index) => (
                            <UserField key={index} field={field} />
                        ))
                    }
                </SimpleGrid>
            </CardBody>
        </Card>
    )
}

export default StaffView;