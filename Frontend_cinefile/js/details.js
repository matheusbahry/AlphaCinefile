document.addEventListener("DOMContentLoaded", async () => {
  const details = document.getElementById("detailsCard");
  const id = new URLSearchParams(location.search).get("id");

  if (!id) {
    details.textContent = "ID ausente.";
    return;
  }

  try {
    const ob = await API.Obras.get(id);

    details.innerHTML = `
      <h1>${ob.titulo}</h1>
      <img src="${ob.poster_url || "assets/placeholder.jpg"}" class="details__poster"/>
      <p>${ob.descricao || "Sem descrição."}</p>
      <p><strong>Ano:</strong> ${ob.anolancamento || "?"}</p>
      <p><strong>Duração:</strong> ${ob.duracao ? ob.duracao + " min" : "?"}</p>
      <div class="details__actions">
        <button id="btnWatchlist" class="btn">+ Watchlist</button>
        <button id="btnWatched" class="btn">✔ Assistido</button>
      </div>
    `;

    document.getElementById("btnWatchlist").addEventListener("click", async () => {
      if (!API.Auth.has()) { location.href = "login.html?redirect=" + encodeURIComponent(location.pathname + location.search); return; }
      await API.Watchlist.add(id);
      alert("Adicionado à Watchlist!");
    });

    document.getElementById("btnWatched").addEventListener("click", async () => {
      if (!API.Auth.has()) { location.href = "login.html?redirect=" + encodeURIComponent(location.pathname + location.search); return; }
      await API.Watched.add(id);
      alert("Marcado como assistido!");
    });
  } catch (err) {
    console.error(err);
    details.textContent = "Erro ao carregar detalhes.";
  }
});
