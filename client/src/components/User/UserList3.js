import React, { useEffect, useState } from 'react';
// import Header from '../Layout/Header';
// import Sidebar from '../Layout/Sidebar';
import Header from '../Layout/Header/Header';
import Sidebar from '../Layout/Sidebar/Sidebar';
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import UserTable from '../MUITable/UserTable';

function UserList() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    const name = params.get('name');
    const [users, setUser] = useState([]);
    const [searchrole, setRole] = useState([]);
    const [errorDialogueBoxOpen, setErrorDialogueBoxOpen] = useState(false);
    const [errorList, setErrorList] = useState([]);
    const handleDialogueOpen = () => {
        setErrorDialogueBoxOpen(true)
    };
    const handleDialogueClose = () => {
        setErrorList([]);
        setErrorDialogueBoxOpen(false)
    };

    useEffect(() => {
        getUsers();
    }, []
    );

    const getUsers = async () => {

        const response = await axios.get("http://localhost:3001/users", {
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            },
            params: {
                role: role,
                name: name
            }
        });
        setUser(response.data);
    };

    const deleteUser = async (id) => {

        try {
            await axios.delete(`http://localhost:3001/users/${id}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            getUsers();
        } catch (error) {
            setErrorList(error);
            handleDialogueOpen();
        }


    };


    return (

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-sm-4 col-3">
                            <h4 className="page-title">User</h4>
                        </div>
                        <div className=" col-sm-8 col-9 text-right m-b-20">
                            <Link to="/users/add" className="btn btn-primary float-right btn-rounded">
                                <i className="fa fa-plus"></i> Add User
                            </Link>
                        </div>
                    </div>
                    <form action="/users" name="userFilter" >
                        <div className="row filter-row pb-4">

                            <div className="col-sm-4 col-md-4">
                                <div className="form-floating ">
                                    <input name="name" type="text" id="empNameSearch" className="form-control" placeholder='Name' />
                                    <label htmlFor='empNameSearch'>User Name</label>
                                </div>
                            </div>
                            <div className="col-sm-4 col-md-4">
                                <div className="form-floating">
                                    <select name="role" className="form-select floating">
                                        <option value="">All</option>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Patient">Patient</option>
                                    </select>
                                    <label htmlFor='role' className="focus-label">Role</label>
                                </div>
                            </div>
                            <div className="col-sm-4 col-md-4">
                                <button type="submit" className="btn btn-primary btn-block"> Search </button>
                            </div>
                        </div>
                    </form>
                    <UserTable userList={users} deleteUser={deleteUser} />
                    {/* <div className="row">
                        <div className="col-md-12">
                            <div className="table-responsive">
                                <table className="table table-striped custom-table">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={user._id}>
                                                <td>{index + 1}</td>
                                                <td>{user.firstName} {user.lastName}</td>
                                                <td>{user.email}</td>
                                                <td><span className="custom-badge status-green">{user.userType}</span></td>
                                                <td>
                                                    <Link
                                                        to={`/users/edit/${user._id}`}
                                                        className="btn btn-warning is-info is-small m-r-2"
                                                    >
                                                        <i className="fa fa-pencil m-r-5"></i> Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteUser(user._id)}
                                                        className="btn btn-danger is-danger is-small m-l-5"
                                                    >
                                                        <i className="fa fa-trash-o m-r-5"></i>  Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div> */}
                </div>
                <ErrorDialogueBox
                    open={errorDialogueBoxOpen}
                    handleToClose={handleDialogueClose}
                    ErrorTitle="Error: Add User"
                    ErrorList={errorList}
                />
            </div>
        </Box>


    )
}

export default UserList;
