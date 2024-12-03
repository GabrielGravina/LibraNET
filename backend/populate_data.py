from models import Biblioteca, Livro, Usuario, Emprestimo, Prateleira, Exemplar
from datetime import datetime, timedelta

def populate_data(db):
    # Limpa as tabelas
    db.session.query(Emprestimo).delete()
    db.session.query(Exemplar).delete()
    db.session.query(Livro).delete()
    db.session.query(Usuario).delete()
    db.session.query(Prateleira).delete()
    db.session.query(Biblioteca).delete()
    
    # Criar bibliotecas
    biblioteca1 = Biblioteca(nome="Biblioteca Central", endereco="Rua A, 123")
    biblioteca2 = Biblioteca(nome="Biblioteca Secundária", endereco="Rua B, 456")
    biblioteca3 = Biblioteca(nome="Biblioteca Plaza", endereco="Rua C, 789")
    db.session.add_all([biblioteca1, biblioteca2, biblioteca3])
    db.session.commit()  # Commit após adicionar bibliotecas para gerar os IDs

    # Criar prateleiras associadas às bibliotecas
    prateleira1 = Prateleira(codigo="A1", localizacao="Primeiro andar - Setor A", biblioteca_id=biblioteca1.id)
    prateleira2 = Prateleira(codigo="B2", localizacao="Segundo andar - Setor B", biblioteca_id=biblioteca2.id)
    prateleira3 = Prateleira(codigo="C3", localizacao="Terceiro andar - Setor C", biblioteca_id=biblioteca3.id)
    db.session.add_all([prateleira1, prateleira2, prateleira3])
    db.session.commit()  # Commit após adicionar prateleiras para gerar os IDs

    # Criar usuários com Alice como administradora
    usuarios = [
        Usuario(nome="Alice", cpf="12345678901", senha='123', admin=True),  # Alice definida como admin
        Usuario(nome="Bob", senha="1234", cpf="23456789012"),
        Usuario(nome="Carol", senha="13", cpf="34567890123"),
        Usuario(nome="Daniel", senha="1113", cpf="45678901234"),
        Usuario(nome="Eva", senha="adga23", cpf="56789012345")
    ]
    db.session.add_all(usuarios)
    db.session.commit()  # Commit após adicionar usuários para gerar os IDs

    # Criar livros associados a prateleiras específicas
    livros = [
        Livro(titulo="Livro de Teste 1", autor="Autor 1", prateleira_id=prateleira1.id, biblioteca_id=biblioteca1.id, categoria="Fantasia", ano_publicado="1998"),
        Livro(titulo="Livro de Teste 2", autor="Autor 2", prateleira_id=prateleira2.id, biblioteca_id=biblioteca2.id, categoria="Ação", ano_publicado="2009"),
        Livro(titulo="Game of Thrones", autor="G. R. R. Martin", prateleira_id=prateleira2.id, biblioteca_id=biblioteca2.id, categoria="Ação", ano_publicado="2009"),
        Livro(titulo="Livro de Teste 4", autor="Autor 3", prateleira_id=prateleira3.id, biblioteca_id=biblioteca3.id, categoria="Romance", ano_publicado="2015"),
        Livro(titulo="Livro de Teste 5", autor="Autor 4", prateleira_id=prateleira1.id, biblioteca_id=biblioteca1.id, categoria="Drama", ano_publicado="2020")
    ]
    db.session.add_all(livros)
    db.session.commit()  # Commit após adicionar livros para gerar os IDs

    # Criar exemplares associados aos livros
    exemplares = [
        Exemplar(livro_id=livros[0].id, codigo_inventario="123456", disponivel=True, condicao="Bom", biblioteca_id=biblioteca1.id),
        Exemplar(livro_id=livros[1].id, codigo_inventario="789101", disponivel=True, condicao="Bom", biblioteca_id=biblioteca2.id),
        Exemplar(livro_id=livros[2].id, codigo_inventario="112233", disponivel=True, condicao="Bom", biblioteca_id=biblioteca2.id),
        Exemplar(livro_id=livros[3].id, codigo_inventario="445566", disponivel=True, condicao="Bom", biblioteca_id=biblioteca3.id),
        Exemplar(livro_id=livros[4].id, codigo_inventario="778899", disponivel=True, condicao="Bom", biblioteca_id=biblioteca1.id)
    ]

    for exemplar in exemplares:
        print(exemplar.livro_id)
    db.session.add_all(exemplares)
    db.session.commit()  # Commit para salvar os exemplares no banco de dados

    # Criar empréstimos
    emprestimos = [
        Emprestimo(livro_id=livros[0].id, exemplar_id=exemplares[0].id, usuario_id=usuarios[0].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=-15), devolvido=False),
        Emprestimo(livro_id=livros[1].id, exemplar_id=exemplares[1].id, usuario_id=usuarios[1].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=5), devolvido=False),
        Emprestimo(livro_id=livros[2].id, exemplar_id=exemplares[2].id, usuario_id=usuarios[2].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=8), devolvido=False),
    ]
    for emprestimo in emprestimos:
        exemplar = Exemplar.query.get(emprestimo.exemplar_id)
        exemplar.disponivel = False  # Marca o exemplar como indisponível
    db.session.add_all(emprestimos)
    db.session.commit()  # Commit após adicionar empréstimos

    print("Dados de teste populados com sucesso.")
