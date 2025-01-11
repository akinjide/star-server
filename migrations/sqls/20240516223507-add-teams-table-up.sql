CREATE TABLE teams (
    id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(400),
    image TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id)
);

INSERT INTO teams (name, description)
VALUES  ('Team A', 'Team A will be working on the Online Management Solution for Graduation Project'),
        ('Team B', 'Team B will be working on the Design YouTube project');
