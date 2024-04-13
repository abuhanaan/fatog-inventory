import { useRef, useState, useEffect } from 'react';
import { useNavigate, useNavigation, Link, useLoaderData, useLocation } from 'react-router-dom';
import ListingsTable from '../../../components/Table';
import { Stack, HStack, VStack, Box, useDisclosure, IconButton, Icon, Button, Heading, Text, Spinner, Menu, MenuButton, MenuList, MenuItem, Badge, Tooltip } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaEllipsisVertical, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Modal from '../../../components/Modal';
import Breadcrumb from '../../../components/Breadcrumb';
import { EmptySearch } from '../../../components/EmptySearch';
import AddButton from '../../../components/AddButton';
import { activateUser, deactivateUser } from '../../../api/users';
import { getStaff } from '../../../api/staff';
import { useToastHook } from '../../../hooks/useToast';
import { requireAuth } from '../../../hooks/useAuth';
import { isUnauthorized } from '../../../utils';
import FetchError from '../../../components/FetchError';
import StaffActions from './StaffActions';

// const columns = [
//     { id: 'S/N', header: 'S/N' },
//     { id: 'firstName', header: 'First Name' },
//     { id: 'lastName', header: 'Last Name' },
//     { id: 'email', header: 'Email' },
//     { id: 'phoneNumber', header: 'Phone' },
//     { id: 'role', header: 'Role' },
//     { id: 'active', header: 'Status' },
//     { id: 'actions', header: '' },
// ];

const columns = [
    {
        id: 'S/N',
        header: 'S/N',
        // size: 225,
        cell: props => <Text>{props.row.index + 1}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'firstName',
        header: 'First Name',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'lastName',
        header: 'Last Name',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'email',
        header: 'Email',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'phone',
        header: 'Phone Number',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'role',
        header: 'Role',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'active',
        header: 'Status',
        // size: 225,
        cell: (props) => (
            <Badge colorScheme={props.getValue() === true ? 'green' : 'red'} variant='subtle'>
                {props.getValue() === true ? 'Active' : 'Inactive'}
            </Badge>
        ),
        enableGlobalFilter: true,
        filterFn: 'includesString'
    },
    {
        id: 'actions',
        header: '',
        // size: 225,
        cell: StaffActions,
        enableGlobalFilter: false,
    },
];

export async function loader({ request }) {
    await requireAuth(request);
    const response = await getStaff();

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode,
        };
    }

    const filtered = response.filter(staff => staff.staffId !== null);

    const data = filtered.map(staff => ({
        id: staff.staffId,
        firstName: staff.firstName,
        lastName: staff.lastName,
        phone: staff.phoneNumber,
        email: staff.user.email,
        role: staff.user.role,
        category: staff.user.category,
        active: staff.user.active
    }));

    return data;
}

const StaffList = () => {
    const [toastState, setToastState] = useToastHook();
    const staff = useLoaderData();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [error, setError] = useState({
        error: staff.error ?? '',
        message: staff.message ?? '',
        statusCode: staff.statusCode ?? '',
    });
    const [staffFilter, setStaffFilter] = useState(staff ?? null);
    const [buttonState, setButtonState] = useState('');
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Staff', ref: '/staff' },
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
                isUnauthorized(error, navigate);
            }, 6000);
        }
    }, []);

    const filterData = (key) => {
        setButtonState(key);
        setStaffFilter(() => {
            const data = staff.filter(staff => {
                if (key === 'active') return staff.active === true
                if (key === 'inactive') return staff.active === false
                if (key === null) return staff
            });

            return data;
        });
    }

    return (
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Staff List</Heading>
                    <AddButton navigateTo='/users/create' state={{ entity: 'staff' }}>Add Staff</AddButton>
                </HStack>
                <Box marginTop='8'>
                    {
                        staff.length === 0 ?
                            <EmptySearch headers={['S/N', 'FIRST NAME', 'LAST NAME', 'EMAIL', 'PHONE', 'ROLE', 'STATUS']} type='staff' /> :
                            <ListingsTable data={staffFilter} columns={columns} fileName='staff-data.csv' filterData={filterData} buttonState={buttonState} />
                    }
                </Box>
            </Stack>
    )
}

export default StaffList;