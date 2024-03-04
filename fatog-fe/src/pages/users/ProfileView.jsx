import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, Card, CardBody, useDisclosure } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Modal from '../../components/Modal';
import { requireAuth } from '../../hooks/useAuth';
import { getUser, deleteUser, activateUser, deactivateUser } from '../../api/users';
import { useToastHook } from '../../hooks/useToast';
import { getStaffData } from '../../api/staff';
import useAuth from '../../hooks/useAuth';
import UserField from '../../components/UserField';

export async function loader({ params, request }) {
    await requireAuth(request);
    const { user } = JSON.parse(sessionStorage.getItem('user'));
    const userId = user.userId;
    const staff = await getStaffData(request, userId);

    return staff;
}

const ProfileView = () => {
    const { user } = useAuth();
    const currentUser = user.user;
    const staff = useLoaderData();
    const navigate = useNavigate();
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: '',
        message: ''
    });

    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Profile', ref: `/profile` },
    ];

    useEffect(() => {
        if (staff.error || staff.message) {
            setToastState({
                title: staff.error,
                description: staff.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setTimeout(() => {
                navigate('/users');
            }, 6000);

            setError({
                error: staff.error,
                message: staff.message
            });
        }
    }, []);

    const getUserInfoArray = (user, staff) => {
        const userData = {
            firstName: staff.firstName,
            lastName: staff.lastName,
            gender: staff.gender,
            phoneNumber: staff.phoneNumber,
            role: user.role,
            category: user.category,
            userId: user.userId,
            status: user.status
        };
        const userInfoArray = [];
        const fieldKeys = ['userId', 'firstName', 'lastName', 'gender', 'phoneNumber', 'category', 'role', 'status'];

        for (const [key, value] of Object.entries(userData)) {
            const find = fieldKeys.find(fieldKey => fieldKey === key);

            if (find) {
                userInfoArray.push({ key, value });
            }
        }

        return userInfoArray;
    }

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
                    <HStack>
                    <Tooltip hasArrow label='Edit Profile' placement='bottom' borderRadius='md'>
                        <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/profile/update' state={{ staff }} icon={<LiaUserEditSolid />} colorScheme='orange' />
                    </Tooltip>

                    <Tooltip hasArrow label='Change Password' placement='bottom' borderRadius='md'>
                        <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/profile/change-password' icon={<MdOutlineEdit />} colorScheme='purple' />
                    </Tooltip>

                    </HStack>
                </HStack>

                <Box marginTop='8'>
                    <Card variant='elevated'>
                        <CardBody>
                            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                                {
                                    getUserInfoArray(currentUser, staff).map((field, index) => (
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

export default ProfileView