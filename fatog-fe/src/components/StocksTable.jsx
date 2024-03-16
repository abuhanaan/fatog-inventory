import ListingsTable from "./Table";
import { EmptySearch } from "./EmptySearch";
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { FaEllipsisVertical } from "react-icons/fa6";

const StocksTable = ({ stocks, columns, path }) => {

    // console.log(stocks);
    
    const stocksData = stocks.map(stock => ({
        ...stock,
        date: stock.createdAt
    }));

    return (
        <Box>
            {
                stocks.length === 0 ?
                    <EmptySearch headers={['S/N', 'Amount', 'No. of Bags', 'Total Weight', ' ']} type='stock' /> :
                    <ListingsTable data={stocksData} columns={columns} fileName='stocks-data.csv' render={(stock) => (
                        <ActionButtons stock={stock} path={path} />
                    )} />
            }
        </Box>
    )
}

const ActionButtons = ({ stock, path }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function viewStock(e) {
        e.preventDefault();

        const dataStockId = e.currentTarget.getAttribute('data-stock-id');
        navigate(`${path}/${dataStockId}`, { state: {from: pathname} });
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