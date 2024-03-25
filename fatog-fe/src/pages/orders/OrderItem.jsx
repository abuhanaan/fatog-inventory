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
import PaymentsTable from '../../components/PaymentsTable';
import StocksTable from '../../components/StocksTable';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { getOrderItem } from '../../api/orders';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getOrderItem(params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode,
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
    };

    return data;
}

const OrderItem = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const orderItem = useLoaderData();
    const { product, order } = orderItem;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: orderItem.error ?? '',
        message: orderItem.message ?? '',
        statusCode: orderItem.statusCode ?? '',
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

    const tabTitles = ['Overview', 'Product Details', 'Order Details'];
    const tabPanels = [
        <TabPanel info={basicOrderItemInfo} />,
        <TabPanel info={productInfo} />,
        <TabPanel info={orderInfo} />,
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
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Order Item</Heading>

                    <HStack spacing='2'>
                        <Tooltip hasArrow label='Edit order item' placement='bottom' borderRadius='md'>
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