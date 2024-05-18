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
    originality SMALLINT
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_projects FOREIGN_KEY(project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_users FOREIGN_KEY(evaluator_id) REFERENCES users(evaluator_id),
    CONSTRAINT fk_rubrics FOREIGN_KEY(rubrics_id) REFERENCES rubrics(rubrics_id)
);
