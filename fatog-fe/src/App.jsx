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

async function loader({ request }) {
    await requireAuth(request);
    return null;
}

const router = createBrowserRouter(createRoutesFromChildren(
    <Route path='/' element={<Layout />}>
        <Route index loader={HomeLoader} element={<Home />} />

        <Route element={<RequireAuth />}>
            <Route element={<InventoryLayout />} errorElement={<Error />}>
                <Route path='dashboard' loader={DashboardLoader} element={<Dashboard />} />

                <Route path='users' loader={UsersLoader} element={<Users />} />
                <Route path='users/create' element={<UserForm />} />
                <Route path='users/:id' loader={UserViewLoader} element={<UserView />} />

                <Route path='profile' element={<ProfileView />} loader={ProfileViewLoader} />
                <Route path='profile/update' element={<ProfileForm />} />
                <Route path='profile/change-password' element={<ChangePassword />} />

                <Route path='products' loader={ProductsLoader} element={<Products />} />
                <Route path='products/create' loader={ProductFormLoader} element={<ProductForm />} />
                <Route path='products/:id' loader={ProductViewLoader} element={<ProductView />} />

                <Route path='manufacturers' loader={ManufacturersLoader} element={<Manufacturers />} />
                <Route path='manufacturers/create' loader={loader} element={<ManufacturerForm />} />
                <Route path='manufacturers/:id' loader={ManufacturerViewLoader} element={<ManufacturerView />} />

                <Route path='inventories' loader={InventoriesLoader} element={<Inventories />} />
                <Route path='inventories/:id' loader={InventoryViewLoader} element={<InventoryView />} />
                <Route path='inventories/history' loader={HistoriesLoader} element={<Histories />} />


                <Route path='stocks' loader={StocksLoader} element={<Stocks />} />
                <Route path='stocks/create' loader={StockCreateLoader} element={<StockCreate />} />
            </Route>
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
