CREATE TABLE reports (
    id INT GENERATED ALWAYS AS IDENTITY,
    project_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    raw_text TEXT,
    url TEXT,
    version SMALLINT,
    added_at TIMESTAMP NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_projects FOREIGN_KEY(project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
);
