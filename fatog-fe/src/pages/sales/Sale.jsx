import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, Card, CardBody, CardHeader, CardFooter, useDisclosure, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { BiError } from "react-icons/bi";
import { IoEyeOutline } from "react-icons/io5";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaRegThumbsUp, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import UserField from '../../components/UserField';
import Tabs from '../../components/Tabs';
import PaymentsTable from '../../components/PaymentsTable';
import OrdersTable from '../../components/OrdersTable';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { getSale } from '../../api/sales';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import Back from '../../components/Back';
import { getMonetaryValue, formatDate } from '../../utils';

export async function loader({ params, request }) {
    await requireAuth(request);
    const sale = await getSale(params.id);

    if (sale.error || sale.message) {
        return {
            error: sale.error,
            message: sale.message,
            statusCode: sale.statusCode,
        };
    }

    console.log(sale)

    const data = {
        id: sale.id,
        amountPaid: sale.amountPaid,
        amountPayable: sale.amountPayable,
        outstandingPayment: sale.outStandingPayment,
        paymentStatus: sale.paymentStatus,
        orderRefId: sale.orderRefId,
        cashierId: sale.cashierId,
        staff: sale.staff,
        order: sale.order,
        payments: sale.payments,
        note: sale.note,
        date: sale.createdAt,
    };

    return data;
}

const Sale = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const sale = useLoaderData();
    const { staff, order, payments } = sale;
    const { orderLists } = order;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: sale.error ?? '',
        message: sale.message ?? '',
        statusCode: sale.statusCode ?? '',
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Sales', ref: '/sales' },
        { name: 'Sale', ref: `/sales/${sale.id}` },
    ];

    const basicSaleInfo = {
        amountPaid: sale.amountPaid,
        amountPayable: sale.amountPayable,
        outstandingPayment: sale.outstandingPayment,
        paymentStatus: sale.paymentStatus,
        date: sale.date,
    };

    console.log(orderLists)

    const staffInfo = {
        firstName: staff.firstName,
        lastName: staff.lastName,
        gender: staff.gender,
        phoneNumber: staff.phoneNumber,
    };

    const orderInfo = {
        referenceId: order.refId,
        totalNoOfBags: order.totalNoOfBags,
        totalAmount: order.totalAmount,
        totalWeight: order.totalWeight,
        customerPhoneNumber: order.phoneNumber,
        shippingAddress: order.shippingAddress,
        date: order.createdAt,
        note: order.note,
    };

    const paymentsData = payments.map(payment => ({
        amountPaid: payment.amountPaid,
        outstandingPayment: payment.outstandingAfter,
        previousPaymentTotal: payment.prevPaymentSum,
        date: payment.date
    }));

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

    const tabTitles = ['Overview', 'Order Details', 'Order List', 'Payments', 'Staff Details',];
    const tabPanels = [
        <TabPanel info={basicSaleInfo} />,
        <TabPanel info={orderInfo} />,
        <OrderList info={orderInfo} orderList={orderLists} orderId={order.id} />,
        <PaymentsTable payments={paymentsData} columns={paymentColumns} />,
        <TabPanel info={staffInfo} />,

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
                    <Heading fontSize='3xl' color='blue.700'>Sale</Heading>
                </HStack>
                <Box>
                    <Tabs titles={tabTitles} panels={tabPanels} variant='enclosed' />
                </Box>
            </Stack>
    )
}

const getInfoArray = (info) => {
    const infoArray = [];
    for (const [key, value] of Object.entries(info)) {
        infoArray.push({ key, value });
    }

    return infoArray;
}

const TabPanel = ({ info }) => {
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

const OrderList = ({ info, orderList, orderId }) => {
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
            cell: props => <ActionButtons order={props.row.original} path={`/orders/${orderId}/orderlist`} />,
            enableGlobalFilter: false,
        },
    ];

    const orderListData = orderList.map(orderItem => ({
        ...orderItem,
        orderId: orderId,
        productName: orderItem.product.name
    }));

    return (
        <OrdersTable orders={orderListData} columns={orderListColumns} />
    )
}

export default Sale;