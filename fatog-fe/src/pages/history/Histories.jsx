import { useState, useEffect } from 'react';
import { useNavigate, useLoaderData, useLocation } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, IconButton, Button, Icon, Heading, Text, Tooltip } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import { getHistories } from '../../api/history';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import { formatDate } from '../../utils';

const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'History', ref: '/history' },
];

export async function loader({ request }) {
    await requireAuth(request);
    const histories = await getHistories();

    if (histories.error || histories.message) {
        return {
            error: histories.error,
            message: histories.message,
            statusCode: histories.statusCode
        }
    }

    const data = histories.map(history => ({
        id: history.id,
        operationStatus: history.decrement ? 'Decrement' : 'Increment',
        operationType: history.orderItemId ? 'Order' : 'Stock',
        effectQuantity: history.effectQuantity,
        remainderAfter: history.remainderAfter,
        remainderBefore: history.remainderBefore,
        orderItemId: history.orderItemId,
        note: history.note,
        date: history.createdAt,
        inventory: history.inventory,
    }));

    return data;
}

const ActionButtons = ({ row }) => {
    const history = row.original;
    const navigate = useNavigate();

    function viewHistory(e) {
        e.preventDefault();

        const dataHistoryId = e.currentTarget.getAttribute('data-history-id');
        navigate(`./${dataHistoryId}`);
    }

    return (
        <HStack spacing='1'>
            <Tooltip hasArrow label='Preview history' placement='bottom' borderRadius='md'>
                <IconButton icon={<IoEyeOutline />} colorScheme='purple' size='sm' data-history-id={history.id} onClick={viewHistory} />
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
        accessorKey: 'remainderBefore',
        header: 'Remainder Before',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: false,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'effectQuantity',
        header: 'Effect Qty',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'remainderAfter',
        header: 'Remainder After',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'operationStatus',
        header: 'Status',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'operationType',
        header: 'Type',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
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

const Histories = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const histories = useLoaderData();
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: histories.error ?? '',
        message: histories.message ?? '',
        statusCode: histories.statusCode ?? ''
    });

    useEffect(() => {
        if (histories.error || histories.message) {
            setToastState({
                title: histories.error,
                description: histories.message,
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
                    <Heading fontSize='3xl' color='blue.700'>History</Heading>
                </HStack>
                <Box marginTop='2'>
                    {
                        histories?.length === 0 ?
                            <EmptySearch headers={['S/N', 'PRODUCT', 'MANUFACTURER', 'STAFF', 'CUSTOMER', 'AMOUNT', 'QTY', 'PAYMENT STATUS', 'DELIVERY STATUS', 'DATE']} type='history' /> :
                            <ListingsTable data={histories} columns={columns} fileName='histories-data.csv' />
                    }
                </Box>
            </Stack>
    )
}

export default Histories;