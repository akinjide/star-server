module.exports = {
    // users.js
    users: {
        findByEmail: `
            SELECT
                full_name,
                password,
                id,
                email
            FROM users
            WHERE email = $1;
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
        find: `
            SELECT *
            FROM users
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
    },

    // rbac.js
    permissions: {
        findOne: `
            SELECT *
            FROM permissions
            WHERE id = $1;
        `,
        find: `
            SELECT *
            FROM permissions;
        `,
        create: `
            INSERT INTO permissions(
                description,
                slug
            ) VALUES ($1, $2)
            RETURNING *;
        `,
        findBySug: `
            SELECT *
            FROM permissions
            WHERE slug = $1;
        `
    },
    roles: {
        findOne: `
            SELECT *
            FROM role_permissions
            WHERE role_id = $1 ANd permission_id = $2;
        `,
        create: `
            INSERT INTO role_permissions(
                role_id,
                permission_id,
                role_slug
            ) VALUES ($1, $2, $3)
            RETURNING *;
        `,
    }
}
