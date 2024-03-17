import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, Card, CardBody, useDisclosure } from '@chakra-ui/react';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import UserField from '../../components/UserField';
import Tabs from '../../components/Tabs';
import OrdersTable from '../../components/OrdersTable';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { getOrderList } from '../../api/orders';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getOrderList(request, params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message
        };
    }

    console.log(response);

    const data = {
        id: response.id,
        refId: response.refId,
        totalNoOfBags: response.totalNoOfBags,
        totalWeight: response.totalWeight,
        totalAmount: response.totalAmount,
        customerPhoneNumber: response.phoneNumber,
        shippingAddress: response.shippingAddress,
        paymentStatus: response.paymentStatus,
        amountPaid: response.amountPaid,
        outstandingPayment: response.outStandingPayment,
        deliveryStatus: response.deliveryStatus,
        note: response.note,
        date: response.createdAt,
        orderList: response.orderLists,
        staffId: response.staffId,
        customerId: response.customerId,
        staff: response.staff,
        // customer: response.customer,

    };

    return data;
}

const OrderList = () => {
    const navigate = useNavigate();
    const order = useLoaderData();
    const { orderList, staff, customer } = order;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: order.error ?? '',
        message: order.message ?? ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Orders', ref: '/orders' },
        { name: 'Order List', ref: `/orders/${order.id}` },
    ];

    const basicOrderInfo = {
        staff: (staff.firstName && staff.lastName) ? `${staff.firstName} ${staff.lastName}` : 'N/A',
        // customer: (customer.firstName && customer.lastName) ? `${customer.firstName} ${customer.lastName}` : 'N/A',
        totalAmount: order.totalAmount,
        totalNoOfBags: order.totalNoOfBags,
        totalWeight: order.totalWeight,
        customerPhoneNumber: order.customerPhoneNumber,
        shippingAddress: order.shippingAddress,
        amountPaid: order.amountPaid,
        outstandingPayment: order.outstandingPayment,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus,
        note: order.note,
        date: order.date
    }

    const orderListColumns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'pricePerBag', header: 'Price per Bag' },
        { id: 'noOfBags', header: 'No. of Bags' },
        { id: 'totalPrice', header: 'Total Amount' },
        { id: 'totalWeight', header: 'Total Weight' },
        { id: 'actions', header: '' },
    ];

    const orderListData = orderList.map(prev => ({
        ...prev,
        orderId: order.id
    }));

    const tabTitles = ['Overview', 'Order List'];
    const tabPanels = [
        <GeneralInfo info={basicOrderInfo} />,
        <OrdersTable orders={orderListData} columns={orderListColumns} path={`/orders/${order.id}/orderlist`} />,
    ];

    useEffect(() => {
        if (error.error || error.message) {
            setToastState({
                title: error.error,
                description: error.message,
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
                    <Heading fontSize='3xl' color='blue.700'>Order</Heading>
                </HStack>
                <Box marginTop='8'>
                    <Tabs titles={tabTitles} panels={tabPanels} variant='enclosed' />
                </Box>
            </Stack>
    )
}

const GeneralInfo = ({ info }) => {
    const getInfoArray = (info) => {
        const infoArray = [];
        for (const [key, value] of Object.entries(info)) {
            infoArray.push({ key, value });
        }

        return infoArray;
    }

    return (
        <Card variant='elevated'>
            <CardBody>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                    {
                        getInfoArray(info).map((field, index) => (
                            <UserField key={index} field={field} />
                        ))
                    }
                </SimpleGrid>
            </CardBody>
        </Card>
    )
}

export default OrderList;