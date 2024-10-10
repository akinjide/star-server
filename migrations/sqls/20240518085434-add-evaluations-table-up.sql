CREATE TABLE evaluations (
    id INT GENERATED ALWAYS AS IDENTITY,
    project_id INT NOT NULL,
    evaluator_id INT NOT NULL,
    rubrics_id INT,
    name VARCHAR(500),
    score SMALLINT,
    is_grade_summary BOOLEAN DEFAULT FALSE,
    originality SMALLINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_projects FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_users FOREIGN KEY(evaluator_id) REFERENCES users(id),
    CONSTRAINT fk_rubrics FOREIGN KEY(rubrics_id) REFERENCES rubrics(id)
);
