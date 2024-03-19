import { useState, useEffect } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, IconButton, Icon, Heading, Tooltip } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import { getHistories } from '../../api/history';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';

const columns = [
    { id: 'S/N', header: 'S/N' },
    { id: 'remainderBefore', header: 'Remainder Before' },
    { id: 'effectQuantity', header: 'Effect Qty' },
    { id: 'remainderAfter', header: 'Remainder After' },
    { id: 'operationStatus', header: 'Status' },
    { id: 'operationType', header: 'Type' },
    { id: 'date', header: 'Date' },
    { id: 'actions', header: '' },
];
const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'History', ref: '/history' },
];

export async function loader({ request }) {
    await requireAuth(request);
    const histories = await getHistories(request);

    if (histories.error || histories.message) {
        return {
            error: histories.error,
            message: histories.message
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

const Histories = () => {
    const histories = useLoaderData();
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: '',
        message: ''
    });

    useEffect(() => {
        if (histories.error || histories.message) {
            console.log('UseEffect If condition');
            setToastState({
                title: histories.error,
                description: histories.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setError({
                error: histories.error,
                message: histories.message
            });
        }
    }, []);

    return (
        error.error || error.message ?
            <VStack>
                <Box>{error.error}</Box>
                <Box>{error.message}</Box>
            </VStack> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>History</Heading>
                </HStack>
                <Box marginTop='8'>
                    {
                        histories?.length === 0 ?
                            <EmptySearch headers={['S/N', 'PRODUCT', 'MANUFACTURER', 'STAFF', 'CUSTOMER', 'AMOUNT', 'QTY', 'PAYMENT STATUS', 'DELIVERY STATUS', 'DATE']} type='history' /> :
                            <ListingsTable data={histories} columns={columns} fileName='histories-data.csv' render={(history) => (
                                <ActionButtons history={history} />
                            )} />
                    }
                </Box>
            </Stack>
    )
}

const ActionButtons = ({ history }) => {
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

export default Histories;