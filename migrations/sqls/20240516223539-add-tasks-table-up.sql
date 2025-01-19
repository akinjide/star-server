CREATE TABLE tasks (
    id INT GENERATED ALWAYS AS IDENTITY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    team_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    comment TEXT,
    raw_text TEXT,
    grade SMALLINT,
    assigned_at TIMESTAMP,
    ends_at TIMESTAMP,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_projects FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_teams FOREIGN KEY(team_id) REFERENCES teams(id)
);
