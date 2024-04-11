import { useRef, useState, useEffect } from 'react';
import { useNavigate, useNavigation, Link, useLoaderData, useLocation } from 'react-router-dom';
// import ListingsTable from '../../components/Table';
import ListingsTable from '../../components/Tabl';
import { Stack, HStack, VStack, Box, useDisclosure, IconButton, Icon, Button, Heading, Text, Spinner, Tooltip, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaEllipsisVertical } from "react-icons/fa6";
import Modal from '../../components/Modal';
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import AddButton from '../../components/AddButton';
import { getProducts, deleteProduct } from '../../api/products';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';
import { getMonetaryValue, isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import ProductActions from './ProductActions';

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
        accessorKey: 'size',
        header: 'Size',
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
        cell: ProductActions,
        enableGlobalFilter: false,
    },
];

export async function loader({ request }) {
    await requireAuth(request);
    const response = await getProducts();

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode,
        }
    }

    const data = response.map(product => {
        return {
            id: product.id,
            name: product.name,
            type: product.type,
            weight: product.weight,
            size: product.size,
            pricePerBag: product.pricePerBag,
            manufacturer: product.manufacturer.brandName,
            manufacturerId: product.manufacturerId
        }
    });

    return data;
}

const Products = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [toastState, setToastState] = useToastHook();
    const products = useLoaderData();
    const [error, setError] = useState({
        error: products.error ?? '',
        message: products.message ?? '',
        statusCode: products.statusCode ?? '',
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Products', ref: '/products' },
    ];

    useEffect(() => {
        if (products.error || products.message) {
            setToastState({
                title: products.error,
                description: products.message,
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
                    <Heading fontSize='3xl' color='blue.700'>Products</Heading>
                    <AddButton navigateTo='create'>Add Product</AddButton>
                </HStack>
                <Box marginTop='8'>
                    {
                        products?.length === 0 ?
                            <EmptySearch headers={['S/N', 'NAME', 'TYPE', 'WEIGHT', 'SIZE', 'MANUFACTURER']} type='product' /> :
                            <ListingsTable data={products} columns={columns} fileName='products-data.csv' />
                    }
                </Box>
            </Stack>
    )
}

export default Products;