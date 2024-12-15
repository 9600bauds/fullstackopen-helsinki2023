import { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Stack } from "react-bootstrap";

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? `none` : `` };
  const showWhenVisible = { display: visible ? `` : `none` };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    };
  });

  return (
    <Stack>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility} variant="primary">{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility} variant="secondary" className='mt-2'>cancel</Button>
      </div>
    </Stack>
  );
});

Togglable.displayName = `Togglable`;

export default Togglable;