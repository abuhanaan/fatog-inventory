import { useRef } from 'react';
import { useNavigate, Link, useLoaderData } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, Box, useDisclosure, IconButton, Button, Heading, Text } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Modal from '../../components/Modal';
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import AddButton from '../../components/AddButton';

const columns = [
    { id: 'S/N', header: 'S/N' },
    { id: 'brandName', header: 'Brand Name' },
    { id: 'repName', header: 'Representative Name' },
    { id: 'repPhoneNumber', header: 'Representative Phone' },
    { id: 'actions', header: '' },
];

export const manufacturers = [
    {
        id: 1,
        brandName: "Optimal Feeds",
        repName: "Ibrahim Salis",
        repPhoneNumber: "08067565656",
        createdAt: "2024-02-27T21:29:08.330Z",
        updatedAt: "2024-02-27T21:29:08.330Z"
    },
    {
        id: 2,
        brandName: "Vital Feeds",
        repName: "Asia Yunus",
        repPhoneNumber: "08012345656",
        createdAt: "2024-02-27T21:29:08.330Z",
        updatedAt: "2024-02-27T21:29:08.330Z"
    },
    {
        id: 3,
        brandName: "KASMAG",
        repName: "Yewande Smith",
        repPhoneNumber: "08090876543",
        createdAt: "2024-02-27T21:29:08.330Z",
        updatedAt: "2024-02-27T21:29:08.330Z"
    },
];

const Manufacturers = () => {
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Manufacturers', ref: '/manufacturers' },
    ];

    return (
        <Stack spacing='6'>
            <Box>
                <Breadcrumb linkList={breadcrumbData} />
            </Box>
            <HStack justifyContent='space-between'>
                <Heading fontSize='3xl' color='blue.700'>Manufacturers</Heading>
                <AddButton navigateTo='create'>Add Manufacturer</AddButton>
            </HStack>
            <Box marginTop='8'>
                {
                    manufacturers?.length === 0 ?
                        <EmptySearch headers={['S/N', 'BRAND NAME', 'REPRESENTATIVE NAME', 'REPRESENTATIVE PHONE']} type='manufacturer' /> :
                        <ListingsTable data={manufacturers} columns={columns} fileName='manufacturers-data.csv' render={(manufacturer) => (
                            <ActionButtons manufacturer={manufacturer} />
                        )} />
                }
            </Box>
        </Stack>
    )
}

const ActionButtons = ({ manufacturer }) => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);

    function viewManufacturer(e) {
        e.preventDefault();

        const dataManufacturerId = e.currentTarget.getAttribute('data-manufacturer-id');
        navigate(`./${dataManufacturerId}`);
    }

    async function manufacturerDelete(e) {
        e.preventDefault();

        console.log(manufacturer.id);

        // TODO: Consume DELETE manufacturer endpoint
        
        closeModalRef.current.click();
    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button onClick={manufacturerDelete} colorScheme='blue'>Delete</Button>
        </HStack>

    return (
        <>
            <HStack spacing='1'>
                <IconButton icon={<IoEyeOutline />} colorScheme='purple' size='sm' data-manufacturer-id={manufacturer.id} onClick={viewManufacturer} />

                <IconButton as={Link} to='create' icon={<MdOutlineEdit />} colorScheme='blue' size='sm' state={{ currentManufacturer: manufacturer }} />

                <IconButton icon={<MdDeleteOutline />} colorScheme='red' size='sm' data-manufacturer-id={manufacturer.id} onClick={onOpen} />
            </HStack>

            <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Manufacturer'>
                <Box>
                    <Text>Proceed to delete manufacturer?</Text>
                </Box>
            </Modal>
        </>
    )
}

export default Manufacturers;