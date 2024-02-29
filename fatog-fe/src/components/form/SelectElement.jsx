import { Select, FormControl, FormLabel } from '@chakra-ui/react';
import { useState } from 'react';

const SelectElement = ({ data, setManufacturerId, label, defaultVal='Select Manufacturer' }) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        setManufacturerId(value);
    }

    return (
        <FormControl>
            <FormLabel htmlFor={label}>{label}</FormLabel>
            <Select
                // value={defaultVal ?? 'Select Manufacturer'}
                value={selectedOption ?? defaultVal}
                placeholder='Select Manufacturer'
                // onChange={(e) => setManufacturerId(e.target.value)}
                onChange={handleChange}
            >
                {
                    data.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))
                }
            </Select>
        </FormControl>
    )
}

export default SelectElement;