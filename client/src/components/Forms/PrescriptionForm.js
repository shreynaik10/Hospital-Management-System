import React, { useContext, useState, useEffect } from "react";
import { UserContext } from '../../Context/UserContext'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function PrescriptionForm(props) {
    const { currentUser } = useContext(UserContext);

    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        getMedicines();
    }, []);

    // useEffect(()=>{
    //     renderMedicineItems()
    // },[medicines])

    const getMedicines = async () => {
        const response = await axios.get("http://localhost:3001/medicines");
        console.log("medicines", medicines);
        setMedicines(response.data);
    };

    const [medicineItems, setMedicineItems] = useState([]);


    const addMedicineItem = () => {
        // getMedicines();
        setMedicineItems([
            ...medicineItems,
            {
                id: medicineItems.length + 1,
                // medicine: medicines[0].name,
                qty: "",
                dosage: "",
                medicineId: medicines[0]._id
            },
        ]);
    };
    const deleteMedicineItem = (id) => {
        setMedicineItems(medicineItems.filter((item) => item.id !== id));
    };

    const handleMedicineChange = (id, e) => {
        const updatedItems = medicineItems.map((item) => {
            if (item.id === id) {

                return {
                    ...item,
                    [e.target.name]: e.target.value,
                };


            }
            return item;
        });
        console.log("updatedItems", updatedItems)
        setMedicineItems(updatedItems);
    };


    const renderMedicineItems = () => {
        return medicineItems.map((item) => (
            <div className="form-group col-11 pl-3 mx-auto row" key={item.id}>
                <div className="col-4">
                    <label htmlFor={`medicine${item.id}`}>Medicine </label>
                    <select
                        name={`medicineId`}
                        required
                        className="form-control"
                        onChange={(e) => handleMedicineChange(item.id, e)}
                    >
                        {medicines.map((medicine) => {
                            if (item._id == medicine._id) {
                                return (
                                    <option key={medicine._id} value={medicine._id} selected>
                                        {medicine.name}
                                    </option>
                                )
                            }
                            else {
                                return (
                                    <option key={medicine._id} value={medicine._id}>
                                        {medicine.name}
                                    </option>
                                )
                            }
                        })}
                    </select>

                </div>
                <div className="col-2">
                    <label htmlFor={`qty${item.id}`}>Qty</label>
                    <input
                        type="number"
                        required
                        className="form-control"
                        name={`qty`}
                        id={`qty${item.id}`}
                        defaultValue={item.qty}
                        onChange={(e) => handleMedicineChange(item.id, e)}
                    />

                </div>
                <div className="col-6">
                    <label htmlFor={`dosage${item.id}`}>Dosage</label>
                    <div className="input-group">
                        <input
                            type="text"
                            required
                            className="form-control"
                            name={`dosage`}
                            id={`dosage${item.id}`}
                            value={item.dosage}
                            onChange={(e) => handleMedicineChange(item.id, e)}
                        />
                        <div className="input-group-append">
                            <button
                                type="button"
                                className="btn text-red ms-5"
                                onClick={() => deleteMedicineItem(item.id)}
                                value="delete"
                                aria-label="delete medicine button"
                            >
                                <DeleteIcon />
                            </button>
                        </div>
                    </div>
                </div>

            </div>



        ));
    };

    return (
        <form name={props.formName} onSubmit={props.formOnSubmit}>
            <div className="form-row">
                <div className="form-group col-11 pl-3 mx-auto">
                    <label for="patient">Patient Name:</label>
                    <select name="patient" className="form-control" disabled>
                        {props.patientList
                            .map((patient, i) => {
                                if (props.patientSelected == patient._id) {
                                    return <option key={i} value={patient._id} selected>{patient.userId.firstName} {patient.userId.lastName}</option>
                                }
                                else {
                                    return <option key={i} value={patient._id}>{patient.userId.firstName} {patient.userId.lastName}</option>
                                }
                            })}
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="form-group col-11 pl-3 mx-auto">
                    <label for="remarks">Remarks</label>
                    <textarea class="form-control" id="remarks" name="remarks" rows="3"></textarea>
                </div>
            </div>
            <div className="medicineDiv">
                {medicines && renderMedicineItems()}
            </div>
            <div className="text-center">
                <Button variant="outlined" onClick={addMedicineItem} className="my-3 mx-4" style={{ border: "1px solid green", color: "darkgreen" }} startIcon={<AddIcon />}>
                    Add Medicine
                </Button>
            </div>



            <input type="hidden" name="id" defaultValue={props.appointmentId} />
            <div>
                <input type="hidden" name="prescribedMed" id="prescribedMed" value={JSON.stringify(medicineItems)} />
            </div>
            <div className="text-center">
                <input type="submit" className="btn btn-primary my-2 mx-4  col-4 " id="customBtn" value="Save"></input>
            </div>


        </form>
    );
}

export default PrescriptionForm;