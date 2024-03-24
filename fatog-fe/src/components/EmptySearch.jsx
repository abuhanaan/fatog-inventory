import emptySearchImg from '../assets/empty-img.png';
import { HStack, VStack, Text, Heading, Spacer, Image, Box } from '@chakra-ui/react';

export const EmptySearch = ({ headers, type }) => {
    return (
        <>
            {
                headers &&
                <HStack display={{ base: 'none', md: 'flex' }} marginBottom='6' justifyContent='space-between'>
                    {
                        headers.map((header, index) => (
                            <Heading key={index} fontSize='sm' fontWeight='semibold'>{header}</Heading>
                        ))
                    }
                </HStack>
            }

            <VStack spacing='8'>
                <Box>
                    <Image src={emptySearchImg} boxSize='200px' alt="Woman with a big lens in search of something" />
                </Box>

                <VStack spacing='2'>
                    <Heading fontSize='3xl' fontWeight='semibold'>OOPS! It's Empty</Heading>
                    <Text fontSize='xl'>Looks like you haven't added any {type} yet...!!!</Text>
                </VStack>
            </VStack>
        </>
    )
};