from models import Biblioteca, Livro, Usuario, Emprestimo, Prateleira
from datetime import datetime, timedelta

def populate_data(db):
    # Limpa as tabelas
    db.session.query(Emprestimo).delete()
    db.session.query(Livro).delete()
    db.session.query(Usuario).delete()
    db.session.query(Prateleira).delete()
    db.session.query(Biblioteca).delete()
    
    # Criar bibliotecas
    biblioteca1 = Biblioteca(nome="Biblioteca Central", endereco="Rua A, 123")
    biblioteca2 = Biblioteca(nome="Biblioteca Secundária", endereco="Rua B, 456")
    biblioteca3 = Biblioteca(nome="Biblioteca Plaza", endereco="Rua C, 789")
    db.session.add_all([biblioteca1, biblioteca2, biblioteca3])
    db.session.commit()  # Commit após adicionar bibliotecas

    # Criar prateleiras associadas às bibliotecas
    prateleira1 = Prateleira(codigo="A1", localizacao="Primeiro andar - Setor A", biblioteca_id=biblioteca1.id)
    prateleira2 = Prateleira(codigo="B2", localizacao="Segundo andar - Setor B", biblioteca_id=biblioteca2.id)
    prateleira3 = Prateleira(codigo="C3", localizacao="Terceiro andar - Setor C", biblioteca_id=biblioteca3.id)
    db.session.add_all([prateleira1, prateleira2, prateleira3])
    db.session.commit()  # Commit após adicionar prateleiras

    # Criar usuários com Alice como administradora
    usuarios = [
        Usuario(nome="Alice", cpf="12345678901", senha='123', admin=True),  # Alice definida como admin
        Usuario(nome="Bob", senha="1234", cpf="23456789012"),
        Usuario(nome="Carol", senha="13", cpf="34567890123"),
        Usuario(nome="Daniel", senha="1113",  cpf="45678901234"),
        Usuario(nome="Eva", senha="adga23", cpf="56789012345")
    ]
    db.session.add_all(usuarios)
    db.session.commit()  # Commit após adicionar usuários

    # Criar livros associados a prateleiras específicas
    livro1 = Livro(titulo="Livro de Teste 1", autor="Autor 1", prateleira_id=prateleira1.id, biblioteca_id=biblioteca1.id, categoria="Fantasia", ano_publicado="1998")
    livro2 = Livro(titulo="Livro de Teste 2", autor="Autor 2", prateleira_id=prateleira2.id, biblioteca_id=biblioteca2.id, categoria="Ação", ano_publicado="2009")
    livro3 = Livro(titulo="Game of Thrones", autor="G. R. R. Martin", prateleira_id=prateleira2.id, biblioteca_id=biblioteca2.id, categoria="Ação", ano_publicado="2009")
    livro4 = Livro(titulo="Livro de Teste 4", autor="Autor 3", prateleira_id=prateleira3.id, biblioteca_id=biblioteca3.id, categoria="Romance", ano_publicado="2015")
    livro5 = Livro(titulo="Livro de Teste 5", autor="Autor 4", prateleira_id=prateleira1.id, biblioteca_id=biblioteca1.id, categoria="Drama", ano_publicado="2020")
    
    db.session.add_all([livro1, livro2, livro3, livro4, livro5])
    db.session.commit()  # Commit após adicionar livros

    # Criar empréstimos
    emprestimos = [
        Emprestimo(livro_id=livro1.id, usuario_id=usuarios[0].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=-15), devolvido=False),
        Emprestimo(livro_id=livro2.id, usuario_id=usuarios[0].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=5), devolvido=False),
        Emprestimo(livro_id=livro1.id, usuario_id=usuarios[1].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=8), devolvido=False),
        Emprestimo(livro_id=livro2.id, usuario_id=usuarios[2].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=3), devolvido=False),
        Emprestimo(livro_id=livro3.id, usuario_id=usuarios[3].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=10), devolvido=False),
        Emprestimo(livro_id=livro4.id, usuario_id=usuarios[4].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=15), devolvido=False),
        Emprestimo(livro_id=livro5.id, usuario_id=usuarios[1].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=20), devolvido=False),
        Emprestimo(livro_id=livro1.id, usuario_id=usuarios[4].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=7), devolvido=False),
        Emprestimo(livro_id=livro2.id, usuario_id=usuarios[3].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=25), devolvido=False),
        Emprestimo(livro_id=livro3.id, usuario_id=usuarios[2].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=30), devolvido=False)
    ]
    db.session.add_all(emprestimos)
    
    # Salvar as alterações
    db.session.commit()  # Commit após adicionar empréstimos
    print("Dados de teste populados com sucesso.")
