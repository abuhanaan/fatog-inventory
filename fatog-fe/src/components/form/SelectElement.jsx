import { Select, FormControl, FormLabel } from '@chakra-ui/react';

const SelectElement = ({ data, setManufacturerId, label, defaultVal }) => {
    return (
        <FormControl>
            <FormLabel htmlFor={label}>{label}</FormLabel>
            <Select
                value={defaultVal ?? 'Select Manufacturer'}
                placeholder='Select Manufacturer'
                onChange={(e) => setManufacturerId(e.target.value)}
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