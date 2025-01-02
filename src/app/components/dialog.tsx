import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type props = {
    isOpen: boolean,
    onClose?: (value?: any) => void,
    title?: string,
    ContentText?:string,
    content?: React.ReactNode,
    button?:React.ReactNode,
}

const DialogComponent: React.FC<props> = (props) => {

    const handleClose = () => {
        if (props.onClose) {
            props.onClose()
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={props.isOpen}
                onClose={handleClose}
            >
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{props.ContentText}</DialogContentText>
                    {props.content}
                </DialogContent>
                <DialogActions>
                    {props.button}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default DialogComponent