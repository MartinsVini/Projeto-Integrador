PRAGMA foreign_keys = ON;
BEGIN;
INSERT INTO Local (id,categoria_id,nome,endereco,bairro,municipio,uf,descricao)
VALUES (100,1,'Sebo Temporário','Rua Exemplo, 100','Centro','Campo Grande','MS','Cadastro demonstrativo.');
SELECT 'Inserção' AS etapa,nome,endereco,bairro FROM Local WHERE id=100 AND bairro='Centro';
UPDATE Local SET bairro='Amambaí' WHERE id=100;
SELECT 'Correção' AS etapa,nome,bairro FROM Local WHERE id=100 AND bairro='Amambaí';
SELECT 'Filtro antigo' AS etapa,count(*) AS encontrados FROM Local WHERE id=100 AND bairro='Centro';
DELETE FROM Local WHERE id=100;
SELECT 'Após remoção' AS etapa,count(*) AS encontrados FROM Local WHERE id=100;
COMMIT;
