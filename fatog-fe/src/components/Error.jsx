import { useRouteError, useNavigate } from 'react-router-dom';
import { VStack, HStack, Text, Heading, UnorderedList, ListItem, Button } from '@chakra-ui/react';
import { GoHome } from "react-icons/go";

const Error = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    const refresh = () => {
        window.location.reload();
    };

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
            <Heading>{error.statusCode}</Heading>
            <Text>{error.message}</Text>
            <Heading>This site can't be reached!</Heading>
            <Text>The site's server IP address could not not be found.</Text>
            <UnorderedList>
                <Text mb='2'>Try the following:</Text>
                <ListItem>Check your network connection.</ListItem>
                <ListItem>Check proxy, firewall, and DNS configuration.</ListItem>
                <ListItem>Run your OS Network Diagnostics.</ListItem>
                <ListItem>Refresh the page and retry previous action.</ListItem>
                <ListItem>Consult the developer for technical resolution if the issue persists.</ListItem>
            </UnorderedList>
            <HStack spacing='4'>
                <Button colorScheme='blue' onClick={refresh} mt='6'>Refresh</Button>
                <Button colorScheme='blue' leftIcon={<GoHome />} onClick={goHome} mt='6'>Return to homepage</Button>
            </HStack>
        </VStack>
    )
}

export default Error;