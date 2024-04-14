// ProductsListing.js
import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createColumnHelper, getCoreRowModel, useReactTable, flexRender, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/react-table';
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Button, IconButton, Flex, HStack, Input, Box, Select, Icon, Spacer, Badge, Text } from '@chakra-ui/react';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import SearchInput from './form/SearchInput';
import DownloadBtn from './DownloadBtn';
import UsersFilter from './UsersFilter';
import SortIcon from '../icons/SortIcon';
import { TbSortAscending, TbSortDescending } from "react-icons/tb";

export const formatDate = (dateParam) => {
    const date = new Date(dateParam);
    return date.toLocaleString();
};

const ListingsTable = ({ data: tableData, columns, filterData, buttonState, fileName }) => {
    const { pathname } = useLocation();
    const [data, setData] = useState(tableData);

    useEffect(() => {
        setData(tableData);
    }, [tableData]);

    const [globalFilter, setGlobalFilter] = useState('');
    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        columnResizeMode: 'onChange',
    });

    const generateMultiplesOf10 = (totalNumber) => {
        let num = Math.ceil(totalNumber / 10);
        const multiplesOf10 = [];

        for (let i = 1; i <= num; i++) {
            multiplesOf10.push(i * 10);
        }
        return multiplesOf10;
    }

    return (
        <>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <SearchInput
                    value={globalFilter ?? ''}
                    onChange={(value) => setGlobalFilter(String(value))}
                />

                <Spacer />

                {
                    (pathname === '/staff' || pathname === '/customers' || pathname === '/users') && <UsersFilter filterData={filterData} buttonState={buttonState} />
                }

                <Spacer />

                <DownloadBtn data={tableData} fileName={fileName}>Download</DownloadBtn>
            </Flex>
            <TableContainer overflowX='auto'>
                <Table variant="simple" size='sm' colorScheme='blue' w={table.getTotalSize()}>
                    <Thead>
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <Tr key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map(header => (
                                            <Th key={header.id} pos={header.column.columnDef.accessorKey === 'refId' ? 'relative' : ''} w={header.getSize()}>
                                                {
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                }

                                                {
                                                    header.column.getCanSort() && (
                                                        <Icon
                                                            as={SortIcon}
                                                            fontSize={14}
                                                            mx={3}
                                                            cursor='pointer'
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        />
                                                    )
                                                }

                                                {
                                                    {
                                                        'asc': <Icon as={TbSortAscending} fontSize={14} />,
                                                        'desc': <Icon as={TbSortDescending} fontSize={14} />
                                                    }[header.column.getIsSorted()]
                                                }

                                                {
                                                    header.column.columnDef.accessorKey === 'refId' && (
                                                        <Box
                                                            onMouseDown={header.getResizeHandler()}
                                                            onTouchStart={header.getResizeHandler()}
                                                            className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                                                        />
                                                    )
                                                }
                                            </Th>
                                        ))
                                    }
                                </Tr>
                            ))
                        }
                    </Thead>
                    <Tbody>
                        {
                            table.getRowModel().rows.length > 0 ?
                                table.getRowModel().rows.map(row => (
                                    <Tr key={row.id}>
                                        {
                                            row.getVisibleCells().map(cell => (
                                                <Td key={cell.id}>
                                                    {
                                                        flexRender(cell.column.columnDef.cell, cell.getContext())
                                                    }
                                                </Td>
                                            ))
                                        }
                                    </Tr>
                                )) :
                                <Tr textAlign='center'>
                                    <Td colSpan={12}>No record found!</Td>
                                </Tr>
                        }
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <HStack mt={4} spacing='5'>
                Page{' '}
                <em>
                    {
                        `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`
                    }
                </em>

                <Box>
                    Go to page: {' '}
                    <Input
                        type='number'
                        w='12'
                        size='sm'
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                    />
                </Box>

                <Box>
                    <Select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        size='sm'
                    >
                        {
                            generateMultiplesOf10(tableData.length).map(pageSize => (
                                <option
                                    key={pageSize}
                                    value='option1'
                                >
                                    Show {pageSize}
                                </option>
                            ))
                        }
                    </Select>
                </Box>

                <Spacer />

                <HStack spacing='2'>
                    <IconButton
                        icon={<FaArrowLeftLong />}
                        onClick={() => table.previousPage()}
                        isDisabled={!table.getCanPreviousPage()}
                    />

                    <IconButton
                        icon={<FaArrowRightLong />}
                        onClick={() => nextPage()}
                        isDisabled={!table.getCanNextPage()}
                    />
                </HStack>
            </HStack>
        </>
    );
};

export default ListingsTable;
