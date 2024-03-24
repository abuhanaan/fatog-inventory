import { useRef, useState } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { SizeInput } from '../../components/form/TextInput';
import { useForm } from 'react-hook-form';
import { Stack, HStack, Flex, Box, Icon, IconButton, Spinner, Button, Heading, FormLabel, Text } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import SelectElement from '../../components/form/SelectElement';
import { createUser, updateUser } from '../../api/users';
import { getUser } from '../../api/users';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { isUnauthorized } from '../../utils';
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import { MdOutlineSyncLock } from "react-icons/md";

const userRoleOptions = ['ADMIN', 'CASHIER', 'CEO', 'CUSTOMER', 'DEALER', 'MANAGER'];
const userCategoryOptions = ['staff', 'customer'];

const UserForm = () => {
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const currentUser = state && state.currentUser;
    const entity = state && state.entity;
    const submitBtnRef = useRef(null);
    const emailRef = useRef(null);
    const roleRef = useRef(null);
    const categoryRef = useRef(null);
    const [password, setPassword] = useState('');
    const [toastState, setToastState] = useToastHook();
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
        setValue,
    } = useForm();

    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: `${entity.slice(0, 1).toUpperCase()}${entity.slice(1)}`, ref: `/${entity}` },
        { name: 'Staff Form', ref: '/users/create' },
    ];

    const submitUser = async (data) => {
        if (!password) {
            setToastState({
                title: 'Password Required',
                description: `Click generate password button to ${currentUser ? 'update' : 'create'} this user.`,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
        }
        
        if (!categoryRef.current.value) {
            setToastState({
                title: 'Category Required',
                description: `Select a category to ${currentUser ? 'update' : 'create'} this user`,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
        }


        const userData = {
            ...data,
            email: data.email,
            role: roleRef.current.value.toLowerCase(),
            category: categoryRef.current.value.toLowerCase(),
            active: true,
            password: password
        };

        const buttonIntent = submitBtnRef.current.getAttribute('data-intent');

        if (buttonIntent === 'add') {
            // TODO: Consume create user API endpoint
            try {
                const response = await createUser(userData);

                if (response.error || response.message) {
                    setToastState({
                        title: response.error,
                        description: response.message,
                        status: 'error',
                        icon: <Icon as={BiError} />
                    });

                    setTimeout(() => {
                        isUnauthorized(response, navigate);
                    }, 6000);

                    return response.error;
                }

                setToastState({
                    title: 'Success!',
                    description: 'User created successfully',
                    status: 'success',
                    icon: <Icon as={FaRegThumbsUp} />
                });

                setTimeout(() => {
                    navigate(`/${entity}`);
                }, 6000);

            } catch (error) {
                return error;
            }
        }

        if (buttonIntent === 'update') {
            const userId = currentUser.id;
            // TODO: Consume user update API endpoint
            try {
                const response = await updateUser(userId, userData);

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

                    setTimeout(() => {
                        isUnauthorized(response, navigate);
                    }, 6000);

                    return response.error;
                }

                setToastState({
                    title: 'Success!',
                    description: 'User updated successfully',
                    status: 'success',
                    icon: <Icon as={FaRegThumbsUp} />
                });

                setTimeout(() => {
                    navigate(`/${entity}`);
                }, 6000);

            } catch (error) {
                return error;
            }
        }
    };

    const generatePassword = (e) => {
        e.preventDefault();

        if (!emailRef.current.value || !roleRef.current.value) {
            setToastState({
                title: 'Error!',
                description: 'Email and role fields are required to generate password.',
                status: 'error',
                icon: <Icon as={BiError} />
            });
            return;
        }

        const emailFirst6Char = emailRef.current.value.slice(0, 6).toLowerCase();
        const role = roleRef.current.value.toLowerCase();

        setPassword(`${emailFirst6Char}_${role}`);
    };

    return (
        <Stack spacing='6'>
            <Box>
                <Breadcrumb linkList={breadcrumbData} />
            </Box>
            <HStack justifyContent='space-between'>
                <Heading fontSize='3xl' color='blue.700'>{currentUser ? 'Update User' : 'Create User'}</Heading>
            </HStack>
            <form onSubmit={handleSubmit(submitUser)}>
                <Stack spacing='4' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                    <TextInput name='email' label='Email' control={control} type='text' fieldRef={emailRef} defaultVal={currentUser ? currentUser.email : ''} />

                    <SelectElement data={userRoleOptions} label='Role' fieldRef={roleRef} defaultVal={currentUser ? currentUser.role.toUpperCase() : ''} placeholder='Select Role' />

                    <SelectElement data={userCategoryOptions} label='Category' fieldRef={categoryRef} defaultVal={currentUser ? currentUser.category : ''} placeholder='Select Category' />

                    <Stack spacing='0'>
                        <FormLabel>Password</FormLabel>
                        <HStack spacing='0' alignItems='stretch'>
                            <Text borderWidth='1px' flex='1' p='2' borderStartRadius='md' bg='gray.100'>{password}</Text>
                            <IconButton
                                variant='solid'
                                colorScheme='teal'
                                aria-label='Generate Password'
                                size='md'
                                borderRadius='none'
                                borderEndRadius='md'
                                icon={<MdOutlineSyncLock />}
                                onClick={generatePassword}
                            />
                        </HStack>
                    </Stack>

                    <Button
                        type='submit'
                        data-intent={currentUser ? 'update' : 'add'}
                        colorScheme='blue'
                        isLoading={isSubmitting ? true : false}
                        loadingText='Submitting...'
                        spinnerPlacement='end'
                        ref={submitBtnRef}
                        spinner={<Spinner
                            thickness='4px'
                            speed='0.5s'
                            emptyColor='gray.200'
                            color='blue.300'
                            size='md'
                        />}
                    >
                        {
                            currentUser ?
                                'Update User' :
                                'Create User'
                        }
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}

export default UserForm;