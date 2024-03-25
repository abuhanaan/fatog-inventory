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
import { getSale } from '../../api/sales';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';

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

    const staffInfo = {
        firstName: staff.firstName,
        lastName: staff.lastName,
        gender: staff.gender,
        phoneNumber: staff.phoneNumber,
    };

    const orderInfo = {
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
        { id: 'S/N', header: 'S/N' },
        { id: 'amountPaid', header: 'Amount Paid' },
        { id: 'outstandingPayment', header: 'Outstanding Payment' },
        { id: 'previousPaymentTotal', header: 'Prev. Payment Total' },
        { id: 'date', header: 'Date' },
    ];

    const tabTitles = ['Overview', 'Order Details', 'Payments', 'Staff Details', ];
    const tabPanels = [
        <TabPanel info={basicSaleInfo} />,
        <TabPanel info={orderInfo} />,
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
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Sale</Heading>
                </HStack>
                <Box>
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

export default Sale;