// js/fix-posters.js
// Não altera layout. Só arruma SRC das imagens e aplica fallback.

(function () {
  const PLACEHOLDER = "assets/placeholder.png";
  const TMDB_BASE = "https://image.tmdb.org/t/p";
  const TMDB_SIZE = "w342"; // mantém o grid levinho

  // Monta URL TMDB se veio apenas o poster_path
  function tmdbUrl(path) {
    if (!path) return null;
    // evita duplicar base se já vier completo
    if (typeof path === "string" && path.startsWith("http")) return path;
    return `${TMDB_BASE}/${TMDB_SIZE}${path}`;
  }

  // tenta obter a melhor fonte do objeto de dados preso no elemento (se existir)
  function bestFromData(data) {
    if (!data) return null;
    // nomes mais comuns nos nossos mocks/APIs
    return (
      data.poster_url ||
      data.posterUrl ||
      data.poster ||
      data.poster_path ||
      data.posterPath ||
      data.imagem ||
      data.capa ||
      null
    );
  }

  // Aplica fallback onerror e normaliza SRC de todas as imagens de cards
  function fixAllPosters() {
    // tente cobrir as classes/seletores mais usados no projeto
    const imgs = document.querySelectorAll(
      "img.card__poster, img.poster, img[data-poster], .card img, .grid img"
    );

    imgs.forEach((img) => {
      // 1) onerror -> placeholder
      if (!img._fallbackBound) {
        img.addEventListener("error", () => {
          if (img.src !== location.origin + "/" + PLACEHOLDER && !img.src.endsWith(PLACEHOLDER)) {
            img.src = PLACEHOLDER;
          }
        });
        img._fallbackBound = true;
      }

      // 2) se já tiver src http(s) deixa — só garante fallback
      if (img.src && /^https?:\/\//i.test(img.src)) return;

      // 3) procura dados no dataset/data-obra preso no elemento, se houver
      let raw =
        img.dataset.poster ||
        img.getAttribute("data-poster") ||
        bestFromData(img.__obra) || // alguns scripts guardam o objeto aqui
        null;

      // 4) se não achou nada, tenta usar alt como último recurso (muitos mocks guardam o path no alt)
      if (!raw && img.alt && (img.alt.startsWith("/t/") || img.alt.endsWith(".jpg") || img.alt.endsWith(".jpeg") || img.alt.endsWith(".png"))) {
        raw = img.alt;
      }

      // 5) decide URL final
      let finalUrl = null;
      if (raw) {
        // se for um path do tmdb (/abc.jpg) -> monta
        if (typeof raw === "string" && raw.startsWith("/")) {
          finalUrl = tmdbUrl(raw);
        } else if (typeof raw === "string") {
          // se já parece url completa
          finalUrl = raw;
        }
      }

      // 6) aplica; se nada deu, bota placeholder
      img.src = finalUrl || PLACEHOLDER;

      // 7) performance gentil
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.decoding) img.decoding = "async";
    });
  }

  // roda após render inicial e também após pequenas mudanças de DOM (ex: carrossel que injeta cards)
  document.addEventListener("DOMContentLoaded", () => {
    fixAllPosters();

    // observa mutações para consertar imagens que surgem depois
    const obs = new MutationObserver(() => fixAllPosters());
    obs.observe(document.body, { childList: true, subtree: true });
  });
})();
