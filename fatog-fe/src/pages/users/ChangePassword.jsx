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
import { isUnauthorized } from '../../utils';
import Back from '../../components/Back';

const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Profile', ref: '/profile' },
    { name: 'Password Update', ref: '/profile/change-password' },
];

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,16}$/;

const ChangePassword = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user } = useAuth();
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [showPasswordHelper, setShowPasswordHelper] = useState(false);
    const [showConfirmHelper, setShowConfirmHelper] = useState(false);
    const [toastState, setToastState] = useToastHook();
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm();

    const passwordChange = async (data) => {
        const passwordValidation = PWD_REGEX.test(data.password);
        setShowConfirmHelper(false);
        setShowPasswordHelper(false);

        if (!passwordValidation) {
            setShowPasswordHelper(true);
            setToastState({
                title: 'Invalid Password!',
                description: 'Password must include lowercase and uppercase letters, number, and special character.',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
        }

        if (data.password !== data.confirmPassword) {
            setShowConfirmHelper(true);
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

            if (response.error) {
                setToastState({
                    title: response.error,
                    description: response.message,
                    status: 'error',
                    icon: <Icon as={BiError} />
                });

                setTimeout(() => {
                    isUnauthorized(response, navigate, pathname);
                }, 6000);

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
            <Stack direction={{ base: 'column', sm: 'row' }} justifyContent='space-between' alignItems='center'>
                <Breadcrumb linkList={breadcrumbData} />
                <Back />
            </Stack>
            <HStack justifyContent='space-between'>
                <Heading fontSize='3xl' color='blue.700'>Update Password</Heading>
            </HStack>

            <form onSubmit={handleSubmit(passwordChange)}>
                <Stack spacing='4' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                    <TextInput
                        name='password'
                        label='New Password'
                        control={control}
                        type='password'
                        fieldRef={passwordRef}
                        defaultVal=''
                        helperText={`
                        8 to 16 characters.
                        Must include lowercase and uppercase letters, number, and special character.`}
                        showHelperText={showPasswordHelper}
                    />

                    <TextInput
                        name='confirmPassword'
                        label='Confirm New Password'
                        control={control}
                        type='password'
                        fieldRef={confirmPasswordRef}
                        defaultVal=''
                        helperText={`Must match the password field above.`}
                        showHelperText={showConfirmHelper}
                    />

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