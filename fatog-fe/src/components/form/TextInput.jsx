import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useController } from 'react-hook-form';

const TextInput = ({ name, label, control, type, fieldRef, defaultVal }) => {
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
                value={field.value}
                placeholder={label}
                ref={fieldRef}
                required
            />
        </FormControl>
    )
}

export default TextInput