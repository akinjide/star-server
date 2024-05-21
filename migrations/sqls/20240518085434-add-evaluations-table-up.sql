CREATE TABLE evaluations (
    id INT GENERATED ALWAYS AS IDENTITY,
    project_id INT NOT NULL,
    evaluator_id INT NOT NULL,
    rubrics_id INT NOT NULL,
    name VARCHAR(100),
    score SMALLINT,
    score_weight SMALLINT,
    criterion_score SMALLINT,
    g_total SMALLINT,
    t_total SMALLINT,
    originality SMALLINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_projects FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_users FOREIGN KEY(evaluator_id) REFERENCES users(id),
    CONSTRAINT fk_rubrics FOREIGN KEY(rubrics_id) REFERENCES rubrics(id)
);
