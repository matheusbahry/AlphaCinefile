window.resolvePoster = function resolvePoster(input) {
  if (!input) return "assets/placeholder-poster.svg";     

  const s = String(input).trim();
                             

  if (/^https?:\/\//i.test(s)) return s;


  if (s.startsWith("/")) return `https://image.tmdb.org/t/p/w342${s}`;

  if (/\.(jpe?g|png|webp)$/i.test(s)) {
    return `https://image.tmdb.org/t/p/w342/${s}`;
  }


  return "assets/placeholder-poster.svg";
};
