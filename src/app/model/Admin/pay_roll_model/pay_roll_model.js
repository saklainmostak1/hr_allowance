const connection = require('../../../../connection/config/database')


const PayRollModel = {

    

    payroll_create: async (req, res) => {
        try {
            const { title, basic, medical, house, convince, tax, notes, total , created_by } = req.body;
    
            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO payroll (title, basic, medical, house, convince, tax, notes, total , created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [title, basic, medical, house, convince, tax, notes, total , created_by]);
    
            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;
    
            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    payroll_list: async (req, res) => {
        try {
            const data = "select * from  payroll";

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

    payroll_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM payroll WHERE id = ?';
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

    payroll_update: async (req, res) => {
        try {
            const { title, basic, medical, house, convince, tax, notes, total, modified_by } = req.body;
    
            const query = `UPDATE payroll SET title = ?, basic = ?, medical = ?, house = ?, convince = ?, tax = ?, notes = ?, total = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [title, basic, medical, house, convince, tax, notes, total, modified_by, req.params.id], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Database error occurred.' });
                }
                if (result.affectedRows > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    return res.status(404).json({ message: 'Payroll record not found.' });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred.' });
        }
    },
    


    payroll_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM payroll WHERE id = ?';
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


 

    



}

module.exports = PayRollModel