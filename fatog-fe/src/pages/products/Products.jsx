import { useRef } from 'react';
import { useNavigate, Link, useLoaderData } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, Box, useDisclosure, IconButton, Button, Heading, Text} from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import Modal from '../../components/Modal';
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';

const columns = [
    { id: 'S/N', header: 'S/N' },
    { id: 'name', header: 'Name' },
    { id: 'type', header: 'Type' },
    { id: 'weight', header: 'Weight' },
    { id: 'size', header: 'Size' },
    { id: 'manufacturer', header: 'Manufacturer' },
    { id: 'actions', header: '' },
];

const products = [
    // { id: 1, name: 'Product 1', type: 'Type 1', weight: 10, size: 100, manufacturer: 'Vita Feed' },
    // { id: 2, name: 'Product 2', type: 'Type 2', weight: 10, size: 100, manufacturer: 'Vita Feed' },
    // { id: 3, name: 'Product 3', type: 'Type 3', weight: 10, size: 100, manufacturer: 'Vita Feed' },
];

const Products = () => {
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Products', ref: '/products' },
    ];

    return (
        <Stack spacing='6'>
            <Box>
                <Breadcrumb linkList={breadcrumbData} />
            </Box>
            <Heading fontSize='3xl' color='blue.700'>Products</Heading>
            <Box>
                {
                    products?.length === 0 ?
                        <EmptySearch headers={['S/N', 'NAME', 'TYPE', 'WEIGHT', 'SIZE', 'MANUFACTURER']} type='product' /> :
                        <ListingsTable data={products} columns={columns} fileName='products-data.csv' addLink='create' render={(product) => (
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

    function viewProduct(e) {
        e.preventDefault();

        const dataProductId = e.currentTarget.getAttribute('data-product-id');
        navigate(`./${dataProductId}`);
    }

    async function productDelete(e) {
        e.preventDefault();

        console.log(product.id);

        // const user = await deleteUser(userId);

        // if (user.unAuthorize) {
        //     const pathname = location.pathname;
        //     console.log(pathname);
        //     return redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
        // }

        // if (user.error || user.message) {
        //     toast.error(`${user.error}: ${user.message}`, {
        //         position: toast.POSITION.TOP_CENTER,
        //         autoClose: 2000,
        //     });
        //     setIsConfirmOpen(false);
        //     return user.error;
        // }

        // toast.success(`User activated successfully!`, {
        //     position: toast.POSITION.TOP_CENTER,
        //     autoClose: 2000,
        // });

        // setTimeout(() => {
        //     return redirect('/admin/users');
        // }, 3000);

        closeModalRef.current.click();
    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button onClick={productDelete} colorScheme='blue'>Delete</Button>
        </HStack>

    return (
        <>
            <HStack spacing='1'>
                <IconButton icon={<IoEyeOutline />} colorScheme='purple' size='sm' data-product-id={product.id} onClick={viewProduct} />

                <IconButton as={Link} to='create' icon={<MdOutlineEdit />} colorScheme='blue' size='sm' state={{ currentProduct: product }} />

                <IconButton icon={<MdDeleteOutline />} colorScheme='red' size='sm' data-product-id={product.id} onClick={onOpen} />
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