import { FormControl, FormLabel, FormHelperText, Input } from "@chakra-ui/react";
import { useController } from 'react-hook-form';
import { useState } from "react";

const TextInput = ({ name, label, control, type, fieldRef, defaultVal, helperText, ...rest }) => {
    const { field } = useController({
        name,
        control,
        defaultValue: defaultVal ?? ''
    });

    return (
        <FormControl>
            {type !== 'hidden' && <FormLabel htmlFor={name}>{label}</FormLabel>}

            <Input
                name={name}
                control={control}
                label={label}
                id={name}
                type={type}
                {...field}
                {...rest}
                value={field.value}
                placeholder={label}
                ref={fieldRef}
                required
            />
            {
                helperText &&
                <FormHelperText>{helperText}</FormHelperText>
            }
        </FormControl>
    )
}

export const SizeInput = ({ name, label, control, type, fieldRef, defaultVal, helperText, getFeedSize, ...rest }) => {
    const [size, setSize] = useState('');
    const { field } = useController({
        name,
        control,
        defaultValue: defaultVal ?? ''
    });

    const handleChange = (e) => {
        const val = e.target.value;
        setSize(val);
        getFeedSize(val);
    }

    return (
        <FormControl>
            {type !== 'hidden' && <FormLabel htmlFor={name}>{label}</FormLabel>}

            <Input
                name={name}
                control={control}
                label={label}
                id={name}
                type={type}
                {...field}
                {...rest}
                value={size}
                placeholder={label}
                ref={fieldRef}
                onChange={handleChange}
                required
            />
            {
                helperText &&
                <FormHelperText>{helperText}</FormHelperText>
            }
        </FormControl>
    )
}

export default TextInput;