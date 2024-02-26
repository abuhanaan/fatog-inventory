import { useState, useEffect } from 'react';
import { InputGroup, InputLeftAddon, Input, Icon, Box } from '@chakra-ui/react';
import { IoSearch } from "react-icons/io5";

const SearchInput = ({ value: initValue, onChange, debounce = 500 }) => {
    const [value, setValue] = useState(initValue);

    useEffect(() => {
        setValue(initValue);
    }, [initValue]);

    // Run 0.5s after setting value in state
    useEffect(() => {
        const timeOut = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeOut);
    }, [value]);

    return (
        <Box w='xs'>
            <InputGroup size='sm'>
                <InputLeftAddon>
                    <Icon as={IoSearch} />
                </InputLeftAddon>
                <Input
                    type="text"
                    placeholder='Search'
                    value={value}
                    onChange={(e) => { setValue(e.target.value) }}
                />
            </InputGroup>
        </Box>
    )
}

export default SearchInput