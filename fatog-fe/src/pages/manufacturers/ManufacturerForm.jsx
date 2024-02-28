import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { useForm } from 'react-hook-form';
import { Stack, HStack, Flex, Box, Spinner, Button, Heading } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import SelectElement from '../../components/form/SelectElement';

const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Manufacturers', ref: '/manufacturers' },
    { name: 'Manufacturer Form', ref: '/manufacturers/create' },
];

const ManufacturerForm = () => {
    const { state, pathname } = useLocation();
    const currentManufacturer = state && state.currentManufacturer;
    const manufacturerIdRef = useRef(null);
    const submitBtnRef = useRef(null);
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm();

    const submitManufacturer = async (data) => {
        const manufacturerData = {
            ...data
        };
        const buttonIntent = submitBtnRef.current.getAttribute('data-intent');
        console.log(manufacturerData);

        if (buttonIntent === 'add') {
            console.log(submitBtnRef.current.getAttribute('data-intent'));
            // TODO: Consume manufacturer create API endpoint
        }

        if (buttonIntent === 'update') {
            console.log(submitBtnRef.current.getAttribute('data-intent'));
            // TODO: Consume product update API endpoint
        }
    };

    return (
        <Stack spacing='6'>
            <Box>
                <Breadcrumb linkList={breadcrumbData} />
            </Box>
            <HStack justifyContent='space-between'>
                <Heading fontSize='3xl' color='blue.700'>{currentManufacturer ? `Update ${currentManufacturer.brandName}` : 'Add Manufacturer'}</Heading>
            </HStack>
            <form onSubmit={handleSubmit(submitManufacturer)}>
                <Stack spacing='4' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                    <TextInput name='brandName' label='Brand Name' control={control} type='text' defaultVal={currentManufacturer?.brandName} />

                    <TextInput name='repName' label='Representative Name' control={control} type='text' defaultVal={currentManufacturer?.repName} />

                    <TextInput name='repPhoneNumber' label='Representative Phone' control={control} type='text' defaultVal={currentManufacturer?.repPhoneNumber} />

                    <Button
                        type='submit'
                        data-intent={currentManufacturer ? 'update' : 'add'}
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
                                currentManufacturer ?
                                    'Update Manufacturer' :
                                    'Add Manufacturer'
                        }
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}

export default ManufacturerForm;