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
    { id: 'product', header: 'Product' },
    { id: 'manufacturer', header: 'Manufacturer' },
    { id: 'staff', header: 'Staff' },
    { id: 'customer', header: 'Customer' },
    { id: 'orderAmount', header: 'Order Amount(₦)' },
    { id: 'orderQty', header: 'Order Quantity' },
    { id: 'paymentStatus', header: 'Payment Status' },
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

    const data = histories.map(history => {
        return {
            id: history.id,
            productName: history.inventory.product.name,
            manufacturer: history.inventory.product.manufacturer.brandName,
            customer: `${history.orderItem.order.customer.firstName} ${history.orderItem.order.customer.lastName}`,
            staff: `${history.orderItem.order.staff.firstName} ${history.orderItem.order.staff.lastName}`,
            orderAmount: history.orderItem.order.totalAmount,
            noOfBags: history.orderItem.order.totalNoOfBags,
            paymentStatus: history.orderItem.order.paymentStatus,
            deliveryStatus: history.orderItem.order.deliveryStatus,
            date: history.createdAt,
        }
    });

    return data;
}

const Histories = () => {
    const histories = useLoaderData();
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: '',
        message: ''
    });
    console.log(histories);

    useEffect(() => {
        if (histories.error || histories.message) {
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
        error.error ?
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