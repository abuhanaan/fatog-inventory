import React from 'react';
import { VStack, Text, Heading, UnorderedList, ListItem, Button } from '@chakra-ui/react';

const Error = () => {
    const refresh = () => {
        window.location.reload();
    };

    return (
        <VStack minH='100vh' spacing='3' justifyContent='center'>
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
            <Button colorScheme='blue' onClick={refresh} mt='6'>Refresh</Button>
        </VStack>
    )
}

export default Error;