import { useRef, useState, useEffect } from 'react';
import { useNavigate, useNavigation, Link, useLoaderData, useLocation } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, useDisclosure, IconButton, Icon, Button, Heading, Text, Spinner, Tooltip, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaEllipsisVertical } from "react-icons/fa6";
import Modal from '../../components/Modal';
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import AddButton from '../../components/AddButton';
import { getManufacturers, deleteManufacturer } from '../../api/manufacturers';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import ManufacturerActions from './ManufacturerActions';

const columns = [
    {
        id: 'S/N',
        header: 'S/N',
        // size: 225,
        cell: props => <Text>{props.row.index + 1}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'brandName',
        header: 'Brand Name',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'repName',
        header: 'Representative Name',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'repPhoneNumber',
        header: 'Representative Phone',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: false,
    },
    {
        id: 'actions',
        header: '',
        // size: 225,
        cell: ManufacturerActions,
        enableGlobalFilter: false,
    },
];

export async function loader({ request }) {
    await requireAuth(request);
    const response = await getManufacturers();

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode
        }
    }

    return response;
}

const Manufacturers = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [toastState, setToastState] = useToastHook();
    const manufacturers = useLoaderData();
    const [error, setError] = useState({
        error: manufacturers.error ?? '',
        message: manufacturers.message ?? '',
        statusCode: manufacturers.statusCode ?? ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Manufacturers', ref: '/manufacturers' },
    ];

    useEffect(() => {
        if (manufacturers.error || manufacturers.message) {
            setToastState({
                title: manufacturers.error,
                description: manufacturers.message,
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
                    <Heading fontSize='3xl' color='blue.700'>Manufacturers</Heading>
                    <AddButton navigateTo='create'>Add Manufacturer</AddButton>
                </HStack>
                <Box marginTop='8'>
                    {
                        manufacturers?.length === 0 ?
                            <EmptySearch headers={['S/N', 'BRAND NAME', 'REPRESENTATIVE NAME', 'REPRESENTATIVE PHONE']} type='manufacturer' /> :
                            <ListingsTable data={manufacturers} columns={columns} fileName='manufacturers-data.csv' />
                    }
                </Box>
            </Stack>
    )
}

export default Manufacturers;