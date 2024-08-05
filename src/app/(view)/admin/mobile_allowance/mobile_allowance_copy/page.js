'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const MobileAllowanceCopy = ({ id }) => {

    
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
        mobile: '', amount: '', recharge_user: created_by, created_by: created_by, recharge_time: ''

    });

    const { data: mobileAllowanceSingle, isLoading, refetch } = useQuery({
        queryKey: ['mobileAllowanceSingle', id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_all/${id}`);
            const data = await res.json();
            return data;
        }
    });

    useEffect(() => {
        if (mobileAllowanceSingle && mobileAllowanceSingle[0]) {
            const { mobile, amount, recharge_time } = mobileAllowanceSingle[0];
            setFormData({

                mobile, amount, recharge_time, modified_by: localStorage.getItem('userId')
            });
        }
    }, [mobileAllowanceSingle]);

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
            recharge_time: formattedDatabaseDate // Update the dob field in the state
        }));
        // if(!formattedDatabaseDate){
        //     setJoinDate('Join Date must be filled nayan')
        // }
        // else{
        //     setJoinDate('')
        // }
    };

    console.log(selectedDate);

    useEffect(() => {
        const dob = formData.recharge_time;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const user_create = (event) => {
        event.preventDefault();

        const schoolShift = {
            ...formData,
            created_by,

        };
        console.log(schoolShift)
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create`, {
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
                    if(typeof window !== 'undefined'){

                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    router.push('/Admin/mobile_allowance/mobile_allowance_all');
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
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Mobile Allowance Copy</h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/mobile_allowance/mobile_allowance_all" className="btn btn-sm btn-info">Back to Mobile Allowance List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Mobile Number:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}

                                            value={formData.mobile}

                                            class="form-control form-control-sm required" id="title" placeholder="Enter Company Name" type="text" name="mobile" />
                                    </div>
                                    </div>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Recharge Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}

                                            value={formData.amount}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Company Name" type="text" name="amount" />
                                    </div>
                                    </div>
                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Recharge Time<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input
                                            type="text"
                                            readOnly

                                            defaultValue={formattedDisplayDate}
                                            onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                            placeholder="dd-mm-yyyy"
                                            className="form-control form-control-sm mb-2"
                                            style={{ display: 'inline-block', }}
                                        />
                                        <input
                                            name='recharge_time'
                                            type="date"
                                            id={`dateInput-nt`}
                                            onChange={(e) => handleDateSelection(e)}
                                            style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                        />
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

export default MobileAllowanceCopy;