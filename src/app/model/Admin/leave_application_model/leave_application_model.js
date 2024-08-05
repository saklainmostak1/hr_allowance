

const connection = require('../../../../connection/config/database')


const LeaveApplicationModel = {



    // leave_application_create: async (req, res) => {


    //     try {
    //         const { leave_category, start_date, receiver, whose_leave, end_date, created_by } = req.body;

    //         // Using parameterized query to prevent SQL injection
    //         const insertQuery = 'INSERT INTO leave_application (leave_category, start_date, receiver, whose_leave, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?)';
    //         const [result] = await connection.query(insertQuery, [leave_category, start_date, receiver, whose_leave, end_date, created_by]);

    //         // Sending only the necessary data from the result object
    //         const { insertId, affectedRows } = result;

    //         // Sending response with relevant data
    //         res.status(200).json({ insertId, affectedRows });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Error processing the request' });
    //     }
    // },


    // leave_application_create: async (req, res) => {
    //     try {
    //         const { leave_category, start_date, receiver, whose_leave, end_date, created_by, leave_date } = req.body;

    //         // Using parameterized query to prevent SQL injection
    //         const insertQuery = 'INSERT INTO leave_application (leave_category, start_date, receiver, whose_leave, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?)';
    //         const [result] = await connection.query(insertQuery, [leave_category, start_date, receiver, whose_leave, end_date, created_by]);

    //         // Extracting the insertId from the result
    //         const { insertId, affectedRows } = result;

    //         // Inserting each date in leave_date into the leave_date table
    //         if (Array.isArray(leave_date) && leave_date.length > 0) {
    //             const leaveDateInsertQuery = 'INSERT INTO leave_application_date (leave_application_id, leave_date) VALUES (?, ?)';

    //             for (const leaveDate of leave_date) {
    //                 await connection.query(leaveDateInsertQuery, [insertId, leaveDate]);
    //             }
    //         }

    //         // Sending response with relevant data
    //         res.status(200).json({ insertId, affectedRows });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Error processing the request' });
    //     }
    // },




    leave_category_list: async (req, res) => {
        try {
            const data = "select * from  leave_category";

            connection.query(data, function (error, result) {
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

    leave_application_create: async (req, res) => {
        try {
            const { leave_category, start_date, receiver, whose_leave, end_date, created_by, leave_date } = req.body;

            // Start a transaction
            connection.beginTransaction(async (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to start transaction' });
                    return;
                }

                // Using parameterized query to prevent SQL injection
                const insertQuery = 'INSERT INTO leave_application (leave_category, start_date, receiver, whose_leave, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?)';
                const result = [leave_category, start_date, receiver, whose_leave, end_date, created_by];

                connection.query(insertQuery, result, async (err, results) => {
                    if (err) {
                        console.error(err);
                        await connection.rollback(() => {
                            res.status(500).json({ message: 'Leave application creation failed' });
                        });
                        return;
                    }

                    const leaveApplicationId = results.insertId;

                    // Inserting each date in leave_date into the leave_date table
                    if (Array.isArray(leave_date) && leave_date.length > 0) {
                        const leaveDateInsertQuery = 'INSERT INTO leave_application_date (leave_application_id, leave_date) VALUES (?, ?)';

                        for (const leaveDate of leave_date) {
                            connection.query(leaveDateInsertQuery, [leaveApplicationId, leaveDate], (err) => {
                                if (err) {
                                    console.error(err);
                                    connection.rollback(() => {
                                        res.status(500).json({ message: 'Failed to insert leave dates' });
                                    });
                                    return;
                                }
                            });
                        }
                    }

                    // Commit the transaction
                    connection.commit((err) => {
                        if (err) {
                            console.error(err);
                            connection.rollback(() => {
                                res.status(500).json({ message: 'Transaction commit failed' });
                            });
                            return;
                        }

                        // Sending response with relevant data
                        res.status(200).json({ insertId: leaveApplicationId, message: 'Leave application created successfully' });
                    });
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },
    leave_application_approved: async (req, res) => {
        try {
            const leaveApplications = req.body; // Ensure req.body is an array

            // Validate that req.body is an array
            if (!Array.isArray(leaveApplications)) {
                return res.status(400).json({ message: 'Request body must be an array of leave applications' });
            }

            // Using a parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO leave_approved (leave_application_id, approved_by, approved_date) VALUES (?, ?, ?)';

            // Array to store the results of each insertion
            const results = [];

            // Using a for loop to iterate over each leave application
            for (let application of leaveApplications) {
                const { leave_application_id, approved_by, approved_date } = application;

                try {
                    const [result] = await connection.query(insertQuery, [leave_application_id, approved_by, approved_date]);

                    // Store the result of each insertion
                    const { insertId, affectedRows } = result;
                    results.push({ insertId, affectedRows });
                } catch (error) {
                    console.error(`Error inserting leave application ID ${leave_application_id}:`, error);
                    results.push({ leave_application_id, error: error.message });
                }
            }

            // Sending response with the array of results
            res.status(200).json(results);
        } catch (error) {
            console.error('Error processing the request:', error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },

    // leave_application_approved: async (req, res) => {
    //     try {
    //         const leaveApplications = req.body; // Ensure req.body is an array

    //         // Validate that req.body is an array
    //         if (!Array.isArray(leaveApplications)) {
    //             return res.status(400).json({ message: 'Request body must be an array of leave applications' });
    //         }

    //         // Using a parameterized query to prevent SQL injection
    //         const insertQuery = 'INSERT INTO leave_approved (leave_application_id, approved_by, approved_date) VALUES (?, ?, ?)';

    //         // Array to store the results of each insertion
    //         const results = [];

    //         // Using a for loop to iterate over each leave application
    //         for (let application of leaveApplications) {
    //             const { leave_application_id, approved_by, approved_date } = application;

    //             const [result] = await connection.query(insertQuery, [leave_application_id, approved_by, approved_date]);

    //             // Store the result of each insertion
    //             const { insertId, affectedRows } = result;
    //             results.push({ insertId, affectedRows });
    //         }

    //         // Sending response with the array of results
    //         res.status(200).json(results);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Error processing the request' });
    //     }
    // },



    leave_application_list: async (req, res) => {
        try {
            const query = `
                SELECT 
                    leave_application.*,
                    leave_category.name AS leave_category_name,
                    created_by_user.full_name AS created_by_name,
                    receiver_user.full_name AS receiver_name
                FROM 
                    leave_application
                LEFT JOIN 
                    leave_category ON leave_application.leave_category = leave_category.id
                LEFT JOIN 
                    users AS created_by_user ON leave_application.created_by = created_by_user.id
                LEFT JOIN 
                    users AS receiver_user ON leave_application.receiver = receiver_user.id
            `;

            connection.query(query, function (error, result) {
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                    res.status(500).send('Database query error');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server error');
        }
    },


    leave_application_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM leave_application WHERE id = ?';
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


    leave_application_update: async (req, res) => {
        try {

            const { leave_category, start_date, receiver, whose_leave, end_date, modified_by } = req.body;

            const query = `UPDATE leave_application SET   leave_category = ?, start_date = ?, receiver = ?, whose_leave = ?, end_date = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [leave_category, start_date, receiver, whose_leave, end_date, modified_by, req.params.id], (error, result) => {
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


    leave_application_update_status: async (req, res) => {
        try {

            const { application_status } = req.body;

            const query = `UPDATE leave_application SET  application_status = ? WHERE id = ?`;
            connection.query(query, [application_status, req.params.id], (error, result) => {
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


    leave_application_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM leave_application WHERE id = ?';
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


    leave_application_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            const query = `
            SELECT 
                leave_application.*,
                leave_category.name AS leave_category_name,
                created_by_user.full_name AS created_by_name,
                receiver_user.full_name AS receiver_name,
                whose_leave_user.full_name AS whose_leave_name,
                CASE 
                    WHEN leave_application.application_status = 0 THEN 'pending'
                    WHEN leave_application.application_status = 1 THEN 'approved'
                    WHEN leave_application.application_status = 2 THEN 'rejected'
                    ELSE 'unknown'
                END AS application_status_name
            FROM 
                leave_application
            LEFT JOIN 
                leave_category ON leave_application.leave_category = leave_category.id
            LEFT JOIN 
                users AS created_by_user ON leave_application.created_by = created_by_user.id
            LEFT JOIN 
                users AS receiver_user ON leave_application.receiver = receiver_user.id
            LEFT JOIN 
                users AS whose_leave_user ON leave_application.whose_leave = whose_leave_user.id
            ORDER BY 
                leave_application.id DESC
            LIMIT ?, ?
        `;


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

    // sub_category_list_paigination: async (req, res) => {
    //     const pageNo = Number(req.params.pageNo);
    //     const perPage = Number(req.params.perPage);
    //     try {
    //         const skipRows = (pageNo - 1) * perPage;
    //         let query = `
    //   SELECT sub_category.*, 
    //          users_created.full_name AS created_by,
    //          users_modified.full_name AS modified_by 
    //   FROM sub_category 
    //   LEFT JOIN users AS users_created ON sub_category.created_by = users_created.id 
    //   LEFT JOIN users AS users_modified ON sub_category.modified_by = users_modified.id 
    //   ORDER BY sub_category.id DESC
    //   LIMIT ?, ?
    // `;

    //         connection.query(query, [skipRows, perPage], (error, result) => {
    //             console.log(result)
    //             if (!error) {
    //                 res.send(result)
    //             }

    //             else {
    //                 console.log(error)
    //             }

    //         })
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // },


    leave_application_list_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, searchQuery, status } = req.body;

            // Construct the base SQL query
            let sql = `
            SELECT 
             leave_application.*, 
                leave_category.name AS leave_category 
            FROM 
                leave_application 
                LEFT JOIN  leave_category ON leave_application.leave_category =  leave_category.id 
            WHERE 1`;


            if (fromDate && toDate) {
                sql += ` AND leave_application.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }

            if (searchQuery) {
                sql += ` AND leave_application.leave_category = ${searchQuery}`;
            }

            if (status) {
                sql += ` AND leave_application.application_status LIKE '%${status}%'`;
            }
            // Add invoice ID condition
            // if (invoiceId && invoiceId !== '') {
            //     sql += ` AND expense.voucher_id LIKE '%${invoiceId}%'`;
            // }

            // if (itemName) {

            //     sql += ` AND LOWER(expense_item.item_name) LIKE '%${itemName}%'`;
            // }

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

module.exports = LeaveApplicationModel