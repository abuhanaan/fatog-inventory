import ListingsTable from "./Table";
import { EmptySearch } from "./EmptySearch";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { FaEllipsisVertical } from "react-icons/fa6";

const PaymentsTable = ({ payments, columns }) => {
    return (
        <Box>
            {
                payments.length === 0 ?
                    <EmptySearch headers={['S/N', 'Amount Paid', 'Outstanding Payment']} type='payment' /> :
                    <ListingsTable data={payments} columns={columns} fileName='payments-data.csv' />
            }
        </Box>
    )
}

export default PaymentsTable;