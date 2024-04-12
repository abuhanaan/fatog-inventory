import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, Card, CardBody, useDisclosure, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
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
import { IoEyeOutline } from "react-icons/io5";
import { FaEllipsisVertical } from "react-icons/fa6";
import { getMonetaryValue, formatDate } from '../../utils';

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
        staff: response.staffId ? response.staff : null,
        customer: response.customerId ? response.customer : null,
        payments: response.payments,
    };

    return data;
}

const ActionButtons = ({ order, path }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function viewOrder(e) {
        e.preventDefault();

        const dataOrderId = e.currentTarget.getAttribute('data-order-id');
        navigate(`${path}/${dataOrderId}`, { state: { from: pathname } });
    }

    return (
        <>
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
                        pathname.includes('orders') &&
                        <MenuItem as={RouterLink} to={`/orders/${order.orderId}/orderlist/${order.id}/edit`} icon={<MdOutlineEdit />} state={{ orderItem: order }}>
                            Edit
                        </MenuItem>
                    }
                </MenuList>
            </Menu>
        </>
    )
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
        totalNoOfBags: order.totalNoOfBags,
        totalWeight: order.totalWeight,
        totalAmount: order.totalAmount,
        outstandingPayment: order.outstandingPayment,
        staff: staff ?
            (staff.firstName && staff.lastName) ?
                `${staff.firstName} ${staff.lastName}` :
                '-'
            : '-',
        customerName: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : '-',
        customerPhoneNumber: order.customerPhoneNumber,
        shippingAddress: order.shippingAddress,
        date: order.date,
        note: order.note,
    }

    // const orderListColumns = [
    //     { id: 'S/N', header: 'S/N' },
    //     { id: 'productName', header: 'Product' },
    //     { id: 'pricePerBag', header: 'Price per Bag' },
    //     { id: 'noOfBags', header: 'No. of Bags' },
    //     { id: 'totalAmount', header: 'Total Amount' },
    //     { id: 'totalWeight', header: 'Total Weight' },
    //     { id: 'actions', header: '' },
    // ];

    const orderListColumns = [
        {
            id: 'S/N',
            header: 'S/N',
            // size: 225,
            cell: props => <Text>{props.row.index + 1}</Text>,
            enableGlobalFilter: false,
        },
        {
            accessorKey: 'productName',
            header: 'Product',
            // size: 225,
            cell: (props) => <Text>{props.getValue()}</Text>,
            enableGlobalFilter: true,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'pricePerBag',
            header: 'Price per Bag',
            // size: 225,
            cell: (props) => <Text>{getMonetaryValue(props.getValue())}</Text>,
            enableGlobalFilter: false,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'noOfBags',
            header: 'No. of Bags',
            // size: 225,
            cell: (props) => <Text>{props.getValue()}</Text>,
            enableGlobalFilter: true,
        },
        {
            accessorKey: 'totalAmount',
            header: 'Amount',
            // size: 225,
            cell: (props) => <Text>{getMonetaryValue(props.getValue())}</Text>,
            enableGlobalFilter: true,
        },
        {
            accessorKey: 'totalWeight',
            header: 'Weight',
            // size: 225,
            cell: (props) => <Text>{props.getValue()}</Text>,
            enableGlobalFilter: false,
        },
        {
            id: 'actions',
            header: '',
            // size: 225,
            cell: props => <ActionButtons order={props.row.original} path={`/orders/${order.id}/orderlist`} />,
            enableGlobalFilter: false,
        },
    ];

    const orderListData = orderList.map(orderItem => ({
        ...orderItem,
        orderId: order.id,
        productName: orderItem.product.name
    }));

    const paymentsData = payments.map(payment => ({
        amountPaid: payment.amountPaid,
        outstandingPayment: payment.outstandingAfter,
        previousPaymentTotal: payment.prevPaymentSum,
        date: payment.date
    }));

    // const paymentColumns = [
    //     { id: 'S/N', header: 'S/N' },
    //     { id: 'amountPaid', header: 'Amount Paid' },
    //     { id: 'outstandingPayment', header: 'Outstanding Payment' },
    //     { id: 'previousPaymentTotal', header: 'Prev. Payment Total' },
    //     { id: 'date', header: 'Date' },
    // ];

    const paymentColumns = [
        {
            id: 'S/N',
            header: 'S/N',
            // size: 225,
            cell: props => <Text>{props.row.index + 1}</Text>,
            enableGlobalFilter: false,
        },
        {
            accessorKey: 'amountPaid',
            header: 'Amount Paid',
            // size: 225,
            cell: (props) => <Text>{getMonetaryValue(props.getValue())}</Text>,
            enableGlobalFilter: true,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'outstandingPayment',
            header: 'Outstanding Payment',
            // size: 225,
            cell: (props) => <Text>{getMonetaryValue(props.getValue())}</Text>,
            enableGlobalFilter: true,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'previousPaymentTotal',
            header: 'Prev. Payment Total',
            // size: 225,
            cell: (props) => <Text>{getMonetaryValue(props.getValue())}</Text>,
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
    ];

    const tabTitles = ['Overview', 'Order List', 'Payments'];
    const tabPanels = [
        <GeneralInfo info={basicOrderInfo} />,
        <OrdersTable orders={orderListData} columns={orderListColumns} />,
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
                <Stack direction={{ base: 'column', sm: 'row' }} justifyContent='space-between' alignItems='center'>
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