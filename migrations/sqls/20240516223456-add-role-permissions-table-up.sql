CREATE TABLE role_permissions (
    role_id INT GENERATED ALWAYS AS IDENTITY,
    permission_id INT NOT NULL,
    added_at TIMESTAMP NOT NULL,

    PRIMARY KEY(role_id, permission_id),
    CONSTRAINT fk_permissions FOREIGN_KEY(permission_id) REFERENCES permissions(id)
);
