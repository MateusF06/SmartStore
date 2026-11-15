document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const error = document.getElementById("loginError");
    if (!email || !password) {
      error.textContent = "Preencha o e-mail e a senha.";
      return;
    }
    localStorage.setItem("comercioUser", JSON.stringify({
      email,
      name: email.split("@")[0],
      role
    }));
    window.location.href = "dashboard.html";
  });
});
