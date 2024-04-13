import ListingsTable from "./Table";
import { EmptySearch } from "./EmptySearch";
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { FaEllipsisVertical } from "react-icons/fa6";

const SalesTable = ({ sales, columns }) => {

    return (
        <Box>
            {
                sales.length === 0 ?
                    <EmptySearch headers={['S/N', 'Amount Payable', 'Amount Paid', 'Outstanding Payment', 'Payment Status']} type='sale' /> :
                    <ListingsTable data={sales} columns={columns} fileName='sales-data.csv' />
            }
        </Box>
    )
}

export default SalesTable;