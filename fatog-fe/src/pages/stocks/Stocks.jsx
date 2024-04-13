import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useLoaderData, Link as RouterLink } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, Text, Box, IconButton, Button, Icon, Heading, Tooltip } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { getMonetaryValue, formatDate } from '../../utils';
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import AddButton from '../../components/AddButton';
import { getStocks } from '../../api/stocks';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';

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

const ActionButtons = ({ row }) => {
    const stock = row.original;
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

const columns = [
    {
        id: 'S/N',
        header: 'S/N',
        // size: 225,
        cell: props => <Text>{props.row.index + 1}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'staff',
        header: 'Staff',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'totalAmount',
        header: 'Amount',
        // size: 225,
        cell: (props) => <Text>{getMonetaryValue(props.getValue())}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'totalNoOfBags',
        header: 'No. of Bags',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'totalWeight',
        header: 'Total Weight (kg)',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'date',
        header: 'Date',
        // size: 225,
        cell: (props) => <Text>{formatDate(props.getValue())}</Text>,
        enableGlobalFilter: false,
        filterFn: 'includesString'
    },
    {
        id: 'actions',
        header: '',
        // size: 225,
        cell: ActionButtons,
        enableGlobalFilter: false,
    },
];

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
                            <ListingsTable data={stocks} columns={columns} fileName='stocks-data.csv' />
                    }
                </Box>
            </Stack>
    )
}

export default Stocks;