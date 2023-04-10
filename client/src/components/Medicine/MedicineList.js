import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import Box from '@mui/material/Box';
import MedicineTable from '../MUITable/MedicineTable';


function MedicineList() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');

    const [medicines, setmedicine] = useState([]);

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
        getmedicines();
    }, []
    );

    const getmedicines = async () => {
        const response = await axios.get("http://localhost:3001/medicines", {
            params: {
                name: name
            }
        });
        setmedicine(response.data);
    };

    const deleteMedicine = async (id) => {

        try {
            await axios.delete(`http://localhost:3001/medicines/${id}`);
            getmedicines();
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
                            <h4 className="page-title">Medicine</h4>
                        </div>
                        <div className="col-sm-8 col-9 text-right m-b-20">
                            <Link to="/medicines/add" className="btn btn-primary float-right btn-rounded">
                                <i className="fa fa-plus"></i> Add Medicine
                            </Link>
                        </div>
                    </div>
                    <form action="/medicines" name="userFilter" >
                        <div className="row filter-row">

                            <div className="col-sm-4 col-md-4">
                                <div className="form-floating ">

                                    <input type="text" name="name" className="form-control" placeholder='Medicine Name' />
                                    <label className="focus-label">Medicine Name</label>
                                </div>
                            </div>

                            <div className="col-sm-4 col-md-4">
                                <button type="submit" className="btn btn-primary btn-block"> Search </button>
                            </div>
                        </div>
                    </form>
                    <MedicineTable medicineList={medicines} deleteMedicine={deleteMedicine} />
                    {/* <div className="row">
                        <div className="col-md-12">
                            <div className="table-responsive">
                                <table className="table table-striped custom-table">
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Company</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicines.map((medicine, index) => (
                                            <tr key={medicine._id}>
                                                <td
                                                >{index + 1}</td>
                                                <td>{medicine.company}</td>
                                                <td>{medicine.name}</td>
                                                <td>{medicine.description}</td>
                                                <td>{medicine.price}</td>
                                                <td className="text-right">
                                                    <Link to={`/medicines/edit/${medicine._id}`} className="btn btn-warning is-info is-small m-r-2">Edit</Link> &nbsp;
                                                    <button onClick={() => deleteMedicine(medicine._id)} className="btn btn-danger is-danger is-small m-l-5">Delete</button>
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
                    ErrorTitle="Error: Add medicine"
                    ErrorList={errorList}
                />
            </div>

        </Box>
    )
}

export default MedicineList;
