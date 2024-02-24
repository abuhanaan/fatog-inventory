// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Layout from "./components/Layout";
import Home from "./components/Home";
import Dashboard from "./pages/Dashboard";
import { Route, createBrowserRouter, createRoutesFromChildren, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RequireAuth from "./components/RequireAuth";

const router = createBrowserRouter(createRoutesFromChildren(
        <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />

            <Route element={<RequireAuth />}>
                <Route path='dashboard' element={<Dashboard />} />
            </Route>

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
