module.exports = {
    // users.js
    auth: {
        find: `
            SELECT
                users.full_name,
                users.password,
                users.id,
                users.email
            FROM users
            WHERE users.email=$1;
        `,
        create: `
            INSERT INTO users(
                full_name,
                title,
                email,
                password,
                department,
                graduation_year,
                student_number,
                role_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `,
        findOne: `
            SELECT *
            FROM users
            WHERE id = $1;
        `,
        deleteOne: `
            DELETE FROM users
            WHERE id = $1;
        `,
    }
}
