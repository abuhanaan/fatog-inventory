import fatogLogo from '../assets/fatog-logo.png';
import { VStack, HStack, Image, Heading, Text } from '@chakra-ui/react';

const Logo = () => {
    return (
        <HStack spacing='' alignSelf='center'>
            <Image src={fatogLogo} boxSize='100px' objectFit='cover' alt="FATOG Logo" />
            <VStack fontWeight='bold' spacing=''>
                <Heading fontSize='2xl'>FATOG</Heading>
                <Text fontSize='10px'>Fishery Enterprises</Text>
            </VStack>
        </HStack>
    )
}

export default Logo;