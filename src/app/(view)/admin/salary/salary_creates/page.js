// 'use client'

// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';

// const SalaryCreate = () => {


//     const [months, setMonths] = useState([]);

//     useEffect(() => {
//         const currentYear = new Date().getFullYear();
//         const currentMonth = new Date().getMonth(); // 0-based index
//         const monthNames = [
//             "January", "February", "March", "April", "May", "June",
//             "July", "August", "September", "October", "November", "December"
//         ];

//         // Create an array of months up to the current month
//         const monthOptions = [];
//         for (let i = 0; i <= currentMonth; i++) {
//             monthOptions.push({
//                 value: `${currentYear}-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
//                 label: `${monthNames[i]} ${currentYear}`
//             });
//         }

//         setMonths(monthOptions);
//     }, []);


//     const { data: designations = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['designations'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: salarys = [],
//     } = useQuery({
//         queryKey: ['salarys'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const [designation, setDesignation] = useState('');
//     const [month, setMonth] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [searchResults, setSearchResults] = useState([]);
//     const [error, setError] = useState(null);


//     const salary_search = () => {
//         setLoading(true);
//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_search`, {
//             designation
//         })
//             .then(response => {
//                 setSearchResults(response.data.results);
//                 setError(null);
//                 setLoading(false);
//                 if (response.data.results == '') {
//                     alert('Nothing found!');
//                 }
//             })
//             .catch(error => {
//                 setError("An error occurred during search.", error);
//                 setSearchResults([]);
//             });
//     };

//     console.log(searchResults)



//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     {/* {
//                         message &&

//                         <div className="alert alert-success font-weight-bold">
//                             {message}
//                         </div>
//                     } */}
//                     <div className='card mb-4'>
//                         <div class=" body-content bg-light">

//                             <div class=" border-primary shadow-sm border-0">
//                                 <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Salary Create</h5>
//                                     <div class="card-title font-weight-bold mb-0 card-header-color float-right">


//                                     </div>
//                                 </div>
//                                 <div class="card-body">
//                                     <form class="">
//                                         <div class="col-md-10 offset-md-1">


//                                             <div class="form-group row student">

//                                                 <label class="col-form-label col-md-2"><strong>Designation:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         value={designation} onChange={(e) => setDesignation(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero lshift"

//                                                     >
//                                                         <option value="">Select Designation</option>
//                                                         {
//                                                             designations.map(designation =>
//                                                                 <>
//                                                                     <option value={designation.id}>{designation.designation_name}</option>
//                                                                 </>

//                                                             )
//                                                         }



//                                                     </select>
//                                                 </div>

//                                                 <label class="col-form-label col-md-2"><strong>Month:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         value={month} onChange={(e) => setMonth(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero lshift"

//                                                     >
//                                                         <option value="">Select Month</option>
//                                                         {months.map((month, index) => (
//                                                             <option key={index} value={month.value}>
//                                                                 {month.label}
//                                                             </option>
//                                                         ))}



//                                                     </select>
//                                                 </div>

//                                             </div>




//                                         </div>
//                                         <div class="form-group row">
//                                             <div class="offset-md-2 col-md-8 float-left">
//                                                 <input type="button" name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search"
//                                                     onClick={salary_search}
//                                                 />

//                                             </div>
//                                         </div>
//                                     </form>
//                                     <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
//                                         <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>



//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Salary Genarate</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">

//                                         <div class="offset-md-3 col-sm-6">
//                                             <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
//                                         </div>

//                                     </div>
//                                 </div>



//                                 <div class="card-body">



//                                     <div className='table-responsive'>
//                                         {
//                                             searchResults.length > 0 &&


//                                             <table className="table table-bordered table-hover table-striped table-sm">
//                                                 <thead>

//                                                     <tr>
//                                                         <th>

//                                                             Serial
//                                                         </th>
//                                                         <th>

//                                                             Name
//                                                         </th>
//                                                         <th>
//                                                             Designation
//                                                         </th>
//                                                         <th>
//                                                             Payroll
//                                                         </th>
//                                                         <th>
//                                                             Previous Due
//                                                         </th>
//                                                         <th>
//                                                             Present Salary
//                                                         </th>
//                                                         <th>
//                                                             Total Payable Amount
//                                                         </th>
//                                                         <th>
//                                                             Bonus
//                                                         </th>
//                                                         <th>
//                                                             Paid Amount
//                                                         </th>
//                                                         <th>
//                                                             Due Amount
//                                                         </th>
//                                                         <th>
//                                                             Total Day
//                                                         </th>
//                                                         <th>
//                                                             Working Day
//                                                         </th>
//                                                         <th>
//                                                             Absent & Present
//                                                         </th>
//                                                         <th>
//                                                             Holiday & Leave
//                                                         </th>
//                                                         <th>
//                                                             Paid By:
//                                                         </th>
//                                                         <th>
//                                                             Salary Date
//                                                         </th>
//                                                     </tr>

//                                                 </thead>

//                                                 <tbody>
//                                                     {isLoading ? <div className='text-center'>
//                                                         <div className='  text-center text-dark'
//                                                         >
//                                                             <FontAwesomeIcon style={{
//                                                                 height: '33px',
//                                                                 width: '33px',
//                                                             }} icon={faSpinner} spin />
//                                                         </div>
//                                                     </div>
//                                                         :
//                                                         searchResults.map((salaries, i) => (
//                                                             <tr key={salaries.id}>
//                                                                 <td>    {i + 1}</td>

//                                                                 <td>
//                                                                     {salaries.employee_name}
//                                                                 </td>
//                                                                 <td>
//                                                                     {salaries.designation_name_promotion}
//                                                                 </td>
//                                                                 <td>
//                                                                     {`${salaries.Payroll} (${salaries.salary})`}
//                                                                 </td>
//                                                                 <td>
//                                                                     0
//                                                                 </td>
//                                                                 <td>
//                                                                     {salaries.salary}
//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>

//                                                                 <td>

//                                                                 </td>

//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>




//                                                             </tr>
//                                                         )

//                                                         )



//                                                     }
//                                                 </tbody>

//                                             </table>
//                                         }
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalaryCreate;

// 'use client'

// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// const SalaryCreate = () => {


//     const [created, setCreated] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setCreated(storedUserId);
//         }
//     }, []);

//     const [fromDate, setFromDate] = useState('');
//     const [bonus, setBonus] = useState(0);
//     const [paidAmount, setPaidAmount] = useState(0);

//     const [months, setMonths] = useState([]);
//     const [designation, setDesignation] = useState('');
//     const [month, setMonth] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [searchResults, setSearchResults] = useState([]);
//     const [error, setError] = useState(null);


//     const formatDate = (date) => {
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = String(date.getFullYear());
//         return `${day}-${month}-${year}`;
//     };

//     const handleTextInputClick = () => {
//         document.getElementById('dateInputFrom').showPicker();
//     };

//     const handleDateChangeFrom = (event) => {
//         const selectedDate = new Date(event.target.value);
//         // const formattedDate = formatDate(selectedDate);
//         setFromDate(selectedDate);
//     };

//     useEffect(() => {
//         const currentDate = new Date();
//         setFromDate(currentDate);

//     }, []);

//     useEffect(() => {
//         const currentYear = new Date().getFullYear();
//         const currentMonth = new Date().getMonth(); // 0-based index
//         const monthNames = [
//             "January", "February", "March", "April", "May", "June",
//             "July", "August", "September", "October", "November", "December"
//         ];

//         // Create an array of months up to the current month
//         const monthOptions = [];
//         for (let i = 0; i <= currentMonth; i++) {
//             monthOptions.push({
//                 value: `${currentYear}-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
//                 label: `${monthNames[i]} ${currentYear}`
//             });
//         }

//         setMonths(monthOptions);
//     }, []);

//     const { data: designations = [], isLoading: isDesignationsLoading } = useQuery({
//         queryKey: ['designations'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)
//             const data = await res.json()
//             return data
//         }
//     });

//     const { data: salaries = [] } = useQuery({
//         queryKey: ['salaries'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_all`)
//             const data = await res.json()
//             return data
//         }
//     });

//     const getTotalDaysInMonth = (year, month) => {
//         return new Date(year, month, 0).getDate();
//     };

//     const salary_search = () => {
//         setLoading(true);

//         if (month === '') {
//             alert('select a month')
//             return
//         }

//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_search`, {
//             designation
//         })
//             .then(response => {
//                 const results = response.data.results;
//                 const monthYear = month.split('-');
//                 const totalDays = getTotalDaysInMonth(Number(monthYear[0]), Number(monthYear[1]));

//                 const updatedResults = results.map(result => ({
//                     ...result,
//                     totalDays
//                 }));

//                 setSearchResults(updatedResults);
//                 setError(null);
//                 setLoading(false);
//                 if (results.length === 0) {
//                     alert('Nothing found!');
//                 }
//             })
//             .catch(error => {
//                 setError("An error occurred during search.");
//                 setSearchResults([]);
//                 setLoading(false);
//             });
//     };

//     console.log(typeof (bonus))


//     const { data: attendance = [] } = useQuery({
//         queryKey: ['attendance'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance_all/attendance_all`)
//             const data = await res.json()
//             return data
//         }
//     });

//     const filteredAttendance = attendance.filter(att => {
//         const checktimeMonthYear = att.checktime.substring(0, 7);
//         return checktimeMonthYear === month;
//     });

//     console.log(filteredAttendance)




//     const matchLengths = salaries.map(emp => {
//         const matchCount = attendance.filter(att => att.user_id === emp.user_id).length;
//         return { user_id: emp.user_id, match_length: matchCount };
//     });

//     console.log(matchLengths);

//     const { data: holidays = [] } = useQuery({
//         queryKey: ['holidays'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/yearly_holiday/yearly_holiday_all`)
//             const data = await res.json()
//             return data
//         }
//     });


//     const filteredAttendances = holidays.filter(att => {
//         const checktimeMonthYear = att.start_date.substring(0, 7);
//         return checktimeMonthYear === month;
//     });

//     console.log(filteredAttendances)
//     console.log(filteredAttendances.length)

//     const { data: leavesDays = [] } = useQuery({
//         queryKey: ['leavesDays'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all`)
//             const data = await res.json()
//             return data
//         }
//     });
//     console.log(leavesDays.filter(leave => leave.application_status === 2))

//     const leaveApproveCount = leavesDays.filter(leave => leave.application_status === 2)

//     console.log(leaveApproveCount)

//     const { data: leavesDaysApproved = [] } = useQuery({
//         queryKey: ['leavesDaysApproved'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_approved/leave_approved_all`)
//             const data = await res.json()
//             return data
//         }
//     });

//     const matchLength = leaveApproveCount.map(emp => {
//         const matchCount = leavesDaysApproved.filter(att => att.leave_application_id === emp.id).length;
//         return { user_id: emp.whose_leave, match_length: matchCount };
//     });

//     console.log(matchLength)

    
//     // Function to handle form submission
//     const handleSubmit = (event) => {
//         // Collect the form data


//         event.preventDefault();


//         const formatDate = (date) => {
//             const d = new Date(date);
//             const year = d.getFullYear();
//             const month = ('0' + (d.getMonth() + 1)).slice(-2);
//             const day = ('0' + d.getDate()).slice(-2);
//             return `${year}-${month}-${day}`;
//         };
//         const formToSubmit = searchResults.map(salary => ({
//             user_id: salary.user_id,
//             salary_month: `${month}-10`,
//             salary_date: fromDate ? formatDate(fromDate) : '',
//             created_by: created,
//             due: salary.salary,
//             paid_amount: salary.salary + parseFloat(bonus),
//             paid_by: document.querySelector('select[name="paid_by"]').value
//         }));

//         console.log(formToSubmit)

//         axios.post('http://192.168.0.107:5002/Admin/salary/salary_create', formToSubmit)
//             .then(response => {
//                 alert('Data submitted successfully!');
//                 // Optionally handle success (e.g., reset the form, show a message, etc.)
//             })
//             .catch(error => {
//                 alert('An error occurred while submitting data.');
//                 console.error('Error:', error);
//                 // Optionally handle error (e.g., show an error message, etc.)
//             });
//     };


//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card mb-4'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Salary Create</h5>
//                                 </div>
//                                 <div className="card-body">
//                                     <form >
//                                         <div className="col-md-10 offset-md-1">
//                                             <div className="form-group row">
//                                                 <label className="col-form-label col-md-2"><strong>Designation:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         value={designation} onChange={(e) => setDesignation(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero"
//                                                     >
//                                                         <option value="">Select Designation</option>
//                                                         {
//                                                             designations.map(designation =>
//                                                                 <option key={designation.id} value={designation.id}>
//                                                                     {designation.designation_name}
//                                                                 </option>
//                                                             )
//                                                         }
//                                                     </select>
//                                                 </div>

//                                                 <label className="col-form-label col-md-2"><strong>Month:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         value={month} onChange={(e) => setMonth(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero"
//                                                     >
//                                                         <option value="">Select Month</option>
//                                                         {months.map((month, index) => (
//                                                             <option key={index} value={month.value}>
//                                                                 {month.label}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <div className="offset-md-2 col-md-8 float-left">
//                                                 <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
//                                                     onClick={salary_search}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='card'>
//                     <form action="" onSubmit={handleSubmit}>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Salary Generate</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <div className="offset-md-3 col-sm-6">
//                                             <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="card-body">
                                   

//                                     <div className='table-responsive'>
//                                         {
//                                             searchResults.length > 0 &&
//                                             <table className="table table-bordered table-hover table-striped table-sm">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>
//                                                             <input type="checkbox" name="" id="" />
//                                                         </th>
//                                                         <th>Serial</th>
//                                                         <th>Name</th>
//                                                         <th>Designation</th>
//                                                         <th>Payroll</th>
//                                                         <th>Previous Due</th>
//                                                         <th>Present Salary</th>
//                                                         <th>Total Payable Amount</th>
//                                                         <th>Bonus</th>
//                                                         <th>Paid Amount</th>
//                                                         <th>Due Amount</th>
//                                                         <th>Total Day</th>
//                                                         <th>Working Day</th>
//                                                         <th>Absent & Present</th>
//                                                         <th>Holiday & Leave</th>
//                                                         <th>Paid By:</th>
//                                                         <th>Salary Date</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {loading ?
//                                                         <tr>
//                                                             <td colSpan="16" className="text-center">
//                                                                 <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
//                                                             </td>
//                                                         </tr>
//                                                         :
//                                                         searchResults.map((salary, i) => (
//                                                             <tr key={salary.id}>
//                                                                 <th>
//                                                                     <input type="checkbox" name="" id="" />
//                                                                 </th>
//                                                                 <td>{i + 1}</td>
//                                                                 <td>{salary.employee_name}

//                                                                     <input type="text" className='d-none' name='user_id' 
//                                                                     value={salary.user_id}
//                                                                     />
//                                                                 </td>
//                                                                 <td>{salary.designation_name_promotion}</td>
//                                                                 <td>{`${salary.Payroll} (${salary.salary})`}</td>
//                                                                 <td>0</td>
//                                                                 <td>{salary.salary}</td>
//                                                                 <td>
//                                                                     {
//                                                                         ((salary.salary / salary.totalDays) * ((filteredAttendances.length) + (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) + (matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0))).toFixed(2)
//                                                                     }
//                                                                 </td>
//                                                                 <td>
//                                                                     <input
//                                                                         value={bonus} onChange={(e) => setBonus(e.target.value)}
//                                                                         type="number" name="bonus" class="form-control form-control-sm text-right bonus" id="bonus" />
//                                                                 </td>
//                                                                 <td>
//                                                                     <input type="number"


//                                                                         name="paid_amount" class="form-control form-control-sm text-right paid_amount" id="paid_amount"
//                                                                         value={salary.salary + parseFloat(bonus)}

//                                                                     />
//                                                                 </td>

//                                                                 <td>
//                                                                     0
//                                                                 <input type="number"
//                                                                     name="due" class="form-control form-control-sm text-right due d-none" id="due"
//                                                                     value={0}
//                                                                 />
//                                                                 </td>
//                                                                 <td>{salary.totalDays}</td>
//                                                                 <td>

//                                                                     {
//                                                                         Math.abs(
//                                                                             (filteredAttendances.length +
//                                                                                 (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) -
//                                                                                 salary.totalDays)
//                                                                         )
//                                                                     }
//                                                                 </td>
//                                                                 <td>
//                                                                     Absent: {(Math.abs(
//                                                                         (filteredAttendances.length +
//                                                                             (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) -
//                                                                             salary.totalDays)
//                                                                     ))



//                                                                         - (matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0)
//                                                                     }

//                                                                     <br />
//                                                                     Present:                                {matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0}
//                                                                 </td>
//                                                                 <td>
//                                                                     Holiday: {filteredAttendances.length}
//                                                                     <br />
//                                                                     Leave: {matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0}
//                                                                 </td>
//                                                                 <td>
//                                                                     <select name="paid_by" id="" class="form-control form-control-sm" required="">
//                                                                         <option value="2">Cash</option>
//                                                                         <option value="5">Bank (Primary)</option>
//                                                                         <option value="6">Bank (High School)</option>
//                                                                     </select>
//                                                                 </td>
//                                                                 <td>
//                                                                     <input
//                                                                         className="form-control"
//                                                                         type="text"
//                                                                         id="fromDate"
//                                                                         value={fromDate ? formatDate(fromDate) : ''}
//                                                                         onClick={handleTextInputClick}
//                                                                         readOnly
//                                                                     />
//                                                                     <input
//                                                                         name='salary_date'
//                                                                         type="date"
//                                                                         id="dateInputFrom"
//                                                                         value={fromDate ? fromDate.toString().split('T')[0] : ''}
//                                                                         onChange={handleDateChangeFrom}
//                                                                         style={{ position: 'absolute', bottom: '20px', right: '0', visibility: 'hidden' }}
//                                                                     />
//                                                                 </td>
//                                                             </tr>
//                                                         ))}
//                                                 </tbody>
//                                             </table>
//                                         }
//                                     </div>
                              
//                                 </div>
//                             </div>
//                         </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalaryCreate;


'use client'

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const SalaryCreate = () => {


    const [created, setCreated] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setCreated(storedUserId);
        }
    }, []);

    const [fromDate, setFromDate] = useState('');
    const [bonus, setBonus] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);

    const [months, setMonths] = useState([]);
    const [designation, setDesignation] = useState('');
    const [month, setMonth] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };

    const handleTextInputClick = () => {
        document.getElementById('dateInputFrom').showPicker();
    };

    const handleDateChangeFrom = (event) => {
        const selectedDate = new Date(event.target.value);
        setFromDate(selectedDate);
    };

    useEffect(() => {
        const currentDate = new Date();
        setFromDate(currentDate);
    }, []);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // 0-based index
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const monthOptions = [];
        for (let i = 0; i <= currentMonth; i++) {
            monthOptions.push({
                value: `${currentYear}-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
                label: `${monthNames[i]} ${currentYear}`
            });
        }

        setMonths(monthOptions);
    }, []);

    const { data: designations = [], isLoading: isDesignationsLoading } = useQuery({
        queryKey: ['designations'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)
            const data = await res.json()
            return data
        }
    });

    const { data: salaries = [] } = useQuery({
        queryKey: ['salaries'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_all`)
            const data = await res.json()
            return data
        }
    });

    const getTotalDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const salary_search = () => {
        setLoading(true);

        if (month === '') {
            alert('select a month')
            return
        }

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_search`, {
            designation
        })
            .then(response => {
                const results = response.data.results;
                const monthYear = month.split('-');
                const totalDays = getTotalDaysInMonth(Number(monthYear[0]), Number(monthYear[1]));

                const updatedResults = results.map(result => ({
                    ...result,
                    totalDays
                }));

                setSearchResults(updatedResults);
                setError(null);
                setLoading(false);
                if (results.length === 0) {
                    alert('Nothing found!');
                }
            })
            .catch(error => {
                setError("An error occurred during search.");
                setSearchResults([]);
                setLoading(false);
            });
    };

    const { data: attendance = [] } = useQuery({
        queryKey: ['attendance'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance_all/attendance_all`)
            const data = await res.json()
            return data
        }
    });

    const filteredAttendance = attendance.filter(att => {
        const checktimeMonthYear = att.checktime.substring(0, 7);
        return checktimeMonthYear === month;
    });

    const matchLengths = salaries.map(emp => {
        const matchCount = attendance.filter(att => att.user_id === emp.user_id).length;
        return { user_id: emp.user_id, match_length: matchCount };
    });

    const { data: holidays = [] } = useQuery({
        queryKey: ['holidays'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/yearly_holiday/yearly_holiday_all`)
            const data = await res.json()
            return data
        }
    });

    const filteredAttendances = holidays.filter(att => {
        const checktimeMonthYear = att.start_date.substring(0, 7);
        return checktimeMonthYear === month;
    });

    const { data: leavesDays = [] } = useQuery({
        queryKey: ['leavesDays'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all`)
            const data = await res.json()
            return data
        }
    });

    const leaveApproveCount = leavesDays.filter(leave => leave.application_status === 2);

    const { data: leavesDaysApproved = [] } = useQuery({
        queryKey: ['leavesDaysApproved'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_approved/leave_approved_all`)
            const data = await res.json()
            return data
        }
    });

    const matchLength = leaveApproveCount.map(emp => {
        const matchCount = leavesDaysApproved.filter(att => att.leave_application_id === emp.id).length;
        return { user_id: emp.whose_leave, match_length: matchCount };
    });


    const { data: salaryList = [], } = useQuery({
        queryKey: ['salaryList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_list`)
            const data = await res.json()
            return data
        }
    });


    // console.log(salaryList.find())

    const handleSubmit = (event) => {
        event.preventDefault();

        const formatDate = (date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = ('0' + (d.getMonth() + 1)).slice(-2);
            const day = ('0' + d.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        };

        const formToSubmit = Array.from(document.querySelectorAll('input[name="salaryCheckbox"]:checked')).map(checkbox => {
            const row = checkbox.closest('tr');
            const userId = row.querySelector('input[name="user_id"]').value;
            const due = row.querySelector('input[name="due"]').value;
            const salary = parseFloat(row.querySelector('.paid_amount').value) - bonus;
            return {
                user_id: userId,
                salary_month: `${month}-10`,
                salary_date: fromDate ? formatDate(fromDate) : '',
                created_by: created,
                due: due,
                paid_amount: salary + parseFloat(bonus),
                paid_by: row.querySelector('select[name="paid_by"]').value
            };
        });

        axios.post('http://192.168.0.107:5002/Admin/salary/salary_create', formToSubmit)
            .then(response => {
                alert('Data submitted successfully!');
            })
            .catch(error => {
                alert('An error occurred while submitting data.');
                console.error('Error:', error);
            });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Salary Create</h5>
                                </div>
                                <div className="card-body">
                                    <form >
                                        <div className="col-md-10 offset-md-1">
                                            <div className="form-group row">
                                                <label className="col-form-label col-md-2"><strong>Designation:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={designation} onChange={(e) => setDesignation(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Designation</option>
                                                        {
                                                            designations.map(designation =>
                                                                <option key={designation.id} value={designation.id}>
                                                                    {designation.designation_name}
                                                                </option>
                                                            )
                                                        }
                                                    </select>
                                                </div>

                                                <label className="col-form-label col-md-2"><strong>Month:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={month} onChange={(e) => setMonth(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Month</option>
                                                        {months.map((month, index) => (
                                                            <option key={index} value={month.value}>
                                                                {month.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-2 col-md-8 float-left">
                                                <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
                                                    onClick={salary_search}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='card'>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Salary Generate</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <div className="offset-md-3 col-sm-6">
                                            <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                   

                                    <div className='table-responsive'>
                                        {
                                            searchResults.length > 0 &&
                                            <table className="table table-bordered table-hover table-striped table-sm">
                                                <thead>
                                                    <tr>
                                                        
                                                        <th>
                                                            {/* <input type="checkbox" name="" id="" /> */}
                                                        </th>
                                                        <th>Serial</th>
                                                        <th>Name</th>
                                                        <th>Designation</th>
                                                        <th>Payroll</th>
                                                        <th>Previous Due</th>
                                                        <th>Present Salary</th>
                                                        <th>Total Payable Amount</th>
                                                        <th>Bonus</th>
                                                        <th>Paid Amount</th>
                                                        <th>Due Amount</th>
                                                        <th>Total Day</th>
                                                        <th>Working Day</th>
                                                        <th>Absent & Present</th>
                                                        <th>Holiday & Leave</th>
                                                        <th>Paid By:</th>
                                                        <th>Salary Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ?
                                                        <tr>
                                                            <td colSpan="16" className="text-center">
                                                                <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                                                            </td>
                                                        </tr>
                                                        :
                                                        searchResults.map((salary, i) => (
                                                            <tr key={salary.id}>
                                                                <th>
                                                                    <input type="checkbox"  name="salaryCheckbox" id="" />
                                                                </th>
                                                                <td>{i + 1}</td>
                                                                <td>{salary.employee_name}

                                                                    <input type="text" className='d-none' name='user_id' 
                                                                    value={salary.user_id}
                                                                    />
                                                                </td>
                                                                <td>{salary.designation_name_promotion}</td>
                                                                <td>{`${salary.Payroll} (${salary.salary})`}</td>
                                                                <td>0</td>
                                                                <td>{salary.salary}

                                                                    
                                                                </td>
                                                                <td>
                                                                    {
                                                                        ((salary.salary / salary.totalDays) * ((filteredAttendances.length) + (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) + (matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0))).toFixed(2)
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        value={bonus} onChange={(e) => setBonus(e.target.value)}
                                                                        type="number" name="bonus" class="form-control form-control-sm text-right bonus" id="bonus" />
                                                                </td>
                                                                <td>
                                                                    <input type="number"
                                                                        name="paid_amount" class="form-control form-control-sm text-right paid_amount" id="paid_amount"
                                                                        value={salary.salary + parseFloat(bonus)}

                                                                    />
                                                                </td>

                                                                <td>
                                                                    {(salary.salary + parseFloat(bonus))-(salary.salary)}
                                                                <input type="number"
                                                                    name="due" class="form-control form-control-sm text-right due d-none" id="due"
                                                                    value={(salary.salary + parseFloat(bonus))-(salary.salary)}
                                                                />
                                                                </td>
                                                                <td>{salary.totalDays}</td>
                                                                <td>

                                                                    {
                                                                        Math.abs(
                                                                            (filteredAttendances.length +
                                                                                (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) -
                                                                                salary.totalDays)
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>
                                                                    Absent: {(Math.abs(
                                                                        (filteredAttendances.length +
                                                                            (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) -
                                                                            salary.totalDays)
                                                                    ))



                                                                        - (matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0)
                                                                    }

                                                                    <br />
                                                                    Present:                                {matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0}
                                                                </td>
                                                                <td>
                                                                    Holiday: {filteredAttendances.length}
                                                                    <br />
                                                                    Leave: {matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0}
                                                                </td>
                                                                <td>
                                                                    <select name="paid_by" id="" class="form-control form-control-sm" required="">
                                                                        <option value="2">Cash</option>
                                                                        <option value="5">Bank (Primary)</option>
                                                                        <option value="6">Bank (High School)</option>
                                                                    </select>
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        id="fromDate"
                                                                        value={fromDate ? formatDate(fromDate) : ''}
                                                                        onClick={handleTextInputClick}
                                                                        readOnly
                                                                    />
                                                                    <input
                                                                        name='salary_date'
                                                                        type="date"
                                                                        id="dateInputFrom"
                                                                        value={fromDate ? fromDate.toString().split('T')[0] : ''}
                                                                        onChange={handleDateChangeFrom}
                                                                        style={{ position: 'absolute', bottom: '20px', right: '0', visibility: 'hidden' }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        }
                                    </div>
                              
                                </div>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryCreate;
