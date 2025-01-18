CREATE TABLE teams (
    id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(400),
    image TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id)
);

INSERT INTO teams (name, description, image)
VALUES  ('Team A', 'Team A will be working on the Online Management Solution for Graduation Project', 'uploads/images/13099629981030824020.png'),
        ('Team B', 'Team B will be working on the Design YouTube project', 'uploads/images/13099629981030824020.png');
