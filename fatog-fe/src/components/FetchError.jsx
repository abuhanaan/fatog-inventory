import { VStack, HStack, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const FetchError = ({ error }) => {
    const navigate = useNavigate();

    return (
        <VStack h='30rem' justifyContent='center'>
            <Heading fontSize='6xl'>{error.statusCode}</Heading>
            <Text fontSize='4xl' fontWeight='medium'>{error.error}</Text>
            <Text>{error.message}</Text>

            <HStack spacing='3'>
                <Button colorScheme='blue' onClick={() => window.location.reload()} mt='6'>Refresh</Button>
                <Button colorScheme='blue' onClick={() => navigate(-1)} mt='6'>Back</Button>
            </HStack>
        </VStack>
    )
}

export default FetchError;