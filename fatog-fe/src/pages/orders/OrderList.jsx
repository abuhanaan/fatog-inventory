import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, Card, CardBody, useDisclosure } from '@chakra-ui/react';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import UserField from '../../components/UserField';
import Tabs from '../../components/Tabs';
import OrdersTable from '../../components/OrdersTable';
import PaymentsTable from '../../components/PaymentsTable';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { getOrderList } from '../../api/orders';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import Back from '../../components/Back';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getOrderList(params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode,
        };
    }

    // console.log(response);

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
        payments: response.payments,
        // customer: response.customer,
    };

    return data;
}

const OrderList = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const order = useLoaderData();
    const { orderList, staff, payments } = order;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: order.error ?? '',
        message: order.message ?? '',
        statusCode: order.statusCode ?? '',
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
        outstandingPayment: order.outstandingPayment,
        date: order.date,
        note: order.note,
    }

    const orderListColumns = [
        { id: 'S/N', header: 'S/N' },
        // { id: 'productName', header: 'Product' },
        { id: 'pricePerBag', header: 'Price per Bag' },
        { id: 'noOfBags', header: 'No. of Bags' },
        { id: 'totalAmount', header: 'Total Amount' },
        { id: 'totalWeight', header: 'Total Weight' },
        { id: 'actions', header: '' },
    ];

    const orderListData = orderList.map(orderItem => ({
        ...orderItem,
        orderId: order.id,
        // productName: orderItem.product.name
    }));

    // console.log(orderListData);

    const paymentsData = payments.map(payment => ({
        amountPaid: payment.amountPaid,
        outstandingPayment: payment.outstandingAfter,
        previousPaymentTotal: payment.prevPaymentSum,
        date: payment.date
    }));

    const paymentColumns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'amountPaid', header: 'Amount Paid' },
        { id: 'outstandingPayment', header: 'Outstanding Payment' },
        { id: 'previousPaymentTotal', header: 'Prev. Payment Total' },
        { id: 'date', header: 'Date' },
    ];

    const tabTitles = ['Overview', 'Order List', 'Payments'];
    const tabPanels = [
        <GeneralInfo info={basicOrderInfo} />,
        <OrdersTable orders={orderListData} columns={orderListColumns} path={`/orders/${order.id}/orderlist`} />,
        <PaymentsTable payments={paymentsData} columns={paymentColumns} />,
    ];

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
                <Stack direction={{base: 'column', sm: 'row'}} justifyContent='space-between' alignItems='center'>
                    <Breadcrumb linkList={breadcrumbData} />
                    <Back />
                </Stack>
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