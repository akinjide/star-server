CREATE TABLE topics (
    id INT GENERATED ALWAYS AS IDENTITY,
    supervisor_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(150),
    url TEXT,
    raw_text TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_users FOREIGN_KEY(supervisor_id) REFERENCES users(supervisor_id) ON DELETE CASCADE
);
