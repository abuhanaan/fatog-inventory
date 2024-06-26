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
import StocksTable from '../../components/StocksTable';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { getHistory } from '../../api/history';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import Back from '../../components/Back';

export const loader = async ({ params, request }) => {
    await requireAuth(request);
    const history = await getHistory(params.id);

    if (history.error || history.message) {
        return {
            error: history.error,
            message: history.message,
            statusCode: history.statusCode
        };
    }

    console.log(history)

    const data = {
        id: history.id,
        operationStatus: history.decrement ? 'Decrement' : 'Increment',
        effectQuantity: history.effectQuantity,
        remainderAfter: history.remainderAfter,
        remainderBefore: history.remainderBefore,
        orderItemId: history.orderItemId,
        note: history.note,
        date: history.createdAt,
        inventory: history.inventory,
        operationData: history.stockItem ?? history.orderItem,
    };

    return data;
}

const History = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const history = useLoaderData();
    const { inventory, operationData } = history;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: history.error ?? '',
        message: history.message ?? '',
        statusCode: history.statusCode ?? ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Inventories', ref: '/inventories' },
        { name: 'Inventory', ref: `/inventories/${inventory.id}` },
        { name: 'Inventory History', ref: `/inventories/histories/${history.id}` },
    ];

    const basicHistoryInfo = {
        remainderBefore: history.remainderBefore,
        remainderAfter: history.remainderAfter,
        effectQuantity: history.effectQuantity,
        operationStatus: history.operationStatus,
        remainingQuantityInStock: inventory.remainingQty,
        note: history.note,
        date: history.date,
    };

    const orderInfo = {
        pricePerBag: operationData.pricePerBag,
        noOfBags: operationData.noOfBags,
        totalAmount: operationData.totalAmount,
        totalWeight: operationData.totalWeight,
        date: operationData.createdAt,
    };

    const tabTitles = ['Overview', history.orderItemId ? 'Order Details' : 'Stock Details'];
    const tabPanels = [
        <TabPanel info={basicHistoryInfo} />,
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
                <Stack direction={{base: 'column', sm: 'row'}} justifyContent='space-between' alignItems='center'>
                    <Breadcrumb linkList={breadcrumbData} />
                    <Back />
                </Stack>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>History</Heading>
                </HStack>
                <Box marginTop='2'>
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

export default History;