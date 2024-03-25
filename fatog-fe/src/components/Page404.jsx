import React from 'react';
import { VStack, Link, Text, Heading, Button } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { GoHome } from "react-icons/go";


const Page404 = () => {
    const navigate = useNavigate();

    const goHome = () => {
        const user = JSON.parse(sessionStorage.getItem('user')) || false;

        if (user) {
            navigate('/dashboard')
        } else {
            navigate('/', { replace: true });
        }
    }

    return (
        <VStack minH='100vh' spacing='3' justifyContent='center'>
            <Heading>404 Error!</Heading>
            <Text>The page you requested for does not exist.</Text>
            <Button colorScheme='blue' leftIcon={<GoHome />} onClick={goHome} mt='6'>Return to homepage</Button>
        </VStack>
    )
}

export default Page404;