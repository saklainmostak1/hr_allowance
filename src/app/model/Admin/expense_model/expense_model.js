const connection = require('../../../../connection/config/database')


const expenceModel = {


    expence_create: async (req, res) => {
        try {
            // Query to get the maximum voucher_id
            const getMaxVoucherIdQuery = 'SELECT MAX(voucher_id) AS max_voucher_id FROM expense';

            connection.query(getMaxVoucherIdQuery, (err, result) => {
                if (err) {
                    console.error('Error getting maximum voucher_id: ' + err.stack);
                    return res.status(500).send('Error getting maximum voucher_id');
                }

                let maxVoucherId = result[0].max_voucher_id || 0; // If there are no expenses yet, start from 0
                const nextVoucherId = maxVoucherId + 1;

                const {
                    item_name,
                    supplier_id,
                    expense_category,
                    amount,
                    payment_type,
                    expense_date,
                    quantity,
                    discount,
                    short_note,
                    created_by,
                    bank_check_no,
                    previous_due,
                    sub_total,

                    payable_amount,
                    due_amount,
                    paid_amount
                } = req.body;

                // Insert into expense table
                const expenseQuery = 'INSERT INTO expense ( supplier_id, voucher_id,  expense_category, amount, payment_type, expense_date, quantity,  discount, short_note, created_by,  previous_due, sub_total,payable_amount, due_amount, paid_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                const expenseValues = [supplier_id, nextVoucherId, expense_category, amount, payment_type, expense_date, quantity, discount, short_note, created_by, previous_due, sub_total, payable_amount, due_amount, paid_amount];

                connection.query(expenseQuery, expenseValues, (err, result) => {
                    if (err) {
                        console.error('Error inserting into expense table: ' + err.stack);
                        return res.status(500).send('Error inserting into expense table');
                    }

                    const expenseId = result.insertId;

                    // Insert into expense_check table
                    const expenseCheckQuery = 'INSERT INTO expense_check (expense_id, bank_check_no) VALUES (?, ?)';
                    const expenseCheckValues = [expenseId, bank_check_no];

                    connection.query(expenseCheckQuery, expenseCheckValues, (err, result) => {
                        if (err) {
                            console.error('Error inserting into expense_check table: ' + err.stack);
                            return res.status(500).send('Error inserting into expense_check table');
                        }

                        // Insert into expense_item table
                        const expenseItemQuery = 'INSERT INTO expense_item (expense_id, item_name, amount, discount, due) VALUES (?, ?, ?, ?, ?)';
                        const expenseItemValues = [expenseId, item_name, amount, discount, due_amount];

                        connection.query(expenseItemQuery, expenseItemValues, (err, result) => {
                            if (err) {
                                console.error('Error inserting into expense_item table: ' + err.stack);
                                return res.status(500).send('Error inserting into expense_item table');
                            }

                            res.status(200).json('Data inserted successfully');
                        });
                    });
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    expense_get: async (req, res) => {
        try {
            // Query to fetch expenses along with their details
            const getExpensesQuery = `
            SELECT 
                e.*,
                ec.bank_check_no,
                ei.item_name,
                ei.amount AS item_amount,
                ei.discount AS item_discount,
                ei.due AS item_due
            FROM 
                expense e
            LEFT JOIN 
                expense_check ec ON e.id = ec.expense_id
            LEFT JOIN 
                expense_item ei ON e.id = ei.expense_id
        `;

            connection.query(getExpensesQuery, (err, results) => {
                if (err) {
                    console.error('Error fetching expenses: ' + err.stack);
                    return res.status(500).send('Error fetching expenses');
                }

                // Organize fetched results
                const expenses = results.reduce((acc, row) => {
                    const existingExpense = acc.find(expense => expense.id === row.id);
                    if (existingExpense) {
                        // Add check details if they exist
                        if (row.bank_check_no) {
                            existingExpense.bank_check_no = row.bank_check_no;
                        }
                        // Add item details if they exist
                        if (row.item_name) {
                            existingExpense.items.push({
                                item_name: row.item_name,
                                amount: row.item_amount,
                                discount: row.item_discount,
                                due: row.item_due
                            });
                        }
                    } else {
                        // Initialize expense object
                        const expense = {
                            id: row.id,
                            supplier_id: row.supplier_id,
                            voucher_id: row.voucher_id,
                            expense_category: row.expense_category,
                            amount: row.amount,
                            payment_type: row.payment_type,
                            expense_date: row.expense_date,
                            discount: row.discount,
                            short_note: row.short_note,
                            created_by: row.created_by,
                            previous_due: row.previous_due,
                            sub_total: row.sub_total,
                            payable_amount: row.payable_amount,
                            due_amount: row.due_amount,
                            paid_amount: row.paid_amount,
                            bank_check_no: row.bank_check_no ? row.bank_check_no : null,
                            items: [],
                            quantity: row.quantity,
                            item_name: row.item_name,
                            amount: row.item_amount,
                            discount: row.item_discount,
                            due: row.item_due
                        };
                        // Add item details if they exist
                        if (row.item_name) {
                            expense.items.push({
                                item_name: row.item_name,
                                amount: row.item_amount,
                                discount: row.item_discount,
                                due: row.item_due
                            });
                        }
                        acc.push(expense);
                    }
                    return acc;
                }, []);

                res.status(200).json(expenses);
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    expense_update: async (req, res) => {
        try {
            const expenseId = req.params.id;

            const {
                item_name,
                supplier_id,
                expense_category,
                amount,
                quantity,
                payment_type,
                expense_date,
                discount,
                short_note,
                
                bank_check_no,
                previous_due,
                sub_total,
                payable_amount,
                due_amount,
                paid_amount
            } = req.body;

            // Update expense table
            const updateExpenseQuery = `
            UPDATE expense 
            SET 
                supplier_id = ?,
                expense_category = ?,
                amount = ?,
                quantity = ?,
                payment_type = ?,
                expense_date = ?,
                discount = ?,
                short_note = ?,
                
                previous_due = ?,
                sub_total = ?,
                payable_amount = ?,
                due_amount = ?,
                paid_amount = ?
            WHERE 
                id = ?
        `;
            const updateExpenseValues = [
                supplier_id,
                expense_category,
                amount,
                quantity,
                payment_type,
                expense_date,
                discount,
                short_note,
                
                previous_due,
                sub_total,
                payable_amount,
                due_amount,
                paid_amount,
                expenseId
            ];

            connection.query(updateExpenseQuery, updateExpenseValues, (err, result) => {
                if (err) {
                    console.error('Error updating expense: ' + err.stack);
                    return res.status(500).send('Error updating expense');
                }

                // Update expense_check table
                const updateExpenseCheckQuery = `
                UPDATE expense_check 
                SET 
                    bank_check_no = ?
                WHERE 
                    expense_id = ?
            `;
                const updateExpenseCheckValues = [bank_check_no, expenseId];

                connection.query(updateExpenseCheckQuery, updateExpenseCheckValues, (err, result) => {
                    if (err) {
                        console.error('Error updating expense_check: ' + err.stack);
                        return res.status(500).send('Error updating expense_check');
                    }

                    // Update expense_item table
                    const updateExpenseItemQuery = `
                    UPDATE expense_item 
                    SET 
                        item_name = ?,
                        amount = ?,
                        discount = ?,
                        due = ?
                    WHERE 
                        expense_id = ?
                `;
                    const updateExpenseItemValues = [item_name, amount, discount, due_amount, expenseId];

                    connection.query(updateExpenseItemQuery, updateExpenseItemValues, (err, result) => {
                        if (err) {
                            console.error('Error updating expense_item: ' + err.stack);
                            return res.status(500).send('Error updating expense_item');
                        }

                        res.status(200).send('Expense updated successfully');
                    });
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    expense_getById: async (req, res) => {
        try {
            const expenseId = req.params.id;

            // Query to fetch a single expense along with its details
            const getExpenseQuery = `
            SELECT 
                e.*,
                ec.bank_check_no,
                ei.item_name,
                ei.amount AS item_amount,
                ei.discount AS item_discount,
                ei.due AS item_due
            FROM 
                expense e
            LEFT JOIN 
                expense_check ec ON e.id = ec.expense_id
            LEFT JOIN 
                expense_item ei ON e.id = ei.expense_id
            WHERE 
                e.id = ?
        `;

            connection.query(getExpenseQuery, [expenseId], (err, results) => {
                if (err) {
                    console.error('Error fetching expense: ' + err.stack);
                    return res.status(500).send('Error fetching expense');
                }

                if (results.length === 0) {
                    return res.status(404).send('Expense not found');
                }

                // Organize fetched results
                const expense = results.reduce((acc, row) => {
                    acc.id = row.id;
                    acc.supplier_id = row.supplier_id;
                    acc.voucher_id = row.voucher_id;
                    acc.expense_category = row.expense_category;
                    acc.amount = row.amount;
                    acc.payment_type = row.payment_type;
                    acc.expense_date = row.expense_date;
                    acc.discount = row.discount;
                    acc.short_note = row.short_note;
                    acc.created_by = row.created_by;
                    acc.previous_due = row.previous_due;
                    acc.sub_total = row.sub_total;
                    acc.payable_amount = row.payable_amount;
                    acc.due_amount = row.due_amount;
                    acc.paid_amount = row.paid_amount;
                    acc.quantity = row.quantity;
                    acc.item_name = row.item_name,
                        acc.amount = row.item_amount,
                        acc.discount = row.item_discount,
                        acc.due = row.item_due
                    // Add check details if they exist
                    if (row.bank_check_no) {
                        acc.bank_check_no = row.bank_check_no;
                    }
                    // Add item details if they exist
                    if (row.item_name) {
                        acc.items.push({
                            item_name: row.item_name,
                            amount: row.item_amount,
                            discount: row.item_discount,
                            due: row.item_due
                        });
                    }
                    return acc;
                }, {
                    id: null,
                    supplier_id: null,
                    voucher_id: null,
                    expense_category: null,
                    amount: null,
                    payment_type: null,
                    expense_date: null,
                    discount: null,
                    short_note: null,
                    created_by: null,
                    previous_due: null,
                    sub_total: null,
                    payable_amount: null,
                    due_amount: null,
                    paid_amount: null,
                    quantity: null,
                    bank_check_no: null,
                    items: [],
                    item_name: null,
                    amount: null,
                    discount: null,
                    due: null,
                });

                res.status(200).json(expense);
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },



    expence_category_list: async (req, res) => {
        try {
            let data = `
                SELECT 
                    expense.*, 
                    expense_item.item_name AS expense_name,
                    users_created.full_name AS created_by,
                    users_modified.full_name AS modified_by,
                    expense_category.expense_category_name AS expense_category
                FROM 
                    expense 
                    INNER JOIN users AS users_created ON expense.created_by = users_created.id 
                    LEFT JOIN users AS users_modified ON expense.modified_by = users_modified.id 
                    INNER JOIN expense_category ON expense.expense_category = expense_category.id
                    LEFT JOIN expense_item ON expense.id = expense_item.expense_id;
            `;

            connection.query(data, function (error, result) {
                console.log(result)
                if (!error) {
                    res.send(result)
                } else {
                    console.log(error)
                    res.status(500).send("An error occurred while fetching expense data.")
                }
            })
        } catch (error) {
            console.log(error)
            res.status(500).send("An error occurred while processing your request.")
        }
    },



    expense_category_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM expense_category WHERE id = ?';
            connection.query(query, [req.params.id], (error, result) => {
                if (!error && result.length > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    console.log(error || 'Product not found');
                    return res.status(404).json({ message: 'Product not found.' });
                }
            });
        }
        catch (error) {
            console.log(error)
        }
    },



    expense_delete: async (req, res) => {

        try {
            const selectExpenseQuery = 'SELECT * FROM expense WHERE id = ?';
            const selectExpenseItemQuery = 'SELECT * FROM expense_item WHERE expense_id = ?';
            const selectExpenseCheckQuery = 'SELECT * FROM expense_check WHERE expense_id = ?';

            const deleteExpenseQuery = 'DELETE FROM expense WHERE id = ?';
            const deleteExpenseItemQuery = 'DELETE FROM expense_item WHERE expense_id = ?';
            const deleteExpenseCheckQuery = 'DELETE FROM expense_check WHERE expense_id = ?';
            
            const insertExpenseLogQuery = 'INSERT INTO expense_log (id, supplier_id, voucher_id, expense_category, amount, payment_type, expense_date, discount, short_note, created_by, previous_due, sub_total, payable_amount, due_amount, paid_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const insertExpenseItemLogQuery = 'INSERT INTO expense_item_log (id ,expense_id, item_name, amount, discount, due) VALUES (?, ?, ?, ?, ?, ?)';
            const insertExpenseCheckLogQuery = 'INSERT INTO expense_check_log (id, expense_id, bank_check_no) VALUES (?, ?, ?)';
    
            connection.beginTransaction((err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: 'Failed to begin transaction.' });
                }
    
                // Select expense data
                connection.query(selectExpenseQuery, [req.params.id], (error, expenseResult) => {
                    if (error) {
                        console.log(error);
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Failed to retrieve expense data.' });
                        });
                    }
    
                    if (expenseResult.length === 0) {
                        console.log('Expense not found');
                        return connection.rollback(() => {
                            res.status(404).json({ message: 'Expense not found.' });
                        });
                    }
    
                    const expenseData = expenseResult[0];
    
                    // Insert expense data into expense_log
                    connection.query(insertExpenseLogQuery, [expenseData.id, expenseData.supplier_id, expenseData.voucher_id, expenseData.expense_category, expenseData.amount, expenseData.payment_type, expenseData.expense_date, expenseData.discount, expenseData.short_note, expenseData.created_by, expenseData.previous_due, expenseData.sub_total, expenseData.payable_amount, expenseData.due_amount, expenseData.paid_amount], (error) => {
                        if (error) {
                            console.log(error);
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Failed to insert expense data into log.' });
                            });
                        }
    
                        // Select expense items data
                        connection.query(selectExpenseItemQuery, [req.params.id], (error, expenseItemResult) => {
                            if (error) {
                                console.log(error);
                                return connection.rollback(() => {
                                    res.status(500).json({ message: 'Failed to retrieve expense item data.' });
                                });
                            }
    
                            // Insert expense items data into expense_item_log
                            const promisesItems = expenseItemResult.map(item => {
                                return new Promise((resolve, reject) => {
                                    connection.query(insertExpenseItemLogQuery, [item.id, item.expense_id, item.item_name, item.amount, item.discount, item.due], (error) => {
                                        if (error) {
                                            console.log(error);
                                            reject(error);
                                        } else {
                                            resolve();
                                        }
                                    });
                                });
                            });
    
                            // Execute all insert queries for expense_item_log
                            Promise.all(promisesItems)
                                .then(() => {
                                    // Select expense checks data
                                    connection.query(selectExpenseCheckQuery, [req.params.id], (error, expenseCheckResult) => {
                                        if (error) {
                                            console.log(error);
                                            return connection.rollback(() => {
                                                res.status(500).json({ message: 'Failed to retrieve expense check data.' });
                                            });
                                        }
    
                                        // Insert expense checks data into expense_check_log
                                        const promisesChecks = expenseCheckResult.map(check => {
                                            return new Promise((resolve, reject) => {
                                                connection.query(insertExpenseCheckLogQuery, [check.id, check.expense_id, check.check_number, check.check_date, check.bank_name, check.amount], (error) => {
                                                    if (error) {
                                                        console.log(error);
                                                        reject(error);
                                                    } else {
                                                        resolve();
                                                    }
                                                });
                                            });
                                        });
    
                                        // Execute all insert queries for expense_check_log
                                        Promise.all(promisesChecks)
                                            .then(() => {
                                                // After successful insertion into log tables, proceed to delete
                                                connection.query(deleteExpenseCheckQuery, [req.params.id], (error) => {
                                                    if (error) {
                                                        console.log(error);
                                                        return connection.rollback(() => {
                                                            res.status(500).json({ message: 'Failed to delete related expense checks.' });
                                                        });
                                                    }
    
                                                    // Delete expense items
                                                    connection.query(deleteExpenseItemQuery, [req.params.id], (error) => {
                                                        if (error) {
                                                            console.log(error);
                                                            return connection.rollback(() => {
                                                                res.status(500).json({ message: 'Failed to delete related expense items.' });
                                                            });
                                                        }
    
                                                        // Delete expense
                                                        connection.query(deleteExpenseQuery, [req.params.id], (error) => {
                                                            if (error) {
                                                                console.log(error);
                                                                return connection.rollback(() => {
                                                                    res.status(500).json({ message: 'Failed to delete expense.' });
                                                                });
                                                            }
    
                                                            connection.commit((err) => {
                                                                if (err) {
                                                                    console.log(err);
                                                                    return connection.rollback(() => {
                                                                        res.status(500).json({ message: 'Failed to commit transaction.' });
                                                                    });
                                                                }
    
                                                                console.log('Expense and related items deleted successfully');
                                                                res.send({ message: 'Expense and related items deleted successfully' });
                                                            });
                                                        });
                                                    });
                                                });
                                            })
                                            .catch(error => {
                                                console.log(error);
                                                return connection.rollback(() => {
                                                    res.status(500).json({ message: 'Failed to insert expense check data into log.' });
                                                });
                                            });
                                    });
                                })
                                .catch(error => {
                                    console.log(error);
                                    return connection.rollback(() => {
                                        res.status(500).json({ message: 'Failed to insert expense item data into log.' });
                                    });
                                });
                        });
                    });
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'An unexpected error occurred.' });
        }
    },
    

    // expense_delete: async (req, res) => {

    //     try {
    //         const selectExpenseQuery = 'SELECT * FROM expense WHERE id = ?';
    //         const selectExpenseItemQuery = 'SELECT * FROM expense_item WHERE expense_id = ?';
    //         const deleteExpenseQuery = 'DELETE FROM expense WHERE id = ?';
    //         const deleteExpenseItemQuery = 'DELETE FROM expense_item WHERE expense_id = ?';
    //         const insertExpenseLogQuery = 'INSERT INTO expense_log (id, supplier_id, voucher_id, expense_category, amount, payment_type, expense_date, discount, short_note, created_by, previous_due, sub_total, payable_amount, due_amount, paid_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    //         const insertExpenseItemLogQuery = 'INSERT INTO expense_item_log (id ,expense_id, item_name, amount, discount, due) VALUES (?, ?, ?, ?, ?, ?)';


    //         connection.beginTransaction((err) => {
    //             if (err) {
    //                 console.log(err);
    //                 return res.status(500).json({ message: 'Failed to begin transaction.' });
    //             }

    //             // Select expense data
    //             connection.query(selectExpenseQuery, [req.params.id], (error, expenseResult) => {
    //                 if (error) {
    //                     console.log(error);
    //                     return connection.rollback(() => {
    //                         res.status(500).json({ message: 'Failed to retrieve expense data.' });
    //                     });
    //                 }

    //                 if (expenseResult.length === 0) {
    //                     console.log('Expense not found');
    //                     return connection.rollback(() => {
    //                         res.status(404).json({ message: 'Expense not found.' });
    //                     });
    //                 }

    //                 const expenseData = expenseResult[0];

    //                 // Insert expense data into expense_log
    //                 connection.query(insertExpenseLogQuery, [expenseData.id, expenseData.supplier_id, expenseData.voucher_id, expenseData.expense_category, expenseData.amount, expenseData.payment_type, expenseData.expense_date, expenseData.discount, expenseData.short_note, expenseData.created_by, expenseData.previous_due, expenseData.sub_total, expenseData.payable_amount, expenseData.due_amount, expenseData.paid_amount], (error) => {
    //                     if (error) {
    //                         console.log(error);
    //                         return connection.rollback(() => {
    //                             res.status(500).json({ message: 'Failed to insert expense data into log.' });
    //                         });
    //                     }

    //                     // Select expense items data
    //                     connection.query(selectExpenseItemQuery, [req.params.id], (error, expenseItemResult) => {
    //                         if (error) {
    //                             console.log(error);
    //                             return connection.rollback(() => {
    //                                 res.status(500).json({ message: 'Failed to retrieve expense item data.' });
    //                             });
    //                         }

    //                         // Insert expense items data into expense_item_log
    //                         const promises = expenseItemResult.map(item => {
    //                             return new Promise((resolve, reject) => {
    //                                 connection.query(insertExpenseItemLogQuery, [item.id, item.expense_id, item.item_name, item.amount, item.discount, item.due], (error) => {
    //                                     if (error) {
    //                                         console.log(error);
    //                                         reject(error);
    //                                     } else {
    //                                         resolve();
    //                                     }
    //                                 });
    //                             });
    //                         });

    //                         // Execute all insert queries for expense_item_log
    //                         Promise.all(promises)
    //                             .then(() => {
    //                                 // After successful insertion into log tables, proceed to delete
    //                                 connection.query(deleteExpenseItemQuery, [req.params.id], (error) => {
    //                                     if (error) {
    //                                         console.log(error);
    //                                         return connection.rollback(() => {
    //                                             res.status(500).json({ message: 'Failed to delete related expense items.' });
    //                                         });
    //                                     }

    //                                     connection.query(deleteExpenseQuery, [req.params.id], (error) => {
    //                                         if (error) {
    //                                             console.log(error);
    //                                             return connection.rollback(() => {
    //                                                 res.status(500).json({ message: 'Failed to delete expense.' });
    //                                             });
    //                                         }

    //                                         connection.commit((err) => {
    //                                             if (err) {
    //                                                 console.log(err);
    //                                                 return connection.rollback(() => {
    //                                                     res.status(500).json({ message: 'Failed to commit transaction.' });
    //                                                 });
    //                                             }

    //                                             console.log('Expense and related items deleted successfully');
    //                                             res.send({ message: 'Expense and related items deleted successfully' });
    //                                         });
    //                                     });
    //                                 });
    //                             })
    //                             .catch(error => {
    //                                 console.log(error);
    //                                 return connection.rollback(() => {
    //                                     res.status(500).json({ message: 'Failed to insert expense item data into log.' });
    //                                 });
    //                             });
    //                     });
    //                 });
    //             });
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ message: 'An unexpected error occurred.' });
    //     }
    // },





    expense_category_update: async (req, res) => {
        try {

            const { expense_category_name, modified_by } = req.body;

            const query = `UPDATE expense_category SET expense_category_name = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [expense_category_name, modified_by, req.params.id], (error, result) => {
                if (!error && result.affectedRows > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    console.log(error || 'Product not found');
                    return res.status(404).json({ message: 'Product not found.' });
                }
            });
        }
        catch (error) {
            console.log(error)
        }
    },




    expense_category_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM expense_category WHERE id = ?';
            connection.query(query, [req.params.id], (error, result) => {
                if (!error && result.affectedRows > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    console.log(error || 'Product not found');
                    return res.status(404).json({ message: 'Product not found.' });
                }
            });
        }
        catch (error) {
            console.log(error)
        }
    },



    expense_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
            SELECT 
                expense.*, 
                expense_item.item_name AS expense_name,
                users_created.full_name AS created_by,
                users_modified.full_name AS modified_by,
                expense_category.expense_category_name AS expense_category
            FROM 
                expense 
                INNER JOIN users AS users_created ON expense.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON expense.modified_by = users_modified.id 
                LEFT JOIN expense_category ON expense.expense_category = expense_category.id
                LEFT JOIN expense_item ON expense.id = expense_item.expense_id
            ORDER BY expense.id DESC  
            LIMIT ?, ?`; 

            connection.query(query, [skipRows, perPage], (error, result) => {
                console.log(result)
                if (!error) {
                    res.send(result)
                }

                else {
                    console.log(error)
                }

            })
        }
        catch (error) {
            console.log(error)
        }
    },

    // expense_search: async (req, res) => {
    //     try {
    //         console.log("Search button clicked.");

    //         // Extract necessary data from request
    //         const { fromDate, toDate, searchQuery, invoiceId } = req.body;

    //         // Construct the base SQL query
    //         let sql = `SELECT expense.*, expense_category.expense_category_name AS expense_category FROM expense LEFT JOIN expense_category ON expense.expense_category = expense_category.id WHERE 1`;

    //         // Add date range condition
    //         if (fromDate && toDate) {
    //             sql += ` AND expense.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
    //         }

    //         // Add expense category ID condition
    //         if ( invoiceId !== undefined && invoiceId !== null && invoiceId !== '') {
    //             sql += ` AND expense.voucher_id = ${invoiceId}`;
    //         }
    //         if (searchQuery ) {
    //             sql += ` AND expense_category = ${searchQuery}`;
    //         }
    //         console.log("SQL Query:", sql);

    //         // Execute the constructed SQL query
    //         connection.query(sql, (error, results, fields) => {
    //             if (error) {
    //                 console.error("Error occurred during search:", error);
    //                 res.status(500).json({ error: "An error occurred during search." });
    //             } else {
    //                 console.log("Search results:", results);
    //                 res.status(200).json({ results });
    //             }
    //         });
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //         res.status(500).json({ error: "An error occurred." });
    //     }
    // },
    expense_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, searchQuery, invoiceId, itemName, supplierId } = req.body;

            // Construct the base SQL query
            let sql = `
            SELECT 
                expense.*, 
                expense_item.item_name AS expense_name, 
                expense_category.expense_category_name AS expense_category 
            FROM 
                expense 
                LEFT JOIN expense_category ON expense.expense_category = expense_category.id 
                LEFT JOIN expense_item ON expense.id = expense_item.expense_id 
            WHERE 1`;


            if (fromDate && toDate) {
                sql += ` AND expense.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }

            if (searchQuery) {
                sql += ` AND expense.expense_category = ${searchQuery}`;
            }

            if (supplierId) {
                sql += ` AND expense.supplier_id LIKE '%${supplierId}%'`;
            }
            // Add invoice ID condition
            if (invoiceId && invoiceId !== '') {
                sql += ` AND expense.voucher_id LIKE '%${invoiceId}%'`;
            }

            if (itemName) {

                sql += ` AND LOWER(expense_item.item_name) LIKE '%${itemName}%'`;
            }

            // Add expense name (item_name) search condition



            console.log("SQL Query:", sql);

            // Execute the constructed SQL query
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    console.error("Error occurred during search:", error);
                    res.status(500).json({ error: "An error occurred during search." });
                } else {
                    console.log("Search results:", results);
                    res.status(200).json({ results });
                }
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },




}
module.exports = expenceModel