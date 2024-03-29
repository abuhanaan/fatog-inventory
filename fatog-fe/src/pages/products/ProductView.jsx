import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, useDisclosure, Card, CardBody } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import Modal from '../../components/Modal';
import Tabs from '../../components/Tabs';
import { requireAuth } from '../../hooks/useAuth';
import { getProduct, deleteProduct } from '../../api/products';
import { useToastHook } from '../../hooks/useToast';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import UserField from '../../components/UserField';
import { getInfoArray } from '../../utils';
import Back from '../../components/Back';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getProduct(params.id);

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
    const { pathname } = useLocation();
    const product = useLoaderData();
    const { manufacturer } = product;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState({
        error: product.error ?? '',
        message: product.message ?? '',
        statusCode: product.statusCode ?? '',
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Products', ref: '/products' },
        { name: product.name, ref: `/products/${product.id}` },
    ];
    const tabTitles = ['General Information', 'Manufacturer\'s Information'];
    const tabPanels = [<GeneralInfo product={product} />, <ManufacturerInfo product={product} />];

    useEffect(() => {
        if (error.error || error.message) {
            setToastState({
                title: error.error,
                description: error.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setTimeout(() => {
                isUnauthorized(error, navigate, pathname);
            }, 6000);
        }
    }, []);

    async function productDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE product endpoint
        const response = await deleteProduct(product.id);

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsDeleting(false);
            closeModalRef.current.click();

            setTimeout(() => {
                isUnauthorized(response, navigate, pathname);
            }, 6000);

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
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Stack direction={{base: 'column', sm: 'row'}} justifyContent='space-between' alignItems='center'>
                    <Breadcrumb linkList={breadcrumbData} />
                    <Back />
                </Stack>
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
    const productData = {
        name: product.name,
        pricePerBag: product.pricePerBag,
        type: product.type,
        size: product.size,
        weight: product.weight,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };

    return (
        <Card variant='elevated'>
            <CardBody>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                    {
                        getInfoArray(productData).map((field, index) => (
                            <UserField key={index} field={field} />
                        ))
                    }
                </SimpleGrid>
            </CardBody>
        </Card>
    )
};

const ManufacturerInfo = ({ product }) => {
    const { manufacturer } = product;

    const manufacturerData = {
        brandName: manufacturer.brandName,
        representativeName: manufacturer.repName,
        representativePhone: manufacturer.repPhoneNumber
    }

    return (
        <Card variant='elevated'>
            <CardBody>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                    {
                        getInfoArray(manufacturerData).map((field, index) => (
                            <UserField key={index} field={field} />
                        ))
                    }
                </SimpleGrid>

                <VStack direction='column'>
                    <Button as={RouterLink} to={`/manufacturers/${manufacturer.id}`} leftIcon={<IoEyeOutline size='26px' />} colorScheme='blue' variant='outline' size='md' mt='6'>Preview Manufacturer</Button>
                </VStack>
            </CardBody>
        </Card>
    )
};


export default ProductView;