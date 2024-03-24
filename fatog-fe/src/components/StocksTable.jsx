import ListingsTable from "./Table";
import { EmptySearch } from "./EmptySearch";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { FaEllipsisVertical } from "react-icons/fa6";

const StocksTable = ({ stocks, columns, path }) => {
    const stocksData = stocks.map(stock => ({
        ...stock,
        date: stock.createdAt
    }));

    // console.log(stocksData);

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
        navigate(`${path}/${dataStockId}`, { state: { from: pathname } });
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

                    {
                        pathname.includes('stocks') &&
                        <MenuItem as={Link} to={`/stocks/${stock.stockId}/stocklist/${stock.id}/edit`} icon={<MdOutlineEdit />} state={{ stockItem: stock }}>
                            Edit
                        </MenuItem>
                    }
                </MenuList>
            </Menu>
        </>
    )
}

export default StocksTable;