
import styles from './Dashboard.module.css';
import { React, useState, useEffect, useContext } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { UserContext } from '../../Context/UserContext'
import { NavLink } from 'react-router-dom';
import axios from "axios";
import moment from "moment"




export default function DoctorDashboard() {
	const { currentUser } = useContext(UserContext);
	const [appsTodayCount, setAppsTodayCount] = useState(0);
	const [pendingAppsTodayCount, setPendingAppsTodayCount] = useState(0);
	const [bookedAppointments, setBookedAppointments] = useState([]);
	const [patientsTreatedCount,setPatientsTreatedCount] = useState([]);
	const [prescriptions, setPrescription] = useState([]);


	const getAppointmentCount = async () => {
		const response = await axios.get(`http://localhost:3001/count/appointments`,
			{
				headers: {
					authorization: `Bearer ${localStorage.getItem("token")}`
				}
			}
		);
		if (response?.data?.totalAppointments) {
			setAppsTodayCount(response?.data?.totalAppointments);
		}
		if (response?.data?.pendingAppointments) {
			setPendingAppsTodayCount(response?.data?.pendingAppointments)
		}
	}

	const getPatientsTreatedCount = async () => {
		const response = await axios.get(`http://localhost:3001/count/patients/treated`,
			{
				headers: {
					authorization: `Bearer ${localStorage.getItem("token")}`
				}
			}
		);
		if (response?.data?.treatedPatients) {
			setPatientsTreatedCount(response?.data?.treatedPatients);
		}
		
	}

	const getBookedSlots = async () => {
		// console.log(moment(new Date()).format('YYYY-MM-DD'))
		let response = await axios.post(`http://localhost:3001/appointments`,
			{
				'isTimeSlotAvailable': false,
				'appDate': moment(new Date()).format('YYYY-MM-DD')
			},
			{
				headers: {
					authorization: `Bearer ${localStorage.getItem("token")}`
				}
			}
		);
		if (response.data.message == "success") {

			let aptms = response.data.appointments;
			console.log("aptms", aptms);

			setBookedAppointments(aptms);
			// console.log(aptms);

		}

		// else {
		// 	setBookedAppointments([]);
		// }

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
                    console.log(timeA)
                    return timeB - timeA;
                });
              console.log(newResp);
            setPrescription(newResp);
        } else {

        }
    };

	useEffect(() => {
		//setting count of Doctors on dashboard
		getAppointmentCount()
		getBookedSlots();
		getPatientsTreatedCount();
		getPrescription();
	}, []);


	return (
		<Box className={styles.dashboardBody} component="main" sx={{ flexGrow: 1, p: 3 }}>
			<div id={styles.welcomeBanner}>
				<div className='text-white'>
					<h3 >Welcome!</h3>
					<br/>
					<h4> Dr. {currentUser.firstName} {currentUser.lastName} </h4>
					<br/>
					<div class={styles.horizontalLine}></div>
					At Green Hills, we believe that every patient deserves the highest quality care possible. 
					<br/>
					Our commitment to excellence in healthcare is matched only by our compassion for those we serve.

				</div>

			</div>
			<div className={styles.statCardGridDoctor}>
				{/* <div className={["", styles.statCard].join(" ")}>
					<div className={styles.dashWidget}>
						<span className={styles.dashWidgetBg1}><i className="fa fa-stethoscope" aria-hidden="true"></i></span>
						<div className={[" ", styles.dashWidgetInfo].join(" ")} >
							<h3 className={styles.dashWidgetInfoH3}>78</h3>
							<span className={styles.widgetTitle1}>Doctor Dashboard <i class="fa fa-check" aria-hidden="true"></i></span>
						</div>
					</div>
				</div> */}
				<div className={["", styles.statCard].join(" ")}>
                        <div className={styles.dashWidget}>
                            <span className={styles.dashWidgetBg2}><i className="fa fa-user-o" aria-hidden="true"></i></span>
                            <div className={[" ", styles.dashWidgetInfo].join(" ")} >
                                <h3 className={styles.dashWidgetInfoH3}>{patientsTreatedCount}</h3>
                                <span className={styles.widgetTitle2}>Total Patients Treated <i class="fa fa-check" aria-hidden="true"></i></span>
                            </div>
                        </div>
                    </div>
                    <div className={["", styles.statCard].join(" ")}>
                        <div className={styles.dashWidget}>
                            <span className={styles.dashWidgetBg3}><i className=" fa fa-calendar" aria-hidden="true"></i></span>
                            <div className={[" ", styles.dashWidgetInfo].join(" ")} >
                                <h3 className={styles.dashWidgetInfoH3}>{appsTodayCount}</h3>
                                <span className={styles.widgetTitle3}>Appointments Today <i class="fa fa-check" aria-hidden="true"></i></span>
                            </div>
                        </div>
                    </div>
                    <div className={["", styles.statCard].join(" ")}>
                        <div className={styles.dashWidget}>
                            <span className={styles.dashWidgetBg4}><i className="fa fa-heartbeat" aria-hidden="true"></i></span>
                            <div className={[" ", styles.dashWidgetInfo].join(" ")} >
                                <h3 className={styles.dashWidgetInfoH3}>{pendingAppsTodayCount}</h3>
                                <span className={styles.widgetTitle4}>Pending Appointments <i class="fa fa-check" aria-hidden="true"></i></span>
                            </div>
                        </div>
                    </div>
			</div>

			<div className="row ">
				<div className="col-12 col-lg-8 col-xl-8">
					<div className="card appointment-panel">
						<div className="card-header">
							<h4 className="card-title d-inline-block">Upcoming Appointments</h4> <NavLink to="/appointments" className="btn btn-primary float-end">View all</NavLink>
						</div>
						<div className="card-body">
							<div className="table-responsive">
								<table className="table mb-0">
									<thead className="d-none">
										<tr>
											<th>Patient Name</th>
											<th>Doctor Name</th>
											<th>Timing</th>
											<th className="text-right">Status</th>
										</tr>
									</thead>
									<tbody>
										{bookedAppointments.map((apt) => {
											return (
												<tr>
													<td className={styles.appointmentTableTd}>
														<NavLink className="avatar" to={`/patient/history/${apt?.patientId?._id}`}>{apt?.patientId?.userId?.firstName?.charAt(0)}</NavLink>
														<h2 className='ps-3'><NavLink to={`/patient/history/${apt?.patientId?._id}`}>{apt?.patientId?.userId?.firstName} {apt?.patientId?.userId?.lastName} <span>{apt?.patientId?.address}</span></NavLink></h2>
													</td>
													<td>
														<h5 className="time-title p-0">Appointment With</h5>
														<p>Dr. {apt?.doctorId?.userId?.firstName} {apt?.doctorId?.userId?.lastName}</p>
													</td>
													<td>
														<h5 class="time-title p-0">Timing</h5>
														<p>{apt?.appointmentTime}</p>
													</td>
													{/* <td class="text-right">
														<a href="" class="btn btn-outline-primary take-btn">Take up</a>
													</td> */}
												</tr>
											)
										})
										}
										
									</tbody>
								</table>
								{(!bookedAppointments || bookedAppointments?.length === 0) &&
											
												<h3 className='mt-5 text-center '>
													You have no appointments today
												</h3>
											
								}
							</div>
						</div>
					</div>
				</div>
				<div class="col-12 col-lg-4 col-xl-4">
					<div class="card member-panel">
						<div class="card-header bg-white">
							<h4 class="card-title mb-0">Completed Appointments</h4>
						</div>
						<div class="card-body">
							<ul class="contact-list">
								
									{prescriptions && prescriptions.map((pre) => {
											return (
												<li>
													<div class="contact-cont">
														<div class="float-left user-img m-r-10">
															{/* <a href="profile.html" title="John Doe"><span class="status online"></span></a> */}
														</div>
														<div class="contact-info">
															<span class="contact-name text-ellipsis">{pre.appointmentId.patientId.userId.firstName} {pre.appointmentId.patientId.userId.lastName}</span>
															<span class="contact-date">Remarks: {pre.remarks}</span>
														</div>
													</div>
												</li>
											)
									})
									}
									
							</ul>
						</div>
						<div class="card-footer text-center bg-white">
							<NavLink to="/prescriptions" className="text-muted">View all </NavLink>
						</div>
					</div>
				</div>
			</div>
		</Box>
	);
}
