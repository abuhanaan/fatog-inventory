import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { SizeInput } from '../../components/form/TextInput';
import { useForm } from 'react-hook-form';
import { Stack, HStack, VStack, Flex, Box, Icon, Spinner, Button, IconButton, Heading, SimpleGrid, FormControl, FormLabel, Input, Select, Text, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerFooter, DrawerBody, Card, CardHeader, CardBody } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import SelectElement from '../../components/form/SelectElement';
import { getProducts } from '../../api/products';
import { createStock } from '../../api/stocks';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { HiOutlinePlus } from 'react-icons/hi';
import { isUnauthorized, getMonetaryValue } from '../../utils';
import FetchError from '../../components/FetchError';
import Back from '../../components/Back';

export const loader = async ({ request }) => {
    await requireAuth(request);
    const response = await getProducts();

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode,
        };
    }

    return response;
};

const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Stocks', ref: '/stocks' },
    { name: 'Create Stock', ref: '/stocks/create' },
];

const StockCreate = () => {
    const products = useLoaderData();
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const focusInput = useRef();
    const [toastState, setToastState] = useToastHook();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState({
        error: products.error ?? '',
        message: products.message ?? '',
        statusCode: products.statusCode ?? '',
    });

    const [stockList, setStockList] = useState([]);
    const [selectedStockItem, setSelectedStockItem] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pricePerBag, setPricePerBag] = useState(Number(''));
    const [noOfBags, setNoOfBags] = useState(Number(''));
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalNoOfBags, setTotalNoOfBags] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [file, setFile] = useState();

    const productOptions = products.map(product => product.name);

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

    useEffect(() => {
        let totalAmountValue = 0;
        let totalNoOfBagsValue = 0;
        let totalWeightValue = 0;

        stockList.forEach(stockItem => {
            totalAmountValue += stockItem.totalAmount;
            totalNoOfBagsValue += stockItem.noOfBags;
            totalWeightValue += stockItem.totalWeight;
        });

        setTotalAmount(totalAmountValue);
        setTotalNoOfBags(totalNoOfBagsValue);
        setTotalWeight(totalWeightValue);
    }, [stockList]);

    const openForm = () => {
        onOpen();
    }

    const addStockItem = (e) => {
        e.preventDefault();

        if (!selectedProduct || !pricePerBag || !noOfBags) {
            setToastState({
                title: 'Empty field(s)',
                description: 'All fields are required',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
        }

        const totalAmount = Number(pricePerBag) * Number(noOfBags);
        const totalWeight = Number(selectedProduct.weight) * Number(noOfBags);

        const newStockItem = {
            productRefId: selectedProduct.refId,
            noOfBags: Number(noOfBags),
            pricePerBag: Number(pricePerBag),
            totalWeight,  // optional
            totalAmount //optional
        };

        const existingStockItemIndex = stockList.findIndex(stockItem => stockItem.productRefId === selectedProduct.refId);

        if (existingStockItemIndex !== -1) {
            setToastState({
                title: 'Duplicate Entry!',
                description: 'The stock item you intend to add already exist.',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
            // const updatedStockItem = {
            //     ...stockList[existingStockItemIndex],
            //     pricePerBag: Number(pricePerBag),
            //     noOfBags: Number(stockList[existingStockItemIndex].noOfBags) + Number(noOfBags),
            //     totalAmount: Number(stockList[existingStockItemIndex].totalAmount) + Number(totalAmount),
            //     totalWeight: Number(stockList[existingStockItemIndex].totalWeight) + Number(totalWeight)
            // };

            // const updatedStockList = [...stockList];
            // updatedStockList[existingStockItemIndex] = updatedStockItem;
            // setStockList(updatedStockList);
        } else {
            // TODO: Add stock item to stocks
            setStockList(prev => ([
                newStockItem,
                ...prev,
            ]));
        }


        // TODO: Reset form to empty
        resetForm();

        // Close form drawer
        onClose();
    }

    const showUpdateStockItemForm = (stockItem) => {
        setSelectedStockItem(stockItem);
        setSelectedProduct(filterProduct('refId', stockItem.productRefId));
        setPricePerBag(stockItem.pricePerBag);
        setNoOfBags(stockItem.noOfBags);

        onOpen();
    }

    const updateStockItem = () => {
        if (!selectedProduct || !pricePerBag || !noOfBags) {
            setToastState({
                title: 'Empty field(s)',
                description: 'All fields are required',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
        }

        const updatedStockItem = {
            ...selectedStockItem,
            productRefId: selectedProduct.refId,
            pricePerBag: pricePerBag,
            noOfBags: noOfBags,
            totalAmount: pricePerBag * noOfBags,
            totalWeight: selectedProduct.weight * noOfBags
        };

        const updatedStockList = stockList.map(stockItem => stockItem === selectedStockItem ? updatedStockItem : stockItem);

        setStockList(updatedStockList);
        resetForm();
        onClose();
    }

    const resetForm = () => {
        setSelectedProduct(null);
        setPricePerBag(0);
        setNoOfBags(0);
        setSelectedStockItem(null);
    }

    const handleProductChange = (e) => {
        e.preventDefault();

        const selectedProductName = e.target.value;
        const filteredProduct = filterProduct('name', selectedProductName);
        setSelectedProduct(filteredProduct);
    }

    const submitStockList = async () => {
        setIsSubmitting(true);

        if (!stockList) {
            setToastState({
                title: 'Empty stock list',
                description: 'Please add one or more stocks.',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsSubmitting(false);
            return;
        }

        const stockListData = {
            data: [...stockList],
        }
        // console.log(stockListData);

        // TODO: Consume create stock list API endpoint
        try {
            const response = await createStock(stockListData);

            if (response.error || response.message) {
                setIsSubmitting(false);
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
                description: 'Stock created successfully',
                status: 'success',
                icon: <Icon as={FaRegThumbsUp} />
            });

            setIsSubmitting(false);

            setTimeout(() => {
                navigate(`/stocks`);
            }, 6000);

        } catch (error) {
            return error;
        }
    }

    const deleteStockItem = (stockItem) => {
        const updatedStockList = stockList.filter(item => item !== stockItem);
        setStockList(updatedStockList);
    }

    const clearStockList = () => {
        setStockList([]);
        resetForm();
    }

    const closeDrawer = () => {
        resetForm();
        onClose();
    }

    const filterProduct = (key, value) => {
        return products.filter(prod => prod[key] === value)[0];
    }

    const stockListGrid = (
        <Stack spacing='4'>
            {
                stockList.map((stockItem, index) => (
                    <StockItem
                        key={index}
                        stockItem={stockItem}
                        products={products}
                        deleteStockItem={deleteStockItem}
                        showUpdateStockItemForm={showUpdateStockItemForm}
                    />
                ))
            }
        </Stack>
    );

    const stockSummary = (
        <Stack borderLeftWidth='1px' p='4'>
            <Heading fontSize='sm' textTransform='uppercase'>
                Stock List Summary
            </Heading>

            <Stack bg='gray.200' p='4' spacing='3'>
                <HStack justifyContent='space-between'>
                    <Text>Total No. of Bags</Text>
                    <Text fontWeight='bold'>
                        {totalNoOfBags}
                    </Text>
                </HStack>
                <HStack justifyContent='space-between'>
                    <Text>Total Weight</Text>
                    <Text fontWeight='bold'>
                        {totalWeight}
                    </Text>
                </HStack>
                <HStack justifyContent='space-between'>
                    <Text>Total Amount</Text>
                    <Text fontWeight='bold'>
                        {getMonetaryValue(totalAmount)}
                    </Text>
                </HStack>
            </Stack>

            <Stack direction={{ base: 'column', lg: 'row' }} spacing='4' mt='4'>
                <Button w='full' variant='outline' colorScheme='red' onClick={clearStockList}>Clear Stock List</Button>
                <Button
                    w='full'
                    colorScheme='blue'
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
                    onClick={submitStockList}
                >
                    Submit Stock List
                </Button>
            </Stack>
        </Stack>
    );

    return (
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Stack direction={{base: 'column', sm: 'row'}} justifyContent='space-between' alignItems='center'>
                    <Breadcrumb linkList={breadcrumbData} />
                    <Back />
                </Stack>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Create Stock</Heading>
                    <Button colorScheme='blue' leftIcon={<HiOutlinePlus />} onClick={openForm}>Add Stock Item</Button>
                </HStack>
                {
                    stockList.length === 0 ?
                        <VStack h='60vh' justifyContent='center'>
                            <Heading fontSize='2xl'>Stock list is empty.</Heading>
                            <Text>Add stocks to view a list of stock items.</Text>
                        </VStack> :
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing='4' py='6' borderTopWidth='1px'>
                            {stockListGrid}
                            {stockSummary}
                        </SimpleGrid>
                }

                {/* Stock Creation Form */}
                <Drawer isOpen={isOpen} onClose={closeDrawer} initialFocusRef={focusInput} closeOnOverlayClick={false}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>{selectedStockItem ? 'Update Stock Item' : 'Add Stock Item'}</DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <FormControl>
                                    <FormLabel htmlFor='product'>Select Product</FormLabel>
                                    <Select
                                        id='product'
                                        value={selectedProduct?.name}
                                        onChange={handleProductChange}
                                        ref={focusInput}
                                    >
                                        <option value=''>Select Product</option>
                                        {productOptions.map((product, index) => (
                                            <option key={index} value={product}>{product}</option>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor='pricePerBag'>Unit Price(₦)</FormLabel>
                                    <Input
                                        id='pricePerBag'
                                        name='pricePerBag'
                                        value={pricePerBag ? pricePerBag : ''}
                                        onChange={(e) => setPricePerBag(e.target.value)}
                                        type='number'
                                        placeholder='Unit Price Per Bag'
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor='noOfBags'>No. of Bags</FormLabel>
                                    <Input
                                        id='noOfBags'
                                        name='noOfBags'
                                        value={noOfBags ? noOfBags : ''}
                                        onChange={(e) => setNoOfBags(e.target.value)}
                                        type='number'
                                        placeholder='No. of Bags'
                                    />
                                </FormControl>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant='outline' mr={3} onClick={closeDrawer}>
                                Cancel
                            </Button>
                            <Button onClick={selectedStockItem ? updateStockItem : addStockItem} colorScheme='blue'>{selectedStockItem ? 'Update' : 'Add'}</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Stack >
    )
}

const StockItem = ({ stockItem, products, deleteStockItem, showUpdateStockItemForm }) => {
    return (
        <Card >
            <CardHeader borderBottomWidth='1px' px='3' py='2'>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='sm'>
                        {
                            products.filter(product => product.refId === stockItem.productRefId)[0].name
                        }
                    </Heading>
                    <HStack>
                        <IconButton icon={<MdOutlineEdit />} colorScheme='purple' size='xs' onClick={() => showUpdateStockItemForm(stockItem)} />
                        <IconButton icon={<FaRegTrashCan />} colorScheme='red' size='xs' onClick={() => deleteStockItem(stockItem)} />
                    </HStack>
                </HStack>
            </CardHeader>

            <CardBody px='3' py='2'>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing='2'>
                    <Box>
                        <Heading fontSize='sm' fontWeight='semibold' textTransform='uppercase'>
                            Unit Price
                        </Heading>
                        <Text fontSize='sm'>
                            {getMonetaryValue(stockItem.pricePerBag)}
                        </Text>
                    </Box>
                    <Box>
                        <Heading fontSize='sm' fontWeight='semibold' textTransform='uppercase'>
                            Quantity
                        </Heading>
                        <Text fontSize='sm'>
                            {stockItem.noOfBags}
                        </Text>
                    </Box>
                    <Box>
                        <Heading fontSize='sm' fontWeight='semibold' textTransform='uppercase'>
                            Amount
                        </Heading>
                        <Text fontSize='sm'>
                            {getMonetaryValue(stockItem.totalAmount)}
                        </Text>
                    </Box>
                    <Box>
                        <Heading fontSize='sm' fontWeight='semibold' textTransform='uppercase'>
                            Total Weight
                        </Heading>
                        <Text fontSize='sm'>
                            {stockItem.totalWeight}
                        </Text>
                    </Box>
                </SimpleGrid>
            </CardBody>
        </Card>
    )
}

export default StockCreate;