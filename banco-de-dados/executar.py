"""Execute a atividade em memória. Use --salvar para criar uma cópia em disco."""
import argparse
import sqlite3
from contextlib import closing
from pathlib import Path

PASTA = Path(__file__).resolve().parent


def executar_sql(banco, arquivo, mostrar=True):
    resultados = []
    trecho = ""
    for linha in (PASTA / arquivo).read_text(encoding="utf-8").splitlines(True):
        trecho += linha
        if not sqlite3.complete_statement(trecho):
            continue
        cursor = banco.execute(trecho)
        trecho = ""
        if cursor.description:
            linhas = cursor.fetchall()
            resultados.append(linhas)
            if mostrar:
                print(" | ".join(c[0] for c in cursor.description))
                for valores in linhas:
                    print(" | ".join("—" if v is None else str(v) for v in valores))
                print()
    if trecho.strip():
        raise ValueError(f"Instrução incompleta em {arquivo}")
    return resultados


def preparar(banco):
    banco.execute("PRAGMA foreign_keys = ON")
    executar_sql(banco, "01-esquema.sql")
    executar_sql(banco, "02-dados.sql")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--salvar", type=Path, help="novo arquivo .sqlite3")
    args = parser.parse_args()
    with closing(sqlite3.connect(":memory:")) as banco:
        preparar(banco)
        for arquivo in ("03-manipulacao.sql", "04-consultas.sql"):
            executar_sql(banco, arquivo)
        if args.salvar:
            args.salvar.touch(exist_ok=False)
            try:
                with closing(sqlite3.connect(args.salvar)) as destino:
                    banco.backup(destino)
            except Exception:
                args.salvar.unlink()
                raise
            print(f"Banco salvo em {args.salvar}")


if __name__ == "__main__":
    main()
