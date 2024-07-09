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
            SELECT
                id,
                role_id,
                email,
                department,
                graduation_year,
                full_name,
                title,
                student_number,
                created_at,
                updated_at
            FROM users
        `,
        findOne: `
            SELECT
                id,
                role_id,
                email,
                department,
                graduation_year,
                full_name,
                title,
                student_number,
                created_at,
                updated_at
            FROM users
            WHERE id = $1;
        `,
        deleteOne: `
            DELETE FROM users
            WHERE id = $1;
        `,
        update: `
            UPDATE users
            SET role_id = $2
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
        update: `
            UPDATE permissions
            SET description = $2
            WHERE id = $1;
        `,
        findBySug: `
            SELECT *
            FROM permissions
            WHERE slug = $1;
        `,
        delete: `
            DELETE FROM permissions
            WHERE id = $1;
        `,
    },
    roles: {
        findOne: `
            SELECT *
            FROM role_permissions
            WHERE role_id = $1 AND permission_id = $2;
        `,
        create: `
            INSERT INTO role_permissions(
                role_id,
                permission_id,
                role_slug
            ) VALUES ($1, $2, $3)
            RETURNING *;
        `,
        find: `
            SELECT
                role_permissions.role_id,
                ARRAY_AGG(permissions.id) permissions,
            FROM role_permissions
            INNER JOIN permissions USING (permission_id)
            GROUP_BY role_permissions.role_id;
        `,
        findByID: `
            SELECT
                role_permissions.role_id,
                ARRAY_AGG(permissions.id) permissions,
            FROM role_permissions
            INNER JOIN permissions USING (permission_id)
            WHERE role_id = $1
            GROUP_BY role_permissions.role_id;
        `,
        delete: `
            DELETE FROM role_permissions
            WHERE role_id = $1 AND permission_id = $2;
        `,
        deleteOne: `
            DELETE FROM role_permissions
            WHERE role_id = $1;
        `,
    },

    // topics.js
    topics: {
        find: `
            SELECT
                topics.id AS topic_id,
                topics.name AS topic_name,
                topics.description AS topic_description,
                topics.url AS topic_url,
                topics.raw_text AS topic_raw_text,
                users.id AS supervisor_id,
                users.email AS supervisor_email,
                users.full_name AS supervisor_full_name,
                users.title AS supervisor_title,
            FROM topics
            INNER JOIN users USING (supervisor_id);
        `,
        findOne: `
            SELECT
                topics.id AS topic_id,
                topics.name AS topic_name,
                topics.description AS topic_description,
                topics.url AS topic_url,
                topics.raw_text AS topic_raw_text,
                users.id AS supervisor_id,
                users.email AS supervisor_email,
                users.full_name AS supervisor_full_name,
                users.title AS supervisor_title,
            FROM topics
            INNER JOIN users USING (supervisor_id);
            WHERE topic_id = $1;
        `,
        create: `
            INSERT INTO topics(
                name,
                supervisor_id,
                description,
                url,
                raw_text
            ) VALUES($1, $2, $3, $4, $5)
            RETURNING *;
        `,
        update: `
            UPDATE topics
            SET name = $1,
                url = $2,
                description = $3,
                raw_text = $4,
                updated_at = $5
            WHERE id = $6;
        `,
        delete: `
            DELETE FROM topics
            WHERE id = $1 AND supervisor_id = $2;
        `,
    },

    // projects.js
    projects: {
        find: `
            SELECT
                projects.id AS project_id,
                projects.name AS project_name,
                projects.course_code AS course_code,
                projects.presentation_at,
                projects.description AS project_description,
                projects.started_at AS project_started_at,
                projects.ends_at AS project_ends_at,
                projects.submitted_at AS project_submitted_at,
                projects.created_at AS project_created_at,
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                teams.image AS team_image,
                topics.name AS topic_name,
                topics.description AS topic_description,
                topics.url AS topic_url,
                users.id AS supervisor_id,
                users.full_name AS supervisor_full_name,
                users.email AS supervisor_email,
                users.title AS supervisor_title,
            FROM projects
            INNER JOIN users USING (projects.supervisor_id)
            INNER JOIN teams USING (projects.team_id)
            INNER JOIN topics USING (projects.topic_id);
        `,
        findOne: `
            SELECT
                projects.id AS project_id,
                projects.name AS project_name,
                projects.course_code AS course_code,
                projects.presentation_at,
                projects.description AS project_description,
                projects.started_at AS project_started_at,
                projects.ends_at AS project_ends_at,
                projects.submitted_at AS project_submitted_at,
                projects.created_at AS project_created_at,
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                teams.image AS team_image,
                topics.name AS topic_name,
                topics.description AS topic_description,
                topics.url AS topic_url,
                users.id AS supervisor_id,
                users.full_name AS supervisor_full_name,
                users.email AS supervisor_email,
                users.title AS supervisor_title,
            FROM projects
            INNER JOIN users USING (projects.supervisor_id)
            INNER JOIN teams USING (projects.team_id)
            INNER JOIN topics USING (projects.topic_id)
            WHERE projects.id = $1;
        `,
    }
}
