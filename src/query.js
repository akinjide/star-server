module.exports = {
    // users.js
    auth: {

    },
    users: {
        findByEmail: `
            SELECT
                full_name,
                password,
                role_id,
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
            INNER JOIN permissions ON role_permissions.permission_id = permissions.id
            GROUP_BY role_permissions.role_id;
        `,
        findByID: `
            SELECT
                role_permissions.role_id,
                ARRAY_AGG(permissions.id) AS permissions,
            FROM role_permissions
            INNER JOIN permissions ON role_permissions.permission_id = permissions.id
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
            INNER JOIN users ON users.id = topics.supervisor_id;
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
            INNER JOIN users ON users.id = topics.supervisor_id
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
            INNER JOIN users ON users.id = projects.supervisor_id
            INNER JOIN teams ON teams.id = projects.team_id
            INNER JOIN topics ON topics.id = projects.topic_id;
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
            INNER JOIN users ON users.id = projects.supervisor_id
            INNER JOIN teams ON teams.id = projects.team_id
            INNER JOIN topics ON topics.id = projects.topic_id
            WHERE projects.id = $1;
        `,
    },
    tasks: {
        find: `
            SELECT
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                users.id AS user_id,
                users.email AS user_email,
                users.full_name AS user_full_name,
                projects.supervisor_id AS supervisor_id,
                projects.id AS project_id,
                projects.name AS project_name,
                projects.description AS project_description,
                tasks.id AS task_id,
                tasks.name AS task_name,
                tasks.raw_text AS task_raw_text,
                tasks.description AS task_description,
                tasks.grade AS task_grade,
                tasks.assigned_at AS task_assigned_at,
                tasks.ends_at AS task_ends_at,
                tasks.submitted_at AS task_submitted_at,
                tasks.created_at AS task_created_at
            FROM tasks
            INNER JOIN teams ON teams.id = tasks.team_id
            INNER JOIN users ON users.id = tasks.user_id
            INNER JOIN projects ON projects.id = tasks.project_id;
        `,
        findOne: `
            SELECT
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                users.id AS user_id,
                users.email AS user_email,
                users.full_name AS user_full_name,
                projects.supervisor_id AS supervisor_id,
                projects.id AS project_id,
                projects.name AS project_name,
                projects.description AS project_description,
                tasks.id AS task_id,
                tasks.name AS task_name,
                tasks.raw_text AS task_raw_text,
                tasks.description AS task_description,
                tasks.grade AS task_grade,
                tasks.assigned_at AS task_assigned_at,
                tasks.ends_at AS task_ends_at,
                tasks.submitted_at AS task_submitted_at,
                tasks.created_at AS task_created_at
            FROM tasks
            INNER JOIN teams ON teams.id = tasks.team_id
            INNER JOIN users ON users.id = tasks.user_id
            INNER JOIN projects ON projects.id = tasks.project_id
            WHERE tasks.id = $1;
        `
    },

    // teams.js
    teams: {
        findByName: `
            SELECT *
            FROM teams
            WHERE name = $1;
        `,
        find: `
            SELECT
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                teams.image AS team_image,
                ARRAY_AGG(
                    SELECT
                        members.is_lead,
                        users.id,
                        users.full_name,
                        users.email,
                        users.title
                    FROM members
                    INNER JOIN users ON users.id = members.member_id
                    WHERE members.team_id = teams.id
                ) AS team_members
            FROM teams;
        `,
        create: `
            INSERT INTO teams(
                name,
                description,
                image
            ) VALUES($1, $2, $3)
            RETURNING *;
        `,
        findOne: `
            SELECT *
            FROM teams
            WHERE teams.id = $1;
        `,
        findMember: `
            SELECT
                members.is_lead,
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                teams.image AS team_image
            FROM members
            LEFT JOIN teams ON teams.id = members.team_id
            WHERE members.member_id = $1
            AND members.team_id = $2;
        `,
        findMembers: `
            SELECT
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                teams.image AS team_image,
                ARRAY_AGG(
                    SELECT
                        members.is_lead,
                        users.id,
                        users.full_name,
                        users.email,
                        users.title
                    FROM members
                    INNER JOIN users ON users.id = members.member_id
                    WHERE members.team_id = teams.id
                ) AS team_members
            FROM teams
            WHERE teams.id = $1;
        `,
        createMember: `
            INSERT INTO members(
                team_id,
                member_id,
                is_lead
            ) VALUES($1, $2, $3)
            RETURNING *;
        `,
        removeMember: `
            DELETE FROM members
            WHERE team_id = $1 AND member_id = $2;
        `,
        deleteOne: `
            DELETE FROM teams
            WHERE id = $1;
        `,
        update: `
            UPDATE teams
            SET name = $1,
                description = $2,
                image = $3,
            WHERE id = $4;
        `,
    },

    // rubrics.js
    rubrics: {
        find: `
            SELECT
                rubrics.*,
                rs.scores AS rubrics_score
            FROM rubrics
            LEFT JOIN (
                SELECT
                    rubrics_id,
                    json_agg(rubrics_score.*) AS scores
                FROM rubrics_score
                GROUP BY rubrics_id
            ) rs ON rs.rubrics_id = rubrics.id;
        `,
        findOne: `
            SELECT
                rubrics.*,
                rs.scores AS rubrics_score
            FROM rubrics
            LEFT JOIN (
                SELECT
                    rubrics_id,
                    json_agg(rubrics_score.*) AS scores
                FROM rubrics_score
                GROUP BY rubrics_id
            ) rs ON rs.rubrics_id = rubrics.id
            WHERE rubrics_id = $1;
        `,
    },

    // evaluations.js
    evaluations: {
        find: `
            SELECT *
            FROM evaluations
            WHERE id = $1;
        `,
        findByEvaluator: `
            SELECT *
            FROM evaluations
            WHERE evaluator_id = $1;
        `,
        findByProject: `
            SELECT *
            FROM evaluations
            WHERE project_id = $1;
        `,
        create: `
            INSERT INTO evaluations(
                project_id,
                evaluator_id,
                rubrics_id,
                name,
                score,
                is_grade_summary,
                originality
            ) VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        download: `
            SELECT
                evaluations.*,
                rubrics.section AS rubrics_section,
                rubrics.section_percentage AS rubrics_section_percentage,
                rubrics.criterion AS rubrics_criterion,
                rubrics.criterion_weight AS rubrics_criterion_weight,
                rs.scores AS rubrics_score
            FROM evaluations
            LEFT JOIN rubrics ON rubrics.id = evaluations.rubrics_id
            LEFT JOIN (
                SELECT
                    rubrics_id,
                    json_agg(rubrics_score.*) AS scores
                FROM rubrics_score
                GROUP BY rubrics_id
            ) rs ON rs.rubrics_id = rubrics.id
            WHERE evaluations.project_id = $1;
        `
    },

    // ai.js
    ai: {}
}
