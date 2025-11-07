/* js/register.js
   Cadastro real (POST /api/usuarios/cadastro)
   + login local automático (Basic Auth)
*/
(function () {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const $  = (id) => document.getElementById(id);
  const err = $("registerError");
  const ok  = $("registerOk");

  // Se já estiver logado, volta pro catálogo
  try { if (API?.Auth?.has && API.Auth.has()) { location.href = "index.html"; return; } } catch {}

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    show(err, ""); hide(err); hide(ok);

    const username = ($("reg_username")?.value || "").trim();
    const email    = ($("reg_email")?.value || "").trim().toLowerCase();
    const pass1    = $("reg_password")?.value || "";
    const pass2    = $("reg_password2")?.value || "";

    if (username.length < 3)  return show(err, "Usuário deve ter pelo menos 3 caracteres.");
    if (!email.includes("@")) return show(err, "Digite um e-mail válido.");
    if (pass1.length < 4)     return show(err, "Senha deve ter pelo menos 4 caracteres.");
    if (pass1 !== pass2)      return show(err, "As senhas não coincidem.");

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn && (submitBtn.disabled = true);

    try {
      const resp = await API.Usuarios.cadastro({ username, email, senha: pass1 });
      // resp: { ok:true, username, email, auth }
      API.Auth.setBasic(username, pass1);

      show(ok, "Conta criada com sucesso. Redirecionando…");
      const params   = new URLSearchParams(location.search);
      const redirect = params.get("redirect");
      const pending  = localStorage.getItem("cinefile_pending_path");

      const target =
        pending
          ? (localStorage.removeItem("cinefile_pending_path"), pending)
          : redirect
            ? safeRedirect(redirect)
            : "index.html";

      setTimeout(() => location.href = target, 600);

    } catch (e) {
      console.error(e);
      const msg = readable(e) || "Não foi possível criar sua conta. Tente novamente.";
      show(err, msg);
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });

  function show(el, msg) { if (!el) return; el.textContent = msg; el.hidden = !msg; }
  function hide(el)      { if (!el) return; el.hidden = true; }
  function safeRedirect(value) {
    try {
      const url = new URL(decodeURIComponent(value), location.origin);
      if (url.origin === location.origin) return url.pathname + url.search + url.hash;
    } catch {}
    return "index.html";
  }
  function readable(err) {
    const text = (err?.body || err?.message || "").toString().toLowerCase();
    if (text.includes("username")) return "Nome de usuário já existe.";
    if (text.includes("email"))    return "E-mail já cadastrado.";
    if (err?.status === 401)       return "Não autorizado.";
    if (err?.status === 409)       return "Usuário ou e-mail já cadastrado.";
    if (err?.status === 400)       return "Dados inválidos.";
    return "";
  }
})();
