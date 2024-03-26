import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { SizeInput } from '../../components/form/TextInput';
import { useForm } from 'react-hook-form';
import { Stack, HStack, VStack, Flex, Box, Icon, Spinner, Button, Heading, FormLabel, Text } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import { getStockItem, updateStockItem } from '../../api/stocks';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import Back from '../../components/Back';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getStockItem(params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode,
        };
    }

    const data = {
        id: response.id,
        refId: response.refId,
        productRefId: response.productRefId,
        noOfBags: response.noOfBags,
        pricePerBag: response.pricePerBag,
        totalWeight: response.totalWeight,
        totalAmount: response.totalAmount,
        date: response.createdAt,
        product: response.product,
        stock: response.stock,
    };

    return data;
}

const StockItemUpdate = () => {
    const navigate = useNavigate();
    const stockItem = useLoaderData();
    const { state, pathname } = useLocation();
    const currentStockItem = state && state.stockItem;
    const { product, stock } = stockItem;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: stockItem.error ?? '',
        message: stockItem.message ?? '',
        statusCode: stockItem.statusCode ?? '',
    });
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
        setValue,
    } = useForm();

    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Stocks', ref: '/stocks' },
        { name: 'Stock List', ref: `/stocks/${stock.id}` },
        { name: 'Stock Item', ref: `/stocks/${stock.id}/stocklist/${stockItem.id}` },
        { name: 'Stock Update', ref: `/stocks/${stock.id}/stocklist/${stockItem.id}/edit` },
    ];

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

    const stockItemUpdate = async (data) => {
        const stockItemData = {
            productRefId: stockItem.productRefId,
            pricePerBag: Number(data.pricePerBag),
            noOfBags: Number(data.noOfBags),
            totalAmount: Number(data.noOfBags * data.pricePerBag),
            totalWeight: Number(product.weight * data.noOfBags)
        };

        const stockItemId = stockItem.id;

        // console.log(stockItemData);

        // TODO: Consume stock item update API endpoint
        try {
            const response = await updateStockItem(stockItemId, stockItemData);

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
                description: 'Stock item updated successfully',
                status: 'success',
                icon: <Icon as={FaRegThumbsUp} />
            });

            setTimeout(() => {
                navigate(`/stocks/${stock.id}/stocklist/${stockItem.id}`);
            }, 6000);

        } catch (error) {
            return error;
        }
    };

    return (
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Stack direction={{base: 'column', sm: 'row'}} justifyContent='space-between' alignItems='center'>
                    <Breadcrumb linkList={breadcrumbData} />
                    <Back />
                </Stack>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Update Stock Item</Heading>
                </HStack>
                <form onSubmit={handleSubmit(stockItemUpdate)}>
                    <Stack spacing='6' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                        <TextInput name='pricePerBag' label='Price per Bag' control={control} type='number' defaultVal={stockItem.pricePerBag ?? currentStockItem.pricePerBag} />

                        <TextInput name='noOfBags' label='No of Bags' control={control} type='number' defaultVal={stockItem.noOfBags ?? currentStockItem.noOfBags} />

                        <Button
                            type='submit'
                            colorScheme='blue'
                            mt='4'
                            isLoading={isSubmitting ? true : false}
                            loadingText='Submitting...'
                            spinnerPlacement='end'
                            spinner={<Spinner
                                thickness='4px'
                                speed='0.5s'
                                emptyColor='gray.200'
                                color='blue.300'
                                size='md'
                            />}
                        >
                            Update Stock Item
                        </Button>
                    </Stack>
                </form>
            </Stack>
    )
}

export default StockItemUpdate;