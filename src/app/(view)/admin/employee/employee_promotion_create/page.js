'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const EmployeePromotionCreate = ({ id }) => {


    const { data: designationList = [],
    } = useQuery({
        queryKey: ['designationList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: payRoll = [], isLoading, refetch
    } = useQuery({
        queryKey: ['payRoll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_all`)

            const data = await res.json()
            return data
        }
    })

   

    
    const [modified_by, setModified_by] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setModified_by(storedUserId);
        }
      }, []);


    const employee_promotion_create = (event) => {

        event.preventDefault();
        const form = event.target;

        const designation_id = form.designation_id.value;
        const promotion_month = form.promotion_month.value;
        const payroll_id = form.payroll_id.value;



        const uniqueFields = {
            designation_id,
            promotion_month,
            payroll_id,
            modified_by: modified_by
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_promotion_create/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(uniqueFields),
        })
            .then((Response) =>
                Response.json()
            )
            .then((data) => {
                if (data[0]?.affectedRows > 0) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    // router.push('/Admin/brand/brand_all');
                }
                console.log(data)

            })
            .catch((error) => console.error(error));
    }




    return (
        <div className="container-fluid">

            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Employee Promotion</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/employee/employee_all?page_group`} className="btn btn-sm btn-info">Back Employee List</Link>
                                    </div>
                                </div>
                                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <div class="card-body ">
                                    <form class="" method="post" autocomplete="off" onSubmit={employee_promotion_create}>
                                        <div class="card bg-white mb-3 shadow-sm ">
                                            <div class="card-body">
                                                <div class=" row no-gutters">
                                                    <div class="col-md-6">
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Designation:</label></div>
                                                            <div class="col-md-8">
                                                                <select required="" name="designation_id" class=" form-control form-control-sm  required integer_no_zero " id="designation_name">
                                                                    <option value="">Select Designation</option>
                                                                    {
                                                                        designationList.map(designation =>

                                                                            <>
                                                                                <option value={designation.id}>{designation.designation_name}</option>

                                                                            </>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Promotion Date:</label></div>
                                                            <div class="col-md-8">
                                                                <input type="date" name="promotion_month" class="form-control form-control-sm  required urban_datepicker" id="join_date" placeholder="Enter Join Date" />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Payroll:</label></div>
                                                            <div class="col-md-8">
                                                                <select required="" name="payroll_id" class="form-control form-control-sm  required integer_no_zero " id="title">
                                                                    <option value="">Select payroll</option>
                                                                    {payRoll.map(item => (
                                                                        < >
                                                                            <option value={item.id}>{`${item.title} (${item.basic}/-)`}</option>
                                                                        </>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            <div class="row no-gutters">
                                                <div class="col-md-12 offset-md-3">
                                                    <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
                                                </div>
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
        </div>
    );
};

export default EmployeePromotionCreate;