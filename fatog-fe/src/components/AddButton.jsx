import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { HiOutlinePlus } from "react-icons/hi";

const AddButton = ({ navigateTo }) => {
    return (
        <IconButton
            as={RouterLink}
            to={navigateTo}
            icon={<HiOutlinePlus />}
            colorScheme="blue"
        />
    )
}

export default AddButton;