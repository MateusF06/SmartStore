# Smart Store — Front-end

## Requisitos
- Navegador atualizado
- Visual Studio Code (recomendado)
- Extensão Live Server (recomendada)

## Como executar
1. Extraia a pasta `sistema-comercio-frontend`.
2. Abra a pasta no VS Code.
3. Clique com o botão direito em `index.html`.
4. Escolha **Open with Live Server**.
5. Entre com qualquer e-mail e senha e selecione o perfil.

Também é possível abrir `index.html` diretamente no navegador, mas o Live Server facilita o desenvolvimento.

## Perfis demonstrativos
- Funcionário: acessa Visão geral, Produtos e Vendas.
- Administrador: acessa também Relatórios.

O login é apenas uma simulação. Não há validação real de credenciais.

## Dados
Os produtos e as vendas são armazenados no `localStorage` do navegador. Para reiniciar os dados de demonstração, abra as ferramentas do desenvolvedor do navegador, vá em Application/Armazenamento > Local Storage e apague as chaves:
- `comercioProducts`
- `comercioSales`
- `comercioUser`

## Estrutura
- `index.html`: login
- `dashboard.html`: visão geral
- `produtos.html`: CRUD demonstrativo de produtos
- `vendas.html`: carrinho e finalização de venda
- `relatorios.html`: resumo de vendas e estoque (administrador)
- `css/style.css`: estilos
- `js/login.js`: simulação de login
- `js/app.js`: navegação, dados e funcionalidades

## Próxima etapa: JSP/Java/MySQL
A versão atual é estática e funciona no navegador. Na integração:
- As páginas poderão ser convertidas para JSP.
- O login deverá ser validado no servidor.
- O CRUD e as vendas deverão usar Servlets/Controllers e classes Java.
- Os dados deverão ser persistidos no MySQL.
- O controle de permissões deverá ser feito no backend, não apenas escondendo links.
