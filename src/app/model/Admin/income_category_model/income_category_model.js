const connection = require('../../../../connection/config/database')


const incomeCategory = {


    income_category_create: async (req, res) => {

        const { income_category_name, created_by } = req.body;

        try {
            const insertQuery = 'INSERT INTO income_category (income_category_name, created_by ) VALUES (?, ?)'

            connection.query(insertQuery, [income_category_name, created_by],
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


    income_category_list: async (req, res) => {
        try {
            let data = `
            SELECT income_category.*, 
                   users_created.full_name AS created_by,
                   users_modified.full_name AS modified_by 
            FROM income_category 
            INNER JOIN users AS users_created ON income_category.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON income_category.modified_by = users_modified.id 
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

    income_category_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM income_category WHERE id = ?';
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

    income_category_update: async (req, res) => {
        try {

            const { income_category_name, modified_by } = req.body;

            const query = `UPDATE income_category SET income_category_name = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [income_category_name, modified_by, req.params.id], (error, result) => {
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

    income_category_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM income_category WHERE id = ?';
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
module.exports = incomeCategory