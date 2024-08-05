// 'use client'
// import React, { useState } from 'react';
// import axios from 'axios';

// const ExpenseUpdateForm = ({id}) => {
//     const [formData, setFormData] = useState({
//         item_name: '',
//         supplier_id: '',
//         expense_category: '',
//         amount: '',
//         quantity: '',
//         payment_type: '',
//         expense_date: '',
//         discount: '',
//         short_note: '',
//         created_by: '',
//         bank_check_no: '',
//         previous_due: '',
//         sub_total: '',
//         payable_amount: '',
//         due_amount: '',
//         paid_amount: '',
//         expenseId: '' // assuming you have a way to get the expense ID
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_update/${id}`, formData);
//             console.log(res.data); // handle success response
//         } catch (error) {
//             console.error('Error updating expense:', error.response.data);
//             // handle error response
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <label>Item Name</label>
//             <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} />

//             <label>Supplier ID</label>
//             <input type="text" name="supplier_id" value={formData.supplier_id} onChange={handleChange} />

//             <label>Expense Category</label>
//             <input type="text" name="expense_category" value={formData.expense_category} onChange={handleChange} />

//             <label>Amount</label>
//             <input type="text" name="amount" value={formData.amount} onChange={handleChange} />

//             <label>Quantity</label>
//             <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} />

//             <label>Payment Type</label>
//             <input type="text" name="payment_type" value={formData.payment_type} onChange={handleChange} />

//             <label>Expense Date</label>
//             <input type="date" name="expense_date" value={formData.expense_date} onChange={handleChange} />

//             <label>Discount</label>
//             <input type="text" name="discount" value={formData.discount} onChange={handleChange} />

//             <label>Short Note</label>
//             <input type="text" name="short_note" value={formData.short_note} onChange={handleChange} />

//             <label>Created By</label>
//             <input type="text" name="created_by" value={formData.created_by} onChange={handleChange} />

//             <label>Bank Check No</label>
//             <input type="text" name="bank_check_no" value={formData.bank_check_no} onChange={handleChange} />

//             <label>Previous Due</label>
//             <input type="text" name="previous_due" value={formData.previous_due} onChange={handleChange} />

//             <label>Sub Total</label>
//             <input type="text" name="sub_total" value={formData.sub_total} onChange={handleChange} />

//             <label>Payable Amount</label>
//             <input type="text" name="payable_amount" value={formData.payable_amount} onChange={handleChange} />

//             <label>Due Amount</label>
//             <input type="text" name="due_amount" value={formData.due_amount} onChange={handleChange} />

//             <label>Paid Amount</label>
//             <input type="text" name="paid_amount" value={formData.paid_amount} onChange={handleChange} />

//             <button type="submit">Update Expense</button>
//         </form>
//     );
// };

// export default ExpenseUpdateForm;


'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from "sweetalert2";
import { FaTrash } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';



const EditExpense = ({ id }) => {

    const [supplierId, setSupplierId] = useState('');

    const supplier_id = (id) => {
        setSupplierId(id);
        console.log("Selected supplier id:", id);
    };

    // Dynamically generate API endpoint based on selected supplierId
    const api = supplierId ? `/Admin/supplier/due_amount/${supplierId}` : '';

    const { data: supplierLastDue } = useQuery({
        queryKey: ['supplierLastDue', api], // Include api in queryKey to trigger refetch when api changes
        queryFn: async () => {
            if (api) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002${api}`);
                const data = await res.json();
                return data;
            }
        },
        enabled: !!api, // Enable the query only if api is truthy (supplierId is selected)
    });

    console.log(supplierLastDue?.payable_amount)

    const prev_due = supplierLastDue?.payable_amount - supplierLastDue?.paid_amount


  
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
    const { data: expenseSingle = []
    } = useQuery({
        queryKey: ['expenseSingle'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_all/${id}`)

            const data = await res.json()
            return data
        }
    })
    console.log(expenseSingle)


    const [expenseData, setExpenseData] = useState({
        supplier_id: '',
        expense_category: '',
        amount: '',
        payment_type: '',
        discount: '',
        short_note: '',
        previous_due: '',
        sub_total: '',
        payable_amount: '',
        due_amount: '',
        paid_amount: '',
        bank_check_no: '',
        items: [],
        quantity: '',
        due: '',
        discount: '',
        amount: '',
        item_name: ''

    });


    useEffect(() => {

        setExpenseData({
            // category_name: brandSingle[0]?.category_name || '',
            supplier_id: expenseSingle.supplier_id || '',
            expense_category: expenseSingle.expense_category || '',
            amount: expenseSingle.amount || '',
            payment_type: expenseSingle.payment_type || '',
            discount: expenseSingle.discount || '',
            short_note: expenseSingle.short_note || '',
            previous_due: expenseSingle.previous_due || '',
            sub_total: expenseSingle.sub_total || '',
            payable_amount: expenseSingle.payable_amount || '',
            due_amount: expenseSingle.due_amount || '',
            paid_amount: expenseSingle.paid_amount || '',
            bank_check_no: expenseSingle.bank_check_no || '',
            item_name: expenseSingle.item_name || '',
            amount: expenseSingle.amount || '',
            discount: expenseSingle.discount || '',
            due: expenseSingle.due || '',
            items: expenseSingle?.items?.map(item => ({
                item_name: item.item_name || '',
                amount: item.amount || '',
                discount: item.discount || '',
                due: item.due || ''
            })),
            quantity: expenseSingle.quantity || '',

            modified_by: modified
        });
    }, [modified, expenseSingle]);



    // Inside your component function
    const [discountAmount, setDiscountAmount] = useState(0);
    const [dueAmount, setDueAmount] = useState(0);

    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState('');
    const [totalAmounts, setTotalAmount] = useState('');

    const handleQuantityChange = (e) => {
        const newQuantity = e.target.value;
        setQuantity(newQuantity);
        calculateTotalAmount(newQuantity, amount);
    };

    const handleAmountChange = (e) => {
        const newAmount = e.target.value;
        setAmount(newAmount);
        calculateTotalAmount(quantity, newAmount);
    };

    const calculateTotalAmount = (newQuantity, newAmount) => {
        const total = parseFloat(newQuantity) * parseFloat(newAmount);
        setTotalAmount(isNaN(total) ? '' : total.toFixed(2)); // Handle NaN or unexpected values
    };

    // Other state variables and useEffect remain the same

    const calculateTotals = () => {
        let totalAmount = 0;
        let totalDiscount = parseFloat(discountAmount);
        let totalDueAmount = parseFloat(dueAmount);
        let totalPaidAmount = 0;
        let preDueAmount = prev_due;
        let totalPayAbleAmount = 0;
        totalAmount = parseFloat(expenseData.amount * expenseData.quantity);
        totalPayAbleAmount = totalAmount - totalDiscount;
        // Calculate totalPaidAmount
        totalPaidAmount = totalPayAbleAmount - totalDueAmount;
        return {
            netAmount: totalAmount + preDueAmount,
            totalAmount,
            totalDiscount,
            totalPaidAmount,
            totalDueAmount,
            totalPayAbleAmount,
        };
    };

    // Other functions remain the same

    const handleInputChange = (event) => {
        if (event.target.name === 'discount') {
            setDiscountAmount(parseFloat(event.target.value));
        } else if (event.target.name === 'due_amount') {
            setDueAmount(parseFloat(event.target.value));
        }
    };
    const {
        totalAmount,
        totalPaidAmount,
        preDueAmount = prev_due,
        netAmount,
        totalPayAbleAmount
    } = calculateTotals();


    const expense_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value

        const attribute = {}
        for (let key in expenseData) {
            attribute[key] = expenseData[key];
        }

        attribute[name] = value;
        setExpenseData(attribute);
    };
    const router = useRouter()
    const expense_update = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get form data
        const formData = new FormData(event.target);

        // Convert form data to JSON object
        const expenseData = {};
        formData.forEach((value, key) => {
            expenseData[key] = value;
        });

        // Make a POST request to your API endpoint
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_update/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        })
            .then(response => {
                if (response.ok) {
                    // Handle success

                    if (response.ok === true) {
                        sessionStorage.setItem("message", "Data saved successfully!");
                        router.push('/Admin/expense/expense_all')
                    }

                    console.log('Expense data updated successfully');

                    // Optionally, you can redirect the user or perform any other action here
                } else {
                    // Handle error
                    console.error('Failed to update expense data');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        // event.preventDefault();
        // try {
        //     // Perform API call to update expense details
        //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_update/${id}`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(expenseData)
        //     });
        //     console.log(expenseData)

        //     if (!res.ok) {
        //         throw new Error('Failed to update expense');
        //     }

        //     // Handle success, maybe show a success message or redirect
        //     console.log('Expense updated successfully');
        //     // expense_input_change()
        // } catch (error) {
        //     // Handle error, maybe show an error message
        //     console.error('Error updating expense:', error.message);
        // }
    }



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

    const [selectedEntryType, setSelectedEntryType] = useState('');

    const handleEntryTypeChange = (event) => {
        setSelectedEntryType(event.target.value);
    };


    const [currentDate, setCurrentDate] = useState('');
    const [formattedDate, setFormattedDate] = useState('');
    // useEffect to update the current date when the component mounts
    useEffect(() => {
        const getCurrentDate = () => {
            // Get the current date
            const now = new Date();
            // Format the date to YYYY-MM-DD (required format for type="date" input)
            const formattedDate = now.toISOString().split('T')[0];
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
            setFormattedDate(formatted);
            // Set the state with the current date
            setCurrentDate(formattedDate);
        };

        // Call the function to get the current date
        getCurrentDate();
    }, []);



    const { data: expenseCategories = [], isLoading, refetch
    } = useQuery({
        queryKey: ['expenseCategories'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_all`)

            const data = await res.json()
            return data
        }
    })


    const { data: supplierList = []
    } = useQuery({
        queryKey: ['supplierList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`)

            const data = await res.json()
            return data
        }
    })



    const { data: module_settings = []
    } = useQuery({
        queryKey: ['module_settings'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

            const data = await res.json()
            return data
        }
    })

    const module_setting = module_settings.filter(moduleI => moduleI.table_name === 'expense');
    const decimal_digit = module_setting[0]?.decimal_digit;


    const [text, setText] = useState('');
    const maxLength = 500;

    const handleChangeTextarea = (event) => {
        const inputText = event.target.value;
        if (inputText.length <= maxLength) {
            setText(inputText);
        }
    };

    const handlePaste = (event) => {
        const pastedText = event.clipboardData.getData('text/plain');
        const newText = text + pastedText;
        if (newText.length > maxLength) {
            event.preventDefault();
        } else {
            setText(newText);
        }
    };


    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">


                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Update Expense</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/expense/expense_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Expense List</Link>
                                </div>
                            </div>
                            <>
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={expense_update} >
                                    <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">
                                        <div class=" ">
                                            <h5>From,</h5>
                                            <div>
                                                <select

                                                    required="" onChange={(e) => {
                                                        supplier_id(e.target.value)
                                                        expense_input_change(e)
                                                    }} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id"
                                                    value={expenseData.supplier_id}

                                                >
                                                    <option value=''>Select Supplier</option>
                                                    {
                                                        supplierList.map((supplier) => (
                                                            <>
                                                                <option value={supplier.id}>{supplier.name}</option>

                                                            </>

                                                        ))
                                                    }

                                                </select>
                                            </div>
                                            {/* <p>{prev_due}</p> */}

                                            <div >
                                                <label className='font-weight-bold'>Expense Purches Date:</label>

                                                <input type="date" required="" name="expense_date" className="form-control form-control-sm mb-2" id="purchase_invoice" placeholder="Enter Purchase Invoice" defaultValue={currentDate} />
                                            </div>
                                        </div>
                                        <div class="">

                                            <span >{formattedDate}</span>
                                        </div>
                                    </div>

                                    <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                        (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                    </div>

                                    <div className="card-body">
                                        <div>
                                            <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">
                                                <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                    <strong>Expense</strong>
                                                </div>


                                            </div>
                                            <div>
                                                <div className="form-group row px-3 ">
                                                    <table className="table table-bordered  table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>

                                                                    Expense Category
                                                                </th>
                                                                <th>
                                                                    Item Name
                                                                </th>
                                                                <th>
                                                                    Quantity
                                                                </th>
                                                                <th>
                                                                    Amount
                                                                </th>
                                                                <th>
                                                                    Total Amount
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
                                                                <>
                                                                    <>

                                                                        <tr>
                                                                            <td>
                                                                                <select
                                                                                    required=""
                                                                                    name="expense_category"
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    value={expenseData.expense_category}
                                                                                    onChange={expense_input_change}
                                                                                >
                                                                                    <option value="">Select One</option>
                                                                                    {
                                                                                        expenseCategories.map((expense) => (
                                                                                            <>

                                                                                                <option value={expense.id}>{expense.expense_category_name}</option>
                                                                                            </>
                                                                                        ))
                                                                                    }

                                                                                </select>
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    onChange={expense_input_change}
                                                                                    value={expenseData.item_name}
                                                                                    type="text"
                                                                                    required
                                                                                    name="item_name"
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Expense Title"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    required
                                                                                    name="quantity"
                                                                                    value={quantity ? quantity : expenseData.quantity}
                                                                                    onChange={(e) => {
                                                                                        handleQuantityChange(e);
                                                                                        expense_input_change(e)
                                                                                    }}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Enter Quantity"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    required
                                                                                    name="amount"
                                                                                    value={amount ? amount : expenseData.amount}
                                                                                    onChange={(e) => {
                                                                                        handleAmountChange(e);
                                                                                        expense_input_change(e)
                                                                                    }}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Enter Amount"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    required
                                                                                    value={totalAmount ? totalAmount.toFixed(decimal_digit) : (expenseData.amount * expenseData.quantity).toFixed(decimal_digit)}
                                                                                    onChange={expense_input_change}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Total Amount"
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    required
                                                                                    name="total_amount"
                                                                                    hidden
                                                                                    value={totalAmount ? totalAmount.toFixed(3) : (expenseData.amount * expenseData.quantity).toFixed(3)}
                                                                                    onChange={expense_input_change}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Total Amount"
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                </>
                                                            }
                                                        </tbody>

                                                    </table>


                                                    <div className='col-lg-12 border'>
                                                        <label className='font-weight-bold'>Short Note:</label>
                                                        <textarea
                                                            rows={2}
                                                            value={text}
                                                            onChange={handleChangeTextarea}
                                                            onPaste={handlePaste}
                                                            className={`form-control form-control-sm mb-2 ${text.length > maxLength ? 'is-invalid' : ''}`}
                                                            placeholder="Enter Short Note"
                                                            name='short_note'
                                                        ></textarea>
                                                        <div>{text.length}/{maxLength}</div>
                                                        {text.length > maxLength && (
                                                            <div className="invalid-feedback">Exceeded character limit</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>



                                    <div className="container mx-auto ">


                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Payment Type:</strong>
                                            </label>


                                            <div class="col-md-3">
                                                <select

                                                    required=""
                                                    name="payment_type"
                                                    className="form-control form-control-sm mb-2"

                                                    value={selectedEntryType ? selectedEntryType : expenseData.payment_type}
                                                    onChange={(e) => {
                                                        handleEntryTypeChange(e);
                                                        expense_input_change(e)
                                                    }}
                                                >
                                                    <option value="">Select Type Of Payment</option>
                                                    <option value="1">Cash</option>

                                                    <option value="2">Check</option>

                                                </select>
                                            </div>

                                        </div>


                                        <div class="">
                                            {
                                                selectedEntryType === '2' ?


                                                    <div class="form-group row student d-flex justify-content-end ">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Bank Check No:</strong>
                                                        </label>


                                                        <div class="col-md-3">
                                                            <input
                                                                onChange={expense_input_change}
                                                                type="text"
                                                                required
                                                                name="bank_check_no"
                                                                className="form-control form-control-sm mb-2"
                                                                placeholder="Enter Bank Check No"

                                                            />
                                                        </div>

                                                    </div>
                                                    :
                                                    <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>



                                                    </div>
                                            }

                                        </div>








                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Sub Total:</strong>
                                            </label>

                                            <div class="col-md-3">
                                                <input
                                                    type="text"

                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="totalAmount"
                                                    placeholder="Enter Total Amount"
                                                    value={totalAmount.toFixed(decimal_digit)}
                                                    onChange={(e) => {
                                                        calculateTotalAmount(e);
                                                        expense_input_change(e)
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    name="sub_total"
                                                    hidden
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="totalAmount"
                                                    placeholder="Enter Total Amount"
                                                    value={totalAmount.toFixed(3)}
                                                    onChange={(e) => {
                                                        calculateTotalAmount(e);
                                                        expense_input_change(e)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Previous Due:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="totalAmount"
                                                    placeholder="Enter Total Amount"
                                                    value={expenseData.previous_due ? (expenseData.previous_due) : preDueAmount.toFixed(decimal_digit)}
                                                    onChange={expense_input_change}
                                                />
                                                <input
                                                    type="text"
                                                    hidden
                                                    name="previous_due"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="totalAmount"
                                                    placeholder="Enter Total Amount"
                                                    value={expenseData.previous_due ? Number(expenseData.previous_due).toFixed(3) : preDueAmount.toFixed(3)}
                                                    onChange={expense_input_change}
                                                />
                                            </div>
                                        </div>
                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Net Amount:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="netAmount"
                                                    placeholder="Enter Net Amount"
                                                    value={(totalAmount - expenseData.previous_due).toFixed(decimal_digit)}
                                                    onChange={expense_input_change}
                                                />

                                                <input
                                                    type="text"
                                                    hidden
                                                    name="net_amount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="netAmount"
                                                    placeholder="Enter Net Amount"
                                                    value={(totalAmount - expenseData.previous_due).toFixed(3)}
                                                    onChange={expense_input_change}
                                                />
                                            </div>
                                        </div>
                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Discount:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="discount"
                                                    placeholder="Enter Discount Amount"
                                                    // value={expenseData.discount ? expenseData.discount : discountAmount}
                                                    value={expenseData.discount ? expenseData.discount : discountAmount.toFixed(decimal_digit)}
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        expense_input_change(e)
                                                    }}
                                                />

                                                <input
                                                    type="text"
                                                    name="discount"
                                                    hidden
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="discount"
                                                    placeholder="Enter Discount Amount"
                                                    value={expenseData.discount ? expenseData.discount : discountAmount.toFixed(3)}
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        expense_input_change(e)
                                                    }}
                                                />

                                            </div>
                                        </div>
                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Payable Amount:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="paidAmount"
                                                    placeholder="Enter Paid Amount"
                                                    value={(totalAmount - expenseData.discount - expenseData.previous_due).toFixed(decimal_digit)}
                                                    // value={expenseData.payable_amount ? expenseData.payable_amount : (totalPayAbleAmount + preDueAmount).toFixed(2)}
                                                    onChange={() => {
                                                        expense_input_change(e);
                                                        handleInputChange(e);
                                                    }}
                                                />

                                                <input
                                                    type="text"
                                                    hidden
                                                    name="payable_amount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="paidAmount"
                                                    placeholder="Enter Paid Amount"
                                                    value={(totalAmount - expenseData.discount - expenseData.previous_due).toFixed(3)}
                                                    // value={expenseData.payable_amount ? expenseData.payable_amount : (totalPayAbleAmount + preDueAmount).toFixed(2)}
                                                    onChange={() => {
                                                        expense_input_change(e);
                                                        handleInputChange(e);
                                                    }}

                                                />
                                            </div>
                                        </div>




                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Paid Amount:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="paidAmount"
                                                    placeholder="Enter Paid Amount"
                                                    value={(totalAmount - expenseData.discount - expenseData.previous_due - expenseData.due_amount).toFixed(decimal_digit)}
                                                    onChange={(e) => {
                                                        expense_input_change(e);
                                                        handleInputChange(e)
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    hidden
                                                    name="paid_amount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="paidAmount"
                                                    placeholder="Enter Paid Amount"
                                                    value={(totalAmount - expenseData.discount - expenseData.previous_due - expenseData.due_amount).toFixed(3)}
                                                    onChange={(e) => {
                                                        expense_input_change(e);
                                                        handleInputChange(e)
                                                    }}

                                                />
                                            </div>
                                        </div>
                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Due Amount:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    name="due_amount" // Make sure the name matches the state variable name
                                                    className="form-control form-control-sm alpha_space student_id" // Use className instead of class
                                                    id="due_amount"
                                                    placeholder="Enter Due Amount"
                                                    value={(expenseData.due_amount ? expenseData.due_amount : dueAmount)} // Use value attribute to bind the state variable
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        expense_input_change(e)
                                                    }} // Call handleInputChange function on change
                                                />
                                            </div>
                                        </div>

                                        <div class="form-group row d-flex justify-content-end">
                                            <div class="offset-md-2  ">

                                                <input type="submit" name="Print" class="btn btn-sm btn-success print_btn mr-2" value="Update" />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </>



                        </div>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default EditExpense;
