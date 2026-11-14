# Lendo pelo Mundo 

Esta é uma versão didática do projeto, construída principalmente com HTML5 e CSS3.

## Tecnologias

- HTML semântico;
- CSS responsivo;
- JavaScript simples apenas para busca, filtro, lista de leitura e formulário demonstrativo;
- `localStorage` para guardar os livros marcados.

## Como abrir

Abra o arquivo `index.html` diretamente no navegador.

Para manter um endereço local estável, recomendo abrir o PowerShell na pasta e executar:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Acesse <http://127.0.0.1:8000>. Encerre com Ctrl+C. A página não precisa de Node.js; ele é usado apenas para os testes automatizados opcionais.

## Funcionalidades e limites

- Catálogo com seis livros, busca por título ou autor com ou sem acentos e filtro de gênero combinável com a busca. Contador e mensagem vazia acompanham os cartões visíveis.
- Marcação e desmarcação em “Quero ler”, persistidas em `lendo-pelo-mundo-lista` no `localStorage`. A marcação aparece no próprio cartão, sem aba de perfil.
- Formulário **demonstrativo**, com campos obrigatórios. Use dados fictícios. A aplicação não cria contas nem envia ou salva nome/senha; limpa os campos ao fechar.
- Diálogo com foco visível, navegação por Tab/Shift+Tab, fechamento por Escape e retorno do foco ao acionador.
- Links das seções disponíveis também em telas estreitas.
- Mapa **ilustrativo** de espaços de leitura, sem busca geográfica, inventário de livros ou histórico por país integrado à página.

A lista depende do mesmo navegador, perfil e origem (protocolo, endereço e porta). Ela não sincroniza entre dispositivos e pode desaparecer ao limpar os dados ou encerrar uma sessão privada. A abertura por `file://` passou no Chrome avaliado, mas seu armazenamento varia entre navegadores; trocar para o servidor local não transfere a lista anterior.

Listas antigas válidas são aceitas e deduplicadas em memória; a próxima gravação salva o formato sem duplicações. Somente os seis títulos do catálogo são aceitos. JSON inválido, formato inadequado ou título desconhecido fazem a sessão iniciar uma lista temporária vazia com aviso, sem apagar automaticamente o conteúdo anterior. Uma marcação posterior tentará salvar uma nova lista. Se a gravação falhar, a seleção anterior será mantida e o leitor receberá um aviso. Dados locais não constituem um histórico confiável de leituras do clube.

## Testes do Módulo 4

No PowerShell, na raiz do projeto, com **Node.js 20 ou superior**, **Google Chrome instalado** e Python com SQLite 3.37 ou superior:

```powershell
npm.cmd ci --ignore-scripts
npm.cmd test
python -X utf8 testes/banco.py
```

A instalação requer internet. Os testes da página iniciam e encerram seu próprio servidor local e usam perfis descartáveis com dados fictícios, sem alterar seu perfil pessoal. Os resultados, versões, hashes dos arquivos e capturas ficam em `test-results/` (ignorada pelo Git). Se a rede local for bloqueada pelo ambiente, a execução falhará e essa restrição deverá ser resolvida antes de avaliar a aplicação.

O Playwright verifica catálogo, lista, falhas de armazenamento, formulário, teclado e larguras de 1440, 768, 390 e 320 pixels. O script Python registra os quatro testes existentes do banco e a demonstração SQL em uma base nova em memória. Consulte [a avaliação e a rastreabilidade](docs/modulo-4/avaliacao.md) e [as evidências da entrega](docs/modulo-4/evidencias/).

Os resultados valem para o ambiente registrado. Emulação de largura não substitui testes em aparelhos reais ou leitores de tela. A validação de Luiza em 04/11/2026 é uma referência histórica; não houve nova aceitação por usuários nesta etapa. Perfil pessoal e os dois mapas desejados pelo clube continuam fora do MVP.

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

