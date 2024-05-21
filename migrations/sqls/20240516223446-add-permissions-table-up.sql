CREATE TABLE permissions (
    id INT GENERATED ALWAYS AS IDENTITY,
    description VARCHAR(400),
    slug VARCHAR(50),
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id)
);

INSERT INTO permissions(id, description, slug)
VALUES  (1, 'Allow user account update', 'update-user');
