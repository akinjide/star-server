CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY,
    role_id INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    image TEXT,
    department VARCHAR(50),
    graduation_year SMALLINT,
    full_name VARCHAR(50) NOT NULL,
    title VARCHAR(20),
    student_number INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_roles FOREIGN KEY(role_id) REFERENCES roles(id)
);

INSERT INTO users(role_id, email, password, department, graduation_year, full_name, title, student_number)
VALUES (1, 'r@akinjide.me', '$2a$10$MgDhMLLRZUEwSFOyWhpD0OujMDLT4gl1mfHzM6sFrmQ3Qlotrj496', 'Computer Engineering', 2025, 'Akinjide Bankole', 'Sys. Admin.', 20801464);
-- password: helloworld1
