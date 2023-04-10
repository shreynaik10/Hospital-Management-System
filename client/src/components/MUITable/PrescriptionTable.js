import React, { useContext } from 'react';
import { UserContext } from '../../Context/UserContext';

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
import Button from '@mui/material/Button';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DownloadIcon from '@mui/icons-material/Download';



function createData(patientName, doctorName, appointmentDate, appointmentTime, prescribedMed, remarks, actionsID, paid) {
    return { patientName, doctorName, appointmentDate, appointmentTime, prescribedMed, remarks, actionsID, paid };
}

export default function PrecriptionTable({ prescriptionList }) {

    const { currentUser } = useContext(UserContext);

    let columns = [];
    if (currentUser.userType == "Patient") {
        columns = [
            { id: 'patientName', label: 'Patient Name', minWidth: 170 },
            { id: 'doctorName', label: 'Doctor Name', minWidth: 100 },
            { id: 'appointmentDate', label: 'Appointment Date', minWidth: 170 },
            { id: 'appointmentTime', label: 'Appointment Time', minWidth: 170 },
            { id: 'prescribedMed', label: 'Prescription', minWidth: 170 },
            { id: 'remarks', label: 'Remarks', minWidth: 170 },
            { id: 'actionsID', label: 'Actions', minWidth: 100 },
        ];
    }
    else {
        columns = [
            { id: 'patientName', label: 'Patient Name', minWidth: 170 },
            { id: 'doctorName', label: 'Doctor Name', minWidth: 100 },
            { id: 'appointmentDate', label: 'Appointment Date', minWidth: 170 },
            { id: 'appointmentTime', label: 'Appointment Time', minWidth: 170 },
            { id: 'prescribedMed', label: 'Prescription', minWidth: 170 },
            { id: 'remarks', label: 'Remarks', minWidth: 170 }
        ];
    }

    const [page, setPage] = React.useState(0);
    // const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const formatDateForDateInput = (dateOfJoining) => {
        // console.log("dateOfJoining",dateOfJoining);
        dateOfJoining = moment(new Date(dateOfJoining.slice(0, -1))).format('YYYY-MM-DD');
        // console.log("dateOfJoining",dateOfJoining);
        return dateOfJoining;
    }

    const formatPrescription = (prescribedMed) => {
        return (
            <ul>
                {prescribedMed.map(pre => (
                    <li key={pre._id}>
                        <p>Medicine: {pre.medicineId.name}</p>
                        <p>Quantity: {pre.qty}</p>
                        <p>Dosage: {pre.dosage}</p>
                    </li>
                ))}
            </ul>
        );
    }

   
    const handlePayment =  async (value) => {
        const apiSetQrcode = process.env.REACT_APP_SERVER_URL + '/api/paypal/payment';
        //console.log(val);
        try {
            //console.log(token);
            const response = await fetch(apiSetQrcode, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    value,
                }),
            });
            //  await //console.log(response);
            if (response.ok) {
                const json = await response.json();
                window.location.assign(json.link);
            }
        } catch (err) {
            console.error(err);
        }

    }

    const handleDownloadReceipt = async (value) => {
        // console.log("Download Receipt clicked prescriptionId-", value)
        const resp = await axios.get(`http://localhost:3001/prescription/invoice/${value}`,
        {
            responseType: 'blob',
        });

        // const pdfContents = response.data;
        // await writeFile('file.pdf', pdfContents);
        const downloadUrl = window.URL.createObjectURL(resp.data);

        // open pdf file on new tab
        window.open(downloadUrl, '__blank');

        // remove temp url
        window.URL.revokeObjectURL(downloadUrl);

        return resp
    }

    let rows = prescriptionList.map((precription) => {

        return createData(
            precription.appointmentId.patientId.userId.firstName + ' ' + precription.appointmentId.patientId.userId.lastName,
            precription.appointmentId.doctorId.userId.firstName + ' ' + precription.appointmentId.doctorId.userId.lastName,
            formatDateForDateInput(precription.appointmentId.appointmentDate),
            precription.appointmentId.appointmentTime,
            formatPrescription(precription.prescribedMed),
            precription.remarks,
            precription._id,
            precription.paid
        )
    })


    React.useEffect(() => {

    }, [])


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
                                            if (column.id === 'actionsID' && currentUser.userType == "Patient") {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>

                                                        {row["paid"] == false && <Button
                                                            variant="contained"
                                                            color="success"
                                                            startIcon={<AttachMoneyIcon />}
                                                            onClick={() => {
                                                                handlePayment(value);
                                                            }}
                                                        >
                                                            Pay Now
                                                        </Button>}

                                                        {row["paid"] == true && <Button
                                                            variant="contained"
                                                            color="success"
                                                            startIcon={<DownloadIcon />}
                                                            onClick={() => {
                                                                handleDownloadReceipt(value);
                                                            }}
                                                        >
                                                            Download Invoice
                                                        </Button>}

                                                    </TableCell>
                                                );
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