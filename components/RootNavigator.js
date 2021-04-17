import * as React from 'react'

// Currently unsure about using this
export const baseNavRef = React.createRef();
export const baseNavigate = (name, params) => {
    baseNavRef.current?.navigate(name, params);
}