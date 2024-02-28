// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Layout from "./components/layouts/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { Route, createBrowserRouter, createRoutesFromChildren, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RequireAuth from "./components/RequireAuth";
import InventoryLayout from "./components/layouts/InventoryLayout";
import Products from "./pages/products/Products";
import Manufacturers from "./pages/manufacturers/Manufacturers";
import Page404 from './components/Page404';
import ProductForm from "./pages/products/ProductForm";
import ProductView from "./pages/products/ProductView";
import ManufacturerForm from "./pages/manufacturers/ManufacturerForm";
import ManufacturerView from "./pages/manufacturers/ManufacturerView";

const router = createBrowserRouter(createRoutesFromChildren(
    <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />

        <Route element={<RequireAuth />}>
            <Route element={<InventoryLayout />}>
                <Route path='dashboard' element={<Dashboard />} />

                <Route path='products' element={<Products />} />
                <Route path='products/create' element={<ProductForm />} />
                <Route path='products/:id' element={<ProductView />} />

                <Route path='manufacturers' element={<Manufacturers />} />
                <Route path='manufacturers/create' element={<ManufacturerForm />} />
                <Route path='manufacturers/:id' element={<ManufacturerView />} />
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
