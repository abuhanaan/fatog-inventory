import { FormControl, FormLabel, FormHelperText, Textarea } from "@chakra-ui/react";
import { useController } from 'react-hook-form';
import { useState } from "react";

const TextArea = ({ name, label, control, type, fieldRef, defaultVal, helperText, ...rest }) => {
    const { field } = useController({
        name,
        control,
        defaultValue: defaultVal ?? ''
    });

    return (
        <FormControl>
            {type !== 'hidden' && <FormLabel htmlFor={name}>{label}</FormLabel>}

            <Textarea
                name={name}
                control={control}
                label={label}
                id={name}
                {...field}
                {...rest}
                value={field.value}
                placeholder={label}
                ref={fieldRef}
            />
            {
                helperText &&
                <FormHelperText>{helperText}</FormHelperText>
            }
        </FormControl>
    )
}

export default TextArea;