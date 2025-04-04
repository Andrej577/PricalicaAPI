CREATE TABLE korisnici (
    korisnik_id SERIAL PRIMARY KEY,
    ime VARCHAR(50) NOT NULL,
    prezime VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    lozinka_hash VARCHAR(255) NOT NULL,
    tip_korisnika VARCHAR(10) CHECK (tip_korisnika IN ('user', 'autor', 'admin')),
    datum_registracije TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_racuna VARCHAR(10) CHECK (status_racuna IN ('aktivan', 'neaktivan')),
    ima_pretplatu BOOLEAN NOT NULL DEFAULT FALSE,
    iznos_prihoda NUMERIC(10, 2) DEFAULT 0.00
);

INSERT INTO korisnici (ime, prezime, email, lozinka_hash, tip_korisnika, status_racuna, ima_pretplatu, iznos_prihoda)
VALUES
('Ivan', 'Horvat', 'ivan.horvat@example.com', 'hashedpassword1', 'autor', 'aktivan', TRUE, 500.00),
('Marko', 'Maric', 'marko.maric@example.com', 'hashedpassword2', 'autor', 'aktivan', TRUE, 1200.50),
('Ana', 'Peric', 'ana.peric@example.com', 'hashedpassword3', 'user', 'neaktivan', FALSE, 0.00),
('Petar', 'Ivic', 'petar.ivic@example.com', 'hashedpassword4', 'admin', 'aktivan', TRUE, 0.00);