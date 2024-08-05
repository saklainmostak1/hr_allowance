

const connection = require('../../../../connection/config/database')


const OfficeVisitModel = {

    office_visit_creates: async (req, res) => {

        try {
            const {
                office_name,
                office_address,
                office_mobile,
                office_email,
                created_by,
                add_office_date,
                user_id,
                remarks_date,
                remarks,
                person_name,
                person_mobile,
                person_email,
                add_person_date
            } = req.body;

           

            // Assuming you have a connection object already defined
            connection.beginTransaction();

            const userQuery = `INSERT INTO office_visit (office_name, office_address, office_mobile, office_email,	created_by,	add_office_date, user_id) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const userParams = [office_name, office_address, office_mobile, office_email,	created_by,	add_office_date, user_id];

            connection.query(userQuery, userParams, async (err, results) => {
                if (err) {
                    console.error(err);
                    await connection.rollback();
                    res.status(500).json({ message: 'User creation failed' });
                    return;
                }

                try {
                    const officeVisit = results.insertId;
                    const employeInfoQuery = `INSERT INTO office_visit_remarks ( office_visit_id, remarks_date,	remarks, created_by, user_id) VALUES (?, ?, ?, ?, ?)`;
                    const employeInfoParams = [officeVisit, remarks_date, remarks, created_by, user_id];

                    const eduQualificationQuery = `INSERT INTO office_visit_person ( office_visit_id, person_name,	person_mobile, person_email, created_by, add_person_date,	
                    user_id) 
                                                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    const eduQualificationParams = [officeVisit, person_name,	person_mobile, person_email, created_by, add_person_date,	
                        user_id];

                   
                 
                  
                    // Insert into employe_info table
                    await connection.query(employeInfoQuery, employeInfoParams);
                    // Insert into educational_qualification table
                    await connection.query(eduQualificationQuery, eduQualificationParams);
                    // Insert into living_address table
                 

                    // New addition: Insert into employee_promotion table
                    

                    await connection.commit();

                    res.status(200).json({ message: 'User created successfully' });
                } catch (error) {
                    console.error("Error inserting additional data:", error);
                    await connection.rollback();
                    res.status(500).json({ message: "Error inserting additional data." });
                }
            });

        } catch (error) {
            console.error("Error inserting data:", error);
            await connection.rollback();
            res.status(500).json({ message: "Error inserting data." });
        }
    },

  


    // office_visit_list: async (req, res) => {
    //     try {
    //         connection.beginTransaction();
    
    //         const officeVisitQuery = `
    //             SELECT 
    //                 ov.id AS id,
    //                 ov.office_name,
    //                 ov.office_address,
    //                 ov.office_mobile,
    //                 ov.office_email,
    //                 ov.created_by,
    //                 ov.add_office_date,
    //                 ov.user_id,
    //                 ovr.id AS remarks_id,
    //                 ovr.remarks_date,
    //                 ovr.remarks,
    //                 ovr.created_by AS remarks_created_by,
    //                 ovr.user_id AS remarks_user_id,
    //                 ovp.id AS person_id,
    //                 ovp.person_name,
    //                 ovp.person_mobile,
    //                 ovp.person_email,
    //                 ovp.created_by AS person_created_by,
    //                 ovp.add_person_date,
    //                 ovp.user_id AS person_user_id
    //             FROM 
    //                 office_visit ov
    //             LEFT JOIN 
    //                 office_visit_remarks ovr ON ov.id = ovr.office_visit_id
    //             LEFT JOIN 
    //                 office_visit_person ovp ON ov.id = ovp.office_visit_id`;
    
    //         connection.query(officeVisitQuery, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'Error retrieving office visit data' });
    //                 return;
    //             }
    
    //             // Process results into the desired structure
    //             const officeVisits = {};
    
    //             results.forEach(row => {
    //                 if (!officeVisits[row.id]) {
    //                     officeVisits[row.id] = {
    //                         id: row.id,
    //                         office_name: row.office_name,
    //                         office_address: row.office_address,
    //                         office_mobile: row.office_mobile,
    //                         office_email: row.office_email,
    //                         created_by: row.created_by,
    //                         add_office_date: row.add_office_date,
    //                         user_id: row.user_id,
    //                         remarks: [],
    //                         persons: []
    //                     };
    //                 }
    
    //                 if (row.remarks_id) {
    //                     officeVisits[row.id].remarks.push({
    //                         remarks_id: row.remarks_id,
    //                         remarks_date: row.remarks_date,
    //                         remarks: row.remarks,
    //                         remarks_created_by: row.remarks_created_by,
    //                         remarks_user_id: row.remarks_user_id
    //                     });
    //                 }
    
    //                 if (row.person_id) {
    //                     officeVisits[row.id].persons.push({
    //                         person_id: row.person_id,
    //                         person_name: row.person_name,
    //                         person_mobile: row.person_mobile,
    //                         person_email: row.person_email,
    //                         person_created_by: row.person_created_by,
    //                         add_person_date: row.add_person_date,
    //                         person_user_id: row.person_user_id
    //                     });
    //                 }
    //             });
    
    //             await connection.commit();
    
    //             res.status(200).json(Object.values(officeVisits));
    //         });
    //     } catch (error) {
    //         console.error("Error retrieving data:", error);
    //         await connection.rollback();
    //         res.status(500).json({ message: "Error retrieving data." });
    //     }
    // },

    office_visit_list: async (req, res) => {
        try {
            connection.beginTransaction();
    
            const officeVisitQuery = `
                SELECT DISTINCT
                    ov.id AS id,
                    ov.office_name,
                    ov.office_address,
                    ov.office_mobile,
                    ov.office_email,
                    ov.created_by,
                    ov.add_office_date,
                    ov.user_id,
                    ovr.id AS remarks_id,
                    ovr.remarks_date,
                    ovr.remarks,
                    ovr.created_by AS remarks_created_by,
                    ovr.user_id AS remarks_user_id,
                    ovp.id AS person_id,
                    ovp.person_name,
                    ovp.person_mobile,
                    ovp.person_email,
                    ovp.created_by AS person_created_by,
                    ovp.add_person_date,
                    ovp.user_id AS person_user_id
                FROM 
                    office_visit ov
                LEFT JOIN 
                    office_visit_remarks ovr ON ov.id = ovr.office_visit_id
                LEFT JOIN 
                    office_visit_person ovp ON ov.id = ovp.office_visit_id`;
    
            connection.query(officeVisitQuery, async (err, results) => {
                if (err) {
                    console.error(err);
                    await connection.rollback();
                    res.status(500).json({ message: 'Error retrieving office visit data' });
                    return;
                }
    
                // Process results into the desired structure
                const officeVisits = {};
    
                results.forEach(row => {
                    if (!officeVisits[row.id]) {
                        officeVisits[row.id] = {
                            id: row.id,
                            office_name: row.office_name,
                            office_address: row.office_address,
                            office_mobile: row.office_mobile,
                            office_email: row.office_email,
                            created_by: row.created_by,
                            add_office_date: row.add_office_date,
                            user_id: row.user_id,
                            remarks: [],
                            persons: []
                        };
                    }
    
                    // Check if remarks_id is already added
                    const existingRemark = officeVisits[row.id].remarks.find(r => r.remarks_id === row.remarks_id);
                    if (!existingRemark && row.remarks_id) {
                        officeVisits[row.id].remarks.push({
                            remarks_id: row.remarks_id,
                            remarks_date: row.remarks_date,
                            remarks: row.remarks,
                            remarks_created_by: row.remarks_created_by,
                            remarks_user_id: row.remarks_user_id
                        });
                    }
    
                    // Check if person_id is already added
                    const existingPerson = officeVisits[row.id].persons.find(p => p.person_id === row.person_id);
                    if (!existingPerson && row.person_id) {
                        officeVisits[row.id].persons.push({
                            person_id: row.person_id,
                            person_name: row.person_name,
                            person_mobile: row.person_mobile,
                            person_email: row.person_email,
                            person_created_by: row.person_created_by,
                            add_person_date: row.add_person_date,
                            person_user_id: row.person_user_id
                        });
                    }
                });
    
                await connection.commit();
    
                res.status(200).json(Object.values(officeVisits));
            });
        } catch (error) {
            console.error("Error retrieving data:", error);
            await connection.rollback();
            res.status(500).json({ message: "Error retrieving data." });
        }
    },
    

    office_visit_single: async (req, res) => {
        // const officeVisitId = req.params.id; // assuming id is passed as a URL parameter

        const { id } = req.params; // Assuming id is passed as a route parameter

        try {
            connection.beginTransaction();
    
            const officeVisitQuery = `
                SELECT DISTINCT
                    ov.id AS id,
                    ov.office_name,
                    ov.office_address,
                    ov.office_mobile,
                    ov.office_email,
                    ov.created_by,
                    ov.add_office_date,
                    ov.user_id,
                    ovr.id AS remarks_id,
                    ovr.remarks_date,
                    ovr.remarks,
                    ovr.created_by AS remarks_created_by,
                    ovr.user_id AS remarks_user_id,
                    ovp.id AS person_id,
                    ovp.person_name,
                    ovp.person_mobile,
                    ovp.person_email,
                    ovp.created_by AS person_created_by,
                    ovp.add_person_date,
                    ovp.user_id AS person_user_id
                FROM 
                    office_visit ov
                LEFT JOIN 
                    office_visit_remarks ovr ON ov.id = ovr.office_visit_id
                LEFT JOIN 
                    office_visit_person ovp ON ov.id = ovp.office_visit_id
                WHERE 
                    ov.id = ?`; // Add the WHERE clause to filter by id
    
            connection.query(officeVisitQuery, [id], async (err, results) => {
                if (err) {
                    console.error(err);
                    await connection.rollback();
                    res.status(500).json({ message: 'Error retrieving office visit data' });
                    return;
                }
    
                // Process results into the desired structure
                const officeVisits = {};
    
                results.forEach(row => {
                    if (!officeVisits[row.id]) {
                        officeVisits[row.id] = {
                            id: row.id,
                            office_name: row.office_name,
                            office_address: row.office_address,
                            office_mobile: row.office_mobile,
                            office_email: row.office_email,
                            created_by: row.created_by,
                            add_office_date: row.add_office_date,
                            user_id: row.user_id,
                            remarks: [],
                            persons: []
                        };
                    }
    
                    // Check if remarks_id is already added
                    const existingRemark = officeVisits[row.id].remarks.find(r => r.remarks_id === row.remarks_id);
                    if (!existingRemark && row.remarks_id) {
                        officeVisits[row.id].remarks.push({
                            remarks_id: row.remarks_id,
                            remarks_date: row.remarks_date,
                            remarks: row.remarks,
                            remarks_created_by: row.remarks_created_by,
                            remarks_user_id: row.remarks_user_id
                        });
                    }
    
                    // Check if person_id is already added
                    const existingPerson = officeVisits[row.id].persons.find(p => p.person_id === row.person_id);
                    if (!existingPerson && row.person_id) {
                        officeVisits[row.id].persons.push({
                            person_id: row.person_id,
                            person_name: row.person_name,
                            person_mobile: row.person_mobile,
                            person_email: row.person_email,
                            person_created_by: row.person_created_by,
                            add_person_date: row.add_person_date,
                            person_user_id: row.person_user_id
                        });
                    }
                });
    
                await connection.commit();
    
                res.status(200).json(Object.values(officeVisits));
            });
        } catch (error) {
            console.error("Error retrieving data:", error);
            await connection.rollback();
            res.status(500).json({ message: "Error retrieving data." });
        }
    },


    office_visit_update: async (req, res) => {
        try {

            const { mobile, amount, recharge_user, recharge_time, modified_by } = req.body;


            const query = `UPDATE office_visit SET   mobile = ?, amount = ?, recharge_user = ?, recharge_time= ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [mobile, amount, recharge_user, recharge_time, modified_by, req.params.id], (error, result) => {
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


    office_visit_delete: async (req, res) => {
        try {
            const { id } = req.params;
    
            // Assuming you have a connection object already defined
            connection.beginTransaction();
    
            try {
                // Delete from office_visit_person table
                const deletePersonQuery = `DELETE FROM office_visit_person WHERE office_visit_id = ?`;
                await connection.query(deletePersonQuery, [req.params.id]);
    
                // Delete from office_visit_remarks table
                const deleteRemarksQuery = `DELETE FROM office_visit_remarks WHERE office_visit_id = ?`;
                await connection.query(deleteRemarksQuery, [req.params.id]);
    
                // Delete from office_visit table
                const deleteOfficeVisitQuery = `DELETE FROM office_visit WHERE id = ?`;
                await connection.query(deleteOfficeVisitQuery, [req.params.id]);
    
                await connection.commit();
                res.status(200).json({ message: 'Office visit deleted successfully' });
            } catch (error) {
                console.error("Error deleting data:", error);
                await connection.rollback();
                res.status(500).json({ message: "Error deleting data." });
            }
        } catch (error) {
            console.error("Error processing request:", error);
            await connection.rollback();
            res.status(500).json({ message: "Error processing request." });
        }
    },

    office_visit_remarks_create: async (req, res) => {
        try {
            const { remarks_date, remarks, created_by, user_id, office_visit_id } = req.body;
    
            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO office_visit_remarks (remarks_date, remarks, created_by, user_id, office_visit_id) VALUES (?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [remarks_date, remarks, created_by, user_id, office_visit_id]);
    
            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;
    
            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },

    office_visit_person_create: async (req, res) => {

    
        try {
            const { person_name, person_mobile, person_email, add_person_date, created_by, user_id ,office_visit_id } = req.body;
    
            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO office_visit_person (person_name, person_mobile, person_email, add_person_date, created_by, user_id ,office_visit_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [person_name, person_mobile, person_email, add_person_date, created_by, user_id ,office_visit_id]);
    
            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;
    
            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
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



}

module.exports = OfficeVisitModel