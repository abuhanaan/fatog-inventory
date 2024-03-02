import React from 'react';
import { FormControl, FormLabel, InputGroup, InputLeftAddon, Input, Icon } from "@chakra-ui/react";
import { TbPasswordUser } from "react-icons/tb";
import { useController } from 'react-hook-form';

const PasswordInput = ({ name, control, label }) => {
    const { field } = useController({
        name,
        control,
        defaultValue: ''
    });

    return (
        <FormControl>
            <FormLabel htmlFor="password">{label}</FormLabel>
            <InputGroup>
                <InputLeftAddon>
                    <Icon as={TbPasswordUser} />
                </InputLeftAddon>
                <Input
                    name={name} 
                    control={control} 
                    label={label}
                    id="password"
                    type="password"
                    {...field}
                    value={field.value}
                    placeholder={label}
                    required
                />
            </InputGroup>
        </FormControl>
    )
}

export default PasswordInput;