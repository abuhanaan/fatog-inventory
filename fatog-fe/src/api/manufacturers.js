import { redirect } from 'react-router-dom';
import { headers } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/manufacturers';

export async function createManufacturer(manufacturerData) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(manufacturerData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function updateManufacturer(manufacturerId, manufacturerData) {
    const res = await fetch(`${BASE_URL}${endpoint}/${manufacturerId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(manufacturerData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getManufacturers() {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getManufacturer(manufacturerId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${manufacturerId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function deleteManufacturer(manufacturerId) {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}/${manufacturerId}`, {
            method: 'DELETE',
            headers,
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

const isError = (res, data) => {
    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }
};