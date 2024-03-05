import { useState, useEffect } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, IconButton, Icon, Heading, Tooltip } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import { getManufacturers } from '../../api/manufacturers';
import { getInventories } from '../../api/inventories';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';

const columns = [
    { id: 'S/N', header: 'S/N' },
    { id: 'name', header: 'Name' },
    { id: 'type', header: 'Type' },
    { id: 'weight', header: 'Weight' },
    { id: 'remainingQty', header: 'Current Qty' },
    { id: 'pricePerBag', header: 'Unit Price(₦)' },
    { id: 'manufacturer', header: 'Manufacturer' },
    { id: 'actions', header: '' },
];
const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Inventories', ref: '/inventories' },
];

export async function loader({ request }) {
    await requireAuth(request);
    const inventories = await getInventories(request);
    const manufacturers = await getManufacturers(request);

    if (inventories.error || inventories.message) {
        return {
            error: inventories.error,
            message: inventories.message
        }
    }

    if (manufacturers.error || manufacturers.message) {
        return {
            error: manufacturers.error,
            message: manufacturers.message
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
    const inventories = useLoaderData();
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: '',
        message: ''
    });

    useEffect(() => {
        if (inventories.error || inventories.message) {
            setToastState({
                title: inventories.error,
                description: inventories.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setError({
                error: inventories.error,
                message: inventories.message
            });
        }
    }, []);

    return (
        error.error ?
            <VStack>
                <Box>{error.error}</Box>
                <Box>{error.message}</Box>
            </VStack> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Inventories</Heading>
                </HStack>
                <Box marginTop='8'>
                    {
                        inventories?.length === 0 ?
                            <EmptySearch headers={['S/N', 'NAME', 'TYPE', 'WEIGHT', 'QUANTITY', 'PRICE(₦)', 'MANUFACTURER']} type='inventory' /> :
                            <ListingsTable data={inventories} columns={columns} fileName='inventories-data.csv' render={(inventory) => (
                                <ActionButtons inventory={inventory} />
                            )} />
                    }
                </Box>
            </Stack>
    )
}

const ActionButtons = ({ inventory }) => {
    const navigate = useNavigate();

    function viewInventory(e) {
        e.preventDefault();

        const dataInventoryId = e.currentTarget.getAttribute('data-inventory-id');
        navigate(`./${dataInventoryId}`);
    }

    return (
        <HStack spacing='1'>
            <Tooltip hasArrow label='Preview inventory' placement='bottom' borderRadius='md'>
                <IconButton icon={<IoEyeOutline />} colorScheme='purple' size='sm' data-inventory-id={inventory.id} onClick={viewInventory} />
            </Tooltip>
        </HStack>
    )
}

export default Inventories;