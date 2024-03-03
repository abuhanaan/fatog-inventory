import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Box, Stack } from '@chakra-ui/react';
import { requireAuth } from '../hooks/useAuth';

export const loader = async ({ request }) => {
    await requireAuth(request);
    const loggedInUser = JSON.parse(sessionStorage.getItem('user')) ?? null;

    return loggedInUser;
}

const Dashboard = () => {
    const loggedInUser = useLoaderData();
    const [dashboard, setDashboard] = useState(null);
    
    useEffect(() => {
        const { role } = loggedInUser.user;

        if (role === 'admin' || role === 'ceo') {
            setDashboard(<AdminDashboard />);
        }
        
        if (role === 'manager') {
            setDashboard(<ManagerDashboard />);
        }
        
        if (role === 'cashier') {
            setDashboard(<CashierDashboard />);
        }
    }, [loggedInUser]);

    return dashboard;
}

const AdminDashboard = () => {
    return (
        <Box>Admin Dashboard</Box>
    )
}

const ManagerDashboard = () => {
    return (
        <Box>Manager Dashboard</Box>
    )
}

const CashierDashboard = () => {
    return (
        <Box>Cashier Dashboard</Box>
    )
}

export default Dashboard;