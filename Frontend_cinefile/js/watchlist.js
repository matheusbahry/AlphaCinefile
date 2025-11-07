document.addEventListener("DOMContentLoaded", async () => {
  const state      = document.getElementById("wlState");
  const gridMovies = document.getElementById("wlMovies");
  const gridSeries = document.getElementById("wlSeries");
  const tabMovies  = document.getElementById("tabMovies");
  const tabSeries  = document.getElementById("tabSeries");

  if (!state || !gridMovies || !gridSeries) return;

  function setTab(which) {
    const isMovies = which === "movies";
    tabMovies?.classList.toggle("is-active", isMovies);
    tabSeries?.classList.toggle("is-active", !isMovies);
    gridMovies?.classList.toggle("is-hidden", !isMovies);
    gridSeries?.classList.toggle("is-hidden", isMovies);
  }
  tabMovies?.addEventListener("click", () => setTab("movies"));
  tabSeries?.addEventListener("click", () => setTab("series"));

  async function carregarWatchlist() {
    try {
      state.hidden = false;
      state.textContent = "Carregando...";
      if (!API.Auth.has()) { location.href = "login.html?redirect=" + encodeURIComponent("watchlist.html"); return; }
      const obras = await API.Watchlist.list();
      renderizar(obras || []);
      state.hidden = true;
    } catch (err) {
      console.error(err);
      state.hidden = false;
      state.textContent = "Erro ao carregar watchlist.";
    }
  }

  function toCard(ob) {
    const a = document.createElement("a");
    a.href = `details.html?id=${encodeURIComponent(ob.obraid)}`;
    a.className = "card";
    a.innerHTML = `
      <img src="${ob.poster_url || 'assets/placeholder.png'}" alt="${ob.titulo}" class="card__poster" onerror="this.src='assets/placeholder.png'"/>
      <div class="card__title">${ob.titulo}</div>
      <button class="btn btn--sm btn-remove" type="button">Remover</button>
    `;
    a.querySelector('.btn-remove')?.addEventListener('click', async (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      try { await API.Watchlist.remove(ob.obraid); carregarWatchlist(); } catch { alert('Erro ao remover'); }
    });
    return a;
  }

  function renderizar(obras) {
    gridMovies.innerHTML = "";
    gridSeries.innerHTML = "";

    if (!obras.length) {
      gridMovies.innerHTML = `<p>Nenhuma obra na sua Watchlist ainda.</p>`;
      gridSeries.innerHTML = `<p>Nenhuma obra na sua Watchlist ainda.</p>`;
      return;
    }

    for (const ob of obras) {
      const target = String(ob.tipo).toUpperCase() === 'FILME' ? gridMovies : gridSeries;
      target.appendChild(toCard(ob));
    }
  }

  setTab("movies");
  carregarWatchlist();
});
