import sqlite3
import unittest

from executar import executar_sql, preparar


class BancoDoClube(unittest.TestCase):
    def setUp(self):
        self.banco = sqlite3.connect(":memory:")
        self.addCleanup(self.banco.close)
        preparar(self.banco)

    def consultas(self):
        return executar_sql(self.banco, "04-consultas.sql", mostrar=False)

    def test_guia_e_historico(self):
        locais, pontos, historico, paises = self.consultas()
        self.assertEqual([l[0] for l in locais], ["Biblioteca das Letras"])
        self.assertEqual([p[0] for p in pontos], ["Biblioteca das Letras", "Sebo Ipê"])
        self.assertEqual(len(historico), 5)
        self.assertEqual(historico[-1][-1], "Em andamento")
        self.assertEqual(dict(paises), {"Brasil": 2, "Colômbia": 1, "França": 1})

    def test_coautoria_e_releitura(self):
        self.banco.execute("INSERT INTO LivroAutor VALUES (2,4)")
        self.banco.execute("INSERT INTO LeituraClube VALUES (6,2,'2026-11-02','2026-11-05')")
        self.assertEqual(dict(self.consultas()[3])["Brasil"], 3)

    def test_manutencao_do_guia(self):
        resultados = executar_sql(self.banco, "03-manipulacao.sql", mostrar=False)
        self.assertEqual(resultados[0][0][-1], "Centro")
        self.assertEqual(resultados[1][0][-1], "Amambaí")
        self.assertEqual(resultados[2:], [[("Filtro antigo", 0)], [("Após remoção", 0)]])
        self.assertEqual(self.banco.execute("SELECT count(*) FROM Local").fetchone(), (4,))

    def test_restricoes(self):
        invalidos = [
            "UPDATE Local SET categoria_id=999 WHERE id=1",
            "INSERT INTO LivroAutor VALUES (1,1)",
            "UPDATE Local SET latitude=NULL WHERE id=1",
            "UPDATE Local SET latitude=91 WHERE id=1",
            "UPDATE Local SET longitude=181 WHERE id=1",
            "UPDATE LeituraClube SET conclusao='2020-01-01' WHERE id=1",
            "UPDATE LeituraClube SET inicio='2026-02-30' WHERE id=1",
            "INSERT INTO CategoriaLocal(nome) VALUES ('Sebo')",
        ]
        for comando in invalidos:
            with self.subTest(comando=comando), self.assertRaises(sqlite3.IntegrityError):
                self.banco.execute(comando)


if __name__ == "__main__":
    unittest.main(verbosity=2)
