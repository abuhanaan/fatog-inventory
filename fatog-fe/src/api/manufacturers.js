import { redirect } from 'react-router-dom';
import { isError } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/manufacturers';

export async function createManufacturer(manufacturerData) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(manufacturerData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function updateManufacturer(manufacturerId, manufacturerData) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}/${manufacturerId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(manufacturerData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getManufacturers() {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;

    const res = await fetch(`${BASE_URL}/manufacturers`, {
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

export async function getManufacturer(manufacturerId) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}/${manufacturerId}`, {
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

export async function deleteManufacturer(manufacturerId) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    try {
        const res = await fetch(`${BASE_URL}${endpoint}/${manufacturerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await res.json();

        isError(res, data);

        return {
            ...data,
            ok: true
        };
    } catch (error) {
        return error;
    }
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