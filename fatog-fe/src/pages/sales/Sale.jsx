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
import StocksTable from '../../components/StocksTable';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { getSale } from '../../api/sales';

export async function loader({ params, request }) {
    await requireAuth(request);
    const sale = await getSale(request, params.id);

    if (sale.error || sale.message) {
        return {
            error: sale.error,
            message: sale.message
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
        note: sale.note,
        date: sale.createdAt,
    };

    return data;
}

const Sale = () => {
    const navigate = useNavigate();
    const sale = useLoaderData();
    const { staff, order } = sale;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: sale.error ?? '',
        message: sale.message ?? ''
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

    const tabTitles = ['Overview', 'Order Details', 'Staff Details'];
    const tabPanels = [
        <TabPanel info={basicSaleInfo} />,
        <TabPanel info={orderInfo} />,
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
                    <Heading fontSize='3xl' color='blue.700'>Sale</Heading>

                    {/* <HStack spacing='2'>
                        <Tooltip hasArrow label='Edit stock item' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to={`/orders/${order.id}/orderlist/${orderItem.id}/edit`} state={{ orderItem: orderItem }} icon={<MdOutlineEdit />} colorScheme='orange' />
                        </Tooltip>
                    </HStack> */}
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

export default Sale;