import { Box, Heading, Button, Flex, Stack, Link, Icon } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import bgImage from '../assets/fish-hero3.png';
import bgImage2 from '../assets/inventoryImg.webp';
import { BiError } from "react-icons/bi";
import LoginInput from "../components/form/LoginInput";
import PasswordInput from "../components/form/PasswordInput";
import Logo from "../components/Logo";
import { authenticate } from "../api/user";
import { useToastHook } from "../hooks/useToast";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm();
    const [toastState, setToastState] = useToastHook();
    const { login } = useAuth();
    const navigate = useNavigate();

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

        login(response);
        navigate('/dashboard', { replace: true });
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
            boxShadow='lg'
        >
            <Flex w={['90%', '90%', '80%', '80%', '60%']} borderRadius='md' overflow='hidden'>
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