import { useRef, useState, useEffect, createContext } from 'react';
import { useNavigate, useNavigation, useSearchParams, Link, useLoaderData, useLocation } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, useDisclosure, IconButton, Icon, Button, Heading, Text, Spinner, Tooltip } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Modal from '../../components/Modal';
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import AddButton from '../../components/AddButton';
import { deleteUser, getUsers, activateUser, deactivateUser } from '../../api/users';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';

const columns = [
    { id: 'S/N', header: 'S/N' },
    { id: 'email', header: 'Email' },
    { id: 'role', header: 'Role' },
    { id: 'category', header: 'Category' },
    { id: 'active', header: 'Status' },
    { id: 'actions', header: '' },
];

export async function loader({ request }) {
    await requireAuth(request);
    const response = await getUsers(request);

    return response;
}

export const FilterContext = createContext({});

const Users = () => {
    const [toastState, setToastState] = useToastHook();
    const users = useLoaderData();
    const [error, setError] = useState({
        error: '',
        message: ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Users', ref: '/users' },
    ];

    const [searchParams, setSearchParams] = useSearchParams();

    const userStatusFilter = searchParams.get('status');
    const filteredUsers = !userStatusFilter ? users : users.filter(user => {
        const userStatus = user.active ? 'active' : 'inactive';
        return userStatus === userStatusFilter;
    });

    const setFilterParams = (key, value) => {
        setSearchParams(prevParams => {
            value === null ? prevParams.delete(key) : prevParams.set(key, value);
            return prevParams;
        })
    }

    useEffect(() => {
        if (users.error || users.message) {
            setToastState({
                title: users.error,
                description: users.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setError({
                error: users.error,
                message: users.message
            });
        }
    }, []);

    return (
        error.error ?
            <VStack>
                <Box>{error.error}</Box>
                <Box>{error.message}</Box>
            </VStack> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Users</Heading>
                    <AddButton navigateTo='create'>Add User</AddButton>
                </HStack>
                <Box marginTop='8'>
                    {
                        users?.length === 0 ?
                            <EmptySearch headers={['S/N', 'EMAIL', 'ROLE', 'CATEGORY', 'STATUS']} type='product' /> :
                            <FilterContext.Provider value={{ userStatusFilter, setFilterParams }}>
                                <ListingsTable data={filteredUsers} columns={columns} fileName='users-data.csv' render={(user) => (
                                    <ActionButtons user={user} />
                                )} />
                            </FilterContext.Provider>
                    }
                </Box>
            </Stack>
    )
}

const ActionButtons = ({ user }) => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const { pathname } = useLocation();
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    function viewUser(e) {
        e.preventDefault();

        const dataUserId = e.currentTarget.getAttribute('data-user-id');
        navigate(`./${dataUserId}`);
    }

    async function userDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE user endpoint
        const response = await deleteUser(user.id);

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
            description: 'User deleted successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsDeleting(false);
        closeModalRef.current.click();

        setTimeout(() => {
            navigate(`/users`);
        }, 6000);

    }

    const userActivate = async (e) => {
        e.preventDefault();

        setIsActivating(true);

        const userId = e.currentTarget.getAttribute('data-user-id');

        const response = await activateUser(userId);

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
            description: 'User activated successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsActivating(false);

        setTimeout(() => {
            navigate(`/users`);
        }, 6000);
    }

    const userDeactivate = async (e) => {
        e.preventDefault();

        setIsActivating(true);

        const userId = e.currentTarget.getAttribute('data-user-id');

        const response = await deactivateUser(userId);

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
            description: 'User deactivated successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsActivating(false);

        setTimeout(() => {
            navigate(`/users`);
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
        <>
            <HStack spacing='1'>
                <Tooltip hasArrow label='Preview user' placement='bottom' borderRadius='md'>
                    <IconButton icon={<IoEyeOutline />} colorScheme='purple' size='sm' data-user-id={user.id} onClick={viewUser} />
                </Tooltip>

                <Tooltip hasArrow label='Edit user' placement='bottom' borderRadius='md'>
                    <IconButton as={Link} to='create' icon={<MdOutlineEdit />} colorScheme='blue' size='sm' state={{ currentUser: user }} />
                </Tooltip>

                <Tooltip hasArrow label='Delete user' placement='bottom' borderRadius='md'>
                    <IconButton icon={<MdDeleteOutline />} colorScheme='red' size='sm' data-user-id={user.id} onClick={onOpen} />
                </Tooltip>

                {
                    user.active ?
                        <Tooltip hasArrow label='Deactivate user' placement='left'>
                            <IconButton
                                icon={<FaUserXmark />}
                                size='sm'
                                data-user-id={user.id}
                                onClick={userDeactivate}
                                colorScheme='red'
                                aria-label='Deactivate user'
                                isLoading={isActivating ? true : false}
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
                        <Tooltip hasArrow label='Activate user' placement='left' borderRadius='md'>
                            <IconButton
                                icon={<FaUserCheck />}
                                size='sm'
                                data-user-id={user.id}
                                onClick={userActivate}
                                colorScheme='green'
                                aria-label='Activate user'
                                isLoading={isActivating ? true : false}
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

            <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete User'>
                <Box>
                    <Text>Proceed to delete user?</Text>
                </Box>
            </Modal>
        </>
    )
}

export default Users;