'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CreateTRansportAllowance = () => {


    
    const [created_by, setCreated_by] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setCreated_by(storedUserId);
        }
      }, []);

    const router = useRouter()
    const [formData, setFormData] = useState({
        travel_from: '', travel_from_time: '', travel_to: '', travel_to_time: '', vehicle_name: '', km_travel: '', amount: '', user_id: created_by, created_by: created_by

    });




    const [selectedDate, setSelectedDate] = useState([]);
    const [formattedDisplayDate, setFormattedDisplayDate] = useState('');

    const handleDateSelection = (event) => {
        const inputDate = event.target.value; // Directly get the value from the input

        const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setSelectedDate(formattedDate);
        setFormData(prevData => ({
            ...prevData,
            travel_from_time: formattedDatabaseDate // Update the dob field in the state
        }));
        if(formattedDatabaseDate){
            setTravel_from_time('')
        }

    };

    console.log(selectedDate);

    useEffect(() => {
        const dob = formData.travel_from_time;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);


    const [selectedDates, setSelectedDates] = useState([]);
    const [formattedDisplayDates, setFormattedDisplayDates] = useState('');

    const handleDateSelections = (event) => {
        const inputDate = event.target.value; // Directly get the value from the input

        const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setSelectedDates(formattedDate);
        setFormData(prevData => ({
            ...prevData,
            travel_to_time: formattedDatabaseDate // Update the dob field in the state
        }));
        if(formattedDatabaseDate){
            setTravel_to_time('')
        }

    };

    console.log(selectedDates);

    useEffect(() => {
        const dob = formData.travel_to_time;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDates(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);



    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     setFormData(prevData => ({
    //         ...prevData,
    //         [name]: value
    //     }));
    // };
    const [travel_from, setTravel_from] = useState([])
    const [travel_from_time, setTravel_from_time] = useState([])
    const [travel_to, setTravel_to] = useState([])
    const [travel_to_time, setTravel_to_time] = useState([])
    const [vehicle_name, setVehicle_name] = useState([])
    const [km_travel, setKm_travel] = useState([])
    const [amount, setAmount] = useState([])



    const handleChange = (event) => {


        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value



        const travel_from = attribute['travel_from'];
        if (travel_from) {
            setTravel_from(""); // Clear the error message
        }

        const travel_from_time = attribute['travel_from_time'];
        if (travel_from_time) {
            setTravel_from_time(""); // Clear the error message
        }

        const travel_to = attribute['travel_to'];
        if (travel_to) {
            setTravel_to(""); // Clear the error message
        }

        const travel_to_time = attribute['travel_to_time'];
        if (travel_to_time) {
            setTravel_to_time(""); // Clear the error message
        }

        const vehicle_name = attribute['vehicle_name'];
        if (vehicle_name) {
            setVehicle_name(""); // Clear the error message
        }

        const km_travel = attribute['km_travel'];
        if (km_travel) {
            setKm_travel(""); // Clear the error message
        }

        const amount = attribute['amount'];
        if (amount) {
            setAmount(""); // Clear the error message
        }



        setFormData(attribute)

        // const { name, value } = event.target;
        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: value
        // }));
    };


    const user_create = (event) => {
        event.preventDefault();

        const schoolShift = {
            ...formData,
            created_by,

        };


        
        if (!formData.travel_from) {
            setTravel_from("Travel From Is Required");
            return
            // Clear the error message
        }

    
        if (!formData.travel_from_time) {
            setTravel_from_time("Travel From Time Is required");
            return
            // Clear the error message
        }

      
        if (!formData.travel_to) {
            setTravel_to("travel to is required");
            return
            // Clear the error message
        }


        if (!formData.travel_to_time) {
            setTravel_to_time("travel to time is required");
            return
            // Clear the error message
        }


        if (!formData.vehicle_name) {
            setVehicle_name("vehicle Name is required");
            return
            // Clear the error message
        }


        if (!formData.km_travel) {
            setKm_travel("travell km is required");
            return
            // Clear the error message
        }


        if (!formData.amount) {
            setAmount("amount is required");
            return
            // Clear the error message
        }


        console.log(schoolShift)
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/transport_allowance/transport_allowance_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(schoolShift),
        })
            .then((Response) => {
                Response.json();
                console.log(Response);
                if (Response.ok === true) {
                    if (typeof window !== 'undefined') {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    // router.push('/Admin/transport_allowance/transport_allowance_all');
                }
                }
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error(error));
    };



    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Transport Allowance Create </h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/transport_allowance/transport_allowance_all" className="btn btn-sm btn-info">Back to Transport Allowance List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Travel From:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required mb-2" id="title" placeholder="Enter Company Name" type="text" name="travel_from" />
                                            {
                                                travel_from && <p className='text-danger'>{travel_from}</p>
                                            }
                                        
                                    </div>
                                    </div>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Travel From Time:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                       <input
                                            type="text"
                                            readOnly0
                                            defaultValue={formattedDisplayDate}
                                            onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                            placeholder="dd-mm-yyyy"
                                            className="form-control form-control-sm mb-2"
                                            style={{ display: 'inline-block', }}
                                        />
                                        <input
                                            name='travel_from_time'
                                            type="datetime-local"
                                            id={`dateInput-nt`}
                                            onChange={(e) => handleDateSelection(e)}
                                            style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                        />
                                         {
                                                travel_from_time && <p className='text-danger'>{travel_from_time}</p>
                                            }
                                        
                                    </div>
                                    </div>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Travel To:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required mb-2" id="title" placeholder="Enter Company Name" type="text" name="travel_to" />
                                            {
                                                travel_to && <p className='text-danger'>{travel_to}</p>
                                            }
                                    </div>
                                    </div>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Travel To Time:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                       <input
                                            type="text"
                                            readOnly0
                                            defaultValue={formattedDisplayDates}
                                            onClick={() => document.getElementById(`dateInput-ntn`).showPicker()}
                                            placeholder="dd-mm-yyyy"
                                            className="form-control form-control-sm mb-2"
                                            style={{ display: 'inline-block', }}
                                        />
                                        <input
                                            name='travel_to_time'
                                            type="datetime-local"
                                            id={`dateInput-ntn`}
                                            onChange={(e) => handleDateSelections(e)}
                                            style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                        />
                                            {
                                                travel_to_time && <p className='text-danger'>{travel_to_time}</p>
                                            }
                                        
                                    </div>
                                    </div>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Vehicle<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Company Name" type="text" name="vehicle_name" />
                                              {
                                                vehicle_name && <p className='text-danger'>{vehicle_name}</p>
                                            }
                                    </div>
                                    </div>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Company Name" type="text" name="amount" />
                                              {
                                                amount && <p className='text-danger'>{amount}</p>
                                            }
                                    </div>
                                    </div>
                               
                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Travel(KM)<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Company Name" type="text" name="km_travel" />
                                             {
                                                km_travel && <p className='text-danger'>{km_travel}</p>
                                            }
                                    </div>
                                    </div>
                               


                                    <div className="form-group row">
                                        <div className="offset-md-3 col-sm-6">
                                            <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTRansportAllowance;