import { VStack, HStack, Heading, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { TbRefresh } from "react-icons/tb";

const FetchError = ({ error }) => {
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
        <VStack h='30rem' justifyContent='center'>
            <Heading fontSize='6xl'>{error.statusCode}</Heading>
            <Text fontSize='4xl' fontWeight='medium'>{error.error}</Text>
            <Text>{error.message}</Text>

            {
                error.statusCode !== 401 &&
                <HStack spacing='3'>
                    <Button colorScheme='blue' leftIcon={<TbRefresh />} onClick={() => window.location.reload()} mt='6'>Refresh</Button>
                    <Button colorScheme='blue' leftIcon={<FaArrowLeftLong />} onClick={() => navigate(-1)} mt='6'>Back</Button>
                    <Button colorScheme='blue' leftIcon={<GoHome />} onClick={goHome} mt='6'>Return to homepage</Button>
                </HStack>
            }
        </VStack>
    )
}

export default FetchError;