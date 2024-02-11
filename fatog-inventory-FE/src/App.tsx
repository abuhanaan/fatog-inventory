// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Layout from "./components/Layout";
import Home from "./components/Home";
import { Route, createBrowserRouter, createRoutesFromChildren, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(createRoutesFromChildren(
    <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />

    </Route>
));

function App() {
    return (
        <RouterProvider router={router} />
    )
}

export default App;
