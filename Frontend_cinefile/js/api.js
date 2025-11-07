/* js/api.js – cliente HTTP unificado (expõe window.API) */
(() => {
  const baseUrl = (() => {
    // Live Server (5500) -> chama backend em http://localhost:8080
    const isLive = location.port === "5500";
    if (isLive) return "http://localhost:8080";
    // mesma origem em produção
    return location.origin;
  })();

  const STORAGE_KEY = "cinefile_basic_auth";

  const State = {
    get basic() { try { return localStorage.getItem(STORAGE_KEY) || ""; } catch { return ""; } },
    set basic(v) { try { v ? localStorage.setItem(STORAGE_KEY, v) : localStorage.removeItem(STORAGE_KEY); } catch {} }
  };

  function buildHeaders(extra = {}) {
    const h = { "Content-Type": "application/json", ...extra };
    if (State.basic) h["Authorization"] = State.basic;
    return h;
  }

  async function http(path, opts = {}) {
    const base = (typeof window !== 'undefined' && window.API_BASE)
      ? String(window.API_BASE).replace(/\/$/, "")
      : baseUrl;
    const res = await fetch(base + path, { ...opts, headers: buildHeaders(opts.headers || {}) });
    const text = await res.text();
    if (!res.ok) {
      const err = new Error(text || String(res.status));
      err.status = res.status;
      err.body = text;
      throw err;
    }
    try { return JSON.parse(text); } catch { return text; }
  }

  const Auth = {
    has() { return !!State.basic; },
    set(user, pass) { State.basic = "Basic " + btoa(`${user}:${pass}`); },
    setBasic(user, pass) { this.set(user, pass); },
    get() { return State.basic; },
    clear() { State.basic = ""; }
  };

  const Usuarios = {
    // envia { usernameOrEmail, senha } (compatível com AuthController)
    async login(usernameOrEmail, senha) {
      const data = await http("/api/usuarios/login", {
        method: "POST",
        body: JSON.stringify({ usernameOrEmail, senha })
      });
      if (data?.auth) State.basic = data.auth; // já guarda o Basic do back
      return data;
    },
    async cadastro({ username, email, senha }) {
      return http("/api/usuarios/cadastro", {
        method: "POST",
        body: JSON.stringify({ username, email, senha })
      });
    }
  };

  const UsuariosPriv = {
    async me() { return http("/api/usuarios/me"); }
  };

  const Obras = {
    async list(tipo) {
      const q = tipo ? `?tipo=${encodeURIComponent(tipo)}` : "";
      return http(`/api/obras${q}`);
    },
    async get(id) { return http(`/api/obras/${encodeURIComponent(id)}`); }
  };

  const Watchlist = {
    async list() { return http("/api/watchlist"); },
    async add(id) { return http(`/api/watchlist/${encodeURIComponent(id)}`, { method: "POST" }); },
    async remove(id) { return http(`/api/watchlist/${encodeURIComponent(id)}`, { method: "DELETE" }); }
  };

  const Watched = {
    async list() { return http("/api/watched"); },
    async add(id) { return http(`/api/watched/${encodeURIComponent(id)}`, { method: "POST" }); },
    async remove(id) { return http(`/api/watched/${encodeURIComponent(id)}`, { method: "DELETE" }); }
  };

  // expõe global
  window.API = { Auth, Usuarios, UsuariosPriv, Obras, Watchlist, Watched, http };
})();
