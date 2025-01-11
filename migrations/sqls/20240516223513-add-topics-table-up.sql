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

INSERT INTO topics(supervisor_id, name, description, url)
VALUES  (2, 'Online Management Solution for Graduation Projects', 'In the Computer Engineering (Turkish and English) and Software Engineering programs within the department, the "Graduation Project" courses are integral to the fourth year of study. Effective planning and management are crucial for the success of these projects.', 'uploads/documents/CERGUN.pdf'),
        (3, 'Design YouTube', 'In this project, you are asked to design YouTube. The solution to this question can be applied to other interview questions like designing a video sharing platform such as Netflix and Hulu.', 'uploads/documents/GOZ.pdf'),
        (4, 'A WEB BASED SOFTWARE SYSTEM USING A DATABASE', 'The aim of this project will be to allow senior level students in software or computer engineering students top apply the knowledge they have acquired in their junior level courses such as programming languages, databases, web development, system analysis and design and develop a full software system meeting the needs of an organization.', 'uploads/documents/EVAROGLU.docx'),
        (5, 'Redundancy Systems for Warehouse-Scale Computing', 'Availability of warehouse-scale computing is critical for building large-scale Web services. Responsiveness of these services requires software-based latency variability mitigation techniques. To this end, a dispatcher can be employed to create multiple copies (also called replicas) of the jobs and send these replicas to different servers.', 'uploads/documents/DARIFLER.docx'),
        (6, 'Home Automation System', 'Home automation is the automatic control of electronic devices at your home. These devices are connected to the Internet, which allows them to be controlled remotely. With home automation, devices can trigger one another so you don’t have to control them manually. Instead, you can do the control via an app or voice assistant.', 'uploads/documents/MSALAMAH.doc'),
        (7, 'Municipality Smart City Application (A Mobile App for Gazimağusa Municipality)', 'The primary goal is to enhance urban services, efficiency, and citizen engagement through a centralized digital platform.', 'uploads/documents/DCELIKERTUGRUL.docx'),
        (8, 'Design of a Digital Signal Generator', 'A digital signal generator is a device which generates various signals (waveforms) with adjustable amplitude and frequecy. The signal to be generated can be selected by the user. The amplitude and frequency of the signal can be set to the desired values by the user. Digital signals are widely used in many areas in which high precision and accuracy are required.', 'uploads/documents/HKOMURCUGIL.docx'),
        (9, 'Processing images in different formats and sizes', 'The students should develop a software tool that can edit images in different formats. The images must not lose quality, because one of the tasks of the printer is to process the images into posters. To do this, she would like to use content-dependent image distortion as well as a cartoon filter and the possibilities of patch swapping.', 'uploads/documents/MGULER.docx'),
        (10, 'Comparison of Supermarket Prices with a Mobile Application', 'It is a global reality that customers appreciate shopping without hitting their pocket sizes. Therefore, they are looking for solutions that obtain products at a reasonable price and satisfy all their quality requirements. Mobile applications cover every industrial area, and in that project, they are merely set to cover the mobile applications price comparison notion.', 'uploads/documents/OTOYGAR.pdf');
