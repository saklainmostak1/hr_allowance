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

const OfficeVisistRemarks = ({ id }) => {





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
        remarks_date: '',
        remarks: '',
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
            remarks_date: formattedDatabaseDate // Update the dob field in the state
        }));

        if(formattedDatabaseDate){
            setRemarks_date('')
        }

    };

    console.log(selectedDate);

    useEffect(() => {
        const dob = formData.remarks_date;
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


    const [remarks_date, setRemarks_date] = useState([])
    const [remarks, setRemarks] = useState([])



    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value

        const remarks_date = attribute['remarks_date'];
        if (remarks_date) {
            setRemarks_date(""); // Clear the error message
        }

        const remarks = attribute['remarks'];
        if (remarks) {
            setRemarks(""); // Clear the error message
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

        if (!formData.remarks) {
            setRemarks("Remarks Must be filled");
            return
            // Clear the error message
        }

        if (!formData.remarks_date) {
            setRemarks_date("Remarks Date must Be filled");
            return
            // Clear the error message
        }




        console.log(schoolShift)
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_remarks_create`, {
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
                    if (typeof window !== '') {

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
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Remarks Create</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                    <Link href={`/Admin/office_visit/office_visit_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Office Visit List</Link>
                                </div>
                            </div>


                            <div class="card-body">
                                <form class="" onSubmit={user_create}>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Office Visit Remarks Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required mb-2" id="title" placeholder="Office Visit Remarks Name" type="text" name="remarks" />

                                        {
                                            remarks && <p className='text-danger'>{remarks}</p>
                                        }

                                    </div>
                                    </div>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">  Office Visit Remarks Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
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
                                            name='remarks_date'
                                            type="datetime-local"
                                            id={`dateInput-nt`}
                                            onChange={(e) => handleDateSelection(e)}
                                            style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                        />
                                        {
                                            remarks_date && <p className='text-danger'>{remarks_date}</p>
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
                                <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Remarks Info</h5>
                                <div className="flex items-center float-right">
                                    <Link href={`/Admin/office_visit/office_visit_person/${office_visits_remarks[0]?.id}?page_group=${page_group}`}>
                                        {filteredBtnIconPerson?.map((filteredBtnIconEdit => (
                                            <button
                                                key={filteredBtnIconEdit.id}
                                                title='Create'
                                                style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                className={filteredBtnIconEdit?.btn}
                                            >
                                                <a
                                                    dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                ></a>
                                            </button>
                                        )))}
                                    </Link>

                                </div>
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
                                                    Office Visit Remarks Name
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
                                                office_visits_remarks[0]?.remarks?.map((remark, i) => (
                                                    <tr key={remark.remarks_id}>
                                                        <td>    {i + 1}</td>

                                                        <td>
                                                            {remark?.remarks}
                                                        </td>

                                                        {/* <td>

                                                         </td> */}

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

export default OfficeVisistRemarks;



