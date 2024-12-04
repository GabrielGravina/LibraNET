Dúvidas sobre o desenvolvimento do projeto:
[x] 1 - endpoints: Devo filtrar os resultados das requisições no front-end (busco todos os dados e filtro o JSON), ou devo fazer endpoints específicos no backend? 
(Buscar biblioteca por nome, buscar biblioteca por endereço, buscar biblioteca por ...)

[x] 2 - banco de dados: devo criar uma tabela para prateleira e para a reserva? Para prateleira, decidimos que seria melhor criá-la mesmo. Entretanto, para as reservas, julgamos 
ser redundante ter uma tabela empréstimos e outra tabela reservas, já que seriam muito parecidas tanto nos conteúdos quanto no funcionamento.

[x] 3 - segurança: é necessário ter segurança no login? Atualmente, estamos fazendo login de uma forma bem problemática. Não há criação de hashes para senhas,
apenas o banco verifica se a senha do usuário bate com a senha que ele cadastrou.

[x] 4 - trivialidades: quão importante será do sistema ter alguams funcionalidades extras, como por exemplo, funcionar em dispositivos móveis. Irá impactar na avaliação?
E a estilização? Tem problema ser muito simples?

[x] 5 - Um livro de mesmo título pode conter milhares de exemplares. Na maneira atual, cada livro específico tem um ID diferente. Entretanto, o sistema deveria buscar os livros
pelo título. Ou seja, caso o usuário pesquise "Dom Quixote", deverá ser listado se existe ou não algum exemplar disponível ao empréstimo. Entretando, devo criar uma nova tabela
no banco de dados para o exemplar do livro, com relacionamento com a tabela Livro?

[x] Quando o usuário sair, atualizar a página
[x] Quando criar empréstimo, aparecer somente os livros com exemplares disponíveis
[x] Mostrar somente os empréstimos do usuário logado, a não ser que seja adm
[x] Adicionar campo para quantos exemplares serão criados para cada livro criado

[ ] Criar classes de controllers para rotas do backend
[ ] Fazer com que a classe exemplares herde de livros
[ ] Remover console.logs
[ ] O livro quando criado é atribuido apenas a uma biblioteca. Porém, e se ele estiver disponível em várias bibliotecas?
 

---URGENTE---

[ ] Editar BookPage.jsx

---OPCIONAL---
[ ] Criar imagens das capas dos livros 
[ ] Terminar o sistema de geração de relatórios


OBS: CRIAR LIVRO NÃO FUNCIONA COM OS DADOS DO POPULATE_DATA ALTERNATIVO. SOMENTE COM O FETCH DA OPENLIBRARY API.