import { useState, forwardRef, useImperativeHandle } from 'react';


const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const makeVisible = () => {
        setVisible(visible);
    };

    const makeNotVisible = () => {
        setVisible(!visible);
    };


    useImperativeHandle(refs, () => {
        return {
            toggleVisibility,
            makeVisible,
            makeNotVisible
        };
    });

    return (
        <span>
            <span style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.openLabel || 'open'}</button>
            </span>
            <span style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>{props.closeLabel || 'close'}</button>
            </span>
        </span>
    );

});

Togglable.displayName = 'Togglable';

export default Togglable;