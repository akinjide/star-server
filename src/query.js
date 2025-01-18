module.exports = {
    // users.js
    auth: {},
    users: {
        findByEmail: `
            SELECT
                users.full_name,
                users.password,
                users.role_id,
                users.id,
                users.email,
                users.image,
                ARRAY_AGG(permissions.slug) AS permissions
            FROM users
            LEFT JOIN role_permissions ON role_permissions.role_id = users.role_id
            LEFT JOIN permissions ON permissions.id = role_permissions.permission_id
            WHERE users.email = $1
            GROUP BY
                users.full_name,
                users.password,
                users.role_id,
                users.id,
                users.email;
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
                role_id,
                image
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
                image,
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
                image,
                password,
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
        updateOne: `
            UPDATE users
            SET full_name = $2,
                title = $3,
                email = $4,
                password = $5,
                department = $6,
                graduation_year = $7,
                student_number = $8,
                image = $9,
                role_id = $10
            WHERE id = $1;
        `
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
                ARRAY_AGG(permissions.id) AS permissions,
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
                users.title AS supervisor_title
            FROM topics
            LEFT JOIN users ON users.id = topics.supervisor_id;
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
                users.title AS supervisor_title
            FROM topics
            INNER JOIN users ON users.id = topics.supervisor_id
            WHERE topics.id = $1;
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
                projects.course_code AS project_course_code,
                projects.semester AS project_semester,
                projects.year AS project_year,
                projects.presentation_at AS project_presentation_at,
                projects.description AS project_description,
                projects.started_at AS project_started_at,
                projects.ends_at AS project_ends_at,
                projects.submitted_at AS project_submitted_at,
                projects.created_at AS project_created_at,
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                teams.image AS team_image,
                topics.id AS topic_id,
                topics.name AS topic_name,
                topics.description AS topic_description,
                topics.raw_text AS topic_raw_text,
                topics.url AS topic_url,
                users.id AS supervisor_id,
                users.full_name AS supervisor_full_name,
                users.email AS supervisor_email,
                users.title AS supervisor_title
            FROM topics
            LEFT JOIN users ON users.id = topics.supervisor_id
            LEFT JOIN projects ON projects.topic_id = topics.id
            LEFT JOIN teams ON teams.id = projects.team_id;
        `,
        findOne: `
            SELECT
                projects.id AS project_id,
                projects.name AS project_name,
                projects.course_code AS project_course_code,
                projects.semester AS project_semester,
                projects.year AS project_year,
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
                topics.id AS topic_id,
                topics.name AS topic_name,
                topics.description AS topic_description,
                topics.raw_text AS topic_raw_text,
                topics.url AS topic_url,
                users.id AS supervisor_id,
                users.full_name AS supervisor_full_name,
                users.email AS supervisor_email,
                users.title AS supervisor_title
            FROM projects
            INNER JOIN users ON users.id = projects.supervisor_id
            INNER JOIN teams ON teams.id = projects.team_id
            INNER JOIN topics ON topics.id = projects.topic_id
            WHERE projects.id = $1;
        `,
        findOneByTeam: `
            SELECT
                projects.id AS project_id,
                projects.name AS project_name,
                projects.course_code AS project_course_code,
                projects.semester AS project_semester,
                projects.year AS project_year,
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
                topics.id AS topic_id,
                topics.name AS topic_name,
                topics.description AS topic_description,
                topics.raw_text AS topic_raw_text,
                topics.url AS topic_url,
                users.id AS supervisor_id,
                users.full_name AS supervisor_full_name,
                users.email AS supervisor_email,
                users.title AS supervisor_title,
            FROM projects
            INNER JOIN users ON users.id = projects.supervisor_id
            INNER JOIN teams ON teams.id = projects.team_id
            INNER JOIN topics ON topics.id = projects.topic_id
            WHERE projects.team_id = $1;
        `,
        findOneForUpdate: `
            SELECT
                projects.id AS project_id,
                projects.name,
                projects.course_code,
                projects.semester,
                projects.year,
                projects.presentation_at,
                projects.description,
                projects.started_at,
                projects.ends_at,
                projects.submitted_at,
                projects.created_at AS project_created_at,
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                teams.image AS team_image,
                topics.id AS topic_id,
                topics.name AS topic_name,
                topics.description AS topic_description,
                topics.raw_text AS topic_raw_text,
                topics.url AS topic_url,
                users.id AS supervisor_id,
                users.full_name AS supervisor_full_name,
                users.email AS supervisor_email,
                users.title AS supervisor_title
            FROM projects
            INNER JOIN users ON users.id = projects.supervisor_id
            INNER JOIN teams ON teams.id = projects.team_id
            INNER JOIN topics ON topics.id = projects.topic_id
            WHERE projects.id = $1;
        `,
        findOneForDelete: `
            SELECT *
            FROM projects
            WHERE id = $1;
        `,
        findTopicWithSupervisor: `
            SELECT
                topics.id AS topic_id,
                topics.name AS topic_name,
                topics.supervisor_id AS topic_supervisor_id,
                projects.id AS project_id,
                projects.team_id AS project_team_id,
                projects.topic_id AS project_topic_id,
                projects.supervisor_id AS project_supervisor_id,
                projects.name AS project_name,
                users.id AS supervisor_id
            FROM topics
            LEFT JOIN projects ON projects.topic_id = topics.id
            LEFT JOIN users ON users.id = topics.supervisor_id
            WHERE topics.id = $1
            AND topics.supervisor_id = $2;
        `,
        findTopicWithProject: `
            SELECT
                topics.id AS topic_id,
                projects.id AS project_id
            FROM topics
            INNER JOIN projects ON projects.topic_id = topics.id
            WHERE topics.id = $1;
        `,
        create: `
            INSERT INTO projects (
                team_id,
                topic_id,
                supervisor_id,
                name,
                course_code,
                semester,
                year,
                presentation_at,
                description,
                started_at,
                ends_at,
                submitted_at
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `,
        update: `
            UPDATE projects
            SET supervisor_id = $1,
                name = $2,
                course_code = $3,
                semester = $4,
                year = $5,
                presentation_at = $6,
                description = $7,
                started_at = $8,
                ends_at = $9,
                submitted_at = $10,
                updated_at = $11
            WHERE id = $12;
        `,
        delete: `
            DELETE FROM projects
            WHERE id = $1;
        `,
        assign: `
            UPDATE projects
            SET topic_id = $1
                updated_at = $2
            WHERE id = $3;
        `
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
                tasks.comment AS task_comment,
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
        findByUserID: `
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
                tasks.comment AS task_comment,
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
            WHERE tasks.user_id = $1;
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
                tasks.comment AS task_comment,
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
        `,
        findOneForUpdate: `
            SELECT *
            FROM tasks
            WHERE id = $1;
        `,
        create: `
            INSERT INTO tasks(
                project_id,
                user_id,
                team_id,
                name,
                description,
                raw_text,
                assigned_at,
                ends_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `,
        mark: `
            UPDATE tasks
            SET submitted_at = $1,
                updated_at = $1
            WHERE id = $2;
        `,
        update: `
            UPDATE tasks
            SET name = $1,
                raw_text = $2,
                comment = $3,
                description = $4,
                grade = $5,
                ends_at = $6,
                updated_at = $7
            WHERE id = $8
        `,
        deleteOne: `
            DELETE FROM tasks
            WHERE id = $1;
        `,
    },

    // reports.js
    reports: {
        find: `
            SELECT
                reports.id AS report_id,
                reports.name AS report_name,
                reports.raw_text AS report_text,
                reports.comment AS report_comment,
                reports.url AS report_url,
                reports.version AS report_version,
                reports.added_at AS report_added_at,
                projects.id AS project_id,
                projects.name AS project_name,
                projects.course_code AS project_course_code,
                projects.semester AS project_semester,
                projects.year AS project_year,
                projects.presentation_at,
                projects.description AS project_description,
                projects.started_at AS project_started_at,
                projects.ends_at AS project_ends_at,
                projects.submitted_at AS project_submitted_at,
                projects.created_at AS project_created_at,
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                teams.image AS team_image
            FROM reports
            LEFT JOIN projects ON projects.id = reports.project_id
            LEFT JOIN teams ON teams.id = projects.team_id
        `,
        findOne: `
            SELECT
                reports.id AS report_id,
                reports.name AS report_name,
                reports.raw_text AS report_text,
                reports.comment AS report_comment,
                reports.url AS report_url,
                reports.version AS report_version,
                reports.added_at AS report_added_at,
                projects.id AS project_id,
                projects.name AS project_name,
                projects.course_code AS project_course_code,
                projects.semester AS project_semester,
                projects.year AS project_year,
                projects.presentation_at,
                projects.description AS project_description,
                projects.started_at AS project_started_at,
                projects.ends_at AS project_ends_at,
                projects.submitted_at AS project_submitted_at,
                projects.created_at AS project_created_at
            FROM reports
            INNER JOIN projects ON projects.id = reports.project_id
            WHERE reports.id = $1;
        `,
        findWithProject: `
            SELECT
                reports.id AS report_id,
                reports.name AS report_name,
                reports.raw_text AS report_text,
                reports.comment AS report_comment,
                reports.url AS report_url,
                reports.version AS report_version,
                reports.added_at AS report_added_at,
                projects.id AS project_id,
                projects.name AS project_name,
                projects.course_code AS project_course_code,
                projects.semester AS project_semester,
                projects.year AS project_year,
                projects.presentation_at,
                projects.description AS project_description,
                projects.started_at AS project_started_at,
                projects.ends_at AS project_ends_at,
                projects.submitted_at AS project_submitted_at,
                projects.created_at AS project_created_at
            FROM reports
            LEFT JOIN projects ON projects.id = reports.project_id
            WHERE reports.project_id = $1;
        `,
        findWithTeam: `
            SELECT
                reports.id AS report_id,
                reports.name AS report_name,
                reports.raw_text AS report_text,
                reports.comment AS report_comment,
                reports.url AS report_url,
                reports.version AS report_version,
                reports.added_at AS report_added_at,
                projects.id AS project_id,
                projects.name AS project_name,
                projects.course_code AS project_course_code,
                projects.semester AS project_semester,
                projects.year AS project_year,
                projects.presentation_at,
                projects.description AS project_description,
                projects.started_at AS project_started_at,
                projects.ends_at AS project_ends_at,
                projects.submitted_at AS project_submitted_at,
                projects.created_at AS project_created_at,
                teams.id AS team_id,
                teams.name AS team_name,
                teams.description AS team_description,
                teams.image AS team_image
            FROM reports
            INNER JOIN projects ON projects.id = reports.project_id
            INNER JOIN teams ON teams.id = projects.team_id
            WHERE teams.id = $1;
        `,
        findOneForUpdate: `
            SELECT *
            FROM reports
            WHERE id = $1;
        `,
        create: `
            INSERT INTO reports(
                name,
                url,
                raw_text,
                version,
                project_id
            ) VALUES($1, $2, $3, $4, $5)
            RETURNING *;
        `,
        deleteOne: `
            DELETE FROM reports
            WHERE id = $1;
        `,
        update: `
            UPDATE reports
            SET name = $1,
                raw_text = $2,
                comment = $3,
                url = $4
            WHERE id = $5
        `
    },

    // teams.js
    teams: {
        findByName: `
            SELECT *
            FROM teams
            WHERE name = $1;
        `,
        findByMember: `
            SELECT
                members.is_lead,
                teams.*
            FROM members
            LEFT JOIN teams ON teams.id = members.team_id
            WHERE members.member_id = $1;
        `,
        find: `
            SELECT
                teams.id AS id,
                teams.name AS name,
                teams.description AS description,
                teams.image AS image,
                users.id AS supervisor_id,
                users.full_name AS supervisor_full_name,
                users.email AS supervisor_email,
                users.title AS supervisor_title,
                ARRAY_AGG(team_members.member) AS members
            FROM teams
            LEFT JOIN projects ON projects.team_id = teams.id
            LEFT JOIN users on users.id = projects.supervisor_id
            LEFT JOIN (
                SELECT
                    members.team_id,
                    json_build_object(
                        'is_lead', members.is_lead,
                        'member_id', members.member_id,
                        'full_name', users.full_name,
                        'image', users.image,
                        'department', users.department,
                        'student_number', users.student_number,
                        'email', users.email
                    ) AS member
                FROM members
                LEFT JOIN users ON users.id = members.member_id
                GROUP BY
                    members.team_id,
                    members.member_id,
                    members.is_lead,
                    users.full_name,
                    users.image,
                    users.department,
                    users.student_number,
                    users.email
            ) team_members ON team_members.team_id = teams.id
            GROUP BY
                teams.id,
                teams.name,
                teams.description,
                teams.image,
                users.id,
                users.full_name,
                users.email,
                users.title
            ORDER BY teams.name ASC;
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
                updated_at = $4
            WHERE id = $5;
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
                    json_agg(rubrics_score.* ORDER BY rubrics_score.criterion_score DESC) AS scores
                FROM rubrics_score
                GROUP BY rubrics_id
            ) rs ON rs.rubrics_id = rubrics.id
            ORDER BY rubrics.id ASC;
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
            SELECT
                projects.*,
                rs.ev AS evaluations
            FROM projects
            LEFT JOIN (
                SELECT
                    evaluations.project_id,
                    json_agg(evaluations.*) AS ev
                FROM evaluations
                LEFT JOIN rubrics ON rubrics.id = evaluations.rubrics_id
                GROUP BY evaluations.project_id
            ) rs ON rs.project_id = projects.id
        `,
        findOne: `
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
    ai: {},

    // messages.js
    messages: {
        find: `
            SELECT
                messages.*,
                users.full_name AS user_full_name,
                users.image AS user_image
            FROM messages
            LEFT JOIN users ON users.id = messages.user_id
            ORDER BY messages.added_at ASC
        `,
        create: `
            INSERT INTO messages(
                user_id,
                message
            ) VALUES ($1, $2);
        `
    }
}
