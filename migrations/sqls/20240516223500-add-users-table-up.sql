CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY,
    role_id INT NOT NULL,
    email VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    department VARCHAR(50),
    graduation_year SMALLINT,
    full_name VARCHAR(50) NOT NULL,
    title VARCHAR(20),
    student_number INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_role_permissions FOREIGN_KEY(role_id) REFERENCES role_permissions(role_id)
);