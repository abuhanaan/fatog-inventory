import { useRef, useState } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { useForm } from 'react-hook-form';
import { Stack, HStack, Flex, Box, Icon, IconButton, Spinner, Button, Heading, FormLabel, Text } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import SelectElement from '../../components/form/SelectElement';
import { changePassword } from '../../api/users';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import useAuth from '../../hooks/useAuth';
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import { MdOutlineSyncLock } from "react-icons/md";

const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Profile', ref: '/profile' },
    { name: 'Password Update', ref: '/profile/change-password' },
];

const ChangePassword = () => {
    const navigate = useNavigate();
    const passwordRef = useRef(null);
    const { user } = useAuth();
    const confirmPasswordRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm();

    const passwordChange = async (data) => {
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            setToastState({
                title: 'Password Mismatch',
                description: 'New password and Confirm password must match.',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
        }

        const passwordData = {
            password: data.password
        };

        try {
            const response = await changePassword(passwordData);

            if (response.unAuthorize) {
                sessionStorage.removeItem('user');
                navigate(`/?message=${response.message}. Please log in to continue&redirectTo=${pathname}`);
            }

            if (response.error) {
                setToastState({
                    title: response.error,
                    description: response.message,
                    status: 'error',
                    icon: <Icon as={BiError} />
                });

                return response.error;
            }

            setToastState({
                title: 'Success!',
                description: 'Password changed successfully',
                status: 'success',
                icon: <Icon as={FaRegThumbsUp} />
            });

            setTimeout(() => {
                navigate(`/profile`);
            }, 6000);

        } catch (error) {
            return error;
        }
    };

    return (
        <Stack spacing='6'>
            <Box>
                <Breadcrumb linkList={breadcrumbData} />
            </Box>
            <HStack justifyContent='space-between'>
                <Heading fontSize='3xl' color='blue.700'>Update Password</Heading>
            </HStack>

            <form onSubmit={handleSubmit(passwordChange)}>
                <Stack spacing='4' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                    <TextInput name='password' label='New Password' control={control} type='password' fieldRef={passwordRef} />

                    <TextInput name='confirm-password' label='Confirm New Password' control={control} type='password' fieldRef={confirmPasswordRef} />

                    <Button
                        type='submit'
                        colorScheme='blue'
                        isLoading={isSubmitting ? true : false}
                        loadingText='Updating...'
                        spinnerPlacement='end'
                        mt='4'
                        spinner={<Spinner
                            thickness='4px'
                            speed='0.5s'
                            emptyColor='gray.200'
                            color='blue.300'
                            size='md'
                        />}
                    >
                        Change Password
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}

export default ChangePassword;