'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SchoolShiftCreate = () => {


	const [start_time, setstart_time] = useState('');
	const [late_time, setlate_time] = useState('');
	const [end_time, setend_time] = useState('');
	const [early_end_time, setearly_end_time] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [errorMessageStartTime, setErrorMessageStartTime] = useState('');


	const handleTimeChange = (event, setTime) => {
		const dateTimeValue = event.target.value;
		const timeValue = new Date(dateTimeValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		setTime(timeValue);
		if (start_time) {
			setErrorMessageStartTime()
		}

	};

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

	console.log(start_time)
	const router = useRouter()
	const created_by = userId
	const user_create = (event) => {
		event.preventDefault();
		const form = event.target;
		const name = form.name.value;

		if (!name) {
			setErrorMessage('Name is required.');
			return;
		}
		if (!start_time) {
			setErrorMessageStartTime('This Name is required.');
			return;
		}

		const schoolShift = {
			name,
			start_time,
			late_time,
			end_time,
			early_end_time,
			created_by

		};

		fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_create`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(schoolShift),
		})
			.then((Response) => {
				Response.json()
				console.log(Response)
				if (Response.ok === true) {
					if(typeof window !== 'undefined'){

						sessionStorage.setItem("message", "Data saved successfully!");
					}
					router.push('/Admin/school_shift/school_shift_all')
				}
			})
			.then((data) => {
				console.log(data);

			})
			.catch((error) => console.error(error));
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<div className='col-12 p-4'>
					<div className='card'>
						<div className="body-content bg-light">
							<div className="border-primary shadow-sm border-0">
								<div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
									<h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create School Shift</h5>
									<div className="card-title font-weight-bold mb-0 card-header-color float-right">
										<Link href={`/Admin/school_shift/school_shift_all?page_group`} className="btn btn-sm btn-info">Back School Shift List</Link>
									</div>
								</div>
								<div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
									(<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
								</div>
								<form action="" onSubmit={user_create}>
									<div className="card-body">
										<div className="form-group row">
											<label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
											<div className="col-md-6">
												<input type="text" name="name" className="form-control form-control-sm  alpha_space unique_name" id="name" placeholder="Enter Name" />
												{
													errorMessage && <p className='text-danger'>{errorMessage}</p>
												}
											</div>
										</div>
										<div className="form-group row">
											<label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
											<div className="col-md-6">
												<input
													type="text"
													readOnly
													name='start_time'
													value={start_time}
													onClick={() => document.getElementById(`dateInput-n1`).showPicker()}

													placeholder="dd-mm-yyyy"
													className="form-control form-control-sm mb-2"
													style={{ display: 'inline-block', }}
												/>
												<input
													type="datetime-local"
													id={`dateInput-n1`}
													onChange={(e) => handleTimeChange(e, setstart_time)}
													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

												/>
												{
													errorMessageStartTime && <p className='text-danger'>{errorMessageStartTime}</p>
												}
											</div>
										</div>
										<div className="form-group row">
											<label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
											<div className="col-md-6">
												<input
													type="text"
													readOnly
													value={late_time}
													name='late_time'
													onClick={() => document.getElementById(`dateInput-n2`).showPicker()}

													placeholder="dd-mm-yyyy"
													className="form-control form-control-sm mb-2"
													style={{ display: 'inline-block', }}
												/>
												<input
													type="datetime-local"
													id={`dateInput-n2`}
													onChange={(e) => handleTimeChange(e, setlate_time)}
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
													value={end_time}
													name='end_time'
													onClick={() => document.getElementById(`dateInput-n3`).showPicker()}

													placeholder="dd-mm-yyyy"
													className="form-control form-control-sm mb-2"
													style={{ display: 'inline-block', }}
												/>
												<input
													type="datetime-local"
													id={`dateInput-n3`}
													onChange={(e) => handleTimeChange(e, setend_time)}
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
													value={early_end_time}
													name='early_end_time'
													onClick={() => document.getElementById(`dateInput-n4`).showPicker()}

													placeholder="dd-mm-yyyy"
													className="form-control form-control-sm mb-2"
													style={{ display: 'inline-block', }}
												/>
												<input
													type="datetime-local"
													id={`dateInput-n4`}
													onChange={(e) => handleTimeChange(e, setearly_end_time)}
													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

												/>
											</div>
										</div>

										<div className="form-group row">
											<div className="offset-md-3 col-sm-6">
												<input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
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

export default SchoolShiftCreate;
