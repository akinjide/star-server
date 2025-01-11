CREATE TABLE projects (
    id INT GENERATED ALWAYS AS IDENTITY,
    team_id INT NOT NULL,
    topic_id INT NOT NULL,
    supervisor_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    course_code VARCHAR(8) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    year VARCHAR(4) NOT NULL,
    presentation_at TIMESTAMP,
    description TEXT,
    started_at TIMESTAMP,
    ends_at TIMESTAMP,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_teams FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_topics FOREIGN KEY(topic_id) REFERENCES topics(id),
    CONSTRAINT fk_users FOREIGN KEY(supervisor_id) REFERENCES users(id)
);

INSERT INTO projects(team_id, topic_id, supervisor_id, name, course_code, semester, year, started_at)
VALUES  (1, 1, 2, 'Online Management Solution for Graduation Projects', 'CMSE406', 'Spring', '2025', NOW()),
        (2, 2, 3, 'Design YouTube', 'CMSE406', 'Spring', '2025', NOW());
