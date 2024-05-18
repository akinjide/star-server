CREATE TABLE permissions (
    id INT GENERATED ALWAYS AS IDENTITY,
    description VARCHAR(400),
    slug VARCHAR(50),
    added_at TIMESTAMP NOT NULL,

    PRIMARY KEY(id)
);
