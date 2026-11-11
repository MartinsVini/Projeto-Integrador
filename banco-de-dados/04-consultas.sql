-- Ajuste categoria e bairro para consultar outro grupo de locais.
SELECT l.nome, l.endereco, l.bairro, l.descricao
FROM Local AS l JOIN CategoriaLocal AS c ON c.id=l.categoria_id
WHERE c.nome='Biblioteca pública' AND l.bairro='Centro' AND l.municipio='Campo Grande' AND l.uf='MS'
ORDER BY l.nome;

SELECT nome, latitude, longitude FROM Local
WHERE municipio='Campo Grande' AND uf='MS' AND latitude IS NOT NULL AND longitude IS NOT NULL
ORDER BY nome;

SELECT b.titulo, l.inicio, l.conclusao,
       CASE WHEN l.conclusao IS NULL THEN 'Em andamento' ELSE 'Concluída' END AS situacao
FROM LeituraClube AS l JOIN Livro AS b ON b.id=l.livro_id
ORDER BY l.inicio, l.id;

SELECT p.nome AS pais, count(DISTINCT l.id) AS leituras_concluidas
FROM LeituraClube AS l
JOIN LivroAutor AS la ON la.livro_id=l.livro_id
JOIN Autor AS a ON a.id=la.autor_id
JOIN Pais AS p ON p.id=a.pais_id
WHERE l.conclusao IS NOT NULL
GROUP BY p.id, p.nome
ORDER BY leituras_concluidas DESC, p.nome;
