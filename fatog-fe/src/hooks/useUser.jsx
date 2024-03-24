import {useQuery} from '@tanstack/react-query';
import { authenticate } from '../api/user';

const key = 'login';

export const useLogin = (data) => {
    return useQuery([key], authenticate(data));
};