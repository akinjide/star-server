CREATE TABLE messages (
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    message TEXT,
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id)
);
