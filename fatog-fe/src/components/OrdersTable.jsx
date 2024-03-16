import ListingsTable from "./Table";
import { EmptySearch } from "./EmptySearch";
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { FaEllipsisVertical } from "react-icons/fa6";

const OrdersTable = ({ orders }) => {
    // console.log(orders);

    const columns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'totalAmount', header: 'Total Amount' },
        { id: 'totalNoOfBags', header: 'No. of Bags' },
        { id: 'customer', header: 'Customer' },
        { id: 'amountPaid', header: 'Amount Paid' },
        { id: 'outStandingPayment', header: 'Outstanding Payment' },
        { id: 'actions', header: '' },
    ];

    return (
        <Box>
            {
                orders.length === 0 ?
                    <EmptySearch headers={['S/N', 'Total Amount', 'No. of Bags', 'Customer', 'Amount Paid', 'Outstanding Payment']} type='order' /> :
                    <ListingsTable data={orders} columns={columns} fileName='orders-data.csv' render={(order) => (
                        <ActionButtons order={order} />
                    )} />
            }
        </Box>
    )
}

const ActionButtons = ({ order }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function viewOrder(e) {
        e.preventDefault();

        const dataOrderId = e.currentTarget.getAttribute('data-order-id');
        navigate(`/orders/${dataOrderId}`, { state: { from: pathname } });
    }

    return (
        <>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<FaEllipsisVertical />}
                    variant='unstyled'
                />
                <MenuList py='0'>
                    <MenuItem icon={<IoEyeOutline />} data-order-id={order.id} onClick={viewOrder}>
                        Preview
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}

export default OrdersTable;