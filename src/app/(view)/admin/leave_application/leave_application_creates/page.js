'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CreateLeaveApplication = () => {

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

    const [formData, setFormData] = useState({
        leave_category: '', start_date: '', receiver: '', whose_leave: '', end_date: '', created_by: created_by, leave_date: ''

    });



    const handleChange = (event) => {

        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value


        setFormData(attribute)

    };

    const { data: employeeList = [], isLoading, refetch
    } = useQuery({
        queryKey: ['employeeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`)

            const data = await res.json()
            return data
        }
    })

    console.log(employeeList)

    const groupedEmployees = employeeList.reduce((groups, employee) => {
        const designation = employee.designation_name;
        if (!groups[designation]) {
            groups[designation] = [];
        }
        groups[designation].push(employee);
        return groups;
    }, {});

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
            start_date: formattedDatabaseDate // Update the dob field in the state
        }));


    };

    console.log(selectedDate);

    useEffect(() => {
        const dob = formData.start_date;
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
            end_date: formattedDatabaseDate // Update the dob field in the state
        }));


    };

    console.log(selectedDates);

    useEffect(() => {
        const dob = formData.end_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDates(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);

    const router = useRouter()


    const generateDateRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const dateArray = [];

        while (startDate <= endDate) {
            const currentDate = new Date(startDate);
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const year = currentDate.getFullYear();
            const formattedDate = `${year}-${month}-${day}`;
            dateArray.push(formattedDate);
            startDate.setDate(startDate.getDate() + 1);
        }

        return dateArray;
    };



    const user_create = (event) => {
        event.preventDefault();

        const leaveDates = generateDateRange(formData.start_date, formData.end_date);
        const dataToSubmit = { ...formData, leave_date: leaveDates };

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(dataToSubmit),
        })
            .then((response) => 
                response.json()
                // if (response.ok === true) {
                //     if (typeof window !== 'undefined') {
                //         sessionStorage.setItem("message", "Data saved successfully!");
                //     }
                //     // router.push('/Admin/leave_application/leave_application_all');
                // }
    )
            .then((data) => 
                console.log(data.affectedRows)

            )
            .catch((error) => console.error(error));
    };


    const { data: leaveCategory = []
    } = useQuery({
        queryKey: ['leaveCategory'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_list`)

            const data = await res.json()
            return data
        }
    })



    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Leave Application</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/leave_application/leave_application_all?page_group`} className="btn btn-sm btn-info">Back Leave Application List</Link>
                                    </div>
                                </div>
                                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <div class="card-body">

                                    <form class="" method="post" autocomplete="off" onSubmit={user_create}>

                                        <div class="form-group row">
                                            <label class="col-form-label font-weight-bold col-md-3">Leave For:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div class="col-md-6">

                                                <select
                                                    onChange={handleChange}
                                                    required="" name="whose_leave" class="form-control form-control-sm  trim integer_no_zero whose_leave" id="whose_leave">
                                                    <option value="">Select Applicant</option>
                                                    {Object.keys(groupedEmployees).map(designation => (
                                                        <optgroup key={designation} label={designation}>
                                                            {groupedEmployees[designation].map(employee => (
                                                                <option key={employee.user_id} value={employee.user_id}>
                                                                    {employee.full_name}
                                                                </option>
                                                            ))}
                                                        </optgroup>
                                                    ))}

                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-form-label font-weight-bold col-md-3">Leave Category:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div class="col-md-6">
                                                <select
                                                    onChange={handleChange}
                                                    required="" name="leave_category" class="form-control form-control-sm  trim integer_no_zero" id="leave_category" placeholder="Enter Leave Category">
                                                    <option value="">Select Leave Category</option>
                                                    {
                                                            leaveCategory.map(category =>

                                                                <>
                                                                    <option value={category.id}>{category.name}</option>
                                                                </>
                                                            )
                                                        }
                                                    {/* <option value="1">অসুস্থ</option>
                                                    <option value="3">বিবাহ</option>
                                                    <option value="2">মাসিক ছুটি</option> */}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Start Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
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
                                                name='start_date'
                                                type="date"
                                                id={`dateInput-nt`}
                                                onChange={(e) => handleDateSelection(e)}
                                                style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                            />


                                        </div>
                                        </div>





                                        <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> End Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
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
                                                name='end_date'
                                                type="date"
                                                id={`dateInput-ntn`}
                                                onChange={(e) => handleDateSelections(e)}
                                                style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                            />


                                        </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-form-label font-weight-bold col-md-3">Receiver:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div class="col-md-6">

                                                <select
                                                    onChange={handleChange}
                                                    required="" name="receiver" class="form-control form-control-sm  trim integer_no_zero whose_leave" id="whose_leave">
                                                    <option value="">Select Receiver</option>
                                                    {Object.keys(groupedEmployees).map(designation => (
                                                        <optgroup key={designation} label={designation}>
                                                            {groupedEmployees[designation].map(employee => (
                                                                <option key={employee.user_id} value={employee.user_id}>
                                                                    {employee.full_name}
                                                                </option>
                                                            ))}
                                                        </optgroup>
                                                    ))}

                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="offset-md-3 col-sm-6">
                                                <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateLeaveApplication;