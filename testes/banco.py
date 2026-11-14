"""Registra a execução dos quatro testes existentes e da demonstração SQL."""
import datetime
import hashlib
import json
import os
from pathlib import Path
import sqlite3
import subprocess
import sys

raiz = Path(__file__).resolve().parent.parent
destino = raiz / os.environ.get("EVIDENCIAS_DIR", "test-results")
destino.mkdir(parents=True, exist_ok=True)
registro = {
    "data": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "python": sys.version.split()[0],
    "sqlite": sqlite3.sqlite_version,
    "commit": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=raiz, text=True).strip(),
    "sha256": {str(p.relative_to(raiz)): hashlib.sha256(p.read_bytes()).hexdigest()
               for p in sorted((raiz / "banco-de-dados").glob("*")) if p.suffix in (".sql", ".py")},
    "execucoes": [],
}
for arquivo in ("testar.py", "executar.py"):
    comando = [sys.executable, "-X", "utf8", str(raiz / "banco-de-dados" / arquivo)]
    resultado = subprocess.run(comando, cwd=raiz, capture_output=True, text=True, encoding="utf-8")
    registro["execucoes"].append({"arquivo": arquivo, "saida": resultado.stdout + resultado.stderr,
                                "codigo_saida": resultado.returncode})
    print(resultado.stdout + resultado.stderr)
(destino / "sqlite-resultados.json").write_text(json.dumps(registro, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
sys.exit(1 if any(e["codigo_saida"] for e in registro["execucoes"]) else 0)
