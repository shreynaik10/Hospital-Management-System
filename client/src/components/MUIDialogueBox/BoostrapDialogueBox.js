import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * BootstrapDialog - A styled Dialog component using Material-UI styles
 *
 * @param {object} theme - The theme object from Material-UI
 *
 * @returns {object} - A styled Dialog component with custom padding for the content and actions
 */

export const BootstrapDialog = styled(Dialog)(({ theme, width }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
        width: width ? parseInt(width) : 400,
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


/**
 * BootstrapDialogTitle - A custom DialogTitle component with a close button
 *
 * @param {object} props - The component props
 * 
 * @returns {JSX.Element} - A DialogTitle component with a close button
 */

export const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

//PropTypes for BootstrapDialogTitle component
BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

