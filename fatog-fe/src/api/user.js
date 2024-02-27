import { jwtDecode } from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const headers = {
    'Content-Type': 'application/json'
};

export const authenticate = async (data) => {
    const body = JSON.stringify(data);
    const method = 'POST';

    const response = await fetch(`${BASE_URL}/auth/login`, { body, method, headers });
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