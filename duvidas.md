Dúvidas sobre o desenvolvimento do projeto:
1 - endpoints: Devo filtrar os resultados das requisições no front-end (busco todos os dados e filtro o JSON), ou devo fazer endpoints específicos no backend? 
(Buscar biblioteca por nome, buscar biblioteca por endereço, buscar biblioteca por ...)

2 - banco de dados: devo criar uma tabela para prateleira e para a reserva? Para prateleira, decidimos que seria melhor criá-la mesmo. Entretanto, para as reservas, julgamos 
ser redundante ter uma tabela empréstimos e outra tabela reservas, já que seriam muito parecidas tanto nos conteúdos quanto no funcionamento.

3 - segurança: é necessário ter segurança no login? Atualmente, estamos fazendo login de uma forma bem problemática. Não há criação de hashes para senhas,
apenas o banco verifica se a senha do usuário bate com a senha que ele cadastrou.

4 - trivialidades: quão importante será do sistema ter alguams funcionalidades extras, como por exemplo, funcionar em dispositivos móveis. Irá impactar na avaliação?
E a estilização? Tem problema ser muito simples?