const connection = require('../../../../connection/config/database')


const supplierModel = {


    supplier_address_list: async (req, res) => {
        try {
            const data = "select * from  supplier_address";

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

    supplier_address_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM supplier_address WHERE id = ?';
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




    supplier_address_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM supplier_address WHERE id = ?';
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


    supplier_due_amount: async (req, res) => {
        try {
            const supplier_id = req.params.supplier_id;
    
            // Query to retrieve the sum of due and paid amounts for the provided supplier_id
            const sql = "SELECT supplier_id, SUM(payable_amount) AS payable_amount,  SUM(paid_amount) AS paid_amount FROM expense WHERE supplier_id = ?";
    
            connection.query(sql, [supplier_id], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
    
                // Check if any record was found
                if (result.length === 0) {
                    return res.status(404).json({ message: 'No data found for the provided supplier_id' });
                }
    
                // Send the result as JSON response
                res.json(result[0]);
            });
        } catch (error) {
            console.log(error);
        }
    },
    






}
module.exports = supplierModel