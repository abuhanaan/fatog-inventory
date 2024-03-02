import React from 'react';
import { VStack, Link, Text, Heading } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Page404 = () => {
    return (
        <VStack minH='100vh' spacing='3' justifyContent='center'>
            <Heading>404 Error!</Heading>
            <Text>The page you requested for does not exist.</Text>
            <Link
                as={RouterLink}
                to='..'
                bg='#2B6CB0'
                color='white'
                padding='4'
                borderRadius='md'
                textDecoration='none'
            >
                Return to home page
            </Link>
        </VStack>
    )
}

export default Page404;