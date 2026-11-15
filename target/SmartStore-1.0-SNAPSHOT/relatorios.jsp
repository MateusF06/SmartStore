<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>

<%
    if (session.getAttribute("usuarioNome") == null) {
        response.sendRedirect("index.jsp");
        return;
    }
%>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatórios | Smart Store</title>
    <link rel="stylesheet" href="css/style.css">
    <script>
        const serverUser = {
            name: "<%= session.getAttribute("usuarioNome") %>",
            email: "<%= session.getAttribute("usuarioEmail") %>",
            role: "<%= session.getAttribute("usuarioRole") %>"
        };
        localStorage.setItem("comercioUser", JSON.stringify(serverUser));
        window.SERVER_USER = serverUser;
    </script>
    <script src="js/app.js" defer></script>
</head>
<body data-page="relatorios">
<c:choose>
    <c:when test="${sessionScope.usuarioRole == 'ADMIN'}">
        <div id="app"></div>
    </c:when>
    <c:otherwise>
        <div class="login-page">
            <div class="login-card" style="text-align: center;">
                <h2 style="color: var(--red);">Acesso Negado (Backend JSP)</h2>
                <p class="muted">Olá, <strong><%= session.getAttribute("usuarioNome") %></strong>. Seu perfil de Funcionário não tem permissão para visualizar relatórios gerenciais.</p>
                <a href="dashboard.jsp" class="btn btn-primary btn-full">Voltar para Visão Geral</a>
            </div>
        </div>
    </c:otherwise>
</c:choose>
</body>
</html>