import ListingsTable from "./Table";
import { EmptySearch } from "./EmptySearch";
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { FaEllipsisVertical } from "react-icons/fa6";

const SalesTable = ({ sales }) => {
    console.log(sales);

    const columns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'amountPayable', header: 'Amount Payable' },
        { id: 'amountPaid', header: 'Amount Paid' },
        { id: 'outStandingPayment', header: 'Outstanding Payment' },
        { id: 'paymentStatus', header: 'Payment Status' },
        { id: 'actions', header: '' },
    ];

    return (
        <Box>
            {
                sales.length === 0 ?
                    <EmptySearch headers={['S/N', 'Amount Payable', 'Amount Paid', 'Outstanding Payment', 'Payment Status']} type='sale' /> :
                    <ListingsTable data={sales} columns={columns} fileName='sales-data.csv' render={(sale) => (
                        <ActionButtons sale={sale} />
                    )} />
            }
        </Box>
    )
}

const ActionButtons = ({ sale }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function viewSale(e) {
        e.preventDefault();

        const dataSaleId = e.currentTarget.getAttribute('data-sale-id');
        navigate(`/sales/${dataSaleId}`, { state: {from: pathname} });
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
                    <MenuItem icon={<IoEyeOutline />} data-sale-id={sale.id} onClick={viewSale}>
                        Preview
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}

export default SalesTable;