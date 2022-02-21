import { Button } from '@mui/material';
import { useState, useEffect } from 'react';

const PasteItemBtn = ({moveHelper}) => {
    const [state, setState] = useState(false);
    const copiedItemID = localStorage.getItem('copiedItemID')
    useEffect(() => {
        if (copiedItemID) setState(true);
        else setState(false);
    }, [copiedItemID])
    return <Button variant="contained" disabled={  state ? false : true } onClick={moveHelper}>Paste Item</Button>
}
export default PasteItemBtn;