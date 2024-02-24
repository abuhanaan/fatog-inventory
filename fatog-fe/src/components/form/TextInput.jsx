import React from 'react';
import { FormControl, FormLabel, InputGroup, InputLeftAddon, Input, Icon } from "@chakra-ui/react";
import { TbUser } from "react-icons/tb";
import { useController } from 'react-hook-form';

const TextInput = ({name, control, label}) => {
    const {field} = useController({
        name, 
        control,
        defaultValue: ''
    });

    return (
        <FormControl>
            <FormLabel htmlFor="email">{label}</FormLabel>
            <InputGroup>
                <InputLeftAddon>
                    <Icon as={TbUser} />
                </InputLeftAddon>
                <Input
                    name={name} 
                    control={control} 
                    label={label}
                    id="email"
                    type="text"
                    {...field}
                    value={field.value}
                    placeholder={label}
                    required
                />
            </InputGroup>
        </FormControl>
    )
}

export default TextInput;