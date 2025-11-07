// js/index.js
// Script principal da página inicial (catálogo)

document.addEventListener("DOMContentLoaded", async () => {
  const catalogState = document.getElementById("catalogState");
  const secaoFilmes = document.querySelector("[aria-label='Filmes'] .row__scroller");
  const secaoSeries = document.querySelector("[aria-label='Séries'] .row__scroller");

  const TMDB_BASE = "https://image.tmdb.org/t/p/w500";

  async function carregarCatalogo() {
    try {
      catalogState.hidden = false;
      catalogState.textContent = "Carregando catálogo...";

      // Buscar filmes e séries do backend (centralizado em API)
      const filmes = await API.Obras.list("FILME");
      const series = await API.Obras.list("SERIE");

      catalogState.hidden = true;

      renderizarSecao(secaoFilmes, filmes);
      renderizarSecao(secaoSeries, series);

    } catch (err) {
      console.error("Erro ao carregar catálogo:", err);
      catalogState.hidden = false;
      catalogState.innerHTML = `<p style="padding:8px;color:#f00">Erro ao carregar catálogo.</p>`;
    }
  }

  function renderizarSecao(container, obras) {
    container.innerHTML = "";

    obras.forEach(ob => {
      // garante URL TMDB válida
      const poster = ob.poster_url?.startsWith("http")
        ? ob.poster_url
        : `${TMDB_BASE}${ob.poster_url || ob.posterPath || ""}`;

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${poster}" alt="${ob.titulo}" class="card__poster" onerror="this.src='assets/placeholder.png'"/>
        <p class="card__title">${ob.titulo}</p>
      `;
      card.addEventListener("click", () => {
        location.href = `details.html?id=${ob.obraid}`;
      });
      container.appendChild(card);
    });
  }

  carregarCatalogo();
});
