CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    description VARCHAR(400),
    slug VARCHAR(50),
    added_at TIMESTAMP NOT NULL
);
