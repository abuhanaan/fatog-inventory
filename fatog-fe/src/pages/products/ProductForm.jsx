import { useRef } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { useForm } from 'react-hook-form';
import { Stack, HStack, Flex, Box, Icon, Spinner, Button, Heading } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import SelectElement from '../../components/form/SelectElement';
import { createProduct, updateProduct } from '../../api/products';
import { getManufacturers } from '../../api/manufacturers';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";

export const loader = async ({ request }) => {
    await requireAuth(request);
    const response = await getManufacturers(request);

    return response;
};

const manufacturers = [
    { id: 1, brandName: 'Optimal' },
    { id: 2, brandName: 'Kasmag' },
    { id: 3, brandName: 'Vital' },
];

const ProductForm = () => {
    const manufacturers = useLoaderData();
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const currentProduct = state && state.currentProduct;
    const manufacturerIdRef = useRef(null);
    const submitBtnRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
        setValue,
    } = useForm();
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Products', ref: '/products' },
        { name: 'Product Form', ref: '/products/create' },
    ];
    const manufacturersOptions = manufacturers.map(manufacturer => manufacturer.brandName);

    const submitProduct = async (data) => {
        const productData = {
            ...data,
            weight: Number(data.weight),
            size: Number(data.size),
            pricePerBag: Number(data.pricePerBag),
        };
        const buttonIntent = submitBtnRef.current.getAttribute('data-intent');
        console.log(productData);

        if (buttonIntent === 'add') {
            console.log(submitBtnRef.current.getAttribute('data-intent'));
            // TODO: Consume create product API endpoint
            try {
                const response = await createProduct(productData);

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

                    return response.error;
                }

                setToastState({
                    title: 'Success!',
                    description: 'Product added successfully',
                    status: 'success',
                    icon: <Icon as={FaRegThumbsUp} />
                });

                setTimeout(() => {
                    navigate(`/products`);
                }, 6000);

            } catch (error) {
                return error;
            }
        }

        if (buttonIntent === 'update') {
            console.log(submitBtnRef.current.getAttribute('data-intent'));
            // TODO: Consume product update API endpoint
        }
    };

    const setManufacturerId = (selectedValue) => {
        const fieldName = manufacturerIdRef.current.name;
        const selectedManufacturer = manufacturers.filter(manufacturer => manufacturer.brandName === selectedValue);
        setValue(fieldName, selectedManufacturer[0].id);
    }

    const setManufacturerOption = () => {
        if (currentProduct) {
            const selectedManufacturer = manufacturers.filter(manufacturer => manufacturer.id === currentProduct.manufacturerId);

            return selectedManufacturer[0].brandName;
        }
    }

    return (
        <Stack spacing='6'>
            <Box>
                <Breadcrumb linkList={breadcrumbData} />
            </Box>
            <HStack justifyContent='space-between'>
                <Heading fontSize='3xl' color='blue.700'>{currentProduct ? `Update ${currentProduct.name}` : 'Add Product'}</Heading>
            </HStack>
            <form onSubmit={handleSubmit(submitProduct)}>
                <Stack spacing='4' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                    <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                        <TextInput name='name' label='Product Name' control={control} type='text' defaultVal={currentProduct?.name} />
                        <TextInput name='type' label='Type' control={control} type='text' defaultVal={currentProduct?.type} />
                    </Flex>
                    <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                        <TextInput name='weight' label='Weight (kg)' control={control} type='number' defaultVal={currentProduct?.weight} />
                        <TextInput name='size' label='Size' control={control} type='number' defaultVal={currentProduct?.size} />
                    </Flex>

                    <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                        <TextInput name='pricePerBag' label='Price per bag (₦)' control={control} type='number' defaultVal={currentProduct?.pricePerBag} />
                        <SelectElement data={manufacturersOptions} label='Manufacturer' setManufacturerId={setManufacturerId} defaultVal={setManufacturerOption()} />
                    </Flex>

                    <TextInput fieldRef={manufacturerIdRef} name='manufacturerId' control={control} label='Manufacturer ID' type='hidden' defaultVal={currentProduct?.manufacturerId} />

                    <Button
                        type='submit'
                        data-intent={currentProduct ? 'update' : 'add'}
                        colorScheme='blue'
                        isLoading={isSubmitting ? true : false}
                        loadingText='Submitting...'
                        spinnerPlacement='end'
                        ref={submitBtnRef}
                        spinner={<Spinner
                            thickness='4px'
                            speed='0.5s'
                            emptyColor='gray.200'
                            color='blue.300'
                            size='md'
                        />}
                    >
                        {
                            currentProduct ?
                                'Update Product' :
                                'Add Product'
                        }
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}

export default ProductForm;