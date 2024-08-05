'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-dropdown-select';
import Link from 'next/link';
import '../../../admin_layout/modal/fa.css'
import Swal from 'sweetalert2';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jsPDF from 'jspdf';
import * as XLSX from "xlsx";
import 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } from 'docx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaUpload } from 'react-icons/fa';

const OfficeVisitPerson = ({ id }) => {


    
    const [created_by, setcreated_by] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setcreated_by(storedUserId);
        }
      }, []);



    const [userId, setUserId] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setUserId(storedUserId);
        }
      }, []);

    const [formData, setFormData] = useState({
        person_name: '',
        person_mobile: '',
        person_email: '',
        add_person_date: '',
        created_by: created_by,
        user_id: created_by,
        office_visit_id: id

    });


    const { data: office_visits_remarks = [], isLoading, refetch
    } = useQuery({
        queryKey: ['office_visits_remarks'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_all/${id}`)

            const data = await res.json()
            return data
        }
    })
    console.log(office_visits_remarks)
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
            add_person_date: formattedDatabaseDate // Update the dob field in the state
        }));
        if(formattedDatabaseDate){
            setAdd_person_date('')
        }

    };

    console.log(selectedDate);

    useEffect(() => {
        const dob = formData.add_person_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);

    const [page_group, setPage_group] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('pageGroup') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('pageGroup');
          setPage_group(storedUserId);
        }
      }, []);


    

      const [person_name, setPerson_name] = useState([])
      const [person_mobile, setPerson_mobile] = useState([])
      const [person_email, setPerson_email] = useState([])
      const [add_person_date, setAdd_person_date] = useState([])

    const handleChange = (event) => {
        // const { name, value } = event.target;
        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: value
        // }));

        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value



        const person_name = attribute['person_name'];
        if (person_name) {
            setPerson_name(""); // Clear the error message
        }

        const person_mobile = attribute['person_mobile'];
        if (person_mobile) {
            setPerson_mobile(""); // Clear the error message
        }

        const person_email = attribute['person_email'];
        if (person_email) {
            setPerson_email(""); // Clear the error message
        }

        const add_person_date = attribute['add_person_date'];
        if (add_person_date) {
            setAdd_person_date(""); // Clear the error message
        }



        setFormData(attribute)
    };

    const user_create = (event) => {
        event.preventDefault();

        const schoolShift = {
            ...formData,
            created_by,

        };

        if (!formData.person_name) {
            setPerson_name("Person Name Is Required");
            return
            // Clear the error message
        }
        if (!formData.person_email) {
            setPerson_email("Email Is Required");
            return
            // Clear the error message
        }
        if (!formData.person_mobile) {
            setPerson_mobile("Mobile Is Required");
            return
            // Clear the error message
        }
        if (!formData.add_person_date) {
            setAdd_person_date("Add person date Is Required");
            return
            // Clear the error message
        }


        console.log(schoolShift)
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(schoolShift),
        })
            .then((Response) => {
                refetch()
                Response.json();
                console.log(Response);
                if (Response.ok === true) {
                    if(typeof window !== 'undefined'){

                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    // router.push('/Admin/transport_allowance/transport_allowance_all');
                }
            })
            .then((data) => {
                console.log(data);
                refetch()
            })
            .catch((error) => console.error(error));
    };

    const { data: moduleInfo = []
    } = useQuery({
        queryKey: ['moduleInfo'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`)

            const data = await res.json()
            return data
        }
    })

    // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'office_visit')
    const filteredBtnIconPerson = brandList.filter(btn =>
        btn.method_sort === 9
    );


    return (
        // col-md-12
        <div class="container-fluid">
            <div class=" row ">




                <div className='col-12 p-4'>



                    <div className='card mb-4'>
                        {/* <div class=" body-content bg-light"> */}


                        <div class=" border-primary shadow-sm border-0">
                            <div class="bg-gradient-primary card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Office Visit Person Create</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                    <Link href={`/Admin/office_visit/office_visit_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Office Visit Create</Link>
                                </div>
                            </div>


                            <div class="card-body">
                                <form class="" onSubmit={user_create}>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Office Visit Person Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required mb-2" id="title" placeholder="Office Visit Person Name" type="text" name="person_name" />
                                            {
                                                person_name && <p className='text-danger'>{person_name}</p>
                                            }

                                    </div>
                                    </div>
                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Office Visit Person Email:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required mb-2" id="title" placeholder="Office Visit Person Email" type="text" name="person_email" />
                                            {
                                                person_email && <p className='text-danger'>{person_email}</p>
                                            }


                                    </div>
                                    </div>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Office Visit Person Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required mb-2" id="title" placeholder="Office Visit Person Mobile" type="text" name="person_mobile" />
                                            {
                                                person_mobile && <p className='text-danger'>{person_mobile}</p>
                                            }


                                    </div>
                                    </div>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">  Office Visit Person Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
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
                                            name='add_person_date'
                                            type="datetime-local"
                                            id={`dateInput-nt`}
                                            onChange={(e) => handleDateSelection(e)}
                                            style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                        />
                                        {
                                                add_person_date && <p className='text-danger'>{add_person_date}</p>
                                            }


                                    </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="offset-md-3 col-sm-6">
                                            <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                        </div>
                                    </div>


                                </form>
                                <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                    <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                </div>

                            </div>
                        </div>


                        {/* </div> */}
                    </div>

                    <div className='card'>
                        <div class=" border-primary  shadow-sm border-0">
                            <div class="card-header   custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Person Info</h5>

                            </div>



                            <div class="card-body" >

                                <div className='table-responsive'>

                                    <table className="table  table-bordered table-hover table-striped table-sm">
                                        <thead>

                                            <tr>
                                                <th>

                                                    Serial
                                                </th>
                                                <th>
                                                    Office Visit Person Name
                                                </th>
                                                <th>
                                                    Office Visit Person Mobile
                                                </th>
                                                <th>
                                                    Office Visit Person Email
                                                </th>
                                                <th>
                                                    Office Visit Person Date
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>
                                            {isLoading ? <div className='text-center'>
                                                <div className='  text-center text-dark'
                                                >
                                                    <FontAwesomeIcon style={{
                                                        height: '33px',
                                                        width: '33px',
                                                    }} icon={faSpinner} spin />
                                                </div>
                                            </div>
                                                :
                                                office_visits_remarks[0]?.persons?.map((person, i) => (
                                                    <tr key={person.person_id}>
                                                        <td>    {i + 1}</td>

                                                        <td>
                                                            {person?.person_name}
                                                        </td>
                                                        <td>
                                                            {person?.person_mobile}
                                                        </td>
                                                        <td>
                                                            {person?.person_email}
                                                        </td>
                                                        <td>
                                                            {person?.add_person_date}
                                                        </td>

                                                   

                                                    </tr>
                                                )

                                                )



                                            }
                                        </tbody>

                                    </table>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OfficeVisitPerson;



