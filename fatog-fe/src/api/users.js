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

export const authenticate = async (data) => {
    const body = JSON.stringify(data);
    const method = 'POST';

    const response = await fetch(`${BASE_URL}/auth/login`, { body, method, headers: authHeaders });
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
    const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData)
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

export async function updateUser(userId, userData) {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(userData)
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

export async function changePassword(userData) {
    const res = await fetch(`${BASE_URL}/users/profile/change-password`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(userData)
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

export async function getUsers(request) {
    const res = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res, request);
    isError(res, data);

    return data;
}

export async function getUser(request, userId) {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res, request);
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

export async function activateUser(userId) {
    const res = await fetch(`${BASE_URL}/users/activate/${userId}`, {
        method: 'PATCH',
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

export async function deactivateUser(userId) {
    const res = await fetch(`${BASE_URL}/users/deactivate/${userId}`, {
        method: 'PATCH',
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