# Cinefile – Frontend + Backend

Projeto com frontend estático (`Frontend_cinefile/`) e backend Spring Boot (`cinefile_backend/`).

## Executando localmente
- Backend:
  - Java 17+, Maven, PostgreSQL.
  - Copie `cinefile_backend/src/main/resources/application-example.properties` para `application.properties` e ajuste `spring.datasource.*`.
  - `cd cinefile_backend && ./mvnw spring-boot:run` (Windows: `mvnw.cmd`).
- Frontend:
  - Sirva a pasta `Frontend_cinefile/` com um servidor estático (ex.: Live Server do VS Code).
  - Crie `Frontend_cinefile/js/config.js` a partir de `Frontend_cinefile/js/config.example.js` e defina `window.TMDB_API_KEY` se quiser carregar pôsteres do TMDB.

## Integração front/back
- O front usa `js/api.js` para centralizar chamadas ao backend e enviar `Authorization: Basic ...` quando logado.
- Em dev, se aberto via Live Server (porta 5500/qualquer porta local), o front chama o backend em `http://localhost:8080`.
- CORS está centralizado no `SecurityConfig` e permite `localhost:*`/`127.0.0.1:*` em dev.
 - Em produção/Pages: defina `window.API_BASE` em `Frontend_cinefile/js/config.js` ou passe `?api=https://SEU_BACKEND` na URL (ex.: `.../index.html?api=https%3A%2F%2Fseu-backend.com`).

## Publicando no GitHub
- Segredos:
  - `application.properties` está no `.gitignore`.
  - A chave do TMDB deve ir em `Frontend_cinefile/js/config.js` (arquivo ignorado).
- Fluxo típico:
  - `git init && git add . && git commit -m "Cinefile: integração front/back"`
  - `git branch -M main && git remote add origin https://github.com/<user>/<repo>.git`
  - `git push -u origin main`

## Observações
- Se as tabelas estiverem vazias, a home exibirá listas vazias até cadastrar obras.
- Endpoints protegidos exigem Basic Auth; use as páginas de login/cadastro do frontend.

### GitHub Pages (frontend)
- O repositório possui o workflow `.github/workflows/pages.yml` que publica a pasta `Frontend_cinefile/` em `gh-pages`.
- Habilite Pages nas configurações do repositório (Source: GitHub Actions) — o workflow fará o deploy automático em pushes para `main`.
- Para o front falar com seu backend público, use uma das opções:
  - Crie `Frontend_cinefile/js/config.js` com `window.API_BASE = "https://SEU_BACKEND";` (arquivo é ignorado pelo Git) e publique você mesmo o arquivo (ou torne-o público se não contiver segredos), ou
  - Acesse com query param: `.../index.html?api=https%3A%2F%2FSEU_BACKEND`.

Link ao vivo:
- Home (Pages): https://matheusbahry.github.io/AlphaCinefile/index.html
- Com backend Render: https://matheusbahry.github.io/AlphaCinefile/index.html?api=https%3A%2F%2Falpha-cinefile.onrender.com


## Guia Rápido (Equipe)
- URLs do frontend (abra via Live Server):
  - Home: http://localhost:5500/Frontend_cinefile/index.html
  - Detalhes: http://localhost:5500/Frontend_cinefile/details.html?id=1
  - Watchlist: http://localhost:5500/Frontend_cinefile/watchlist.html
  - Assistidos: http://localhost:5500/Frontend_cinefile/watched.html
  - Perfil: http://localhost:5500/Frontend_cinefile/profile.html
  - Login: http://localhost:5500/Frontend_cinefile/login.html
  - Cadastro: http://localhost:5500/Frontend_cinefile/register.html

- Rotas principais do backend (para rápido sanity check):
  - GET http://localhost:8080/api/obras?tipo=FILME
  - GET http://localhost:8080/api/obras?tipo=SERIE
  - GET http://localhost:8080/api/obras/{id}
  - POST http://localhost:8080/api/usuarios/login
    - body: { "usernameOrEmail": "user", "senha": "pass" }
  - POST http://localhost:8080/api/usuarios/cadastro
    - body: { "username": "user", "email": "e@x.com", "senha": "pass" }

- Roteiro de teste em 2 minutos:
  1) Suba o backend (8080). Abra a home do front (Live Server).
  2) Crie uma conta em "Cadastrar" e faça login.
  3) Abra um título em Detalhes e adicione à Watchlist e aos Assistidos.
  4) Confira em /watchlist.html e /watched.html.
  5) Veja o perfil e os últimos avaliados.

- Prints internos (opcional):
  - Salve capturas em `docs/prints/` e referencie aqui se quiser compartilhar com stakeholders.

## Deploy do backend (Render)
Este repositório inclui um `render.yaml` (Blueprint) para deploy 1‑click no Render.

Passos:
- Acesse https://render.com e conecte seu GitHub.
- Clique em New → Blueprint → selecione este repositório.
- Confirme os serviços listados:
  - Web Service `alpha-cinefile` (Java) apontando para `cinefile_backend`.
  - PostgreSQL `alpha-cinefile-db` (free).
- Crie o deploy. O Render criará as variáveis `DB_*` a partir do banco e usará:
  - `java -Dserver.port=$PORT -Dspring.datasource.url=jdbc:postgresql://$DB_HOST:$DB_PORT/$DB_NAME -Dspring.datasource.username=$DB_USER -Dspring.datasource.password=$DB_PASSWORD -jar target/*.jar`
- Aguarde a URL pública (ex.: `https://alpha-cinefile.onrender.com`).

Ligando Pages ao backend público:
- Use a página do GitHub Pages e acrescente `?api=` com a URL do backend codificada:
  - Ex.: `https://matheusbahry.github.io/AlphaCinefile/index.html?api=https%3A%2F%2Falpha-cinefile.onrender.com`
- Alternativa: crie `Frontend_cinefile/js/config.js` com:
  - `window.API_BASE = "https://alpha-cinefile.onrender.com";`
