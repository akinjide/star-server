CREATE TABLE reports (
    id INT GENERATED ALWAYS AS IDENTITY,
    project_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    raw_text TEXT,
    url TEXT,
    version SMALLINT,
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_projects FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
);
