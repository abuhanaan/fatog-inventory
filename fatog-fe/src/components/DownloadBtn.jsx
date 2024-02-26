import React from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import { CSVLink } from 'react-csv';
import { IconButton } from '@chakra-ui/react';

const DownloadBtn = ({ data = [], fileName }) => {
    return (
        <IconButton
            as={CSVLink}
            colorScheme='blue'
            aria-label='Download data as CSV'
            icon={<MdOutlineFileDownload />}
            // size='md'
            data={data}
            filename={fileName}
            target='_blank'
        />
    )
}

export default DownloadBtn;