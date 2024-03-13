import ListingsTable from "./Table";
import { EmptySearch } from "./EmptySearch";
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { FaEllipsisVertical } from "react-icons/fa6";

const StocksTable = ({ stocks }) => {
    console.log(stocks);

    const columns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'totalAmount', header: 'Total Amount' },
        { id: 'totalNoOfBags', header: 'No. of Bags' },
        { id: 'totalWeight', header: 'Total Weight' },
        { id: 'actions', header: '' },
    ];

    return (
        <Box>
            {
                stocks.length === 0 ?
                    <EmptySearch headers={['S/N', 'Amount', 'No. of Bags', 'Total Weight', ' ']} type='stock' /> :
                    <ListingsTable data={stocks} columns={columns} fileName='stocks-data.csv' render={(stock) => (
                        <ActionButtons stock={stock} />
                    )} />
            }
        </Box>
    )
}

const ActionButtons = ({ stock }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function viewStock(e) {
        e.preventDefault();

        const dataStockId = e.currentTarget.getAttribute('data-stock-id');
        navigate(`/stocks/${dataStockId}`, { state: {from: pathname} });
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
                    <MenuItem icon={<IoEyeOutline />} data-stock-id={stock.id} onClick={viewStock}>
                        Preview
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}

export default StocksTable;