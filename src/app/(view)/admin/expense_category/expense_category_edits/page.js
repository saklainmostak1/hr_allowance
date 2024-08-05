'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ExpenceCategoryUpdate = ({ id }) => {


    // /Admin/expence_category/expence_category_all/:id

    const { data: expenseCategorySingle = [], isLoading, refetch
    } = useQuery({
        queryKey: ['expenseCategorySingle'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_all/${id}`)

            const data = await res.json()
            return data
        }
    })

  
    const [modified, setModified] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setModified(storedUserId);
        }
      }, []);
    const [expenseCategory, setexpenseCategory] = useState({
        expense_category_name: '',
        modified_by: ''
    });



    useEffect(() => {

        setexpenseCategory({
            expense_category_name: expenseCategorySingle[0]?.expense_category_name || '',

            modified_by: modified
        });
    }, [expenseCategorySingle, modified]);


    const material_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...expenseCategory }
        attribute[name] = value
        setexpenseCategory(attribute)

    };
    const router = useRouter()
    const expense_category_update = (e) => {
        e.preventDefault()
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_edit/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseCategory)
        })
            .then((Response) => {
                Response.json()
                console.log(Response)
                if (Response.ok === true) {
                    sessionStorage.setItem("message", "Data Update successfully!");
                    router.push('/Admin/expense_category/expense_category_all')
                }
            })
            .then(data => {
                console.log(data);
                // Handle success or show a success message to the user
            })
            .catch(error => {
                console.error('Error updating brand:', error);
                // Handle error or show an error message to the user
            });
    };

    console.log(expenseCategorySingle)
    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" bg-light body-content ">
                            <div class=" border-primary shadow-sm border-0">
                                <div class="card-header custom-card-header  py-1  clearfix bg-gradient-primary text-white" style={{ backgroundColor: '#4267b2' }}>
                                    <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Edit Expense Category</h5>
                                    <div class="card-title card-header-color font-weight-bold mb-0  float-right"> <Link href="/Admin/expense_category/expense_category_all?page_group=account_management" class="btn btn-sm btn-info">Back to Expense category List</Link></div>
                                </div>
                                <div class="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i class="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <div class="card-body">
                                    <form class="" method="post" autocomplete="off" onSubmit={expense_category_update}>
                                        <div class="form-group row">
                                            <label class="col-form-label font-weight-bold col-md-3">Expense Category Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div class="col-md-6">
                                                <input type="text" required onChange={material_input_change} name="expense_category_name" class="form-control form-control-sm  required unique_expense_category_name" id="expense_category_name" placeholder="Enter expense category name" value={expenseCategory.expense_category_name} />


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

export default ExpenceCategoryUpdate;