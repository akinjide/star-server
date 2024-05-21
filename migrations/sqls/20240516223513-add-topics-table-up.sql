CREATE TABLE topics (
    id INT GENERATED ALWAYS AS IDENTITY,
    supervisor_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(400),
    url TEXT,
    raw_text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_users FOREIGN KEY(supervisor_id) REFERENCES users(id) ON DELETE CASCADE
);
