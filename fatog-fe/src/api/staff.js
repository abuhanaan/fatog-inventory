import { redirect } from 'react-router-dom';
import { isError } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/staffs';

export async function createStaff(staffData) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(staffData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function updateStaff(staffData) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}/profile-update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(staffData)
    });

    const data = await res.json();

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error,
            path: data.path
        }
    }

    return data;
}

export async function getStaff() {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
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

export async function getStaffData() {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    isError(res, data);

    return data;
    // return {
    //     statusCode: 401,
    //     message: 'You do not have the right to view the resource',
    //     error: 'Unauthorized',
    // }
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