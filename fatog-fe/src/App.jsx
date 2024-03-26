// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Layout from "./components/layouts/Layout";
import Home from "./pages/Home";
import { loader as HomeLoader } from "./pages/Home";
import { Route, createBrowserRouter, createRoutesFromChildren, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RequireAuth from "./components/RequireAuth";
import InventoryLayout from "./components/layouts/InventoryLayout";
import Dashboard from "./pages/Dashboard";
import { loader as DashboardLoader } from "./pages/Dashboard";
import Products from "./pages/products/Products";
import { loader as ProductsLoader } from "./pages/products/Products";
import Manufacturers from "./pages/manufacturers/Manufacturers";
import { loader as ManufacturersLoader } from "./pages/manufacturers/Manufacturers";
import Page404 from './components/Page404';
import ProductForm from "./pages/products/ProductForm";
import { loader as ProductFormLoader } from "./pages/products/ProductForm";
import ProductView from "./pages/products/ProductView";
import { loader as ProductViewLoader } from "./pages/products/ProductView";
import ManufacturerForm from "./pages/manufacturers/ManufacturerForm";
import ManufacturerView from "./pages/manufacturers/ManufacturerView";
import { loader as ManufacturerViewLoader } from "./pages/manufacturers/ManufacturerView";
import UserForm from "./pages/users/UserForm";
import Users from "./pages/users/Users";
import { loader as UsersLoader } from "./pages/users/Users";
import UserView from "./pages/users/UserView";
import { loader as UserViewLoader } from "./pages/users/UserView";
import ProfileView from "./pages/users/ProfileView";
import { loader as ProfileViewLoader } from "./pages/users/ProfileView";
import ProfileForm from "./pages/users/ProfileForm";
import ChangePassword from "./pages/users/ChangePassword";
import { requireAuth } from "./hooks/useAuth";
import Error from "./components/Error";
import Inventories from "./pages/inventory/Inventories";
import { loader as InventoriesLoader } from "./pages/inventory/Inventories";
import InventoryView from "./pages/inventory/InventoryView";
import { loader as InventoryViewLoader } from "./pages/inventory/InventoryView";
import Histories from "./pages/history/Histories";
import { loader as HistoriesLoader } from "./pages/history/Histories";
import Stocks from "./pages/stocks/Stocks";
import { loader as StocksLoader } from "./pages/stocks/Stocks";
import StockCreate from "./pages/stocks/StockCreate";
import { loader as StockCreateLoader } from "./pages/stocks/StockCreate";
import StockList from "./pages/stocks/StockList";
import { loader as StockListLoader } from "./pages/stocks/StockList";
import StaffList from "./pages/users/staff/StaffList";
import { loader as StaffListLoader } from "./pages/users/staff/StaffList";
import StaffView from "./pages/users/staff/StaffView";
import { loader as StaffViewLoader } from "./pages/users/staff/StaffView";
import Customers from "./pages/users/customers/Customers";
import { loader as CustomersLoader } from "./pages/users/customers/Customers";
import Customer from "./pages/users/customers/Customer";
import { loader as CustomerLoader } from "./pages/users/customers/Customer";
import StockItem from "./pages/stocks/StockItem";
import { loader as StockItemLoader } from "./pages/stocks/StockItem";
import StockItemUpdate from "./pages/stocks/StockItemUpdate";
import { loader as StockItemUpdateLoader } from "./pages/stocks/StockItemUpdate";
import Orders from "./pages/orders/Orders";
import { loader as OrdersLoader } from "./pages/orders/Orders";
import OrderCreate from "./pages/orders/OrderCreate";
import { loader as OrderCreateLoader } from "./pages/orders/OrderCreate";
import OrderList from "./pages/orders/OrderList";
import { loader as OrderListLoader } from "./pages/orders/OrderList";
import OrderItem from "./pages/orders/OrderItem";
import { loader as OrderItemLoader } from "./pages/orders/OrderItem";
import OrderItemUpdate from "./pages/orders/OrderItemUpdate";
import { loader as OrderItemUpdateLoader } from "./pages/orders/OrderItemUpdate";
import SalesCreate from "./pages/sales/SalesCreate";
import { loader as SalesCreateLoader } from "./pages/sales/SalesCreate";
import Sales from "./pages/sales/Sales";
import { loader as SalesLoader } from "./pages/sales/Sales";
import Sale from "./pages/sales/Sale";
import { loader as SaleLoader } from "./pages/sales/Sale";
import History from "./pages/history/History";
import { loader as HistoryLoader } from "./pages/history/History";
import AddPayment from "./pages/sales/AddPayment";
import { loader as AddPaymentLoader } from "./pages/sales/AddPayment";

async function loader({ request }) {
    await requireAuth(request);
    return null;
}

const router = createBrowserRouter(createRoutesFromChildren(
    <Route path='/' element={<Layout />}>
        <Route index loader={HomeLoader} element={<Home />} />

        <Route element={<InventoryLayout />} errorElement={<Error />} loader={loader}>
            <Route path='dashboard' loader={DashboardLoader} element={<Dashboard />} />

            <Route path='users' loader={UsersLoader} element={<Users />} />
            <Route path='users/create' element={<UserForm />} loader={loader} />
            <Route path='users/:id' loader={UserViewLoader} element={<UserView />} />

            <Route path='staff' loader={StaffListLoader} element={<StaffList />} />
            <Route path='staff/:id' loader={StaffViewLoader} element={<StaffView />} />

            <Route path='customers' loader={CustomersLoader} element={<Customers />} />
            <Route path='customers/:id' loader={CustomerLoader} element={<Customer />} />

            <Route path='profile' element={<ProfileView />} loader={ProfileViewLoader} />
            <Route path='profile/update' element={<ProfileForm />} loader={loader} />
            <Route path='profile/change-password' element={<ChangePassword />} loader={loader} />

            <Route path='products' loader={ProductsLoader} element={<Products />} />
            <Route path='products/create' loader={ProductFormLoader} element={<ProductForm />} />
            <Route path='products/:id' loader={ProductViewLoader} element={<ProductView />} />

            <Route path='manufacturers' loader={ManufacturersLoader} element={<Manufacturers />} />
            <Route path='manufacturers/create' loader={loader} element={<ManufacturerForm />} />
            <Route path='manufacturers/:id' loader={ManufacturerViewLoader} element={<ManufacturerView />} />

            <Route path='inventories' loader={InventoriesLoader} element={<Inventories />} />
            <Route path='inventories/:id' loader={InventoryViewLoader} element={<InventoryView />} />
            <Route path='inventories/histories' loader={HistoriesLoader} element={<Histories />} />
            <Route path='inventories/histories/:id' loader={HistoryLoader} element={<History />} />

            {/* Stocks */}
            <Route path='stocks' loader={StocksLoader} element={<Stocks />} />
            <Route path='stocks/create' loader={StockCreateLoader} element={<StockCreate />} />
            <Route path='stocks/:id' loader={StockListLoader} element={<StockList />} />
            <Route path='stocks/:id/stocklist/:id' loader={StockItemLoader} element={<StockItem />} />
            <Route path='stocks/:id/stocklist/:id/edit' loader={StockItemUpdateLoader} element={<StockItemUpdate />} />

            {/* Orders */}
            <Route path='orders' loader={OrdersLoader} element={<Orders />} />
            <Route path='orders/create' loader={OrderCreateLoader} element={<OrderCreate />} />
            <Route path='orders/:id' loader={OrderListLoader} element={<OrderList />} />
            <Route path='orders/:id/orderlist/:id' loader={OrderItemLoader} element={<OrderItem />} />
            <Route path='orders/:id/orderlist/:id/edit' loader={OrderItemUpdateLoader} element={<OrderItemUpdate />} />

            {/* Sales */}
            <Route path='sales' loader={SalesLoader} element={<Sales />} />
            <Route path='sales/create/:id' loader={SalesCreateLoader} element={<SalesCreate />} />
            <Route path='sales/:id' loader={SaleLoader} element={<Sale />} />
            <Route path='sales/:id/payments/add' loader={AddPaymentLoader} element={<AddPayment />} />
        </Route>

        <Route path="*" element={<Page404 />} />
    </Route>
));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: 1
        },
    },
});

function App() {
    return (
        <RouterProvider router={router} />
    )
}

export default App;
