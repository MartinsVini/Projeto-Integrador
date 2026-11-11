PRAGMA foreign_keys = ON;
BEGIN;
CREATE TABLE CategoriaLocal (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (trim(nome) <> '')
) STRICT;
CREATE TABLE Local (
    id INTEGER PRIMARY KEY,
    categoria_id INTEGER NOT NULL REFERENCES CategoriaLocal(id),
    nome TEXT NOT NULL CHECK (trim(nome) <> ''),
    endereco TEXT NOT NULL CHECK (trim(endereco) <> ''),
    bairro TEXT NOT NULL CHECK (trim(bairro) <> ''),
    municipio TEXT NOT NULL CHECK (trim(municipio) <> ''),
    uf TEXT NOT NULL CHECK (uf GLOB '[A-Z][A-Z]'),
    descricao TEXT NOT NULL CHECK (trim(descricao) <> ''),
    latitude REAL,
    longitude REAL,
    CHECK ((latitude IS NULL AND longitude IS NULL) OR
           (latitude IS NOT NULL AND longitude IS NOT NULL AND
            latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180))
) STRICT;
CREATE TABLE Pais (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (trim(nome) <> '')
) STRICT;
CREATE TABLE Autor (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL CHECK (trim(nome) <> ''),
    pais_id INTEGER NOT NULL REFERENCES Pais(id)
) STRICT;
CREATE TABLE Livro (
    id INTEGER PRIMARY KEY,
    titulo TEXT NOT NULL CHECK (trim(titulo) <> ''),
    genero TEXT NOT NULL CHECK (trim(genero) <> '')
) STRICT;
CREATE TABLE LivroAutor (
    livro_id INTEGER NOT NULL REFERENCES Livro(id),
    autor_id INTEGER NOT NULL REFERENCES Autor(id),
    PRIMARY KEY (livro_id, autor_id)
) STRICT;
CREATE TABLE LeituraClube (
    id INTEGER PRIMARY KEY,
    livro_id INTEGER NOT NULL REFERENCES Livro(id),
    inicio TEXT NOT NULL CHECK (length(inicio) = 10 AND date(inicio, '+0 days') IS inicio),
    conclusao TEXT CHECK (conclusao IS NULL OR
        (length(conclusao) = 10 AND date(conclusao, '+0 days') IS conclusao AND conclusao >= inicio))
) STRICT;
COMMIT;
