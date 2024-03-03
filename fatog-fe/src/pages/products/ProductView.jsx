import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, useDisclosure } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import Modal from '../../components/Modal';
import Tabs from '../../components/Tabs';
import { requireAuth } from '../../hooks/useAuth';
import { getProduct, deleteProduct } from '../../api/products';
import { useToastHook } from '../../hooks/useToast';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getProduct(request, params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode
        }
    }

    return response;
}

const ProductView = () => {
    const navigate = useNavigate();
    const product = useLoaderData();
    const { manufacturer } = product;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState({
        error: '',
        message: ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Products', ref: '/products' },
        { name: product.name, ref: `/products/${product.id}` },
    ];
    const tabTitles = ['General Information', 'Manufacturer\'s Information'];
    const tabPanels = [<GeneralInfo product={product} />, <ManufacturerInfo product={product} />];

    useEffect(() => {
        if (product.error || product.message) {
            setToastState({
                title: product.error,
                description: product.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setTimeout(() => {
                navigate('/products');
            }, 6000);

            setError({
                error: product.error,
                message: product.message
            });
        }
    }, []);

    async function productDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE product endpoint
        const response = await deleteProduct(product.id);

        if (response.unAuthorize) {
            sessionStorage.removeItem('user');
            navigate(`/?message=${response.message}. Please log in to continue&redirectTo=${pathname}`);
        }

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsDeleting(false);
            closeModalRef.current.click();

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Product deleted successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsDeleting(false);
        closeModalRef.current.click();

        setTimeout(() => {
            navigate(`/products`);
        }, 6000);
    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button
                onClick={productDelete}
                colorScheme='blue'
                isLoading={isDeleting ? true : false}
                loadingText='Deleting...'
                spinnerPlacement='end'
                spinner={<Spinner
                    thickness='4px'
                    speed='0.5s'
                    emptyColor='gray.200'
                    color='blue.300'
                    size='md'
                />}
            >
                Delete
            </Button>
        </HStack>

    return (
        error.error ?
            <VStack>
                <Box>{error.error}</Box>
                <Box>{error.message}</Box>
            </VStack> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize={{ base: '2xl', md: '3xl' }} color='blue.700'>{product.name}</Heading>
                    <HStack spacing='2'>
                        <Tooltip hasArrow label='Add new product' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/products/create' icon={<HiOutlinePlus />} colorScheme='blue' />
                        </Tooltip>

                        <Tooltip hasArrow label='Edit product' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/products/create' state={{ currentProduct: product }} icon={<MdOutlineEdit />} colorScheme='orange' />
                        </Tooltip>

                        <Tooltip hasArrow label='Delete product' placement='left' borderRadius='md'>
                            <IconButton icon={<MdDeleteOutline />} size={{ base: 'sm', md: 'md' }} data-product-id={product.id} onClick={onOpen} colorScheme='red' />
                        </Tooltip>
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

const GeneralInfo = ({ product }) => {
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

const ManufacturerInfo = ({ product }) => {
    const { manufacturer } = product;

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