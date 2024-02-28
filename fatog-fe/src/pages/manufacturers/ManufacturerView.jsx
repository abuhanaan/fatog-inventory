import { useRef } from 'react';
import { Stack, Box, HStack, SimpleGrid, Heading, Text, Button, IconButton, useDisclosure } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import Modal from '../../components/Modal';
import Tabs from '../../components/Tabs';

const manufacturer = {
    id: 1,
    brandName: "Vital Feeds",
    repName: "Yewande Smith",
    repPhoneNumber: "08098654789",
    createdAt: "2024-02-28T16:23:01.079Z",
    updatedAt: "2024-02-28T16:23:01.079Z"
};

const ManufacturerView = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Manufacturers', ref: '/manufacturers' },
        { name: manufacturer.brandName, ref: `/manufacturers/${manufacturer.id}` },
    ];

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
        <Stack spacing='6'>
            <Box>
                <Breadcrumb linkList={breadcrumbData} />
            </Box>
            <HStack justifyContent='space-between'>
                <Heading fontSize={{ base: '2xl', md: '3xl' }} color='blue.700'>{manufacturer.brandName}</Heading>
                <HStack spacing='2'>
                    <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/manufacturers/create' icon={<HiOutlinePlus />} colorScheme='blue' />
                    <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/manufacturers/create' state={{ currentManufacturer: manufacturer }} icon={<MdOutlineEdit />} colorScheme='orange' />
                    <IconButton icon={<MdDeleteOutline />} size={{ base: 'sm', md: 'md' }} data-manufacturer-id={manufacturer.id} onClick={onOpen} colorScheme='red' />
                </HStack>

                <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Manufacturer'>
                    <Box>
                        <Text>Proceed to delete manufacturer?</Text>
                    </Box>
                </Modal>
            </HStack>
            <Box marginTop='8'>
                <Box as='fieldset' boxSize={{ base: 'full', lg: 'full' }} bg='white' p='6' borderWidth='1px' borderColor='gray.300' borderRadius='md'>
                    <Heading as='legend' px='1' fontSize='lg' fontWeight='medium'>General Information</Heading>
                    <GeneralInfo manufacturer={manufacturer} />
                </Box>
            </Box >
        </Stack >
    )
};

const GeneralInfo = ({ manufacturer }) => {
    return (
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>ID</Heading>
                <Text>{manufacturer.id}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Brand Name</Heading>
                <Text>{manufacturer.brandName}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Representative Name</Heading>
                <Text>{manufacturer.repName}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Representative Phone</Heading>
                <Text>{manufacturer.repPhoneNumber}</Text>
            </Stack>
        </SimpleGrid>
    )
};

export default ManufacturerView;