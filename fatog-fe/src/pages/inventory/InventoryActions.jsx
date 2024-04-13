import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useLoaderData, Link as RouterLink } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, IconButton, Button, Icon, Heading, Text, Tooltip } from '@chakra-ui/react';
import { IoEyeOutline } from "react-icons/io5";

const InventoryActions = ({ row }) => {
    const inventory = row.original;
    const navigate = useNavigate();

    function viewInventory(e) {
        e.preventDefault();

        const dataInventoryId = e.currentTarget.getAttribute('data-inventory-id');
        navigate(`./${dataInventoryId}`);
    }

    return (
        <HStack spacing='1'>
            <Tooltip hasArrow label='Preview inventory' placement='bottom' borderRadius='md'>
                <IconButton icon={<IoEyeOutline />} colorScheme='purple' size='sm' data-inventory-id={inventory.id} onClick={viewInventory} />
            </Tooltip>
        </HStack>
    )
}

export default InventoryActions;