import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { useForm, Controller } from 'react-hook-form';
import { Stack, HStack, Flex, Box, Spinner, Button, Heading } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { products } from './Products';
import SelectElement from '../../components/form/SelectElement';

const formFields = [
    { name: 'name', label: 'Product Name' },
    { name: 'type', label: 'Feed Type' },
    { name: 'weight', label: 'Weight' },
    { name: 'size', label: 'Size' },
    { name: 'pricePerBag', label: 'Price per bag (₦)' },
    { name: 'manufacturer', label: 'Manufacturer' },
];

const manufacturers = [
    { id: 1, brandName: 'Optimal' },
    { id: 2, brandName: 'Kasmag' },
    { id: 3, brandName: 'Vital' },
];
const manufacturersOptions = manufacturers.map(manufacturer => manufacturer.brandName);
const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Products', ref: '/products' },
    { name: 'Product Form', ref: '/products/create' },
];

const ProductForm = () => {
    const { state, pathname } = useLocation();
    const currentProduct = state && state.currentProduct;
    const manufacturerIdRef = useRef(null);
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
        setValue,
    } = useForm();

    const addProduct = async (data) => {
        const productData = {
            ...data,
            weight: Number(data.weight),
            size: Number(data.size),
            pricePerBag: Number(data.pricePerBag),
        };

        setTimeout(() => {
            console.log(productData);
        }, 3000);
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
                <Heading fontSize='3xl' color='blue.700'>Add Products</Heading>
            </HStack>
            <form onSubmit={handleSubmit(addProduct)}>
                <Stack spacing='4' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                    <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                        <TextInput name='name' label='Product Name' control={control} type='text' defaultVal={ currentProduct?.name } />
                        <TextInput name='type' label='Type' control={control} type='text' defaultVal={ currentProduct?.type } />
                    </Flex>
                    <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                        <TextInput name='weight' label='Weight (kg)' control={control} type='number' defaultVal={ currentProduct?.weight } />
                        <TextInput name='size' label='Size' control={control} type='number' defaultVal={ currentProduct?.size } />
                    </Flex>

                    <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                        <TextInput name='pricePerBag' label='Price per bag (₦)' control={control} type='number' defaultVal={ currentProduct?.pricePerBag } />
                        <SelectElement data={manufacturersOptions} label='Manufacturer' setManufacturerId={setManufacturerId} defaultVal={setManufacturerOption()} />
                    </Flex>

                    <TextInput fieldRef={manufacturerIdRef} name='manufacturerId' control={control} label='Manufacturer ID' type='hidden' defaultVal={ currentProduct?.manufacturerId } />

                    <Button
                        type='submit'
                        colorScheme='blue'
                        isLoading={isSubmitting ? true : false}
                        loadingText='Submitting...'
                        spinnerPlacement='end'
                        spinner={<Spinner
                            thickness='4px'
                            speed='0.5s'
                            emptyColor='gray.200'
                            color='blue.300'
                            size='xl'
                        />}
                    >
                        {
                            isSubmitting ?
                                <Spinner
                                    thickness='4px'
                                    speed='0.5s'
                                    emptyColor='gray.200'
                                    color='blue.300'
                                    size='xl'
                                /> :
                                'Submit'
                        }
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}

export default ProductForm