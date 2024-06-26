import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useLoaderData, Link as RouterLink } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, IconButton, Button, Icon, Heading, Text, Tooltip, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { MdOutlineCreateNewFolder, MdAddCard } from "react-icons/md";
import { FaEllipsisVertical, FaMoneyBill } from "react-icons/fa6";
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';
import { getSales } from '../../api/sales';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import { getMonetaryValue, formatDate } from '../../utils';

// const columns = [
//     { id: 'S/N', header: 'S/N' },
//     { id: 'staff', header: 'Staff' },
//     { id: 'amountPaid', header: 'Amount Paid' },
//     { id: 'amountPayable', header: 'Amount Payable' },
//     { id: 'outstandingPayment', header: 'Balance' },
//     { id: 'paymentStatus', header: 'Payment Status' },
//     { id: 'totalNoOfBags', header: 'No. of Bags' },
//     { id: 'date', header: 'Date' },
//     { id: 'actions', header: '' },
// ];

const ActionButtons = ({ row }) => {
    const sale = row.original;
    const navigate = useNavigate();

    function viewSale(e) {
        e.preventDefault();

        const dataSaleId = e.currentTarget.getAttribute('data-sale-id');
        navigate(`./${dataSaleId}`);
    }

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<FaEllipsisVertical />}
                variant='unstyled'
            />
            <MenuList py='0'>
                <MenuItem icon={<IoEyeOutline />} data-sale-id={sale.id} onClick={viewSale}>
                    Preview
                </MenuItem>

                {
                    sale.outstandingPayment ?
                    <MenuItem as={RouterLink} to={`/sales/${sale.id}/payments/add`} icon={<MdAddCard />}>
                        Add Payment
                    </MenuItem> :
                    null
                }
            </MenuList>
        </Menu>
    )
}

const columns = [
    {
        id: 'S/N',
        header: 'S/N',
        // size: 225,
        cell: props => <Text>{props.row.index + 1}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'staff',
        header: 'Staff',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'amountPaid',
        header: 'Amount Paid',
        // size: 225,
        cell: (props) => <Text>{getMonetaryValue(props.getValue())}</Text>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'amountPayable',
        header: 'Amount Payable',
        // size: 225,
        cell: (props) => <Text>{getMonetaryValue(props.getValue())}</Text>,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'outstandingPayment',
        header: 'Outstanding Payment',
        // size: 225,
        cell: (props) => <Text>{getMonetaryValue(props.getValue())}</Text>,
        enableGlobalFilter: true,
        filterFn: 'includesString',
    },
    {
        accessorKey: 'paymentStatus',
        header: 'Payment Status',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'totalNoOfBags',
        header: 'No. of Bags',
        // size: 225,
        cell: (props) => <Text>{props.getValue()}</Text>,
        enableGlobalFilter: false,
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

const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Sales', ref: '/sales' },
];

export const loader = async ({ request }) => {
    await requireAuth(request);
    const sales = await getSales();

    if (sales.error || sales.message) {
        return {
            error: sales.error,
            message: sales.message,
            statusCode: sales.statusCode,
        }
    }

    // console.log(sales)

    const data = sales.map(sale => {
        return {
            id: sale.id,
            orderRefId: sale.orderRefId,
            orderId: sale.order.id,
            amountPaid: sale.amountPaid,
            amountPayable: sale.amountPayable,
            outstandingPayment: sale.outStandingPayment,
            paymentStatus: sale.paymentStatus,
            totalNoOfBags: sale.order.totalNoOfBags,
            staff: (sale.staff.firstName && sale.staff.lastName) ? `${sale.staff.firstName} ${sale.staff.lastName}` : '-',
            customerPhone: sale.order.phoneNumber,
            shippingAddress: sale.order.shippingAddress,
            deliveryStatus: sale.order.deliveryStatus,
            date: sale.createdAt,
        }
    });

    return data;
};

const Sales = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const sales = useLoaderData();
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: sales.error ?? '',
        message: sales.message ?? '',
        statusCode: sales.statusCode ?? '',
    });

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
                    <Heading fontSize='3xl' color='blue.700'>Sales</Heading>
                    {/* <Button as={RouterLink} to='create' colorScheme='blue' leftIcon={<MdOutlineCreateNewFolder />}>Create Order</Button> */}
                </HStack>
                <Box marginTop='8'>
                    {
                        sales?.length === 0 ?
                            <EmptySearch headers={['S/N', 'AMOUNT PAID', 'AMOUNT PAYABLE', 'bALANCE', 'NO. OF BAGS', 'CUSTOMER', 'STAFF', 'DELIVERY STATUS', 'PAYMENT STATUS', 'DATE']} type='order' /> :
                            <ListingsTable data={sales} columns={columns} fileName='sales-data.csv' />
                    }
                </Box>
            </Stack>
    )
}

export default Sales;