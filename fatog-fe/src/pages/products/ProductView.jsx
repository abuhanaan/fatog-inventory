import { useRef } from 'react';
import { Stack, Box, HStack, SimpleGrid, Heading, Text, Button, IconButton, useDisclosure } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Modal from '../../components/Modal';
import Tabs from '../../components/Tabs';

const product = {
    id: 1,
    name: "Product 1",
    type: "Type 1",
    weight: 12,
    pricePerBag: 7000,
    size: 12,
    manufacturerId: 1,
    manufacturer: {
        id: 1,
        brandName: "Optimal Feeds",
        repName: "Ibrahim Salis",
        repPhoneNumber: "08067565656",
        createdAt: "2024-02-27T21:29:08.330Z",
        updatedAt: "2024-02-27T21:29:08.330Z"
    },
    createdAt: "2024-02-27T21:29:08.334Z",
    updatedAt: "2024-02-27T21:29:08.334Z"
};

const { manufacturer } = product;

const ProductView = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Products', ref: '/products' },
        { name: product.name, ref: `/products/${1}` },
    ];
    const tabTitles = ['General Information', 'Manufacturer\'s Information'];
    const tabPanels = [<GeneralInfo />, <ManufacturerInfo />];

    async function productDelete(e) {
        e.preventDefault();

        console.log(product.id);

        closeModalRef.current.click();
    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button onClick={productDelete} colorScheme='blue'>Delete</Button>
        </HStack>

    return (
        <Stack spacing='6'>
            <Box>
                <Breadcrumb linkList={breadcrumbData} />
            </Box>
            <HStack justifyContent='space-between'>
                <Heading fontSize={{base: '2xl', md: '3xl'}} color='blue.700'>{product.name}</Heading>
                <HStack spacing='2'>
                    <IconButton as={RouterLink} size={{base: 'sm', md: 'md'}} to='/products/create' icon={<HiOutlinePlus />} colorScheme='blue' />
                    <IconButton as={RouterLink} size={{base: 'sm', md: 'md'}} to='/products/create' state={{ currentProduct: product }} icon={<MdOutlineEdit />} colorScheme='orange' />
                    <IconButton icon={<MdDeleteOutline />} size={{base: 'sm', md: 'md'}} data-product-id={product.id} onClick={onOpen} colorScheme='red' />
                </HStack>

                <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Product'>
                    <Box>
                        <Text>Proceed to delete product?</Text>
                    </Box>
                </Modal>
            </HStack>
            <Box marginTop='8'>
                <Tabs titles={tabTitles} panels={tabPanels} variant='enclosed' />
            </Box >
        </Stack >
    )
}

const GeneralInfo = () => {
    return (
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>ID</Heading>
                <Text>{product.id}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Name</Heading>
                <Text>{product.name}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Type</Heading>
                <Text>{product.type}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Price per bag (₦)</Heading>
                <Text>{product.pricePerBag}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Weight (kg)</Heading>
                <Text>{product.weight}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Size</Heading>
                <Text>{product.size}</Text>
            </Stack>
        </SimpleGrid>
    )
};

const ManufacturerInfo = () => {
    return (
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>ID</Heading>
                <Text>{product.manufacturerId}</Text>
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
            <Stack direction='column' colSpan={2} mt='2'>
                <Button as={RouterLink} to={`/manufacturers/${1}`} leftIcon={<IoEyeOutline />} colorScheme='blue' size='md'>Preview Manufacturer</Button>
            </Stack>
        </SimpleGrid>
    )
};


export default ProductView;