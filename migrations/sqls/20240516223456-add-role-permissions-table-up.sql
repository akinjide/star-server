CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    role_slug VARCHAR(50) NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(role_id, permission_id),
    CONSTRAINT fk_permissions FOREIGN KEY(permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);


INSERT INTO role_permissions(role_id, permission_id, role_slug)
VALUES
    (1, 1, 'administrator'),
    (2, 1, 'supervisor'),
    (3, 1, 'committee_member'),
    (4, 1, 'student'),
    (1, 2, ''),
    (2, 2, ''),
    (3, 2, ''),
    (4, 2, ''),
    (1, 3, ''),
    (2, 3, ''),
    (3, 3, ''),
    (4, 3, ''),
    (1, 4, ''),
    (2, 4, ''),
    (3, 4, ''),
    (4, 4, '');
