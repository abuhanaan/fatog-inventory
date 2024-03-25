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
import { getStockItem } from '../../api/stocks';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getStockItem(params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode,
        };
    }

    const data = {
        id: response.id,
        refId: response.refId,
        productRefId: response.productRefId,
        noOfBags: response.noOfBags,
        pricePerBag: response.pricePerBag,
        totalWeight: response.totalWeight,
        totalAmount: response.totalAmount,
        date: response.createdAt,
        product: response.product,
        stock: response.stock,
    };

    return data;
}

const StockItem = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const stockItem = useLoaderData();
    const { product, stock } = stockItem;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: stockItem.error ?? '',
        message: stockItem.message ?? '',
        statusCode: stockItem.statusCode ?? '',
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Stocks', ref: '/stocks' },
        { name: 'Stock List', ref: `/stocks/${stock.id}` },
        { name: 'Stock Item', ref: `/stocks/${stock.id}/stocklist/${stockItem.id}` },
    ];

    const basicStockItemInfo = {
        product: product.name,
        purchasePricePerBag: stockItem.pricePerBag,
        noOfBags: stockItem.noOfBags,
        purchaseAmount: stockItem.totalAmount,
        totalWeight: stockItem.totalWeight,
        currentSellingPricePerBag: product.pricePerBag,
        totalNoOfBagsInStock: stock.totalNoOfBags,
        date: stockItem.date,
        // staff: (staff.firstName && staff.lastName) ? `${staff.firstName} ${staff.lastName}` : 'N/A',
    };

    const productInfo = {
        productName: product.name,
        currentSellingPricePerBag: product.pricePerBag,
        type: product.type,
        size: product.size,
        weight: product.weight,
    };

    const stockInfo = {
        totalNoOfBags: stock.totalNoOfBags,
        totalAmount: stock.totalAmount,
        totalWeight: stock.totalWeight
    };

    const tabTitles = ['Overview', 'Product Details', 'Stock Details'];
    const tabPanels = [
        <TabPanel info={basicStockItemInfo} />,
        <TabPanel info={productInfo} />,
        <TabPanel info={stockInfo} />,

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
                    <Heading fontSize='3xl' color='blue.700'>Stock Item</Heading>

                    <HStack spacing='2'>
                        <Tooltip hasArrow label='Edit stock item' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to={`/stocks/${stock.id}/stocklist/${stockItem.id}/edit`} state={{ stockItem: stockItem }} icon={<MdOutlineEdit />} colorScheme='orange' />
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

export default StockItem;