PRAGMA foreign_keys = ON;
BEGIN;
INSERT INTO CategoriaLocal VALUES (1,'Sebo'), (2,'Biblioteca pública'), (3,'Livraria'), (4,'Espaço de leitura');
-- Locais, endereços, coordenadas e datas do clube são exemplos fictícios.
INSERT INTO Local VALUES
(1,1,'Sebo Ipê','Rua Exemplo, 10','Centro','Campo Grande','MS','Compra e troca de livros usados.',-20.46,-54.61),
(2,2,'Biblioteca das Letras','Rua Exemplo, 20','Centro','Campo Grande','MS','Biblioteca pública de demonstração.',-20.47,-54.62),
(3,3,'Livraria Horizonte','Rua Exemplo, 30','Amambaí','Campo Grande','MS','Livraria de demonstração.',NULL,NULL),
(4,4,'Espaço de Leitura do Bairro','Rua Exemplo, 40','Amambaí','Campo Grande','MS','Espaço comunitário de leitura.',NULL,NULL);
INSERT INTO Pais VALUES (1,'França'), (2,'Brasil'), (3,'Colômbia'), (4,'Reino Unido'), (5,'Estados Unidos');
INSERT INTO Autor VALUES (1,'Antoine de Saint-Exupéry',1), (2,'Itamar Vieira Junior',2),
(3,'Gabriel García Márquez',3), (4,'Jorge Amado',2), (5,'Jane Austen',4), (6,'Frank Herbert',5);
INSERT INTO Livro VALUES (1,'O Pequeno Príncipe','Fantasia'), (2,'Torto Arado','Literatura brasileira'),
(3,'Cem Anos de Solidão','Romance'), (4,'Capitães da Areia','Literatura brasileira'),
(5,'Orgulho e Preconceito','Romance'), (6,'Duna','Ficção científica');
INSERT INTO LivroAutor VALUES (1,1),(2,2),(3,3),(4,4),(5,5),(6,6);
INSERT INTO LeituraClube VALUES (1,2,'2026-07-01','2026-07-31'), (2,1,'2026-08-01','2026-08-31'),
(3,4,'2026-09-01','2026-09-30'), (4,3,'2026-10-01','2026-10-31'), (5,6,'2026-11-01',NULL);
COMMIT;
