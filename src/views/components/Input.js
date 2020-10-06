import React, {useEffect, useState} from "react";
import {AvField} from "availity-reactstrap-validation";

function Input(props) {
    let name = props.label.toLowerCase().replace(" ", "_");
    if (props.name)
        name = props.name;
    const [validate, setValidate] = useState({
        required: {value: props.required, errorMessage: props.label + ' wajib diisi'},
    });
    useEffect(() => {
        if (props.minLength)
            setValidate({
                ...validate,
                minLength: {value: props.minLength, errorMessage: 'Minimal berisi ' + props.minLength + ' karakter'}
            });
        if (props.maxLength)
            setValidate({
                ...validate,
                maxLength: {value: props.maxLength, errorMessage: 'Maksimal berisi ' + props.maxLength + ' karakter'}
            });
        if (props.type === "email")
            setValidate({
                ...validate,
                email: {value: true, errorMessage: props.label + ' harus berupa alamat email yang valid.'}
            });
        if (props.pattern)
            setValidate({
                ...validate,
                pattern: {value: '^[A-Za-z0-9]+$', errorMessage: 'Format ' + props.label + ' tidak valid'},
            });
    }, []);
    let input = (<AvField {...props} innerRef={props.innerRef} name={name} label={props.label} type={props.type} validate={validate}/>)
    return( input );
}

export default Input;