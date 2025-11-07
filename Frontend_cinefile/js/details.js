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
      if (!API.Auth.has()) {
        const redirect = (window.API && API.withApi) ? API.withApi("login.html") : "login.html";
        location.href = redirect + (redirect.includes('?') ? '&' : '?') + 'redirect=' + encodeURIComponent(location.pathname + location.search);
        return;
      }
      await API.Watchlist.add(id);
      alert("Adicionado à Watchlist!");
    });

    document.getElementById("btnWatched").addEventListener("click", async () => {
      if (!API.Auth.has()) {
        const redirect = (window.API && API.withApi) ? API.withApi("login.html") : "login.html";
        location.href = redirect + (redirect.includes('?') ? '&' : '?') + 'redirect=' + encodeURIComponent(location.pathname + location.search);
        return;
      }
      await API.Watched.add(id);
      alert("Marcado como assistido!");
    });

    // bloco de avaliação
    try {
      const rate = document.createElement('div');
      rate.id = 'ratingBlock';
      rate.className = 'stars';
      rate.setAttribute('aria-label', 'Avaliar este título');
      rate.innerHTML = '<span class="star" data-v="1">★</span><span class="star" data-v="2">★</span><span class="star" data-v="3">★</span><span class="star" data-v="4">★</span><span class="star" data-v="5">★</span>';
      details.appendChild(rate);
      rate.querySelectorAll('.star').forEach(el => {
        el.addEventListener('click', async () => {
          const nota = Number(el.getAttribute('data-v')) || 0;
          if (!API.Auth.has()) {
            const redirect = (window.API && API.withApi) ? API.withApi('login.html') : 'login.html';
            location.href = redirect + (redirect.includes('?') ? '&' : '?') + 'redirect=' + encodeURIComponent(location.pathname + location.search);
            return;
          }
          try {
            await API.Avaliacoes.create({ obraId: id, nota });
            alert('Avaliação enviada!');
          } catch (e) { console.error(e); alert('Não foi possível enviar sua avaliação.'); }
        }, { passive: true });
      });
    } catch {}
  } catch (err) {
    console.error(err);
    details.textContent = "Erro ao carregar detalhes.";
  }
});
