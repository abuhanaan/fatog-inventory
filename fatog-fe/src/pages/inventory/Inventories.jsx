import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useLoaderData, Link as RouterLink } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, IconButton, Button, Icon, Heading, Text, Tooltip } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { LuHistory } from "react-icons/lu";
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import { getManufacturers } from '../../api/manufacturers';
import { getInventories } from '../../api/inventories';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import InventoryActions from './InventoryActions';
import { getMonetaryValue } from '../../utils';

const columns = [
    {
        id: 'S/N',
        header: 'S/N',
        // size: 225,
        cell: props => <Text>{props.row.index + 1}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'type',
        header: 'Type',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'weight',
        header: 'Weight',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'remainingQty',
        header: 'Remaining Quantity',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'pricePerBag',
        header: 'Price',
        // size: 225,
        cell: (props) => <Text>{getMonetaryValue(props.getValue())}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'manufacturer',
        header: 'Manufacturer',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString'
    },
    {
        id: 'actions',
        header: '',
        // size: 225,
        cell: InventoryActions,
        enableGlobalFilter: false,
    },
];

const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Inventories', ref: '/inventories' },
];

export async function loader({ request }) {
    await requireAuth(request);
    const inventories = await getInventories();
    const manufacturers = await getManufacturers();

    if (inventories.error || inventories.message) {
        return {
            error: inventories.error,
            message: inventories.message,
            statusCode: inventories.statusCode
        }
    }

    if (manufacturers.error || manufacturers.message) {
        return {
            error: manufacturers.error,
            message: manufacturers.message,
            statusCode: manufacturers.statusCode
        }
    }

    const data = inventories.map(inventory => {
        const manId = inventory.product.manufacturerId;
        const brandName = manufacturers.filter(manufacturer => manufacturer.id === manId)[0].brandName;
        return {
            id: inventory.id,
            name: inventory.product.name,
            type: inventory.product.type,
            weight: inventory.product.weight,
            remainingQty: inventory.remainingQty,
            pricePerBag: inventory.product.pricePerBag,
            manufacturer: brandName
        }
    });

    return data;
}

const Inventories = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const inventories = useLoaderData();
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: inventories.error ?? '',
        message: inventories.message ?? '',
        statusCode: inventories.statusCode ?? ''
    });

    useEffect(() => {
        if (inventories.error || inventories.message) {
            setToastState({
                title: inventories.error,
                description: inventories.message,
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
                    <Heading fontSize='3xl' color='blue.700'>Inventories</Heading>
                    <Button as={RouterLink} to='histories' leftIcon={<LuHistory />} colorScheme='blue'>History</Button>
                </HStack>
                <Box marginTop='8'>
                    {
                        inventories?.length === 0 ?
                            <EmptySearch headers={['S/N', 'NAME', 'TYPE', 'WEIGHT', 'QUANTITY', 'PRICE(₦)', 'MANUFACTURER']} type='inventory' /> :
                            <ListingsTable data={inventories} columns={columns} fileName='inventories-data.csv' />
                    }
                </Box>
            </Stack>
    )
}

export default Inventories;