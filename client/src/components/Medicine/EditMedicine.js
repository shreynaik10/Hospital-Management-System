import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'
import { useNavigate, useParams } from "react-router-dom";
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import axios from "axios";
import Box from '@mui/material/Box';

function Editmedicine() {
  const navigate = useNavigate();

  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const { id } = useParams();

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
    getmedicineById();
  }, []);

  const getmedicineById = async () => {
    const response = await axios.get(`http://localhost:3001/medicines/${id}`);
    console.log(response);
    setCompany(response.data.company);
    setName(response.data.name);
    setDescription(response.data.description);
    setPrice(response.data.price);
  };

  const updatemedicine = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3001/medicines/${id}`, {
        company,
        name,
        description,
        price
      });
      navigate("/medicines");
    } catch (error) {
      //console.log(error.response.data.errors);
      //Display error message
      setErrorList(error.response.data.errors);
      handleDialogueOpen();
    }
  };


  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <div className="page-wrapper">
        <div className="content">

          <div className="card-box">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <h3 className="page-title">Edit medicine</h3>
              </div>
            </div>
            <div className="row">

              <div className="col-lg-8 offset-lg-2">
                <form id="addmedicineForm" name='addmedicineForm' onSubmit={updatemedicine}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Company <span className="text-danger">*</span></label>
                        <input name="company" className="form-control" type="text" required value={company} onChange={(event) => setCompany(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Name</label>
                        <input name="lastName" className="form-control" type="text" required value={name} onChange={(event) => setName(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Description <span className="text-danger">*</span></label>
                        <input name="description" className="form-control" type="text" required value={description} onChange={(event) => setDescription(event.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Price <span className="text-danger">*</span></label>
                        <input name="price" className="form-control" type="number" required value={price} onChange={(event) => setPrice(event.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="m-t-20 text-center">
                    <button type="submit" className="btn btn-primary submit-btn">Update Medicine</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <ErrorDialogueBox
          open={errorDialogueBoxOpen}
          handleToClose={handleDialogueClose}
          ErrorTitle="Error: Edit medicine"
          ErrorList={errorList}
        />
      </div>
    </Box>
  )
}

export default Editmedicine;
