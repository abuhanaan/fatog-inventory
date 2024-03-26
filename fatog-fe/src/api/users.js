import { jwtDecode } from 'jwt-decode';
import { redirect } from 'react-router-dom';
import { isError } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authenticate = async (data) => {
    const body = JSON.stringify(data);
    const method = 'POST';

    const response = await fetch(`${BASE_URL}/auth/login`, { 
        body, 
        method, 
        headers: {
            'Content-Type': 'application/json',
        }, 
    });
    const responseData = await response.json();

    if (!response.ok) {
        return {
            statusCode: responseData.statusCode,
            message: responseData.message,
            error: responseData.error
        };
    }
    
    // Decode token and get the payload
    const decodedToken = jwtDecode(JSON.stringify(responseData.accessToken));
    const user = { ...decodedToken };

    return {
        ...responseData,
        user
    }
};

export async function createUser(userData) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function updateUser(userId, userData) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function changePassword(userData) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/users/profile/change-password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getUsers() {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getUser(userId) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function deleteUser(userId) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function activateUser(userId) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/users/activate/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function deactivateUser(userId) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/users/deactivate/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

const isUnauthorized = (res, request) => {
    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }
};

// const isError = (res, data) => {
//     if (!res.ok || data.error) {
//         return {
//             statusCode: data.statusCode,
//             message: data.message,
//             error: data.error ?? 'Something went wrong',
//             path: data.path
//         }
//     }
// };