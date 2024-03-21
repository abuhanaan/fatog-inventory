import { jwtDecode } from 'jwt-decode';
import { redirect } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const user = JSON.parse(sessionStorage.getItem('user'));
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.accessToken}`,
};
const authHeaders = {
    'Content-Type': 'application/json'
};

const ordinaryHeaders = {
    'Authorization': `Bearer ${user?.accessToken}`,
};

const endpoint = '/staffs';

export async function createStaff(staffData) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(staffData)
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorized: true,
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Unauthorized',
        }
    }

    isError(res, data);

    return data;
}

export async function updateStaff(staffData) {
    const res = await fetch(`${BASE_URL}${endpoint}/profile-update`, {
        method: 'PATCH',
        ordinaryHeaders,
        body: JSON.stringify(staffData)
    });

    const data = await res.json();

    // if (res.status === 401) {
    //     return {
    //         unAuthorized: true,
    //         statusCode: data.statusCode,
    //         message: data.message,
    //         error: data.error ?? 'Unauthorized',
    //     }
    // }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error,
            path: data.path
        }
    }

    console.log(data);

    return data;
}

export async function getStaff(request) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }
    
    isError(res, data);

    return data;
}

export async function getStaffData(request) {
    const res = await fetch(`${BASE_URL}${endpoint}/profile`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();
    console.log(res);

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    isError(res, data);

    return data;
}

export async function deleteUser(userId) {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers,
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorized: true,
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Unauthorized',
        }
    }

    isError(res, data);

    return data;
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