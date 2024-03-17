import ListingsTable from "./Table";
import { EmptySearch } from "./EmptySearch";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { FaEllipsisVertical } from "react-icons/fa6";

const OrdersTable = ({ orders, columns, path }) => {
    const ordersData = orders.map(order => ({
        ...order,
        date: order.createdAt
    }));

    return (
        <Box>
            {
                ordersData.length === 0 ?
                    <EmptySearch headers={['S/N', 'Total Amount', 'No. of Bags', 'Customer', 'Amount Paid', 'Outstanding Payment']} type='order' /> :
                    <ListingsTable data={ordersData} columns={columns} fileName='orders-data.csv' render={(order) => (
                        <ActionButtons order={order} path={path} />
                    )} />
            }
        </Box>
    )
}

const ActionButtons = ({ order, path }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function viewOrder(e) {
        e.preventDefault();

        const dataOrderId = e.currentTarget.getAttribute('data-order-id');
        navigate(`${path}/${dataOrderId}`, { state: { from: pathname } });
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

                    {
                        pathname.includes('orders') &&
                        <MenuItem as={Link} to={`/orders/${order.orderId}/orderlist/${order.id}/edit`} icon={<MdOutlineEdit />} state={{ orderItem: order }}>
                            Edit
                        </MenuItem>
                    }
                </MenuList>
            </Menu>
        </>
    )
}

export default OrdersTable;