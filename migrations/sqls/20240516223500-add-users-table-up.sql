CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY,
    role_id INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    image TEXT,
    department VARCHAR(100),
    graduation_year SMALLINT,
    full_name VARCHAR(100) NOT NULL,
    title VARCHAR(50),
    student_number INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id),
    CONSTRAINT fk_roles FOREIGN KEY(role_id) REFERENCES roles(id)
);

INSERT INTO users(role_id, email, password, department, graduation_year, full_name, title, student_number, image)
VALUES  (1, 'r@akinjide.me', '$2a$10$MgDhMLLRZUEwSFOyWhpD0OujMDLT4gl1mfHzM6sFrmQ3Qlotrj496', 'Computer Engineering', 2025, 'Akinjide Bankole', 'Sys. Admin.', 20801464, 'uploads/images/13099629981030824019.png'),
        (2, 'cem.ergun@emu.edu.tr', '$2a$10$h2K5oGp5p2HtlccIgxD65eWOIeQR2w6RnupQphfxy5OCUs9IiGazu', 'Computer Engineering', null, 'Cem ERGUN', 'Assist. Prof. Dr.', null, 'uploads/images/17342939430467042857858.jpg'),
        (2, 'gurcu.oz@emu.edu.tr', '$2a$10$QGeE.tIoKOjQIW2tnVTAcOm2fYsp214dX/m9H3nJ03siz4DwW2vh.', 'Computer Engineering', null, 'Gurcu OZ', 'Assoc. Prof. Dr.', null, 'uploads/images/13099629981030824019.png'),
        (2, 'ekrem.varoglu@emu.edu.tr', '$2a$10$DKGidSaPC6IzewfQycBcauLsnU.BITNRG3Rx1CG2qWgH4RGfF797.', 'Computer Engineering', null, 'Ekrem VAROGLU', 'Assoc. Prof. Dr.', null, 'uploads/images/17342939430467042857859.jpg'),
        (2, 'dogu.arifler@emu.edu.tr', '$2a$10$SqFZtYXtYecOS71sNdFro.HBiKhNEijmvrUioJO1tdP5Z1FfaZXem', 'Computer Engineering', null, 'Dogu Arifler', 'Prof. Dr.', null, 'uploads/images/13099629981030824019.png'),
        (2, 'muhammed.salamah@emu.edu.tr', '$2a$10$BeCkaCjGQudv65Od6Uq3z.6297E.DzveJAEiqIN6LdYZe0VHwy4UC', 'Computer Engineering', null, 'Muhammed SALAMAH', 'Assoc. Prof. Dr.', null, 'uploads/images/13099629981030824019.png'),
        (1, 'duygu.celik@emu.edu.tr', '$2a$10$JkzA2.AWFHOTjFdB/8Bu3eHPTYeUSvAHge/7olQjMI8ewVizYYQe.', 'Computer Engineering', null, 'Duygu Çelik Ertuğrul', 'Prof. Dr.', null, 'uploads/images/17342939430467042857857.jpg'),
        (2, 'hasan.komurcugil@emu.edu.tr', '$2a$10$8UINUCrYF3iYypoUy0ww9efUo55XnI9LGssNNz9Q.D1XAG6QbyDTu', 'Computer Engineering', null, 'Hasan Kömürcügil', 'Prof. Dr.', null, 'uploads/images/17342939430467042857861.jpg'),
        (2, 'marifi.guler@emu.edu.tr', '$2a$10$WfrmFL3gBvc.DY9yrFc3AOjz2dpydILJ8iwo/eKYATtq6UMxwX6jm', 'Computer Engineering', null, 'Marifi Güler', 'Prof. Dr.', null, 'uploads/images/17342939430467042857862.jpg'),
        (3, 'onsen.toygar@emu.edu.tr', '$2a$10$5xiR/Wz6jpZhkZRELsao3eT0CbuV/nRfzAH4mm1SrtCRnpqBx9.0i', 'Computer Engineering', null, 'Önsen Toygar', 'Prof. Dr.', null, 'uploads/images/17342939430467042857863.jpg'),
        (3, 'isik.aybay@emu.edu.tr', '$2a$10$GfqpJep4rrjXF4oz0cShyOEalhayH9OqPgp.pIhGrTf/wvT5n6mQm', 'Computer Engineering', null, 'Hadi Işık Aybay', 'Prof. Dr.', null, 'uploads/images/17342939430467042857860.jpg'),
        (3, 'hakan.altincay@emu.edu.tr', '$2a$10$8QS1QC3Qs5nSYiEufDmLreaH9Q9n4gB/qch3OLzUdPNaWuxcfBb9u', 'Computer Engineering', null, 'Hakan ALTINCAY', 'Prof. Dr.', null, 'uploads/images/17342939430467042857864.jpg'),
        (4, '20910539@emu.edu.tr', '$2a$10$SHr5ZLWGFWRpd.HEejZUUO6sfK4Ua2EiobZ1v476q2LuqoumDye5W', 'Computer Engineering', 2025, 'Antoniy Kanu', '', 20910539, 'uploads/images/13099629981030824019.png'),
        (4, '21904987@emu.edu.tr', '$2a$10$/erf6vdGKu.PVuZbJHyaq.QGDELhU362hqk7G2jmc.mh.AHITuQ5e', 'Computer Engineering', 2025, 'Hind Abdalla Ali Abdalla', '', 21904987, 'uploads/images/13099629981030824019.png'),
        (4, '22702500@emu.edu.tr', '$2a$10$Mvxl6JYXaVf6wB04fAPu5uydYcQwqBfm4iiwfw1waqJkQKCshKBUO', 'Computer Engineering', 2025, 'Omer Murtada Mohammedelfatih Ahmed', '', 22702500, 'uploads/images/13099629981030824019.png'),
        (4, '20800910@emu.edu.tr', '$2a$10$kpBPW3POhkUfOl1IEAbdBerk0q1mIJPqEtVY8eLHP8Q0glNlwCM/W', 'Computer Engineering', 2025, 'James Dorbor Jallah JR', '', 20800910, 'uploads/images/13099629981030824019.png'),
        (4, '20801464@emu.edu.tr', '$2a$10$y9x0nSK3umuvFS7JKbN58e2nEcQlW6HD778lL9daymm1gaAAifFoe', 'Computer Engineering', 2025, 'Akinjide Bankole', '', 20801464, 'uploads/images/13099629981030824019.png'),
        (4, '21007760@emu.edu.tr', '$2a$10$vImwP4Gho5yAJqqZZshVA.naY.uUN5Q56yy7IJ4DQhhaCPrNxo1ou', 'Computer Engineering', 2025, 'Oluwatomilola Faith Komolafe', '', 21007760, 'uploads/images/13099629981030824019.png'),
        (4, '20910110@emu.edu.tr', '$2a$10$tEzwo7FG3zLjKhoF4MhM3eo5sOiy7V5ASEPUIZl.ZNweeq7rhVX.u', 'Computer Engineering', 2025, 'Carlos Leonardo Colaco', '', 20910110, 'uploads/images/13099629981030824019.png'),
        (4, '22902271@emu.edu.tr', '$2a$10$UZoL/c9hxRGFWclsSQ21Ouz4FLZ/HFtrmQOsai25plNIZKZ75IJHe', 'Computer Engineering', 2025, 'Adedoyin Angel Adewoye', '', 22902271, 'uploads/images/13099629981030824019.png');


