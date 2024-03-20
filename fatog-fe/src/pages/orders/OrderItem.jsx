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
import PaymentsTable from '../../components/PaymentsTable';
import StocksTable from '../../components/StocksTable';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { getOrderItem } from '../../api/orders';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getOrderItem(request, params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message
        };
    }

    const data = {
        id: response.id,
        noOfBags: response.noOfBags,
        pricePerBag: response.pricePerBag,
        totalWeight: response.totalWeight,
        totalAmount: response.totalPrice,
        date: response.createdAt,
        product: response.product,
        order: response.order,
        payments: response.payments,
    };

    return data;
}

const OrderItem = () => {
    const navigate = useNavigate();
    const orderItem = useLoaderData();
    const { product, order, payments } = orderItem;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: orderItem.error ?? '',
        message: orderItem.message ?? ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Orders', ref: '/orders' },
        { name: 'Order List', ref: `/orders/${order.id}` },
        { name: 'Order Item', ref: `/orders/${order.id}/orderlist/${orderItem.id}` },
    ];

    const basicOrderItemInfo = {
        product: product.name,
        noOfBags: orderItem.noOfBags,
        pricePerBag: orderItem.pricePerBag,
        totalWeight: orderItem.totalWeight,
        totalAmount: orderItem.totalAmount,
        date: orderItem.date,
    };

    const productInfo = {
        productName: product.name,
        pricePerBag: product.pricePerBag,
        type: product.type,
        size: product.size,
        weight: product.weight,
    };

    const orderInfo = {
        totalNoOfBags: order.totalNoOfBags,
        totalAmount: order.totalAmount,
        totalWeight: order.totalWeight,
        amountPaid: order.amountPaid,
        outstandingPayment: order.outStandingPayment,
        customerPhoneNumber: order.phoneNumber,
        shippingAddress: order.shippingAddress,
    };

    const paymentsData = payments.map(payment => ({
        amountPaid: payment.amountPaid,
        outstandingPayment: payment.outStandingPayment,
        date: payment.createdAt
    }));

    const paymentColumns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'amountPaid', header: 'Amount Paid' },
        { id: 'outstandingPayment', header: 'Outstanding Payment' },
        { id: 'date', header: 'Date' },
    ];

    const tabTitles = ['Overview', 'Product Details', 'Order Details', 'Payments'];
    const tabPanels = [
        <TabPanel info={basicOrderItemInfo} />,
        <TabPanel info={productInfo} />,
        <TabPanel info={orderInfo} />,
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
                    <Heading fontSize='3xl' color='blue.700'>Order Item</Heading>

                    <HStack spacing='2'>
                        <Tooltip hasArrow label='Edit stock item' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to={`/orders/${order.id}/orderlist/${orderItem.id}/edit`} state={{ orderItem: orderItem }} icon={<MdOutlineEdit />} colorScheme='orange' />
                        </Tooltip>
                    </HStack>
                </HStack>
                <Box marginTop='8'>
                    <Tabs titles={tabTitles} panels={tabPanels} variant='enclosed' />
                </Box>
            </Stack>
    )
}

const TabPanel = ({ info }) => {
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

export default OrderItem;