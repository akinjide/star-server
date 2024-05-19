CREATE TABLE rubrics (
    id INT GENERATED BY DEFAULT AS IDENTITY,
    section VARCHAR(50) NOT NULL,
    section_percentage SMALLINT,
    criterion VARCHAR(100) NOT NULL,
    criterion_weight SMALLINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id)
);

CREATE TABLE rubrics_score (
    id INT GENERATED BY DEFAULT AS IDENTITY,
    rubrics_id INT NOT NULL,
    description VARCHAR(400),
    criterion_score SMALLINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_rubrics FOREIGN KEY(rubrics_id) REFERENCES rubrics(id)
);


INSERT INTO rubrics(id, section, section_percentage, criterion, criterion_weight)
VALUES  (1, 'Report', 40, 'Organization And Format (Whole Report)', 1),
        (2, 'Report', 40, 'Proper Citations (Whole Report)', 1),
        (3, 'Report', 40, 'Writing and English Quality (Whole Report)', 3),
        (4, 'Report', 40, 'Size Of the Report (Whole Report)', 1),
        (5, 'Report', 40, 'Motivation For the Project (Chapter 1 – Introduction)', 3),
        (6, 'Report', 40, 'Project Planning and Management (chapter 2)', 2),
        (7, 'Report', 40, 'Requirements Analysis (Chapter 3, sections 3.1 and 3.2)', 4),
        (8, 'Report', 40, 'Realistic Constraints (Chapter 3, section 3.3)', 2),
        (9, 'Report', 40, 'Ethical issues (Chapter 3, section 3.4)', 1),
        (10, 'Report', 40, 'System design  (chapter 4)', 5),
        (11, 'Report', 40, 'Implementation (chapter 5, sections 5.1,  5.2, 5.4)', 6),
        (12, 'Report', 40, 'Standards (chapter 5, section 5.3)', 1),
        (13, 'Report', 40, 'Quality Assurance & Quality Control Testing (chapter 6)', 4),
        (14, 'Report', 40, 'User guide for the system (chapter 7)', 2),
        (15, 'Report', 40, 'Description of the solution’s impact in the global, economic, environmental and societal context. (chapter 8- discussion)', 2),
        (16, 'Report', 40, 'References', 1),
        (17, 'Report', 40, 'Appendices', 1),


        (18, 'Cooperation with the supervisor', 10, 'Frequency of interaction with the instructor', 3),
        (19, 'Cooperation with the supervisor', 10, 'Progress reports', 3),
        (20, 'Cooperation with the supervisor', 10, 'Project developed with full cooperation of the supervisor', 4),


        (21, 'Quality and contribution of the project', 30, 'Multi-disciplinary development', 2),
        (22, 'Quality and contribution of the project', 30, 'Contribution of new ideas', 6),
        (23, 'Quality and contribution of the project', 30, 'Implementation quality', 10),
        (24, 'Quality and contribution of the project', 30, 'Use of modern implementation tools', 4),
        (25, 'Quality and contribution of the project', 30, 'Project solves a realistic problem', 8),

        (21, 'Presentation', 20, 'Organization', 2),
        (21, 'Presentation', 20, 'Time usage', 2),
        (21, 'Presentation', 20, 'Quality and relevance of the slides', 4),
        (21, 'Presentation', 20, 'Communication Skills', 4),
        (21, 'Presentation', 20, 'Questions and Answers', 8);


INSERT INTO rubrics_score(id, rubrics_id, description, criterion_score)
VALUES  (1, 1, 'Report follows the format specified for CMSE projects exactly', 4),
        (2, 1, 'Report leaves out 1-2 chapters of the format', 3),
        (3, 1, 'Report leaves out 3-4 chapters of the format', 2),
        (4, 1, 'Report leaves out more than 4 chapters of the format', 1),

        (5, 2, 'Every statement is either original or is properly cited. Cited material is only a small portion of the whole (less than 10%)', 4),
        (6, 2, 'Every statement is either original or is properly cited. Cited material is sizable portion of the whole (between 10 and 30%).', 3),
        (7, 2, 'Most of the statements are original, but there are some quotations that are not properly cited.', 2),
        (8, 2, 'Most of the report is copied from some source, without proper citation.', 1),

        (9, 3, 'No errors in sentence structure and word usage. No spelling mistakes.', 4),
        (10, 3, 'Almost no errors in sentence structure and word usage. Very few spelling mistakes.', 3),
        (11, 3, 'Many errors in sentence structure and word usage. Many spelling mistakes.', 2),
        (12, 3, 'Numerous and distracting errors in sentence structure and word usage.', 1),

        (13, 4, '>30 pages', 4),
        (14, 4, '20-29 pages', 3),
        (15, 4, '10-19 pages', 2),
        (16, 4, '<10 pages', 1),

        (17, 5, 'The motivation for the project, general background for the project, why it is needed are explained well.', 4),
        (18, 5, 'The motivation for the project, general background for the project, why it is needed are explained but some important aspects are left out.', 3),
        (19, 5, 'The motivation for the project, general background for the project, why it is needed are explained poorly.', 2),
        (20, 5, 'The motivation for the project, general background for the project, why it is needed are not explained at all.', 1),

        (21, 6, '13-16 of the items on the Project Planning & Management Checklist have been done.', 4),
        (22, 6, '9-12 of the items on the Project Planning & Management Checklist have been done.', 3),
        (23, 6, '5-8 of the items on the Project Planning & Management Checklist have been done.', 2),
        (24, 6, 'Less than 5 items on the Project Planning & Management Checklist have been done.', 1),

        (25, 7, 'Economic, environmental, social, political, ethical, health and safety, manufacturability, and sustainability constraints that the solution must satisfy are identified', 4),
        (26, 7, 'Most of the economic, environmental, social, political, ethical, health and safety, manufacturability, and sustainability constraints that the solution must satisfy are identified', 3),
        (27, 7, 'Only a few of the economic, environmental, social, political, ethical, health and safety, manufacturability, and sustainability constraints that the solution must satisfy are identified', 2),
        (28, 7, 'None of the economic, environmental, social, political, ethical, health and safety, manufacturability, and sustainability constraints that the solution must satisfy are identified', 1),

        (29, 8, 'All ethical issues relevant to the project have been discussed, including effect on the environment, effect in case system fails to function properly, effects on privacy, impact on employment, possibility of crime (hacking and data theft), protection against malware (viruses etc.), usage of pirated software', 4),
        (30, 8, 'Most ethical issues relevant to the project have been discussed', 3),
        (31, 8, 'Some ethical issues relevant to the project have been discussed', 2),
        (32, 8, 'No discussion of ethical issues', 1),

        (33, 9, 'Both high level and low-level system design (overall architecture, database design in the form of E-R diagrams, Relational Tables, Physical DB Tables, and UML diagrams (e.g. Sequence, Class diagrams, Associations of classes, Context diagrams, Entity-class diagrams for static modelling. State transition diagrams, Communication and/or Sequence diagrams for dynamic modelling, etc.)) are shown in sufficient detail and clarity in the report.', 4),
        (34, 9, 'Both high level and low-level system design (overall architecture, database design in the form of E-R diagrams, Relational Tables, Physical DB Tables, and UML diagrams (e.g. Sequence, Class diagrams, Associations of classes, Context diagrams, Entity-class diagrams for static modelling. State transition diagrams, Communication and/or Sequence diagrams for dynamic modelling, etc.)) are shown, but in not enough detail and clarity in the report.', 3),
        (35, 9, 'Although system design is shown in the report, it is not informative at all.', 2),
        (36, 9, 'No System design is shown in the report.', 1),

        (37, 10, 'Tools, technologies, and platforms used, algorithms developed, as well as the details of the implementation have been described thoroughly and clearly. ', 4),
        (38, 10, 'Tools, technologies, and platforms used, algorithms developed, as well as the details of the implementation have been described at a reasonable level. ', 3),
        (39, 10, 'Tools, technologies, and platforms used, algorithms developed, as well as the details of the implementation have been poorly described. ', 2),
        (40, 10, 'Tools, technologies, and platforms used, algorithms developed, as well as the details of the implementation have not been described at all. ', 1),

        (41, 11, 'There is a discussion of the relevant standards and the degree to which they have been used. ', 4),
        (42, 11, 'Relevant standards are stated, but their utilization is not discussed. ', 3),
        (43, 11, 'Standards that are not truly applicable to the project have been mentioned. ', 2),
        (44, 11, 'There is no mention of standards at all. ', 1),

        (45, 12, 'Includes strategies applied for Quality Assurance & Quality Control activities such as Quality Checks, Audits and Inspections done, Statistical Process Controls Charts, Fishbone diagrams, Test Cases Developed, Test Data Employed, Results of the Testing, as well as corrective actions taken considering these test and inspection results. It is clear that the solution has undergone extensive quality assurance and the necessary tests have been carried out.', 4),
        (46, 12, 'Includes strategies applied for Quality Assurance & Quality Control activities such as Quality Checks, Audits and Inspections done, Statistical Process Controls Charts, Fishbone diagrams, Test Cases Developed, Test Data Employed, Results of the Testing, as well as corrective actions taken considering these test and inspection results. Somewhat incomplete testing of the solution is evident.', 3),
        (47, 12, 'Some testing has been performed, but not enough to permit its use without reservations.', 2),
        (48, 12, 'No testing has been performed, and no results are reported.', 1),

        (49, 13, 'The system with all its functionality is explained clearly and in sufficient detail', 4),
        (50, 13, 'The system with all its functionality is explained, but some explanations are unclear or not in enough detail ', 3),
        (51, 13, 'Only part of system’s functionality is explained, and some are unclear or not in enough detail', 2),
        (52, 13, 'No useful explanation of the system’s functionality is present', 1),

        (53, 14, 'The solution’s impact in the global, economic, environmental, and societal context are analysed and explained thoroughly', 4),
        (54, 14, 'Most of the solution’s impact in the global, economic, environmental, and societal context are analysed and explained ', 3),
        (55, 14, 'Only some of the solution’s impact in the global, economic, environmental, and societal context are analysed and explained', 2),
        (56, 14, 'None of the solution’s impact in the global, economic, environmental, and societal context are analysed and explained', 1),

        (57, 15, 'Includes more than 10 major references ', 4),
        (58, 15, 'Includes 5-10 major references.', 3),
        (59, 15, 'Includes 3-4 major references.', 2),
        (60, 15, 'Includes less than 3 major references.', 1),

        (61, 16, 'Report has at least appendices A and B, Appendix A clearly explains the instructions for installing the system, and appendix B contains all the significant code', 4),
        (62, 16, 'Report has at least appendices A and B, Appendix A poorly explains the instructions for installing the system, or appendix B contains only some of the significant code', 3),
        (63, 16, 'Report leaves out one of appendices A or B.', 2),
        (64, 16, 'Report has no appendices', 1);

