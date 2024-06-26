import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { SizeInput } from '../../components/form/TextInput';
import { useForm } from 'react-hook-form';
import { Stack, VStack, HStack, Flex, Box, Icon, Spinner, Button, Heading, FormLabel, Text } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import SelectElement from '../../components/form/SelectElement';
import { createProduct, updateProduct } from '../../api/products';
import { getManufacturers } from '../../api/manufacturers';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import Back from '../../components/Back';

export const loader = async ({ request }) => {
    await requireAuth(request);
    const response = await getManufacturers();
    
    // console.log(response)
    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode
        }
    }

    return response;
};

const ProductForm = () => {
    const manufacturers = useLoaderData();
    const navigate = useNavigate();
    const [error, setError] = useState({
        error: manufacturers.error ?? '',
        message: manufacturers.message ?? '',
        statusCode: manufacturers.statusCode ?? '',
    });
    const { state, pathname } = useLocation();
    const currentProduct = state && state.currentProduct;
    const manufacturerIdRef = useRef(null);
    const submitBtnRef = useRef(null);
    const productTypeRef = useRef(null);
    const [brandName, setBrandName] = useState(currentProduct ? String(currentProduct?.manufacturer).replace(/\s+/g, '').toUpperCase() : '');
    const [feedSize, setFeedSize] = useState('');
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
    const productTypeOptions = ['sinking', 'floating'];

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

    const submitProduct = async (data) => {
        const productData = {
            ...data,
            weight: Number(data.weight),
            size: Number(feedSize[0]),
            pricePerBag: Number(data.pricePerBag),
            name: getProductName(),
            type: productTypeRef.current.value.toLowerCase()
        };

        const buttonIntent = submitBtnRef.current.getAttribute('data-intent');

        if (buttonIntent === 'add') {
            // TODO: Consume create product API endpoint
            try {
                const response = await createProduct(productData);

                if (response.error || response.message) {
                    setToastState({
                        title: response.error,
                        description: response.message,
                        status: 'error',
                        icon: <Icon as={BiError} />
                    });

                    setTimeout(() => {
                        isUnauthorized(response, navigate, pathname);
                    }, 6000);

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
            const productId = currentProduct.id;
            // TODO: Consume product update API endpoint
            try {
                const response = await updateProduct(productId, productData);

                if (response.error || response.message) {
                    setToastState({
                        title: response.error,
                        description: response.message,
                        status: 'error',
                        icon: <Icon as={BiError} />
                    });

                    setTimeout(() => {
                        isUnauthorized(response, navigate, pathname);
                    }, 6000);

                    return response.error;
                }

                setToastState({
                    title: 'Success!',
                    description: 'Product updated successfully',
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
    };

    const getFeedSize = (size) => {
        setFeedSize(`${size}mm`.toUpperCase());
    }

    const getProductName = () => {
        return `${brandName}-${feedSize}`;
    }

    const setManufacturerId = (selectedValue) => {
        const fieldName = manufacturerIdRef.current.name;
        const selectedManufacturer = manufacturers.filter(manufacturer => manufacturer.brandName === selectedValue);
        setValue(fieldName, selectedManufacturer[0]?.id);
        setBrandName(selectedValue.replace(/\s+/g, '').toUpperCase());
    }

    const setManufacturerOption = () => {
        if (currentProduct) {
            const selectedManufacturer = manufacturers.filter(manufacturer => manufacturer.id === currentProduct.manufacturerId);

            return selectedManufacturer[0].brandName;
        }
    }

    return (
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Stack direction={{base: 'column', sm: 'row'}} justifyContent='space-between' alignItems='center'>
                    <Breadcrumb linkList={breadcrumbData} />
                    <Back />
                </Stack>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>{currentProduct ? `Update ${currentProduct.name}` : 'Add Product'}</Heading>
                </HStack>
                <form onSubmit={handleSubmit(submitProduct)}>
                    <Stack spacing='4' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                        <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                            <SelectElement data={manufacturersOptions} label='Manufacturer' setManufacturerId={setManufacturerId} defaultVal={setManufacturerOption()} placeholder='Select Manufacturer' />
                            <SizeInput name='size' label='Size' control={control} type='number' getFeedSize={getFeedSize} defaultVal={currentProduct ? currentProduct.size : ''} />
                        </Flex>
                        <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                            <TextInput name='weight' label='Weight (kg)' control={control} type='number' defaultVal={currentProduct?.weight} />
                            <SelectElement data={productTypeOptions} label='Type' defaultVal={currentProduct ? currentProduct.type : ''} placeholder='Select Product Type' fieldRef={productTypeRef} />
                            {/* <TextInput name='type' label='Type' control={control} type='text' defaultVal={currentProduct?.type} /> */}
                        </Flex>

                        <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                            <TextInput name='pricePerBag' label='Price per bag (₦)' control={control} type='number' defaultVal={currentProduct?.pricePerBag} />
                            <Stack w='full' spacing='0'>
                                <FormLabel>Product Name</FormLabel>
                                <Text borderWidth='1px' p='2' borderRadius='md' bg='gray.100'>{currentProduct ? currentProduct.name : getProductName()}</Text>
                            </Stack>
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