import { redirect } from 'react-router-dom';

const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;

export const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
};

export const authHeaders = {
    'Content-Type': 'application/json'
};

export const isUnauthorized = (res, navigate, pathname) => {
    if (res.statusCode === 401) {
        const message = `${res.message}. Please login to continue.`;
        sessionStorage.removeItem('user');
        navigate(`/`, { state: { message, redirectTo: pathname } });
    }
};

export const isError = (res, data) => {
    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }
};

export const getInfoArray = (obj) => {
    const infoArray = [];

    for (const [key, value] of Object.entries(obj)) {
        infoArray.push({ key, value });
    }

    return infoArray;
}

export const getMonetaryValue = (value) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    }).format(value);
}

export const formatDate = (dateParam) => {
    if (!dateParam) return '-'
    
    const date = new Date(dateParam);
    return date.toLocaleString();
};


// const isUnauthorized = (res, request) => {
//     if (res.status === 401) {
//         const pathname = new URL(request.url).pathname;
//         throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
//     }
// };