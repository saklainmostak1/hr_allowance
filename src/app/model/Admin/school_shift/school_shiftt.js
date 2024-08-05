const connection = require('../../../../connection/config/database')


const SchoolShift = {

    school_shiftt_create: async (req, res) => {
        try {
            const { name, start_time, late_time, end_time, early_end_time, created_by } = req.body;
    
            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO school_shift (name, start_time, late_time, end_time, early_end_time, created_by) VALUES (?, ?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [name, start_time, late_time, end_time, early_end_time, created_by]);
    
            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;
    
            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    school_shift_list: async (req, res) => {
        try {
            const data = "select * from  school_shift";

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

    school_shift_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM school_shift WHERE id = ?';
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


    school_shift_update: async (req, res) => {
        try {

            const { name, start_time, late_time, end_time, early_end_time, modified_by } = req.body;


            const query = `UPDATE school_shift SET   name = ?, start_time = ?, late_time = ?, end_time = ?, early_end_time = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [name, start_time, late_time, end_time, early_end_time, modified_by, req.params.id], (error, result) => {
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


    school_shift_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM school_shift WHERE id = ?';
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


    sub_category_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT sub_category.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM sub_category 
      LEFT JOIN users AS users_created ON sub_category.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON sub_category.modified_by = users_modified.id 
      ORDER BY sub_category.id DESC
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

    



}

module.exports = SchoolShift