import React from 'react';
import {
    Breadcrumb as ChakraBreadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { MdChevronRight } from "react-icons/md";

const Breadcrumb = ({ linkList }) => {
    return (
        <ChakraBreadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
            {
                linkList.map((link, index) => (
                    <BreadcrumbItem key={index}>
                        <BreadcrumbLink as={RouterLink} to={link.ref}>{link.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                ))
            }
        </ChakraBreadcrumb>
    )
}

export default Breadcrumb;