import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useLoaderData, Link as RouterLink } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, IconButton, Button, Icon, Heading, Tooltip } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { MdOutlineCreateNewFolder } from "react-icons/md";

import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import AddButton from '../../components/AddButton';
import { getStocks } from '../../api/stocks';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';

const columns = [
    { id: 'S/N', header: 'S/N' },
    { id: 'staff', header: 'Staff' },
    { id: 'totalAmount', header: 'Amount(₦)' },
    { id: 'totalNoOfBags', header: 'No. of Bags' },
    { id: 'totalWeight', header: 'Total Weight(kg)' },
    { id: 'date', header: 'Date' },
    { id: 'actions', header: '' },
];
const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Stocks', ref: '/stocks' },
];

export async function loader({ request }) {
    await requireAuth(request);
    const stocks = await getStocks();

    if (stocks.error || stocks.message) {
        return {
            error: stocks.error,
            message: stocks.message,
            statusCode: stocks.statusCode,
        }
    }

    const data = stocks.map(stock => {
        return {
            id: stock.id,
            totalAmount: stock.totalAmount,
            totalNoOfBags: stock.totalNoOfBags,
            totalWeight: stock.totalWeight,
            staff: (stock.staff.firstName && stock.staff.lastName) ? `${stock.staff.firstName} ${stock.staff.lastName}` : 'N/A',
            date: stock.createdAt,
        }
    });

    return data;
}

const Stocks = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const stocks = useLoaderData();
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: stocks.error ?? '',
        message: stocks.message ?? '',
        statusCode: stocks.statusCode ?? ''
    });

    useEffect(() => {
        if (error.error || error.message) {
            setToastState({
                title: error.error,
                description: error.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setTimeout(() => {
                isUnauthorized(error, navigate, pathname);
            }, 6000);
        }
    }, []);

    return (
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Stocks</Heading>
                    <Button as={RouterLink} to='create' colorScheme='blue' leftIcon={<MdOutlineCreateNewFolder />}>Create Stock</Button>
                </HStack>
                <Box marginTop='8'>
                    {
                        stocks?.length === 0 ?
                            <EmptySearch headers={['S/N', 'AMOUNT', 'NO. OF BAGS', 'WEIGHT', 'STAFF', 'DATE']} type='stock' /> :
                            <ListingsTable data={stocks} columns={columns} fileName='stocks-data.csv' render={(stock) => (
                                <ActionButtons stock={stock} />
                            )} />
                    }
                </Box>
            </Stack>
    )
}

const ActionButtons = ({ stock }) => {
    const navigate = useNavigate();

    function viewStock(e) {
        e.preventDefault();

        const dataStockId = e.currentTarget.getAttribute('data-stock-id');
        navigate(`./${dataStockId}`);
    }

    return (
        <HStack spacing='1'>
            <Tooltip hasArrow label='Preview stock' placement='bottom' borderRadius='md'>
                <IconButton icon={<IoEyeOutline />} colorScheme='purple' size='sm' data-stock-id={stock.id} onClick={viewStock} />
            </Tooltip>
        </HStack>
    )
}

export default Stocks;