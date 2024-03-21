import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { SizeInput } from '../../components/form/TextInput';
import { useForm } from 'react-hook-form';
import { Stack, HStack, VStack, Flex, Box, Icon, Spinner, Button, IconButton, Heading, SimpleGrid, FormControl, FormLabel, Input, Textarea, Select, Text, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerFooter, DrawerBody, Card, CardHeader, CardBody } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import Tabs from '../../components/Tabs';
import SelectElement from '../../components/form/SelectElement';
import { getProducts } from '../../api/products';
import { createOrder } from '../../api/orders';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { HiOutlinePlus } from 'react-icons/hi';
import { getMonetaryValue } from '../stocks/StockCreate';

export const loader = async ({ request }) => {
    await requireAuth(request);
    const response = await getProducts(request);

    return response;
};

const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Orders', ref: '/orders' },
    { name: 'Create Order', ref: '/orders/create' },
];

const OrderCreate = () => {
    const products = useLoaderData();
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const focusInput = useRef();
    const [toastState, setToastState] = useToastHook();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [orderList, setOrderList] = useState([]);
    const [selectedOrderItem, setSelectedOrderItem] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    // const [pricePerBag, setPricePerBag] = useState(Number(''));
    const [noOfBags, setNoOfBags] = useState(Number(''));
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalNoOfBags, setTotalNoOfBags] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [shippingForm, setShippingForm] = useState({
        phoneNumber: '',
        shippingAddress: '',
        amountPaid: 0,
        paymentStatus: '',
        deliveryStatus: '',
        note: ''
    })

    const productOptions = products.map(product => product.name);

    useEffect(() => {
        let totalAmountValue = 0;
        let totalNoOfBagsValue = 0;
        let totalWeightValue = 0;

        orderList.forEach(orderItem => {
            totalAmountValue += orderItem.totalAmount;
            totalNoOfBagsValue += orderItem.noOfBags;
            totalWeightValue += orderItem.totalWeight;
        });

        setTotalAmount(totalAmountValue);
        setTotalNoOfBags(totalNoOfBagsValue);
        setTotalWeight(totalWeightValue);
    }, [orderList]);

    const openForm = () => {
        onOpen();
    }

    const addOrderItem = (e) => {
        e.preventDefault();

        if (!selectedProduct || !noOfBags) {
            setToastState({
                title: 'Empty field(s)',
                description: 'All fields are required.',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
        }

        const totalAmount = Number(selectedProduct.pricePerBag) * Number(noOfBags);
        const totalWeight = Number(selectedProduct.weight) * Number(noOfBags);

        const newOrderItem = {
            productRefId: selectedProduct.refId,
            noOfBags: Number(noOfBags),
            // pricePerBag: Number(selectedProduct.pricePerBag),
            totalWeight,  // optional
            totalAmount //optional
        };

        const existingOrderItemIndex = orderList.findIndex(orderItem => orderItem.productRefId === selectedProduct.refId);

        if (existingOrderItemIndex !== -1) {
            setToastState({
                title: 'Duplicate Entry!',
                description: 'The order item you intend to add already exist.',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
        } else {
            // TODO: Add order item to orders
            setOrderList(prev => ([
                newOrderItem,
                ...prev,
            ]));
        }

        // TODO: Reset form to empty
        resetForm();

        // Close form drawer
        onClose();
    }

    const showUpdateOrderItemForm = (orderItem) => {
        setSelectedOrderItem(orderItem);
        setSelectedProduct(filterProduct('refId', orderItem.productRefId));
        setNoOfBags(orderItem.noOfBags);

        onOpen();
    }

    const updateOrderItem = () => {
        if (!selectedProduct || !noOfBags) {
            setToastState({
                title: 'Empty field(s)',
                description: 'All fields are required',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            return;
        }

        const updatedOrderItem = {
            ...selectedOrderItem,
            productRefId: selectedProduct.refId,
            pricePerBag: selectedProduct.pricePerBag,
            noOfBags: noOfBags,
            totalAmount: selectedProduct.pricePerBag * noOfBags,
            totalWeight: selectedProduct.weight * noOfBags
        };

        const updatedOrderList = orderList.map(orderItem => orderItem === selectedOrderItem ? updatedOrderItem : orderItem);

        setOrderList(updatedOrderList);
        resetForm();
        onClose();
    }

    const resetForm = () => {
        setSelectedProduct(null);
        setNoOfBags(0);
        setSelectedOrderItem(null);
    }

    const clearOrderList = () => {
        setOrderList([]);
        resetForm();
    }

    const closeDrawer = () => {
        resetForm();
        onClose();
    }

    const handleProductChange = (e) => {
        e.preventDefault();

        const selectedProductName = e.target.value;
        const filteredProduct = filterProduct('name', selectedProductName);
        setSelectedProduct(filteredProduct);
    }

    const submitOrderList = async () => {
        setIsSubmitting(true);

        if (!orderList) {
            setToastState({
                title: 'Empty order list',
                description: 'Please add one or more orders.',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsSubmitting(false);
            return;
        }

        if (!shippingForm.phoneNumber || !shippingForm.shippingAddress) {
            setToastState({
                title: 'Missing field(s)',
                description: 'Please fill all required fields.',
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsSubmitting(false);
            return;
        }

        const orderListData = {
            data: [...orderList],
            phoneNumber: shippingForm.phoneNumber,
            shippingAddress: shippingForm.shippingAddress,
            amountPaid: 0,
            paymentStatus: shippingForm.paymentStatus,
            deliveryStatus: shippingForm.deliveryStatus,
            note: shippingForm.note,
        }

        console.log(orderListData)

        // TODO: Consume create order list API endpoint
        try {
            const response = await createOrder(orderListData);

            if (response.unAuthorize) {
                sessionStorage.removeItem('user');
                navigate(`/?message=${response.message}. Please log in to continue&redirectTo=${pathname}`);
            }

            console.log(`Order creation response body: \n`, response);

            if (response.error || response.message) {
                setIsSubmitting(false);
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
                description: 'Order created successfully',
                status: 'success',
                icon: <Icon as={FaRegThumbsUp} />
            });

            setIsSubmitting(false);

            setTimeout(() => {
                navigate(`/orders`);
            }, 6000);

        } catch (error) {
            return error;
        }
    }

    const deleteOrderItem = (orderItem) => {
        const updatedOrderList = orderList.filter(item => item !== orderItem);
        setOrderList(updatedOrderList);
    }

    const filterProduct = (key, value) => {
        return products.filter(prod => prod[key] === value)[0];
    }

    const orderListGrid = (
        <Stack spacing='4'>
            {
                orderList.map((orderItem, index) => (
                    <OrderItem
                        key={index}
                        orderItem={orderItem}
                        products={products}
                        deleteOrderItem={deleteOrderItem}
                        showUpdateOrderItemForm={showUpdateOrderItemForm}
                    />
                ))
            }
        </Stack>
    );

    const orderSummary = (
        <Stack borderLeftWidth='1px' p='4'>
            <Heading fontSize='sm' textTransform='uppercase'>
                Order List Summary
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
                <Button w='full' variant='outline' colorScheme='red' onClick={clearOrderList}>Clear Order List</Button>
            </Stack>
        </Stack>
    );

    const tabTitles = ['Order Details', 'Shipping Details'];
    const tabPanels = [
        <OrderListPanel orderListGrid={orderListGrid} orderSummary={orderSummary} />,
        <ShippingForm setShippingForm={setShippingForm} shippingForm={shippingForm} submit={submitOrderList} isSubmitting={isSubmitting} />
    ];

    return (
        <Stack spacing='6'>
            <Box>
                <Breadcrumb linkList={breadcrumbData} />
            </Box>
            <HStack justifyContent='space-between'>
                <Heading fontSize='3xl' color='blue.700'>Create Order</Heading>
                <Button colorScheme='blue' leftIcon={<HiOutlinePlus />} onClick={openForm}>Add Order Item</Button>
            </HStack>
            {
                orderList.length === 0 ?
                    <VStack h='60vh' justifyContent='center'>
                        <Heading fontSize='2xl'>Order list is empty.</Heading>
                        <Text>Add orders to view a list of order items.</Text>
                    </VStack> :
                    <Tabs titles={tabTitles} panels={tabPanels} variant='enclosed' />
            }

            {/* Order Creation Form */}
            <Drawer isOpen={isOpen} onClose={closeDrawer} initialFocusRef={focusInput} closeOnOverlayClick={false}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>{selectedOrderItem ? 'Update Order Item' : 'Add Order Item'}</DrawerHeader>

                    <DrawerBody>
                        <Stack spacing='24px'>
                            <FormControl>
                                <FormLabel htmlFor='product'>Select Product</FormLabel>
                                <Select
                                    id='product'
                                    value={selectedProduct ? selectedProduct.name : ''}
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
                        <Button onClick={selectedOrderItem ? updateOrderItem : addOrderItem} colorScheme='blue'>{selectedOrderItem ? 'Update' : 'Add'}</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Stack >
    )
}

const ShippingForm = ({ setShippingForm, shippingForm, submit, isSubmitting }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;

        setShippingForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <Stack spacing='4' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
            <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                <FormControl>
                    <FormLabel htmlFor='phoneNumber'>Phone Number</FormLabel>
                    <Input
                        id='phoneNumber'
                        name='phoneNumber'
                        value={shippingForm.phoneNumber}
                        onChange={handleChange}
                        type='text'
                        placeholder='Phone Number'
                        required
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor='shippingAddress'>Shipping Address</FormLabel>
                    <Input
                        id='shippingAddress'
                        name='shippingAddress'
                        value={shippingForm.shippingAddress}
                        onChange={handleChange}
                        placeholder='Shipping Address'
                        required
                    />
                </FormControl>
            </Flex>

            {/* <Flex gap={{ base: '4', md: '6' }} direction={{ base: 'column', sm: 'row' }}>
                <FormControl>
                    <FormLabel htmlFor='paymentStatus'>Payment Status</FormLabel>
                    <Select
                        id='paymentStatus'
                        name='paymentStatus'
                        value={shippingForm.paymentStatus}
                        onChange={handleChange}
                        required
                    >
                        <option value=''>Select Payment Status</option>
                        <option value='fully paid'>Fully Paid</option>
                        <option value='partly paid'>Partly Paid</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor='deliveryStatus'>Delivery Status</FormLabel>
                    <Select
                        id='deliveryStatus'
                        name='deliveryStatus'
                        value={shippingForm.deliveryStatus}
                        onChange={handleChange}
                        required
                    >
                        <option value=''>Select Delivery Status</option>
                        <option value='pending'>Pending</option>
                        <option value='delivered'>Delivered</option>
                    </Select>
                </FormControl>
            </Flex> */}

            <FormControl>
                <FormLabel htmlFor='note'>Note</FormLabel>
                <Textarea
                    id='note'
                    name='note'
                    value={shippingForm.note}
                    onChange={handleChange}
                    placeholder='Note'
                />
            </FormControl>

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
                onClick={submit}
            >
                Submit Order List
            </Button>
        </Stack>
    )
}

const OrderItem = ({ orderItem, products, deleteOrderItem, showUpdateOrderItemForm }) => {
    return (
        <Card >
            <CardHeader borderBottomWidth='1px' px='3' py='2'>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='sm'>
                        {
                            products.filter(product => product.refId === orderItem.productRefId)[0].name
                        }
                    </Heading>
                    <HStack>
                        <IconButton icon={<MdOutlineEdit />} colorScheme='purple' size='xs' onClick={() => showUpdateOrderItemForm(orderItem)} />
                        <IconButton icon={<FaRegTrashCan />} colorScheme='red' size='xs' onClick={() => deleteOrderItem(orderItem)} />
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
                            {getMonetaryValue(orderItem.pricePerBag)}
                        </Text>
                    </Box>
                    <Box>
                        <Heading fontSize='sm' fontWeight='semibold' textTransform='uppercase'>
                            Quantity
                        </Heading>
                        <Text fontSize='sm'>
                            {orderItem.noOfBags}
                        </Text>
                    </Box>
                    <Box>
                        <Heading fontSize='sm' fontWeight='semibold' textTransform='uppercase'>
                            Amount
                        </Heading>
                        <Text fontSize='sm'>
                            {getMonetaryValue(orderItem.totalAmount)}
                        </Text>
                    </Box>
                    <Box>
                        <Heading fontSize='sm' fontWeight='semibold' textTransform='uppercase'>
                            Total Weight
                        </Heading>
                        <Text fontSize='sm'>
                            {orderItem.totalWeight}
                        </Text>
                    </Box>
                </SimpleGrid>
            </CardBody>
        </Card>
    )
}

const OrderListPanel = ({ orderListGrid, orderSummary }) => {
    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing='4' py='6' borderTopWidth='1px'>
            {orderListGrid}
            {orderSummary}
        </SimpleGrid>
    )
}

export default OrderCreate;