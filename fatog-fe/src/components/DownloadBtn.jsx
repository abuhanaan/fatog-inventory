import React from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import { CSVLink } from 'react-csv';
import { Button } from '@chakra-ui/react';

const DownloadBtn = ({ children, data = [], fileName }) => {
    return (
        <Button
            as={CSVLink}
            colorScheme='blue'
            aria-label='Download data as CSV'
            leftIcon={<MdOutlineFileDownload />}
            // size='md'
            data={data}
            filename={fileName}
            target='_blank'
            size='sm'
        >
            {children}
        </Button>
        // <IconButton
        //     as={CSVLink}
        //     colorScheme='blue'
        //     aria-label='Download data as CSV'
        //     icon={<MdOutlineFileDownload />}
        //     // size='md'
        //     data={data}
        //     filename={fileName}
        //     target='_blank'
        // />
    )
}

export default DownloadBtn;