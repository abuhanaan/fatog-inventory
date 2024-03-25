import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, Card, CardBody, useDisclosure } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Modal from '../../components/Modal';
import { requireAuth } from '../../hooks/useAuth';
import { getUser, deleteUser, activateUser, deactivateUser } from '../../api/users';
import { useToastHook } from '../../hooks/useToast';
import { isUnauthorized } from '../../utils';
import { getStaffData } from '../../api/staff';
import useAuth from '../../hooks/useAuth';
import UserField from '../../components/UserField';
import FetchError from '../../components/FetchError';
import Back from '../../components/Back';

export async function loader({ request }) {
    await requireAuth(request);
    const staff = await getStaffData(request);

    // console.log(staff);

    if (staff.error || staff.message) {
        return {
            error: staff.error,
            message: staff.message,
            statusCode: staff.statusCode
        };
    }

    return staff;
}

const ProfileView = () => {
    const staff = useLoaderData();
    const { user, orders, sales, stocks } = staff;
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: staff.error ?? '',
        message: staff.message ?? '',
        statusCode: staff.statusCode ?? '',
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
                isUnauthorized(error, navigate, pathname);
            }, 6000);
        }
    }, []);

    const getUserInfoArray = (user, staff) => {
        const userData = {
            firstName: staff.firstName,
            lastName: staff.lastName,
            email: user.email,
            phoneNumber: staff.phoneNumber,
            gender: staff.gender,
            role: user.role,
            category: user.category,
            userId: user.userId,
            status: user.active
        };
        const userInfoArray = [];
        const fieldKeys = ['firstName', 'lastName', 'email', 'gender', 'phoneNumber', 'category', 'role', 'status'];

        for (const [key, value] of Object.entries(userData)) {
            const find = fieldKeys.find(fieldKey => fieldKey === key);

            if (find) {
                if (key === 'status') {
                    userInfoArray.push({ key, value: value ? 'Active' : 'Inactive' })
                }
                userInfoArray.push({ key, value });
            }
        }

        return userInfoArray;
    }

    return (
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Stack direction={{base: 'column', sm: 'row'}} justifyContent='space-between' alignItems='center'>
                    <Breadcrumb linkList={breadcrumbData} />
                    <Back />
                </Stack>
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
                                    getUserInfoArray(user, staff).map((field, index) => (
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