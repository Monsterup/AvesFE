import React from 'react'
import {InputGroup, InputGroupAddon, InputGroupText, Input} from 'reactstrap'

function inputWithIcon(mb, addon, icon, type, name, value, onChange, placeholder, disabled) {
    return (
        <InputGroup className={mb}>
            <InputGroupAddon addonType={addon}>
                <InputGroupText>
                    <i className={icon}/>
                </InputGroupText>
            </InputGroupAddon>
            <Input type={type} name={name} value={value} 
                onChange={onChange} placeholder={placeholder} disabled={disabled}/>
        </InputGroup>
    )
}

export default inputWithIcon;