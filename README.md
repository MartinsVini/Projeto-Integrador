# Lendo pelo Mundo 

Esta é uma versão didática do projeto, construída principalmente com HTML5 e CSS3.

## Tecnologias

- HTML semântico;
- CSS responsivo;
- JavaScript simples apenas para busca, filtro, lista de leitura e formulário demonstrativo;
- `localStorage` para guardar os livros marcados.

## Como abrir

Abra o arquivo `index.html` diretamente no navegador.


## Escopo

O protótipo web usa o armazenamento local do navegador. O Módulo 3 acrescenta uma atividade independente de banco de dados sobre os locais de leitura e as leituras do clube.

## Banco de dados — SQLite

No Windows, abra o PowerShell na raiz deste repositório. Ambiente validado com Python 3.13.7 e SQLite 3.50.4, incluído no Python.

```powershell
python -X utf8 banco-de-dados/executar.py
python -X utf8 banco-de-dados/testar.py
```

A primeira execução cria um banco em memória, carrega os seis livros do catálogo e quatro locais fictícios, demonstra a manutenção de um sebo e exibe as quatro consultas. Cada execução começa em uma base vazia. Para guardar uma cópia, execute `python -X utf8 banco-de-dados/executar.py --salvar clube.sqlite3` com um nome de arquivo novo.

Consulte o [modelo relacional](banco-de-dados/modelo.md) e o [diagrama](banco-de-dados/modelo.png). Os arquivos SQL numerados de 01 a 04 correspondem ao esquema, aos dados demonstrativos, à manipulação e às consultas. No arquivo 04, altere os valores do filtro de categoria e bairro para pesquisar outro grupo de locais.

### Resultados da demonstração

O Sebo Temporário aparece primeiro no Centro e depois no bairro Amambaí. O filtro antigo retorna zero registros e a consulta após a remoção também retorna zero. Dos quatro locais de exemplo, a Biblioteca das Letras corresponde ao filtro de biblioteca pública no Centro. Ela e o Sebo Ipê possuem coordenadas demonstrativas.

O histórico apresenta quatro leituras concluídas e Duna em andamento. A contagem por país traz Brasil (2), Colômbia (1) e França (1). Os testes também exercitam coautoria e releitura, chaves estrangeiras, unicidade, intervalos de coordenadas e validade das datas. Locais, endereços, coordenadas e leituras são dados fictícios para reprodução da atividade.

