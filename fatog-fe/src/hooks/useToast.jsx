import {useToast} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export const useToastHook = () => {
    const [toastState, setToastState] = useState(null);
    const toast = useToast();

    useEffect(() => {
        if (toastState) {
            const {title, description, status, icon} = toastState;

            toast({
                title: title,
                description: description,
                status: status,
                duration: 9000,
                isClosable: true,
                position: 'top',
                icon: icon
            });
        }
    }, [toastState, toast]);

    return [toastState, setToastState];
};