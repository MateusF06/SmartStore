<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.sql" prefix="sql" %>

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
    <title>Produtos | Smart Store</title>
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
<body data-page="produtos">
<div id="app"></div>
</body>
</html>