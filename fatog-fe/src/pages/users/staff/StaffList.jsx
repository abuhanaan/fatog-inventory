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
import { getStaff } from '../../../api/staff';
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
    const response = await getStaff();

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode,
        };
    }

    const filtered = response.filter(staff => staff.staffId !== null);

    const data = filtered.map(staff => ({
        id: staff.staffId,
        firstName: staff.firstName,
        lastName: staff.lastName,
        phone: staff.phoneNumber,
        email: staff.user.email,
        role: staff.user.role,
        category: staff.user.category,
        active: staff.user.active
    }));

    return data;
}

const StaffList = () => {
    const [toastState, setToastState] = useToastHook();
    const staff = useLoaderData();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [error, setError] = useState({
        error: staff.error ?? '',
        message: staff.message ?? '',
        statusCode: staff.statusCode ?? '',
    });
    const [staffFilter, setStaffFilter] = useState(staff ?? null);
    const [buttonState, setButtonState] = useState('');
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Staff', ref: '/staff' },
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
                isUnauthorized(error, navigate);
            }, 6000);
        }
    }, []);

    const filterData = (key) => {
        setButtonState(key);
        setStaffFilter(() => {
            const data = staff.filter(staff => {
                if (key === 'active') return staff.active === true
                if (key === 'inactive') return staff.active === false
                if (key === null) return staff
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
                    <Heading fontSize='3xl' color='blue.700'>Staff List</Heading>
                    <AddButton navigateTo='/users/create' state={{ entity: 'staff' }}>Add Staff</AddButton>
                </HStack>
                <Box marginTop='8'>
                    {
                        staff.length === 0 ?
                            <EmptySearch headers={['S/N', 'FIRST NAME', 'LAST NAME', 'EMAIL', 'PHONE', 'ROLE', 'STATUS']} type='staff' /> :
                            <ListingsTable data={staffFilter} columns={columns} fileName='staff-data.csv' filterData={filterData} buttonState={buttonState} render={(staff) => (
                                <ActionButtons staff={staff} />
                            )} />
                    }
                </Box>
            </Stack>
    )
}

const ActionButtons = ({ staff }) => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const { pathname } = useLocation();
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    function viewStaff(e) {
        e.preventDefault();

        const dataStaffId = e.currentTarget.getAttribute('data-staff-id');
        navigate(`./${dataStaffId}`);
    }

    async function staffDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE staff endpoint
        const response = await deleteStaff(staff.id);

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

    const staffActivate = async (e) => {
        e.preventDefault();

        setIsActivating(true);

        const staffId = e.currentTarget.getAttribute('data-staff-id');

        const response = await activateUser(staffId);

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
            description: 'Staff activated successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsActivating(false);

        setTimeout(() => {
            navigate(`/staff`);
        }, 6000);
    }

    const staffDeactivate = async (e) => {
        e.preventDefault();

        setIsActivating(true);

        const staffId = e.currentTarget.getAttribute('data-staff-id');

        const response = await deactivateUser(staffId);

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
            description: 'Staff deactivated successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsActivating(false);

        setTimeout(() => {
            navigate(`/staff`);
        }, 6000);
    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button
                onClick={staffDelete}
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
                    <MenuItem icon={<IoEyeOutline />} data-staff-id={staff.id} onClick={viewStaff}>
                        Preview
                    </MenuItem>
                    <MenuItem as={Link} to='/users/create' icon={<MdOutlineEdit />} state={{ currentUser: staff, entity: 'staff' }}>
                        Edit Staff
                    </MenuItem>
                    {
                        staff.active ?
                            <MenuItem
                                as={Button}
                                icon={<FaUserXmark />}
                                data-staff-id={staff.id}
                                onClick={staffDeactivate}
                                size='sm'
                                _hover={{ bg: 'gray.100' }}
                                borderRadius='0'
                                fontWeight='normal'
                                closeOnSelect={false}
                                aria-label='Deactivate staff'
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
                                Deactivate Staff
                            </MenuItem> :
                            <MenuItem
                                as={Button}
                                icon={<FaUserCheck />}
                                size='sm'
                                data-staff-id={staff.id}
                                onClick={staffActivate}
                                _hover={{ bg: 'gray.100' }}
                                borderRadius='0'
                                fontWeight='normal'
                                closeOnSelect={false}
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
                            >
                                Activate Staff
                            </MenuItem>
                    }
                    {/* <MenuItem icon={<MdDeleteOutline />} data-staff-id={staff.id} onClick={onOpen}>
                        Delete Staff
                    </MenuItem> */}
                </MenuList>
            </Menu>

            <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Staff'>
                <Box>
                    <Text>Proceed to delete staff?</Text>
                </Box>
            </Modal>
        </>
    )
}

export default StaffList;