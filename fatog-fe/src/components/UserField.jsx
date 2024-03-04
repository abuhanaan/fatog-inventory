import {Box, Heading, Text} from '@chakra-ui/react';

const UserField = ({ field }) => {
    return (
        <Box as='fieldset' boxSize={{ base: 'full', lg: 'full' }} p='3' borderWidth='1px' borderColor='gray.300' borderRadius='md'>
            <Heading as='legend' px='1' fontSize='sm' fontWeight='semibold' textTransform='capitalize'>{field.key}</Heading>
            <Text>{field.value ? field.value : 'N/A'}</Text>
        </Box>
    )
}

export default UserField;