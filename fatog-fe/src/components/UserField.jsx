import { Box, Heading, Text } from '@chakra-ui/react';
import { getMonetaryValue } from '../pages/stocks/StockCreate';
import { formatDate } from './Table';

export const splitFieldName = (str) => {
    return str.split(/(?=[A-Z])/).join(' ');
}

const UserField = ({ field }) => {
    const { key, value } = field;

    let outputValue;

    if ((key === 'totalAmount' || key === 'pricePerBag' || key === 'purchaseAmount' || key === 'purchasePricePerBag' || key === 'currentSellingPricePerBag' || key === 'outstandingPayment' || key === 'amountPaid') && (value)) {
        outputValue = getMonetaryValue(value)
    } else if (key === 'date') {
        outputValue = formatDate(value)
    } else if (!value) {
        if (key === 'amountPaid') {
            outputValue = getMonetaryValue(value);
        } else {
            outputValue = 'N/A';
        }
    } else {
        outputValue = value
    }

    return (
        <Box as='fieldset' boxSize={{ base: 'full', lg: 'full' }} p='3' borderWidth='1px' borderColor='gray.300' borderRadius='md'>
            <Heading as='legend' px='1' fontSize='sm' fontWeight='semibold' textTransform='capitalize'>{splitFieldName(key)}</Heading>
            
            <Text>{outputValue}</Text>
        </Box>
    )
}

export default UserField;