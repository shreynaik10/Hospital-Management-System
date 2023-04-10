import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import axios from "axios";
import moment from "moment"
import ConfirmDeleteDialogue from '../MUIDialogueBox/ConfirmDeleteDialogue'
import { BootstrapDialog, BootstrapDialogTitle } from "../MUIDialogueBox/BoostrapDialogueBox"
import DialogContent from '@mui/material/DialogContent';
import AppointmentForm from '../Forms/AppointmentForm'
import { NavLink, useNavigate } from 'react-router-dom';

const columns = [
    { id: 'Name', label: 'Name', minWidth: 170 },
    { id: 'Email', label: 'Email', minWidth: 170 },
    { id: 'Role', label: 'Role', minWidth: 170 },
    { id: 'actionsID', label: 'Actions', minWidth: 100 },
];

function createData(Name, Email, Role, actionsID) {
    return { Name, Email, Role, actionsID };
}

// const rows = [
//     createData('John Doe', 'Dr. Smith', '2023-03-20', '10:00 AM', ''),
//     createData('Jane Doe', 'Dr. Johnson', '2023-03-22', '2:00 PM', ''),
//     createData('Bob Smith', 'Dr. Lee', '2023-03-24', '11:30 AM', ''),
//     createData('Alice Johnson', 'Dr. Davis', '2023-03-26', '4:00 PM', ''),
//     createData('Chris Lee', 'Dr. Martin', '2023-03-28', '3:30 PM', ''),
//     createData('Sarah Davis', 'Dr. Brown', '2023-03-30', '9:45 AM', ''),

// ];

export default function UserTable({ userList, deleteUser }) {
    const [page, setPage] = React.useState(0);
    // const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [openConfirmDeleteDialogue, setOpenConfirmDeleteDialogue] = React.useState(false);

    const navigate = useNavigate();


    const handleDeleteDialogueOpen = () => {
        setOpenConfirmDeleteDialogue(true);
    };

    const handleDeleteDialogueClose = () => {
        setOpenConfirmDeleteDialogue(false);
    };





    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    let rows = userList.map((user) => {
        // console.log("inside map",await getPatientByID(apt.patientId))
        return createData(
            user.firstName + " " + user.lastName,
            user.email,
            user.userType,
            user._id,

        )
    })



    React.useEffect(() => {

    }, [])



    // getDoctorByID(bookedAppointments[0].doctorId);
    // getPatientByID(bookedAppointments[0].patientId);

    return (
        <Paper sx={{ width: '95%', overflow: 'hidden', marginTop: 2, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2) " }}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            if (column.id === 'actionsID') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <Tooltip title="Edit" placement="top" arrow>
                                                            <EditIcon
                                                                className="mx-2"
                                                                style={{ color: '#ff6600', fontSize: 30 }}
                                                                onClick={() => {
                                                                    navigate(`/users/edit/${value}`);
                                                                }}
                                                            />
                                                        </Tooltip>
                                                        <Tooltip title="Delete" placement="top" arrow>
                                                            <DeleteIcon
                                                                className="mx-2"
                                                                style={{ color: 'red', fontSize: 30 }}
                                                                onClick={handleDeleteDialogueOpen}
                                                            />
                                                        </Tooltip>
                                                        <ConfirmDeleteDialogue
                                                            title="Confirm Delete"
                                                            message="Are you sure you want to delete this record? This action cannot be undone."
                                                            open={openConfirmDeleteDialogue}
                                                            handleClose={handleDeleteDialogueClose}
                                                            handleDelete={() => {
                                                                deleteUser(value);
                                                                handleDeleteDialogueClose();
                                                            }}
                                                        />
                                                    </TableCell>
                                                );
                                            }
                                            else if (column.id == 'Role') {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <span className="custom-badge status-green">{value}</span>
                                                    </TableCell>
                                                )
                                            }
                                            else {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            }
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    "& p": {
                        "marginTop": 'auto',
                        "marginBottom": 'auto'
                    }
                }}
            />
        </Paper>
    );
}