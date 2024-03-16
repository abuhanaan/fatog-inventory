import { Box, Heading, Text } from '@chakra-ui/react';
import { getMonetaryValue } from '../pages/stocks/StockCreate';

export const splitFieldName = (str) => {
    return str.split(/(?=[A-Z])/).join(' ');
}

const UserField = ({ field }) => {
    return (
        <Box as='fieldset' boxSize={{ base: 'full', lg: 'full' }} p='3' borderWidth='1px' borderColor='gray.300' borderRadius='md'>
            <Heading as='legend' px='1' fontSize='sm' fontWeight='semibold' textTransform='capitalize'>{splitFieldName(field.key)}</Heading>
            <Text>
                {
                    (field.key === 'totalAmount' || field.key === 'pricePerBag') && (field.value) ?
                    getMonetaryValue(field.value) : field.value ? 
                    field.value : 'N/A'
                }
            </Text>
        </Box>
    )
}

export default UserField;