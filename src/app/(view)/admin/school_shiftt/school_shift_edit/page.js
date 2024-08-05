// 'use client'
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';

// const SchoolShiftEdit = ({ id }) => {


//     const [start_time, setstart_time] = useState('');
//     const [late_time, setlate_time] = useState('');
//     const [end_time, setend_time] = useState('');
//     const [early_end_time, setearly_end_time] = useState('');



//     const handleTimeChange = (event, setTime) => {
//         const dateTimeValue = event.target.value;
//         const timeValue = new Date(dateTimeValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         setTime(timeValue);


//     };


//     const { data: schoolShiftListSingle = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['schoolShiftListSingle'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })

//     console.log(schoolShiftListSingle)
//     const modified_by = localStorage.getItem('userId')
//     const [formData, setFormData] = useState({
//         name: '',
//         start_time: '',
//         late_time: '',
//         end_time: '',
//         early_end_time: '',
//         modified_by: ''
//     });

//     useEffect(() => {

//         setFormData({
//             name: schoolShiftListSingle[0]?.name,
//             start_time: schoolShiftListSingle[0]?.start_time,
//             late_time: schoolShiftListSingle[0]?.late_time,
//             end_time: schoolShiftListSingle[0]?.end_time,
//             early_end_time: schoolShiftListSingle[0]?.early_end_time,
//             modified_by: modified_by
//         });
//     }, [schoolShiftListSingle, modified_by]);

//     console.log(formData)

//     const school_shift_update = (e) => {
//         e.preventDefault()

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_edit/${id}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         })
//             .then(response => {

//                 response.json()
//             console.log(response)
//             })
//             .then(data => {
//                 console.log(data);
//                 // if (data.affectedRows > 0) {
//                 //     sessionStorage.setItem("message", "Data Update successfully!");
//                 //     // router.push('/Admin/period/period_all')

//                 // }
//                 // Handle success or show a success message to the user
//             })
//             .catch(error => {
//                 console.error('Error updating brand:', error);
//                 // Handle error or show an error message to the user
//             });

//     };

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create School Shift</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/school_shift/school_shift_all?page_group`} className="btn btn-sm btn-info">Back School Shift List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <form action="" onSubmit={school_shift_update}>
//                                     <div className="card-body">
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     defaultValue={formData.name}
//                                                     type="text" name="name" className="form-control form-control-sm  alpha_space unique_name" id="name" placeholder="Enter Name" />

//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     name='start_time'
//                                                     value={start_time ? start_time : formData?.start_time}
//                                                     onClick={() => document.getElementById(`dateInput-n1`).showPicker()}

//                                                     placeholder="dd-mm-yyyy"
//                                                     className="form-control form-control-sm mb-2"
//                                                     style={{ display: 'inline-block', }}
//                                                 />
//                                                 <input
//                                                     type="datetime-local"
//                                                     id={`dateInput-n1`}
//                                                     onChange={(e) => handleTimeChange(e, setstart_time)}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                 />

//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={late_time ? late_time : formData?.late_time}
//                                                     name='late_time'
//                                                     onClick={() => document.getElementById(`dateInput-n2`).showPicker()}

//                                                     placeholder="dd-mm-yyyy"
//                                                     className="form-control form-control-sm mb-2"
//                                                     style={{ display: 'inline-block', }}
//                                                 />
//                                                 <input
//                                                     type="datetime-local"
//                                                     id={`dateInput-n2`}
//                                                     onChange={(e) => handleTimeChange(e, setlate_time)}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={end_time ? end_time : formData?.end_time}
//                                                     name='end_time'
//                                                     onClick={() => document.getElementById(`dateInput-n3`).showPicker()}

//                                                     placeholder="dd-mm-yyyy"
//                                                     className="form-control form-control-sm mb-2"
//                                                     style={{ display: 'inline-block', }}
//                                                 />
//                                                 <input
//                                                     type="datetime-local"
//                                                     id={`dateInput-n3`}
//                                                     onChange={(e) => handleTimeChange(e, setend_time)}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={early_end_time ? early_end_time : formData?.early_end_time}
//                                                     name='early_end_time'
//                                                     onClick={() => document.getElementById(`dateInput-n4`).showPicker()}

//                                                     placeholder="dd-mm-yyyy"
//                                                     className="form-control form-control-sm mb-2"
//                                                     style={{ display: 'inline-block', }}
//                                                 />
//                                                 <input
//                                                     type="datetime-local"
//                                                     id={`dateInput-n4`}
//                                                     onChange={(e) => handleTimeChange(e, setearly_end_time)}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="form-group row">
//                                             <div className="offset-md-3 col-sm-6">
//                                                 <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SchoolShiftEdit;
'use client'
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const SchoolShiftEdit = ({ id }) => {


    
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
        name: '',
        start_time: '',
        late_time: '',
        end_time: '',
        early_end_time: '',
        modified_by: userId
    });

    const { data: schoolShiftData, isLoading, refetch } = useQuery({
        queryKey: ['schoolShiftListSingle', id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all/${id}`);
            const data = await res.json();
            return data;
        }
    });

    useEffect(() => {
        if (schoolShiftData && schoolShiftData[0]) {
            const { name, start_time, late_time, end_time, early_end_time } = schoolShiftData[0];
            setFormData({
                name,
                start_time,
                late_time,
                end_time,
                early_end_time,
                modified_by: userId
            });
        }
    }, [schoolShiftData, userId]);

    const handleTimeChange = (event, field) => {
        const dateTimeValue = event.target.value;
        const timeValue = new Date(dateTimeValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setFormData({ ...formData, [field]: timeValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data); // Handle response data or success message
        } catch (error) {
            console.error('Error updating school shift:', error);
            // Handle error or show an error message to the user
        }
    };

    if (isLoading) return <div className='  text-center text-dark'
    >
        <FontAwesomeIcon style={{
            height: '33px',
            width: '33px',
        }} icon={faSpinner} spin />
    </div>;
    

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Edit School Shift</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/school_shift/school_shift_all?page_group`} className="btn btn-sm btn-info">Back to School Shift List</Link>
                                    </div>
                                </div>
                                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="card-body">
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control form-control-sm"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.start_time}
                                                    name="start_time"
                                                    className="form-control form-control-sm mb-2"
                                                    onClick={() => document.getElementById(`dateInput-n1`).showPicker()}
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    type="datetime-local"
                                                    id={`dateInput-n1`}
                                                    onChange={(e) => handleTimeChange(e, "start_time")}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.late_time}
                                                    name="late_time"
                                                    className="form-control form-control-sm mb-2"
                                                    onClick={() => document.getElementById(`dateInput-n2`).showPicker()}
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    type="datetime-local"
                                                    id={`dateInput-n2`}
                                                    onChange={(e) => handleTimeChange(e, "late_time")}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.end_time}
                                                    name="end_time"
                                                    className="form-control form-control-sm mb-2"
                                                    onClick={() => document.getElementById(`dateInput-n3`).showPicker()}
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    type="datetime-local"
                                                    id={`dateInput-n3`}
                                                    onChange={(e) => handleTimeChange(e, "end_time")}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.early_end_time}
                                                    name="early_end_time"
                                                    className="form-control form-control-sm mb-2"
                                                    onClick={() => document.getElementById(`dateInput-n4`).showPicker()}
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    type="datetime-local"
                                                    id={`dateInput-n4`}
                                                    onChange={(e) => handleTimeChange(e, "early_end_time")}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">
                                                <input type="submit" className="btn btn-sm btn-success" value="Submit" />
                                            </div>
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

export default SchoolShiftEdit;

