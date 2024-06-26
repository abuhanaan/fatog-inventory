import { useState } from "react";
import { Box, Heading, Text, Button, Flex, Stack, Link, Icon } from "@chakra-ui/react";
import { useNavigate, useLoaderData, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import bgImage from '../assets/fish-hero3.png';
import bgImage2 from '../assets/inventoryImg.webp';
import { BiError } from "react-icons/bi";
import LoginInput from "../components/form/LoginInput";
import PasswordInput from "../components/form/PasswordInput";
import Logo from "../components/Logo";
import { authenticate } from "../api/users";
import { useToastHook } from "../hooks/useToast";
import useAuth from "../hooks/useAuth";

export async function loader({ request }) {
    const error = new URL(request.url).searchParams.get('message')
    return { error, request };
}

const Home = () => {
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm();
    const [toastState, setToastState] = useToastHook();
    const { login } = useAuth();
    const navigate = useNavigate();
    const { errorMessage, request } = useLoaderData();
    const { state } = useLocation();
    const [loginError, setLoginError] = useState('')
    const message = (state && state.message) || errorMessage || loginError;
    const redirectTo = state && state.redirectTo;

    const submit = async (userData) => {
        const formData = new FormData();

        Object.entries(userData).forEach(([key, value]) => formData.append(key, value));

        // TO-DO: Call authentication api
        const response = await authenticate(userData);

        if (!response.accessToken) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
        }

        if (response.user.category === 'customer') {
            setToastState({
                title: 'Unauthorized!',
                description: 'You are not authorized to login here.',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setLoginError('You are not authorized to login here.');

            return;
        }

        login(response);
        const to = redirectTo || new URL(request.url).searchParams.get('redirectTo') || '/dashboard';
        // const to = '/dashboard';
        navigate(to, { replace: true });
    };

    return (
        <Flex
            fontSize='3xl'
            w='100%'
            justifyContent='center'
            alignItems='center'
            minHeight='100vh'
            bgImage={`linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImage})`}
            backgroundRepeat='no-repeat'
            backgroundSize='cover'
        >
            <Flex w={['90%', '90%', '80%', '80%', '60%']} borderRadius='md' overflow='hidden' boxShadow='lg'>
                <Box
                    display={['none', 'none', 'block']} w='55%'
                    bgImage={bgImage2}
                    backgroundRepeat='no-repeat'
                    backgroundSize='cover'
                >
                </Box>

                <Stack
                    w={['100%', '100%', '45%']}
                    bg='whitesmoke'
                    spacing='6'
                    p='6'
                >
                    <Logo />

                    {
                        (message) &&
                        <Text fontSize='md' fontWeight='medium' px='3' py='2' bg='red.100' color='red.600'>{message}</Text>
                    }

                    <Heading fontSize='2xl' >Login</Heading>

                    <form onSubmit={handleSubmit(submit)}>

                        <Stack spacing='6'>
                            <LoginInput
                                name='email'
                                control={control}
                                label='Email/Username'
                            />

                            <PasswordInput
                                name='password'
                                control={control}
                                label='Password'
                            />

                            <Button type="submit" borderWidth='2px' borderColor='gray.500'>
                                {
                                    isSubmitting ? 'Logging in...' : 'Login'
                                }
                            </Button>

                            <Link fontSize='sm' alignSelf='end'>Forgot Password?</Link>
                        </Stack>
                    </form>
                </Stack>
            </Flex>
        </Flex>
    )
}

export default Home;