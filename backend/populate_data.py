from models import Biblioteca, Livro, Usuario, Emprestimo
from datetime import datetime, timedelta

def populate_data(db):
    # Limpa as tabelas
    db.session.query(Emprestimo).delete()
    db.session.query(Livro).delete()
    db.session.query(Usuario).delete()
    db.session.query(Biblioteca).delete()
    
    # Criar bibliotecas
    biblioteca1 = Biblioteca(nome="Biblioteca Central", endereco="Rua A, 123")
    biblioteca2 = Biblioteca(nome="Biblioteca Secundária", endereco="Rua B, 456")
    db.session.add_all([biblioteca1, biblioteca2])
    db.session.commit()  # Commit após adicionar bibliotecas

    # Criar usuários
    usuarios = [
        Usuario(nome="Alice", cpf="12345678901"),
        Usuario(nome="Bob", cpf="23456789012"),
        Usuario(nome="Carol", cpf="34567890123")
    ]
    db.session.add_all(usuarios)
    db.session.commit()  # Commit após adicionar usuários

    # Criar livros
    livro1 = Livro(titulo="Livro de Teste 1", autor="Autor 1", prateleira="A1", biblioteca_id=biblioteca1.id)
    livro2 = Livro(titulo="Livro de Teste 2", autor="Autor 2", prateleira="B2", biblioteca_id=biblioteca2.id)
    db.session.add_all([livro1, livro2])
    db.session.commit()  # Commit após adicionar livros

    # Criar empréstimos
    emprestimos = [
        Emprestimo(livro_id=livro1.id, usuario_id=usuarios[0].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=-15), devolvido=False),
        Emprestimo(livro_id=livro2.id, usuario_id=usuarios[0].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=5), devolvido=False),
        Emprestimo(livro_id=livro1.id, usuario_id=usuarios[1].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=8), devolvido=False),
        Emprestimo(livro_id=livro2.id, usuario_id=usuarios[2].id, data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=3), devolvido=False)
    ]
    db.session.add_all(emprestimos)
    
    # Salvar as alterações
    db.session.commit()  # Commit após adicionar empréstimos
    print("Dados de teste populados com sucesso.")
