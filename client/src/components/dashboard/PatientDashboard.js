
import styles from './Dashboard.module.css';
import { React, useState, useEffect, useContext } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { UserContext } from '../../Context/UserContext'
import { Navigate, NavLink } from 'react-router-dom';
import axios from "axios";
import moment from "moment"
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';





export default function PatientDashboard() {
	const { currentUser } = useContext(UserContext);
	const [appsTodayCount, setAppsTodayCount] = useState(0);
	const [firstAppointmentInFuture, setFirstAppointmentInFuture] = useState({});
	const [bookedAppointments, setBookedAppointments] = useState([]);
	const [patientsTreatedCount,setPatientsTreatedCount] = useState([]);
	const [prescriptions, setPrescription] = useState([]);

	const getAppMonth = (dateOfJoining) => {
		if(!dateOfJoining){
			return;
		}
        // console.log("dateOfJoining",dateOfJoining);
        let month = new Date(dateOfJoining.slice(0, -1)).getMonth();
        // console.log("dateOfJoining",dateOfJoining);
		let monthList = ["January","February","March","April","May","June","July","August","September","October","November","December"]
        return monthList[month];
    }

	const getAppDate = (dateOfJoining) => {
		if(!dateOfJoining){
			return;
		}
        // console.log("dateOfJoining",dateOfJoining);
        let date = new Date(dateOfJoining.slice(0, -1)).getDate();
        // console.log("dateOfJoining",dateOfJoining);
        return date;
    }

	const getAppYear = (dateOfJoining) => {
		if(!dateOfJoining){
			return;
		}
        // console.log("dateOfJoining",dateOfJoining);
        let year = new Date(dateOfJoining.slice(0, -1)).getFullYear();
        // console.log("dateOfJoining",dateOfJoining);
        return year;
    }

	const getBookedSlots = async () => {
    
            let response = await axios.post(`http://localhost:3001/appointments`,
                {
                    'isTimeSlotAvailable': false
                },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.data.message == "success") {
                // getAvailableSlot();
                // window.alert("success add")
                // setAvailableSlot(response.data.appointments)
                let aptms = response.data.appointments;
                console.log("aptms", aptms);
				// console.log(firstAppointmentInFuture)
                const futureAppointments = aptms.filter(appointment => {
					const appointmentDate = new Date(appointment.appointmentDate.slice(0,-1));
					const now = new Date();
					return appointmentDate > now;
				  });
				  console.log("futureAppointments", futureAppointments);

				  if(futureAppointments && futureAppointments.length>0){
					const sortedAppointments = futureAppointments.sort((a, b) => {
						const aDate = new Date(a.appointmentDate.slice(0,-1));
						const bDate = new Date(b.appointmentDate.slice(0,-1));
						return aDate - bDate;
					  });
					  console.log("sortedAppointments",sortedAppointments)
					  let firstApp= sortedAppointments.find(appointment => {
						const appointmentDate = new Date(appointment.appointmentDate.slice(0,-1));
						const now = new Date();
						return appointmentDate > now;
					  });
					  console.log(firstApp)
					  setFirstAppointmentInFuture(firstApp)
				  }

				  
                // setBookedAppointments(sortedAptms);
                // console.log(aptms)
            }
            else {
                // window.alert("error add")
            }
        

    }
	const getPrescription = async () => {
        
        let response = await axios.post(`http://localhost:3001/prescriptions`,{},
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        if (response.data.message == "success") {
            let respPrescription = response.data.prescriptions;
            let newResp =respPrescription.sort((a, b) => {
                    const timeA = new Date(`${moment(new Date(a.appointmentId.appointmentDate.slice(0, -1))).format('MM/DD/YYYY')} ${a.appointmentId.appointmentTime}`);
                    const timeB = new Date(`${moment(new Date(b.appointmentId.appointmentDate.slice(0, -1))).format('MM/DD/YYYY')} ${b.appointmentId.appointmentTime}`);
                    // console.log(timeA)
                    return timeB - timeA;
                });
            //   console.log(newResp);
            setPrescription(newResp);
        } 
    };

	useEffect(() => {
		getBookedSlots();
		getPrescription();
	}, []);


	return (
		<Box className={styles.dashboardBody} component="main" sx={{ flexGrow: 1, p: 3 }}>
			<div id={styles.welcomeBanner}>
				<div className='text-white'>
					<h3 >Welcome!</h3>
					<br/>
					<h4> {currentUser.firstName} {currentUser.lastName} </h4>
					<br/>
					<div class={styles.horizontalLine}></div>
					At Green Hills, we believe that every patient deserves the highest quality care possible. 
					<br/>
					Our commitment to excellence in healthcare is matched only by our compassion for those we serve.

				</div>

			</div>

			<div className='row mt-5 justify-content-center'>
				<div className='col-md-6 col-sm-12'>
					<div className='customPatientApt mx-auto' >
						<div className='topicHeader'>
							<h3 className='text-center'>Upcoming Appointment</h3>
						</div>
						<div className='topicContent'>
							{firstAppointmentInFuture.appointmentDate  && <div className='contentCard'>
								<div className='apDate'>
									<p className='date'>{getAppDate(firstAppointmentInFuture.appointmentDate)}</p>
									<p>{getAppMonth(firstAppointmentInFuture.appointmentDate)}</p>
									<p>{getAppYear(firstAppointmentInFuture.appointmentDate)}</p>
								</div>
								<div className='apDetails'>
									<p className='py-2'>
										<span className='fw-bold'>Doctor Name </span>: {firstAppointmentInFuture?.doctorId?.userId.firstName} {firstAppointmentInFuture?.doctorId?.userId.lastName}
									</p>
									<p className='py-2'>
										<span className='fw-bold'>Department </span>: {firstAppointmentInFuture?.doctorId?.department}
									</p>
									<p className='py-2'>
										<span className='fw-bold'>Time</span>: {firstAppointmentInFuture?.appointmentTime}
									</p>
								</div>
							</div>}
							{!firstAppointmentInFuture.appointmentDate  && <div className='contentCard-empty'>
									<p className='fw-bolder'>You have no upcoming Appointments</p>
									<p className='mt-5'>Would you like to book a new Appointment?</p>
									<Button
                                                            variant="contained"
                                                            color="success"
															className='my-3'
                                                            startIcon={<BookOnlineIcon />}
                                                            component={NavLink}
															to="/appointments"
                                                        >
                                                            Book Now
                                                        </Button>
								</div>}
						</div>
					</div>

				</div>
				<div className='col-md-6 col-sm-12'>
				<div className='customPatientApt mx-auto' >
						<div className='topicHeader'>
							<h3 className='text-center'>Patient History</h3>
						</div>
						<div className='topicContent'>
							{prescriptions[0]?.appointmentId &&
								<div className='contentCard'>
									<div className='apDate'>
										<p className='date'>{getAppDate(prescriptions[0]?.appointmentId?.appointmentDate)}</p>
										<p>{getAppMonth(prescriptions[0]?.appointmentId?.appointmentDate)}</p>
										<p>{getAppYear(prescriptions[0]?.appointmentId?.appointmentDate)}</p>
									</div>
									<div className='apDetails'>
										<p className='py-2'>
											<span className='fw-bold'>Doctor Name </span>: {prescriptions[0]?.appointmentId?.doctorId?.userId?.firstName} {prescriptions[0]?.appointmentId?.doctorId?.userId?.lastName}
										</p>
										<p className='py-2'>
											<span className='fw-bold'>Department </span>: {prescriptions[0]?.appointmentId?.doctorId?.department} 
										</p>
										<p className='py-2'>
											<span className='fw-bold'> Doctor's Remarks </span> : {prescriptions[0]?.remarks} 
										</p>
									</div>
								</div>
							}
							{!prescriptions[0]?.appointmentId && <div className='contentCard-empty'>
									<p className='fw-bolder'>You have no medical history in this hospital</p>
								</div>
							}
							
						</div>
					</div>
				</div>
			</div>
			
		</Box>
	);
}
