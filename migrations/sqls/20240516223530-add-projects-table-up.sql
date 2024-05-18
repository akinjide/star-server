CREATE TABLE projects (
    id INT GENERATED ALWAYS AS IDENTITY,
    team_id INT NOT NULL,
    topic_id INT NOT NULL,
    supervisor_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    course_code VARCHAR(6) NOT NULL,
    presentation_at TIMESTAMP,
    description TEXT,
    started_at TIMESTAMP,
    ends_at TIMESTAMP,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    PRIMARY KEY(id, team_id),
    CONSTRAINT fk_teams FOREIGN_KEY(team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT fk_topics FOREIGN_KEY(topic_id) REFERENCES topics(topic_id),
    CONSTRAINT fk_users FOREIGN_KEY(supervisor_id) REFERENCES users(supervisor_id)
);
