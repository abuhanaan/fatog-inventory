import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { HiOutlinePlus } from "react-icons/hi";

const AddButton = ({ children, navigateTo, state }) => {
    return (
        <Button
            as={RouterLink}
            to={navigateTo}
            leftIcon={<HiOutlinePlus />}
            colorScheme="blue"
            state={state}
        >
            {children}
        </Button>
    )
}

export default AddButton;