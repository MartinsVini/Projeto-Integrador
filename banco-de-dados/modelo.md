# Modelo relacional do Lendo pelo Mundo

O guia usa endereço e categoria para localizar espaços de leitura. Livros e autores fazem parte do histórico do clube. Cada leitura representa uma ocasião, inclusive quando o clube relê uma obra. Cada autor tem um país de referência.

```mermaid
erDiagram
    CategoriaLocal ||--o{ Local : classifica
    Pais ||--o{ Autor : representa
    Autor ||--o{ LivroAutor : assina
    Livro ||--o{ LivroAutor : possui
    Livro ||--o{ LeituraClube : participa
    CategoriaLocal {
        integer id PK
        text nome UK
    }
    Local {
        integer id PK
        integer categoria_id FK
        text nome
        text endereco
        text bairro
        text municipio
        text uf
        text descricao
        real latitude
        real longitude
    }
    Pais {
        integer id PK
        text nome UK
    }
    Autor {
        integer id PK
        text nome
        integer pais_id FK
    }
    Livro {
        integer id PK
        text titulo
        text genero
    }
    LivroAutor {
        integer livro_id PK,FK
        integer autor_id PK,FK
    }
    LeituraClube {
        integer id PK
        integer livro_id FK
        text inicio
        text conclusao
    }
```

Coordenadas são opcionais em par. A ausência da data de conclusão identifica uma leitura em andamento. A contagem por país usa o identificador da leitura, o que preserva releituras e evita duplicação por coautores do mesmo país.
