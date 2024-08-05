

const connection = require('../../../../connection/config/database')


const SalaryModel = {




    employe_joining_list_salary: async (req, res) => {
        try {
            const data = `
            SELECT ej.*, 
                   p.basic AS salary, 
                   d.designation_name,
                   u.full_name AS employee_name,
                   ep.designation_id_promotion,
                   dp.designation_name AS designation_name_promotion,
                   pp.title AS Payroll
            FROM employe_joining ej
            LEFT JOIN payroll p ON ej.payroll_id = p.id
            LEFT JOIN designation d ON ej.designation_id = d.id
            LEFT JOIN users u ON ej.user_id = u.id
            LEFT JOIN (
                SELECT user_id, MAX(designation_id) AS designation_id_promotion
                FROM employee_promotion
                GROUP BY user_id
            ) ep ON ej.user_id = ep.user_id
            LEFT JOIN designation dp ON ep.designation_id_promotion = dp.id
            LEFT JOIN (
                SELECT ep2.user_id, p2.title
                FROM employee_promotion ep2
                JOIN payroll p2 ON ep2.payroll_id = p2.id
                JOIN (
                    SELECT user_id, MAX(designation_id) AS max_designation_id
                    FROM employee_promotion
                    GROUP BY user_id
                ) ep_max ON ep2.user_id = ep_max.user_id AND ep2.designation_id = ep_max.max_designation_id
            ) pp ON ej.user_id = pp.user_id
            `;

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



    employee_salary_update: async (req, res) => {
        try {

            const { salary_month, salary_date, due, paid_amount, paid_by, modified_by } = req.body;


            const query = `UPDATE salary SET   salary_month = ?, salary_date = ?, due = ?, paid_amount = ?, paid_by = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [salary_month, salary_date, due, paid_amount, paid_by, modified_by, req.params.id], (error, result) => {
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

    employe_attendance_list: async (req, res) => {
        try {
            const data = `SELECT * from attendance`;

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


    salary_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM salary WHERE id = ?';
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

    employe_leave_approved_list: async (req, res) => {
        try {
            const data = `SELECT * from leave_approved`;

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

    employe_joining_list_salary_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { designation } = req.body;

            // Construct the base SQL query
            let sql = `
            SELECT ej.*, 
                   p.basic AS salary, 
                   d.designation_name,
                   u.full_name AS employee_name,
                   ep.designation_id_promotion,
                   dp.designation_name AS designation_name_promotion,
                   pp.title AS Payroll
            FROM employe_joining ej
            LEFT JOIN payroll p ON ej.payroll_id = p.id
            LEFT JOIN designation d ON ej.designation_id = d.id
            LEFT JOIN users u ON ej.user_id = u.id
            LEFT JOIN (
                SELECT user_id, MAX(designation_id) AS designation_id_promotion
                FROM employee_promotion
                GROUP BY user_id
            ) ep ON ej.user_id = ep.user_id
            LEFT JOIN designation dp ON ep.designation_id_promotion = dp.id
            LEFT JOIN (
                SELECT ep2.user_id, p2.title
                FROM employee_promotion ep2
                JOIN payroll p2 ON ep2.payroll_id = p2.id
                JOIN (
                    SELECT user_id, MAX(designation_id) AS max_designation_id
                    FROM employee_promotion
                    GROUP BY user_id
                ) ep_max ON ep2.user_id = ep_max.user_id AND ep2.designation_id = ep_max.max_designation_id
            ) pp ON ej.user_id = pp.user_id 
            WHERE 1=1`;

            const queryParams = [];

            if (designation) {
                sql += ` AND ep.designation_id_promotion = ?`;
                queryParams.push(designation);
            }

            console.log("Constructed SQL Query:", sql);
            console.log("Query Parameters:", queryParams);

            // Execute the constructed SQL query
            connection.query(sql, queryParams, (error, results, fields) => {
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


    salary_create: async (req, res) => {
        try {
            const periods = req.body;
            const results = [];

            for (const period of periods) {
                const { user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by } = period;

                const insertQuery = 'INSERT INTO salary (user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const insertedperiod = await new Promise((resolve, reject) => {
                    connection.query(insertQuery, [user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by], (error, result) => {
                        if (error) {
                            console.log(error);
                            reject(error);
                        }
                        resolve(result);
                    });
                });

                console.log(insertedperiod);
                results.push(insertedperiod);

            }

            res.send(results);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // salary_create: async (req, res) => {

    //     try {
    //         const { user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by } = req.body;


    //         // If material name doesn't exist, insert it
    //         const insertQuery = 'INSERT INTO salary (user_id, salary_month, salary_date, created_by, due,paid_amount,paid_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
    //         connection.query(
    //             insertQuery,
    //             [user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by],
    //             (error, result) => {
    //                 if (error) {
    //                     console.log(error);
    //                     return res.status(500).json({ message: 'Internal Server Error' });
    //                 }
    //                 console.log(result);
    //                 return res.send(result);
    //             }
    //         );

    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }

    // },


    employe_list_salary: async (req, res) => {
        try {
            const data = `
            SELECT 
                salary.*, 
                emp_promotion.designation_id, 
                designation.designation_name, 
                creator.full_name AS created_by_name,
                employee.full_name AS employee_name
            FROM 
                salary 
            LEFT JOIN 
                employee_promotion emp_promotion
            ON 
                salary.user_id = emp_promotion.user_id 
            LEFT JOIN 
                designation 
            ON 
                emp_promotion.designation_id = designation.id
            LEFT JOIN 
                users creator
            ON 
                salary.created_by = creator.id
            LEFT JOIN 
                users employee
            ON 
                salary.user_id = employee.id
        `;

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

    employe_list_salary_single: async (req, res) => {
        try {
            const userId = req.params.id;  // Assuming the id is passed as a URL parameter
            const data = `
             SELECT 
            salary.*, 
            emp_promotion.designation_id, 
            designation.designation_name, 
            creator.full_name AS created_by_name,
            employee.full_name AS employee_name,
            DAY(LAST_DAY(salary.salary_month)) AS totalDays
        FROM 
            salary 
        LEFT JOIN 
            employee_promotion emp_promotion
        ON 
            salary.user_id = emp_promotion.user_id 
        LEFT JOIN 
            designation 
        ON 
            emp_promotion.designation_id = designation.id
        LEFT JOIN 
            users creator
        ON 
            salary.created_by = creator.id
        LEFT JOIN 
            users employee
        ON 
            salary.user_id = employee.id
        WHERE 
            salary.id = ?
            `;

            connection.query(data, [userId], function (error, result) {
                console.log(result);
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                    res.status(500).send('Error occurred while fetching salary details');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server error');
        }
    },

     employe_list_salary_single_search: async (req, res) => {
        try {
            const userId = req.params.id; // Assuming the id is passed as a URL parameter
            const data = `
                SELECT ej.*, 
                       p.basic AS salary, 
                       d.designation_name,
                       u.full_name AS employee_name,
                       ep.designation_id_promotion,
                       dp.designation_name AS designation_name_promotion,
                       pp.title AS Payroll
                       
                FROM employe_joining ej
                LEFT JOIN payroll p ON ej.payroll_id = p.id
                LEFT JOIN designation d ON ej.designation_id = d.id
                LEFT JOIN users u ON ej.user_id = u.id
                LEFT JOIN (
                    SELECT user_id, MAX(designation_id) AS designation_id_promotion
                    FROM employee_promotion
                    GROUP BY user_id
                ) ep ON ej.user_id = ep.user_id
                LEFT JOIN designation dp ON ep.designation_id_promotion = dp.id
                LEFT JOIN (
                    SELECT ep2.user_id, p2.title
                    FROM employee_promotion ep2
                    JOIN payroll p2 ON ep2.payroll_id = p2.id
                    JOIN (
                        SELECT user_id, MAX(designation_id) AS max_designation_id
                        FROM employee_promotion
                        GROUP BY user_id
                    ) ep_max ON ep2.user_id = ep_max.user_id AND ep2.designation_id = ep_max.max_designation_id
                ) pp ON ej.user_id = pp.user_id
                WHERE ej.user_id = ?
            `;
    
            connection.query(data, [userId], function (error, result) {
                if (error) {
                    console.error('Database query error:', error);
                    res.status(500).send('Error occurred while fetching salary details');
                    return;
                }
                res.send(result);
            });
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).send('Server error');
        }
    },
    



    // employe_list_salary_search: async (req, res) => {
    //     try {
    //         const data = `
    //         SELECT 
    //             salary.*, 
    //             emp_promotion.designation_id, 
    //             designation.designation_name, 
    //             creator.full_name AS created_by_name,
    //             employee.full_name AS employee_name
    //         FROM 
    //             salary 
    //         LEFT JOIN 
    //             employee_promotion emp_promotion
    //         ON 
    //             salary.user_id = emp_promotion.user_id 
    //         LEFT JOIN 
    //             designation 
    //         ON 
    //             emp_promotion.designation_id = designation.id
    //         LEFT JOIN 
    //             users creator
    //         ON 
    //             salary.created_by = creator.id
    //         LEFT JOIN 
    //             users employee
    //         ON 
    //             salary.user_id = employee.id
    //     `;

    //         connection.query(data, function (error, result) {
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

    employe_list_salary_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { designation, month } = req.body;

            // Construct the base SQL query
            let sql = `
            SELECT 
                salary.*, 
                emp_promotion.designation_id, 
                designation.designation_name, 
                creator.full_name AS created_by_name,
                employee.full_name AS employee_name
            FROM 
                salary 
            LEFT JOIN 
                employee_promotion emp_promotion
            ON 
                salary.user_id = emp_promotion.user_id 
            LEFT JOIN 
                designation 
            ON 
                emp_promotion.designation_id = designation.id
            LEFT JOIN 
                users creator
            ON 
                salary.created_by = creator.id
            LEFT JOIN 
                users employee
            ON 
                salary.user_id = employee.id 
            WHERE 1=1`;

            const queryParams = [];

            if (designation) {
                sql += ` AND emp_promotion.designation_id = ?`;
                queryParams.push(designation);
            }
            if (month) {
                sql += ` AND DATE_FORMAT(salary.salary_month, '%Y-%m') = ?`;
                queryParams.push(month);
            }

            console.log("Constructed SQL Query:", sql);
            console.log("Query Parameters:", queryParams);

            // Execute the constructed SQL query
            connection.query(sql, queryParams, (error, results, fields) => {
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

module.exports = SalaryModel