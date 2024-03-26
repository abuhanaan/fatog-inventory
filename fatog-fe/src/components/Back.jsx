import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

const Back = () => {
    const navigate = useNavigate();

    return (
        <Button colorScheme='blue' leftIcon={<FaArrowLeftLong />} iconSpacing='4' onClick={() => navigate(-1)} variant='ghost'>Back</Button>
    )
}

export default Back