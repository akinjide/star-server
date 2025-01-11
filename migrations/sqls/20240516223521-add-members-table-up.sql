CREATE TABLE members (
    id INT GENERATED ALWAYS AS IDENTITY,
    team_id INT NOT NULL,
    member_id INT NOT NULL,
    is_lead BOOLEAN DEFAULT TRUE,
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_teams FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_users FOREIGN KEY(member_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO members (team_id, member_id, is_lead)
VALUES  (1, 13, true),
        (1, 14, false),
        (1, 15, false),
        (2, 16, true),
        (2, 18, false),
        (2, 19, false);
