import { useState, useEffect } from 'react';
import { useNavigate, useLoaderData, Link as RouterLink } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, IconButton, Button, Icon, Heading, Text, Tooltip, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { FaEllipsisVertical, FaMoneyBill } from "react-icons/fa6";
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import { getOrders } from '../../api/orders';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';

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
    { name: 'Orders', ref: '/orders' },
];

export async function loader({ request }) {
    await requireAuth(request);
    const orders = await getOrders(request);

    if (orders.error || orders.message) {
        return {
            error: orders.error,
            message: orders.message
        }
    }

    const data = orders.map(order => {
        return {
            id: order.id,
            refId: order.refId,
            totalAmount: order.totalAmount,
            totalNoOfBags: order.totalNoOfBags,
            totalWeight: order.totalWeight,
            staff: (order.staff.firstName && order.staff.lastName) ? `${order.staff.firstName} ${order.staff.lastName}` : 'N/A',
            // customer: (order.customer.firstName && order.customer.lastName) ? `${order.customer.firstName} ${order.customer.lastName}` : 'N/A',
            phoneNumber: order.phoneNumber,
            ShippingAddress: order.ShippingAddress,
            paymentStatus: order.paymentStatus,
            deliveryStatus: order.deliveryStatus,
            amountPaid: order.amountPaid,
            outstandingPayment: order.outStandingPayment,
            date: order.createdAt,
            invoice: order.invoice,
        }
    });

    return data;
}

const Orders = () => {
    const orders = useLoaderData();
    const { invoice } = orders;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: orders.error ?? '',
        message: orders.message ?? ''
    });

    // console.log(orders);

    useEffect(() => {
        if (orders.error || orders.message) {
            setToastState({
                title: orders.error,
                description: orders.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });
        }
    }, []);

    return (
        error.error || error.message ?
            <VStack h='30rem' justifyContent='center'>
                <Heading>{error.error}</Heading>
                <Text>{error.message}</Text>
                <Button colorScheme='blue' onClick={() => window.location.reload()} mt='6'>Refresh</Button>
            </VStack> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Orders</Heading>
                    <Button as={RouterLink} to='create' colorScheme='blue' leftIcon={<MdOutlineCreateNewFolder />}>Create Order</Button>
                </HStack>
                <Box marginTop='8'>
                    {
                        orders?.length === 0 ?
                            <EmptySearch headers={['S/N', 'AMOUNT', 'NO. OF BAGS', 'CUSTOMER', 'STAFF', 'AMOUNT PAID', 'DELIVERY STATUS', 'PAYMENT STATUS', 'DATE']} type='order' /> :
                            <ListingsTable data={orders} columns={columns} fileName='orders-data.csv' render={(order) => (
                                <ActionButtons order={order} />
                            )} />
                    }
                </Box>
            </Stack>
    )
}

const ActionButtons = ({ order }) => {
    const navigate = useNavigate();

    function viewOrder(e) {
        e.preventDefault();

        const dataOrderId = e.currentTarget.getAttribute('data-order-id');
        navigate(`./${dataOrderId}`);
    }

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<FaEllipsisVertical />}
                variant='unstyled'
            />
            <MenuList py='0'>
                <MenuItem icon={<IoEyeOutline />} data-order-id={order.id} onClick={viewOrder}>
                    Preview
                </MenuItem>

                {
                    !order.invoice ?
                    <MenuItem as={RouterLink} to={`/sales/create/${order.id}`} icon={<FaMoneyBill />}>
                        Create Sales
                    </MenuItem> :
                    null
                }
            </MenuList>
        </Menu>
    )
}

export default Orders;