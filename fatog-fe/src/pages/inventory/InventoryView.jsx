import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, useDisclosure } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import Modal from '../../components/Modal';
import { EmptySearch } from '../../components/EmptySearch';
import UserField from '../../components/UserField';
import Tabs from '../../components/Tabs';
import { requireAuth } from '../../hooks/useAuth';
import { getInventory } from '../../api/inventories';
import { getManufacturers } from '../../api/manufacturers';
import { useToastHook } from '../../hooks/useToast';
import ListingsTable from '../../components/Tabl';
import { formatDate, isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import Back from '../../components/Back';

export async function loader({ params, request }) {
    await requireAuth(request);
    const inventory = await getInventory(params.id);
    const manufacturers = await getManufacturers();

    if (inventory.error || inventory.message) {
        return {
            error: inventory.error,
            message: inventory.message,
            statusCode: inventory.statusCode
        }
    }

    // console.log(inventory)

    if (manufacturers.error || manufacturers.message) {
        return {
            error: manufacturers.error,
            message: manufacturers.message,
            statusCode: manufacturers.statusCode
        }
    }

    const brandName = manufacturers.filter(manufacturer => manufacturer.id === inventory.product.manufacturerId)[0].brandName;
    const { product } = inventory;

    return {
        id: inventory.id,
        productId: product.id,
        name: product.name,
        type: product.type,
        size: product.size,
        weight: product.weight,
        pricePerBag: product.pricePerBag,
        remainingQty: inventory.remainingQty,
        manufacturer: brandName,
        manufacturerId: product.manufacturerId,
        history: inventory.history
    }
}

const InventoryView = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const inventory = useLoaderData();
    const { history } = inventory;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: inventory.error ?? '',
        message: inventory.message ?? '',
        statusCode: inventory.statusCode ?? ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Inventories', ref: '/inventories' },
        { name: inventory.name, ref: `/inventories/${inventory.id}` },
    ];
    const tabTitles = ['General Information', 'Recent History'];
    const tabPanels = [<GeneralInfo inventory={inventory} />, <RecentHistory history={history} />];

    useEffect(() => {
        if (inventory.error || inventory.message) {
            setToastState({
                title: inventory.error,
                description: inventory.message,
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
                    <Heading fontSize={{ base: '2xl', md: '3xl' }} color='blue.700'>{inventory.name}</Heading>
                </HStack>

                <Box marginTop='2'>
                    <Tabs titles={tabTitles} panels={tabPanels} variant='enclosed' />
                </Box >
            </Stack >
    )
}

const GeneralInfo = ({ inventory }) => {
    const getInventoryInfoArray = (data) => {
        const inventoryInfoArray = [];
        const fieldKeys = ['name', 'type', 'size', 'weight', 'remainingQty', 'pricePerBag', 'manufacturer'];

        for (const [key, value] of Object.entries(data)) {
            const find = fieldKeys.find(fieldKey => fieldKey === key);

            if (find) {
                inventoryInfoArray.push({ key, value });
            }
        }

        return inventoryInfoArray;
    }

    return (
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
            {
                getInventoryInfoArray(inventory).map((field, index) => (
                    <UserField key={index} field={field} />
                ))
            }
        </SimpleGrid>
    )
};

const ActionButtons = ({ row }) => {
    const history = row.original;
    const navigate = useNavigate();

    function viewHistory(e) {
        e.preventDefault();

        const dataHistoryId = e.currentTarget.getAttribute('data-history-id');
        navigate(`/inventories/histories/${dataHistoryId}`);
    }

    return (
        <HStack spacing='1'>
            <Tooltip hasArrow label='Preview history' placement='bottom' borderRadius='md'>
                <IconButton icon={<IoEyeOutline />} colorScheme='purple' size='sm' data-history-id={history.id} onClick={viewHistory} />
            </Tooltip>
        </HStack>
    )
}

const RecentHistory = ({ history }) => {
    const columns = [
        {
            id: 'S/N',
            header: 'S/N',
            // size: 225,
            cell: props => <Text>{props.row.index + 1}</Text>,
            enableGlobalFilter: false,
        },
        {
            accessorKey: 'remainderBefore',
            header: 'Remainder Before',
            // size: 225,
            cell: (props) => <Text>{props.getValue()}</Text>,
            enableGlobalFilter: false,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'effectQuantity',
            header: 'Effect Qty',
            // size: 225,
            cell: (props) => <Text>{props.getValue()}</Text>,
            enableGlobalFilter: true,
            filterFn: 'includesString',
        },
        {
            accessorKey: 'remainderAfter',
            header: 'Remainder After',
            // size: 225,
            cell: (props) => <Text>{props.getValue()}</Text>,
            enableGlobalFilter: false,
        },
        {
            accessorKey: 'operationStatus',
            header: 'Status',
            // size: 225,
            cell: (props) => <Text>{props.getValue()}</Text>,
            enableGlobalFilter: true,
        },
        {
            accessorKey: 'operationType',
            header: 'Type',
            // size: 225,
            cell: (props) => <Text>{props.getValue()}</Text>,
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
        {
            id: 'actions',
            header: '',
            // size: 225,
            cell: ActionButtons,
            enableGlobalFilter: false,
        },
    ];

    const historyData = history.map(hist => ({
        ...hist,
        operationStatus: hist.decrement ? 'Decrement' : 'Increment',
        operationType: hist.orderItemId ? 'Order' : 'Stock',
        date: hist.createdAt
    }));

    return (
        <Box marginTop='8'>
            {
                history?.length === 0 ?
                    <EmptySearch headers={['S/N', 'REM. BEFORE', 'REM. AFTER', 'EFFECT QTY', 'STATUS']} type='history' /> :
                    <ListingsTable data={historyData} columns={columns} fileName='inventories-data.csv' />
            }
        </Box>
    )
}

export default InventoryView;