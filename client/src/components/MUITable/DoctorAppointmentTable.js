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
import PrescriptionForm from '../Forms/PrescriptionForm'
import { NavLink } from 'react-router-dom';


const columns = [
    { id: 'patientName', label: 'Patient Name', minWidth: 170 },
    { id: 'doctorName', label: 'Doctor Name', minWidth: 100 },
    { id: 'appointmentDate', label: 'Appointment Date', minWidth: 170 },
    { id: 'appointmentTime', label: 'Appointment Time', minWidth: 170 },
    { id: 'actionsID', label: 'Actions', minWidth: 100 },
    {id: 'patientID',label: 'patientID', minWidth: 100 }
];

function createData(patientName, doctorName, appointmentDate, appointmentTime, actionsID,patientID) {
    return { patientName, doctorName, appointmentDate, appointmentTime, actionsID, patientID };
}

// const rows = [
//     createData('John Doe', 'Dr. Smith', '2023-03-20', '10:00 AM', ''),
//     createData('Jane Doe', 'Dr. Johnson', '2023-03-22', '2:00 PM', ''),
//     createData('Bob Smith', 'Dr. Lee', '2023-03-24', '11:30 AM', ''),
//     createData('Alice Johnson', 'Dr. Davis', '2023-03-26', '4:00 PM', ''),
//     createData('Chris Lee', 'Dr. Martin', '2023-03-28', '3:30 PM', ''),
//     createData('Sarah Davis', 'Dr. Brown', '2023-03-30', '9:45 AM', ''),

// ];

export default function DoctorAppointmentTable({ bookedAppointments, deleteBookedSlots, doctorList, patientList, availableSlots, getAvailableSlots, getBookedSlots }) {
    const [page, setPage] = React.useState(0);
    // const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [openConfirmDeleteDialogue, setOpenConfirmDeleteDialogue] = React.useState(false);
    const [openPrescriptionFormDialogue, setOpenPrescriptionFormDialogue] = React.useState(false);

    const [doctorId, setDoctorId] = React.useState("");
    const [patientId, setPatientId] = React.useState("");
    const [appointmentDate, setAppointmentDate] = React.useState("");
    const [appointmentTime, setAppointmentTime] = React.useState("");
    const [appointmentId, setAppointmentId] = React.useState("");


    const handleDeleteDialogueOpen = () => {
        setOpenConfirmDeleteDialogue(true);
    };

    const handleDeleteDialogueClose = () => {
        setOpenConfirmDeleteDialogue(false);
    };

    const handlePrescriptionFormOpen = () => {
        setOpenPrescriptionFormDialogue(true)
    }

    const handlePrescriptionFormClose = () => {
        setOpenPrescriptionFormDialogue(false)
    }



    const prescriptionFormSubmitted = async (event) => {
        event.preventDefault();
        const form = document.forms.prescriptionForm;
        let appId = form.id.value;
        let reqObj = {
            "appointmentId": appId,
            "remarks": form.remarks.value,
            "prescribedMed": JSON.parse(form.prescribedMed.value)
        }

        console.log(reqObj)
        let response = await axios.post(`http://localhost:3001/prescription/`,
            reqObj,
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        if (response.data.message == "success") {
            getAvailableSlots();
            getBookedSlots();
            handlePrescriptionFormClose()
        }
    }

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

    const setFormProperties = async (appID) => {
        const response = await axios.get(`http://localhost:3001/appointments/${appID}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        let app = response.data.appointment
        console.log(app);
        setDoctorId(app.doctorId)
        setPatientId(app.patientId)
        setAppointmentDate(formatDateForDateInput(app.appointmentDate));
        setAppointmentTime(app.appointmentTime);
        setAppointmentId(app._id)
        // console.log(doctorId)
        // console.log(patientId)
        // console.log(appointmentDate)
        // console.log(appointmentTime)

    }



    let rows = bookedAppointments.map((apt) => {
        // console.log("inside map",await getPatientByID(apt.patientId))
        return createData(
            apt.patientId.userId.firstName + " " + apt.patientId.userId.lastName,
            apt.doctorId.userId.firstName + " " + apt.doctorId.userId.lastName,
            formatDateForDateInput(apt.appointmentDate),
            apt.appointmentTime,
            apt._id,
            apt.patientId._id
        )
    })



    React.useEffect(() => {

    }, [])



    // getDoctorByID(bookedAppointments[0].doctorId);
    // getPatientByID(bookedAppointments[0].patientId);

    return (
        <Paper sx={{ width: '95%', overflow: 'hidden', marginTop: 5, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2) " }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => {
                                if(column.id !='patientID'){
                                    return (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    )
                                }
                                
                            })}
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
                                                        <div
                                                            className="btn btn-outline-primary take-btn"
                                                            onClick={() => {
                                                                setFormProperties(value)
                                                                handlePrescriptionFormOpen()
                                                            }}
                                                        >
                                                            Take up
                                                        </div>
                                                    </TableCell>
                                                );
                                            }
                                            else if(column.id === 'patientName'){
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : <NavLink to={`/patient/history/${row["patientID"]}`} className="text-muted"> {value} </NavLink>}
                                                    </TableCell>
                                                )
                                                
                                            }
                                            else if(column.id === 'patientID'){
                                                return ;
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
                rowsPerPageOptions={[10, 25, 100]}
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
            <BootstrapDialog
                onClose={handlePrescriptionFormClose}
                aria-labelledby="customized-dialog-title"
                open={openPrescriptionFormDialogue}
                width={"550"}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handlePrescriptionFormClose}>
                    Prescription
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <PrescriptionForm
                        formName="prescriptionForm"
                        formOnSubmit={prescriptionFormSubmitted}
                        appDate={appointmentDate}
                        appTime={appointmentTime}
                        doctorSelected={doctorId}
                        patientSelected={patientId}
                        doctorList={doctorList}
                        patientList={patientList}
                        availableSlots={availableSlots}
                        appointmentId={appointmentId} />
                </DialogContent>
            </BootstrapDialog>
        </Paper>
    );
}