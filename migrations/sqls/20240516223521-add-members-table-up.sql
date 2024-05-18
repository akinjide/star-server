CREATE TABLE members (
    id INT GENERATED ALWAYS AS IDENTITY,
    team_id INT NOT NULL,
    member_id INT NOT NULL,
    is_lead BOOLEAN DEFAULT 0,
    added_at TIMESTAMP NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_teams FOREIGN_KEY(team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT fk_users FOREIGN_KEY(member_id) REFERENCES users(member_id) ON DELETE CASCADE
);
