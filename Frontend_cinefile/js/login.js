// js/login.js – POST /api/usuarios/login + persist Basic
document.addEventListener("DOMContentLoaded", () => {
  const form      = document.getElementById("loginForm");
  const inputUser = document.getElementById("username");
  const inputPass = document.getElementById("password");
  const errorMsg  = document.getElementById("loginError");
  const submitBtn = form?.querySelector('[type="submit"]');

  if (!form) return;

  // Se já está logado, volta ao catálogo
  try { if (window.API?.Auth?.has && API.Auth.has()) { location.href = "index.html"; return; } } catch {}

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userRaw = (inputUser?.value || "").trim();
    const passRaw = (inputPass?.value || "").trim();
    if (!userRaw || !passRaw) {
      if (errorMsg) errorMsg.textContent = "Informe usuário/e-mail e senha.";
      return;
    }

    try {
      submitBtn && (submitBtn.disabled = true);
      errorMsg && (errorMsg.textContent = "");

      const resp = await API.Usuarios.login(userRaw, passRaw);
      // resp: { success, username, email, auth }
      if (resp?.auth) {
        API.Auth.setBasic(resp.username, passRaw);
      } else {
        API.Auth.setBasic(userRaw, passRaw); // fallback
      }

      // redireciona
      const redirect = new URLSearchParams(location.search).get("redirect");
      if (redirect) {
        try {
          const url = new URL(decodeURIComponent(redirect), location.origin);
          if (url.origin === location.origin) { location.href = url.pathname + url.search + url.hash; return; }
        } catch {}
      }
      location.href = "index.html";
    } catch (err) {
      console.error(err);
      if (errorMsg) errorMsg.textContent = (err?.status === 401) ? "Credenciais inválidas." : "Falha ao autenticar.";
      else alert("Falha ao autenticar.");
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
});
