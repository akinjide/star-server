CREATE TABLE tasks (
    id INT GENERATED ALWAYS AS IDENTITY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    team_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description  VARCHAR(150),
    raw_text TEXT,
    grade SMALLINT,
    assigned_at TIMESTAMP,
    ends_at TIMESTAMP,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_projects FOREIGN_KEY(project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_users FOREIGN_KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_teams FOREIGN_KEY(team_id) REFERENCES teams(team_id)
);
