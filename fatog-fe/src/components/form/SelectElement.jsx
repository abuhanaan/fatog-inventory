import { Select, FormControl, FormLabel } from '@chakra-ui/react';
import { useState } from 'react';

const SelectElement = ({ data, setManufacturerId, label, defaultVal, placeholder, fieldRef }) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        label === 'Manufacturer' && setManufacturerId(value);

        if (fieldRef) {
            fieldRef.current.value = value;
        }
    }

    return (
        <FormControl>
            <FormLabel htmlFor={label}>{label}</FormLabel>
            <Select
                value={selectedOption ? selectedOption : defaultVal}
                placeholder={placeholder}
                onChange={handleChange}
                ref={fieldRef}
                textTransform='capitalize'
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