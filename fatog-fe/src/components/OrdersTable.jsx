import ListingsTable from "./Table";
import { EmptySearch } from "./EmptySearch";
import { Box } from '@chakra-ui/react';

const OrdersTable = ({ orders, columns }) => {
    const ordersData = orders.map(order => ({
        ...order,
        date: order.createdAt
    }));

    return (
        <Box>
            {
                ordersData.length === 0 ?
                    <EmptySearch headers={['S/N', 'Total Amount', 'No. of Bags', 'Customer', 'Amount Paid', 'Outstanding Payment']} type='order' /> :
                    <ListingsTable data={ordersData} columns={columns} fileName='orders-data.csv' />
            }
        </Box>
    )
}

export default OrdersTable;