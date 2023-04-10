import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Slide from '@mui/material/Slide';

//Transistion element for the Dialogue Box
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ErrorDialogueBox(props) {

    let empRowList = props.ErrorList.map(err => (
        <p className="text-center" key={err}>{err}</p>
    ));

    return (
        <Dialog open={props.open} onClose={props.handleToClose} TransitionComponent={Transition} keepMounted PaperProps={{ sx: { minWidth: "20%" } }} >
            <DialogTitle>{props.ErrorTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {empRowList}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleToClose}
                    color="primary" >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default ErrorDialogueBox;
