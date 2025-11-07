document.addEventListener("DOMContentLoaded", async () => {
  const state    = document.getElementById("watchedState");
  const scroller = document.getElementById("watchedScroller");
  const meta     = document.getElementById("watchedMeta");
  const btnPrev  = document.getElementById("btnPrev");
  const btnNext  = document.getElementById("btnNext");

  if (!state || !scroller) return;

  btnPrev?.addEventListener('click', () => scroller.scrollBy({ left: -Math.floor(scroller.clientWidth*0.9), behavior:'smooth'}));
  btnNext?.addEventListener('click', () => scroller.scrollBy({ left:  Math.floor(scroller.clientWidth*0.9), behavior:'smooth'}));

  async function carregarWatched() {
    try {
      state.hidden = false;
      state.textContent = "Carregando...";
      if (!API.Auth.has()) { location.href = "login.html?redirect=" + encodeURIComponent("watched.html"); return; }
      const obras = await API.Watched.list();
      renderizar(obras || []);
      state.hidden = true;
    } catch (err) {
      console.error(err);
      state.hidden = false;
      state.textContent = "Erro ao carregar assistidos.";
    }
  }

  function toCard(ob) {
    const a = document.createElement('a');
    a.href = `details.html?id=${encodeURIComponent(ob.obraid)}`;
    a.className = 'card card--sm';
    a.innerHTML = `
      <img src="${ob.poster_url || 'assets/placeholder.png'}" alt="${ob.titulo}" class="card__poster" onerror="this.src='assets/placeholder.png'"/>
      <div class="card__title">${ob.titulo}</div>
      <button class="btn btn--sm btn-remove" type="button">Remover</button>
    `;
    a.querySelector('.btn-remove')?.addEventListener('click', async (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      try { await API.Watched.remove(ob.obraid); carregarWatched(); } catch { alert('Erro ao remover'); }
    });
    return a;
  }

  function renderizar(obras) {
    scroller.innerHTML = '';
    if (meta) meta.textContent = obras.length ? `${obras.length} título${obras.length>1?'s':''}` : '';
    if (!obras.length) {
      scroller.innerHTML = `<p>Você ainda não marcou obras como assistidas.</p>`;
      return;
    }
    const frag = document.createDocumentFragment();
    for (const ob of obras) frag.appendChild(toCard(ob));
    scroller.appendChild(frag);
  }

  carregarWatched();
});
