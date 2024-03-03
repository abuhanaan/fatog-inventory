import { useRef, useState, useEffect } from 'react';
import { useNavigate, useNavigation, Link, useLoaderData, useLocation } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, useDisclosure, IconButton, Icon, Button, Heading, Text, Spinner, Tooltip } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import Modal from '../../components/Modal';
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import AddButton from '../../components/AddButton';
import { getProducts, deleteProduct } from '../../api/products';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';

const columns = [
    { id: 'S/N', header: 'S/N' },
    { id: 'name', header: 'Name' },
    { id: 'type', header: 'Type' },
    { id: 'weight', header: 'Weight' },
    { id: 'size', header: 'Size' },
    { id: 'pricePerBag', header: 'Price(₦)' },
    { id: 'manufacturer', header: 'Manufacturer' },
    { id: 'actions', header: '' },
];

export async function loader({ request }) {
    await requireAuth(request);
    const response = await getProducts(request);

    return response;
}

const Products = () => {
    const [toastState, setToastState] = useToastHook();
    const products = useLoaderData();
    const [error, setError] = useState({
        error: '',
        message: ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Products', ref: '/products' },
    ];

    useEffect(() => {
        if (products.error || products.message) {
            setToastState({
                title: products.error,
                description: products.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setError({
                error: products.error,
                message: products.message
            });
        }
    }, []);

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
                    <Heading fontSize='3xl' color='blue.700'>Products</Heading>
                    <AddButton navigateTo='create'>Add Product</AddButton>
                </HStack>
                <Box marginTop='8'>
                    {
                        products?.length === 0 ?
                            <EmptySearch headers={['S/N', 'NAME', 'TYPE', 'WEIGHT', 'SIZE', 'MANUFACTURER']} type='product' /> :
                            <ListingsTable data={products} columns={columns} fileName='products-data.csv' render={(product) => (
                                <ActionButtons product={product} />
                            )} />
                    }
                </Box>
            </Stack>
    )
}

const ActionButtons = ({ product }) => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const { pathname } = useLocation();
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);

    function viewProduct(e) {
        e.preventDefault();

        const dataProductId = e.currentTarget.getAttribute('data-product-id');
        navigate(`./${dataProductId}`);
    }

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
        <>
            <HStack spacing='1'>
                <Tooltip hasArrow label='Preview product' placement='bottom' borderRadius='md'>
                    <IconButton icon={<IoEyeOutline />} colorScheme='purple' size='sm' data-product-id={product.id} onClick={viewProduct} />
                </Tooltip>

                <Tooltip hasArrow label='Edit product' placement='bottom' borderRadius='md'>
                    <IconButton as={Link} to='create' icon={<MdOutlineEdit />} colorScheme='blue' size='sm' state={{ currentProduct: product }} />
                </Tooltip>

                <Tooltip hasArrow label='Delete product' placement='left' borderRadius='md'>
                    <IconButton icon={<MdDeleteOutline />} colorScheme='red' size='sm' data-product-id={product.id} onClick={onOpen} />
                </Tooltip>
            </HStack>

            <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Product'>
                <Box>
                    <Text>Proceed to delete product?</Text>
                </Box>
            </Modal>
        </>
    )
}

export default Products;