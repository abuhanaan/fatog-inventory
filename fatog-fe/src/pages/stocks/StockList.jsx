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
import { getStockList } from '../../api/stocks';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getStockList(request, params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message
        };
    }

    const data = {
        id: response.id,
        refId: response.refId,
        totalNoOfBags: response.totalNoOfBags,
        totalWeight: response.totalWeight,
        totalAmount: response.totalAmount,
        date: response.createdAt,
        stockList: response.stockLists,
        staffId: response.staffId,
        staff: response.staff,
        invoice: response.invoice
    };

    return data;
}

const StockList = () => {
    const navigate = useNavigate();
    const stock = useLoaderData();
    const { stockList, staff } = stock;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: stockList.error ?? '',
        message: stockList.message ?? ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Stocks', ref: '/stocks' },
        { name: 'Stock-list', ref: `/stock-list/${stock.id}` },
    ];

    const basicStockInfo = {
        staff: (staff.firstName && staff.lastName) ? `${staff.firstName} ${staff.lastName}` : 'N/A',
        totalAmount: stock.totalAmount,
        totalNoOfBags: stock.totalNoOfBags,
        totalWeight: stock.totalWeight,
    }

    const stockListColumns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'pricePerBag', header: 'Price per Bag' },
        { id: 'noOfBags', header: 'No. of Bags' },
        { id: 'totalAmount', header: 'Total Amount' },
        { id: 'totalWeight', header: 'Total Weight' },
        { id: 'date', header: 'Date' },
        { id: 'actions', header: '' },
    ];

    const tabTitles = ['Basic Stock Details', 'Stock List'];
    const tabPanels = [
        <GeneralInfo info={basicStockInfo} />,
        <StocksTable stocks={stockList} columns={stockListColumns} />,
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
                    <Heading fontSize='3xl' color='blue.700'>Stock</Heading>
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

export default StockList;