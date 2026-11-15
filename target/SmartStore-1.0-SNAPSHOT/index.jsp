<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>

<c:if test="${param.logout == 'true'}">
    <c:remove var="usuarioNome" scope="session"/>
    <c:remove var="usuarioEmail" scope="session"/>
    <c:remove var="usuarioRole" scope="session"/>
</c:if>

<%
    String metodo = request.getMethod();
    if ("POST".equalsIgnoreCase(metodo)) {
        String email = request.getParameter("email");
        String senha = request.getParameter("password");
        String role = request.getParameter("role");

        if (email != null && !email.trim().isEmpty() && senha != null && !senha.trim().isEmpty()) {
            String nome = email.split("@")[0];
            session.setAttribute("usuarioEmail", email.trim());
            session.setAttribute("usuarioNome", nome);
            session.setAttribute("usuarioRole", role);
            response.sendRedirect("dashboard.jsp");
            return;
        } else {
            request.setAttribute("erroLogin", "Preencha o e-mail e a senha corretamente.");
        }
    }
%>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Smart Store</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="login-page">
    <div class="login-card">
        <div class="brand">
            <span class="brand-mark">C</span>
            <span>Smart<span class="brand-light"> Store</span></span>
        </div>
        <div class="login-heading">
            <h1>Acesso ao Sistema</h1>
            <p>Entre com suas credenciais para gerenciar o comércio.</p>
        </div>

        <form method="POST" action="index.jsp">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" placeholder="seu@email.com" required>

            <label for="password">Senha</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required>

            <label for="role">Perfil de Acesso</label>
            <select id="role" name="role">
                <option value="ADMIN">Administrador</option>
                <option value="FUNC">Funcionário</option>
            </select>

            <c:if test="${not empty requestScope.erroLogin}">
                <div class="form-error"><c:out value="${requestScope.erroLogin}"/></div>
            </c:if>

            <button type="submit" class="btn btn-primary btn-full">Entrar no sistema</button>
        </form>

        <div class="login-hint">
            <strong>Perfis demonstrativos (Autenticação JSP Session):</strong>
            <span>• Funcionário: acessa Visão geral, Produtos e Vendas.</span>
            <span>• Administrador: acessa também Relatórios.</span>
        </div>
    </div>
</body>
</html>