import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, Card, CardBody, useDisclosure } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Modal from '../../components/Modal';
import { requireAuth } from '../../hooks/useAuth';
import { getUser, deleteUser, activateUser, deactivateUser } from '../../api/users';
import { useToastHook } from '../../hooks/useToast';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getUser(request, params.id);

    return response;
}

const UserView = () => {
    const navigate = useNavigate();
    const user = useLoaderData();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [error, setError] = useState({
        error: '',
        message: ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Users', ref: '/users' },
        { name: 'User', ref: `/users/${user.id}` },
    ];

    useEffect(() => {
        if (user.error || user.message) {
            setToastState({
                title: user.error,
                description: user.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setTimeout(() => {
                navigate('/users');
            }, 6000);

            setError({
                error: user.error,
                message: user.message
            });
        }
    }, []);

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
            navigate(`/users/${userId}`);
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
            navigate(`/users/${userId}`);
        }, 6000);
    }

    const getUserArray = (user) => {
        const userArray = [];
        for(const [key, value] of Object.entries(user)) {
            if (key === 'createdAt' || key === 'updatedAt') {
                continue;
            }

            if (key === 'active') {
                userArray.push({key, value: value ? 'Active' : 'Inactive'});
                continue;
            }
            userArray.push({key, value});
        }

        return userArray;
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
                    <Heading fontSize={{ base: '2xl', md: '3xl' }} color='blue.700'>User</Heading>
                    <HStack spacing='2'>
                        <Tooltip hasArrow label='Create user' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/users/create' icon={<HiOutlinePlus />} colorScheme='blue' />
                        </Tooltip>

                        <Tooltip hasArrow label='Edit user' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/users/create' state={{ currentUser: user }} icon={<MdOutlineEdit />} colorScheme='orange' />
                        </Tooltip>

                        <Tooltip hasArrow label='Delete user' placement='bottom' borderRadius='md'>
                            <IconButton icon={<MdDeleteOutline />} size={{ base: 'sm', md: 'md' }} data-user-id={user.id} onClick={onOpen} colorScheme='red' />
                        </Tooltip>

                        {
                            user.active ?
                                <Tooltip hasArrow label='Deactivate user' placement='left'>
                                    <IconButton
                                        icon={<FaUserXmark />}
                                        size={{ base: 'sm', md: 'md' }}
                                        data-user-id={user.id}
                                        onClick={userDeactivate}
                                        colorScheme='red'
                                        aria-label='Deactivate user'
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
                                <Tooltip hasArrow label='Activate user' placement='left' borderRadius='md'>
                                    <IconButton
                                        icon={<FaUserCheck />}
                                        size={{ base: 'sm', md: 'md' }}
                                        data-user-id={user.id}
                                        onClick={userActivate}
                                        colorScheme='green'
                                        aria-label='Activate user'
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

                    <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete User'>
                        <Box>
                            <Text>Proceed to delete user?</Text>
                        </Box>
                    </Modal>
                </HStack>
                <Box marginTop='8'>
                    <Card variant='elevated'>
                        <CardBody>
                            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                                {
                                    getUserArray(user).map((field, index) => (
                                        <UserField key={index} field={field} />
                                    ))
                                }
                            </SimpleGrid>
                        </CardBody>
                    </Card>
                </Box >
            </Stack >
    )
}

export const UserField = ({ field }) => {
    return (
        <Box as='fieldset' boxSize={{ base: 'full', lg: 'full' }} p='3' borderWidth='1px' borderColor='gray.300' borderRadius='md'>
            <Heading as='legend' px='1' fontSize='sm' fontWeight='semibold' textTransform='capitalize'>{field.key}</Heading>
            <Text>{field.value}</Text>
        </Box>
    )
}


export default UserView;