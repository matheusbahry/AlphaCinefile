// js/profile.js – perfil fake (decodifica Basic) + últimos avaliados do localStorage
document.addEventListener("DOMContentLoaded", async () => {
  if (!API.Auth.has()) { location.href = "login.html?redirect=" + encodeURIComponent("profile.html"); return; }

  const nameEl   = document.getElementById("profileName");
  const avatarEl = document.getElementById("profileAvatar");
  const scroller = document.getElementById("pfScroller");
  const metaEl   = document.getElementById("pfLastMeta");

  // username a partir do Basic
  let username = "usuario";
  try {
    const basic = API.Auth.get();
    const decoded = atob(String(basic).replace(/^Basic\s+/i, ""));
    username = decoded.split(":")[0] || "usuario";
  } catch {}
  if (nameEl) nameEl.textContent = "@" + username;

  if (avatarEl) {
    // tenta arquivo, senão fallback texto/sem img
    const saved = localStorage.getItem("cinefile_avatar");
    avatarEl.src = saved || "assets/avatar.png";
    avatarEl.alt = "Avatar do usuário";
    avatarEl.onerror = () => { avatarEl.removeAttribute("src"); avatarEl.alt = "Avatar do usuário"; };
  }

  if (!scroller) return;

  // últimos 8
  const recent = (window.Ratings?.listSortedDesc?.() || []).slice(0, 8);
  if (metaEl) metaEl.textContent = recent.length ? `${recent.length} recente${recent.length>1?'s':''}` : '';
  if (!recent.length) { scroller.innerHTML = `<p class="muted">Sem avaliações recentes.</p>`; return; }

  scroller.innerHTML = "";
  for (const r of recent) {
    try {
      const ob = await API.Obras.get(r.id.replace(/\D/g, "") || r.id);
      const a = document.createElement("a");
      a.href = `details.html?id=${encodeURIComponent(ob?.obraid ?? r.id)}`;
      a.className = "card card--sm";
      a.innerHTML = `
        <img class="card__poster" src="${ob?.poster_url || 'assets/placeholder.png'}" alt="${ob?.titulo || 'Título'}" onerror="this.src='assets/placeholder.png'"/>
        <div class="card__title">${ob?.titulo || 'Título'}</div>
      `;
      scroller.appendChild(a);
    } catch {}
  }
});
