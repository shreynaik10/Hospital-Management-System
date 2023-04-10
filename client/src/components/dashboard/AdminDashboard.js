
import styles from './Dashboard.module.css';
import { React, useState, useEffect, useContext } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import axios from "axios";
import { NavLink } from 'react-router-dom';
import moment from "moment"
import { UserContext } from '../../Context/UserContext'


export default function AdminDashboard() {

	const [doctorCount, setDoctorCount] = useState(0);
	const [patientCount, setPatientCount] = useState(0);
	const [appsTodayCount, setAppsTodayCount] = useState(0);
	const [pendingAppsTodayCount, setPendingAppsTodayCount] = useState(0);
	const [bookedAppointments, setBookedAppointments] = useState([]);
	const [doctors, setdoctor] = useState([]);
	const { currentUser } = useContext(UserContext);

	const getUserCountByRole = async (userType) => {
		const response = await axios.post(`http://localhost:3001/count/users`,
			{
				'userType': userType
			},
			{
				headers: {
					authorization: `Bearer ${localStorage.getItem("token")}`
				}
			}
		);
		let count = response.data.count
		if (count) {
			if (userType == "Doctor")
				setDoctorCount(count);
			else if (userType == "Patient")
				setPatientCount(count);
		}

	};

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

	const getdoctors = async () => {
		const response = await axios.get("http://localhost:3001/doctors");
		setdoctor(response.data);
	};

	useEffect(() => {
		//setting count of Doctors on dashboard
		getUserCountByRole("Doctor");

		//setting count of Patients on dashboard
		getUserCountByRole("Patient");
		getAppointmentCount()
		getBookedSlots();
		getdoctors();
	}, []);

	return (
		<Box className={styles.dashboardBody} component="main" sx={{ flexGrow: 1, p: 3 }}>
			<div id={styles.welcomeBanner}>
				<div className='text-white'>
					<h3 >Welcome!</h3>
					<br/>
					<h4>{currentUser.firstName} {currentUser.lastName}</h4>
					<br/>
					<div class={styles.horizontalLine}></div>
					At Green Hills, we believe that every patient deserves the highest quality care possible. 
					<br/>
					Our commitment to excellence in healthcare is matched only by our compassion for those we serve.

				</div>

			</div>
			<div className={styles.statCardGrid}>
				<div className={["", styles.statCard].join(" ")}>
					<div className={styles.dashWidget}>
						<span className={styles.dashWidgetBg1}><i className="fa fa-stethoscope" aria-hidden="true"></i></span>
						<div className={[" ", styles.dashWidgetInfo].join(" ")} >
							<h3 className={styles.dashWidgetInfoH3}>{doctorCount}</h3>
							<span className={styles.widgetTitle1}>Doctors <i class="fa fa-check" aria-hidden="true"></i></span>
						</div>
					</div>
				</div>
				<div className={["", styles.statCard].join(" ")}>
					<div className={styles.dashWidget}>
						<span className={styles.dashWidgetBg2}><i className="fa fa-user-o" aria-hidden="true"></i></span>
						<div className={[" ", styles.dashWidgetInfo].join(" ")} >
							<h3 className={styles.dashWidgetInfoH3}>{patientCount}</h3>
							<span className={styles.widgetTitle2}>Patients <i class="fa fa-check" aria-hidden="true"></i></span>
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
														<a className="avatar" href="">{apt?.patientId?.userId?.firstName?.charAt(0)}</a>
														<h2 className='ps-3'><a href="">{apt?.patientId?.userId?.firstName} {apt?.patientId?.userId?.lastName} <span>{apt?.patientId?.address}</span></a></h2>
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
							<h4 class="card-title mb-0">Doctors</h4>
						</div>
						<div class="card-body">
							<ul class="contact-list">
								{doctors && doctors.map((doc) => {
									return (
										<li>
											<div class="contact-cont">
												<div class="float-left user-img m-r-10">
													{/* <a href="profile.html" title="John Doe"><span class="status online"></span></a> */}
												</div>
												<div class="contact-info">
													<span class="contact-name text-ellipsis">{doc.userId?.firstName} {doc.userId?.lastName}</span>
													<span class="contact-date">{doc.department} </span>
												</div>
											</div>
										</li>
									)
								})
								}

							</ul>
						</div>
						<div class="card-footer text-center bg-white">
							<NavLink to="/doctors" className="text-muted">View all Doctors</NavLink>
						</div>
					</div>
				</div>
			</div>
		</Box>
	);
}
