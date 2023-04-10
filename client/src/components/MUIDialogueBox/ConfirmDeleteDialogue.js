import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';


//Transistion element for the Dialogue Box
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * ConfirmDeleteDialogue - A styled Dialog component using Material-UI styles to confirm the delete action of the user
 *
 * @param {object} props - props of the component
 * @param {boolean} props.open - status of the dialogue box
 * @param {boolean} props.handleClose - handler function when cancel is clicked
 * @param {boolean} props.handleDelete - handler function when delete is clicked
 * @param {string} props.title - title of the dialogue box
 * @param {string} props.message - message to be displayed on the dialogue box
 *
 * @returns {object} - A  Dialog component which confirms the delete action of the user
 */

const ConfirmDeleteDialogue = (props) => {
    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {props.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={props.handleDelete}>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDeleteDialogue;