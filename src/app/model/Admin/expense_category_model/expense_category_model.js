const connection = require('../../../../connection/config/database')


const expenceCategory = {


    expence_category_create: async (req, res) => {

        const { expense_category_name, created_by } = req.body;
        try {
            const insertQuery = 'INSERT INTO expense_category (expense_category_name, created_by ) VALUES (?, ?)'

            connection.query(
                insertQuery,
                [expense_category_name, created_by],
                (error, result) => {
                    if (!error && result.affectedRows > 0) {
                        console.log(result);
                        return res.send(result);
                    } else {
                        console.log(error || 'Product not found');
                        return res.status(404).json({ message: 'Product not found.' });
                    }
                }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }

    },

    expence_category_list: async (req, res) => {
        // INNER
        try {
            let data = `
            SELECT expense_category.*, 
                   users_created.full_name AS created_by,
                   users_modified.full_name AS modified_by 
            FROM expense_category 
            LEFT JOIN users AS users_created ON expense_category.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON expense_category.modified_by = users_modified.id 
        
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



    material_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
          SELECT material.*, 
                 users_created.full_name AS created_by,
                 users_modified.full_name AS modified_by 
          FROM material 
          INNER JOIN users AS users_created ON material.created_by = users_created.id 
          LEFT JOIN users AS users_modified ON material.modified_by = users_modified.id 
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
module.exports = expenceCategory