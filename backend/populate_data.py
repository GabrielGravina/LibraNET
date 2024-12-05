import requests
from models import Biblioteca, Livro, Usuario, Emprestimo, Prateleira, Exemplar
from datetime import datetime, timedelta
import random


def populate_data(db):
    # Limpa as tabelas relacionadas
    db.session.query(Emprestimo).delete()
    db.session.query(Exemplar).delete()
    db.session.query(Livro).delete()
    db.session.query(Usuario).delete()
    db.session.query(Prateleira).delete()
    db.session.query(Biblioteca).delete()

    # Criar bibliotecas
    bibliotecas = [
        Biblioteca(nome="Biblioteca Central", endereco="Rua A, 123"),
        Biblioteca(nome="Biblioteca Secundária", endereco="Rua B, 456"),
        Biblioteca(nome="Biblioteca Plaza", endereco="Rua C, 789")
    ]
    db.session.add_all(bibliotecas)
    db.session.commit()

    # Criar prateleiras
    prateleiras = []
    for biblioteca in bibliotecas:
        for i in range(3):  # Cria com três prateleiras por biblioteca.
            prateleiras.append(
                Prateleira(codigo=f"{biblioteca.nome[:3].upper()}-{i+1}", 
                           localizacao=f"Andar {i+1} - Setor {chr(65 + i)}", 
                           biblioteca_id=biblioteca.id)
            )
    db.session.add_all(prateleiras)
    db.session.commit()

    # Criar usuários
    usuarios = [
        Usuario(nome="Alice", cpf="12345678901", senha='123', admin=True),
        Usuario(nome="Bob", senha="1234", cpf="23456789012"),
        Usuario(nome="Carol", senha="13", cpf="34567890123"),
        Usuario(nome="Daniel", senha="1113", cpf="45678901234"),
        Usuario(nome="Eva", senha="adga23", cpf="56789012345")
    ]
    db.session.add_all(usuarios)
    db.session.commit()

    # Criar livros com dados fixos
    livros = [
        Livro(
            titulo="O Senhor dos Anéis - A Sociedade do Anel",
            autor="J.R.R. Tolkien",
            categoria="Fantasia",
            ano_publicado="1954",
            imagem_capa="https://covers.openlibrary.org/b/id/111111-L.jpg",  # Imagem fictícia
            disponivel=True
        ),
        Livro(
            titulo="Dom Quixote",
            autor="Miguel de Cervantes",
            categoria="Clássico",
            ano_publicado="1605",
            imagem_capa="https://covers.openlibrary.org/b/id/222222-L.jpg",
            disponivel=True
        ),
        Livro(
            titulo="1984",
            autor="George Orwell",
            categoria="Distopia",
            ano_publicado="1949",
            imagem_capa="https://covers.openlibrary.org/b/id/333333-L.jpg",
            disponivel=True
        ),
        Livro(
            titulo="A Revolução dos Bichos",
            autor="George Orwell",
            categoria="Fábula",
            ano_publicado="1945",
            imagem_capa="https://covers.openlibrary.org/b/id/444444-L.jpg",
            disponivel=True
        ),
        Livro(
            titulo="O Pequeno Príncipe",
            autor="Antoine de Saint-Exupéry",
            categoria="Infantil",
            ano_publicado="1943",
            imagem_capa="https://covers.openlibrary.org/b/id/555515-L.jpg",
            disponivel=True
        ),
        Livro(
            titulo="Harry Potter e a Pedra Filosofal",
            autor="J.K. Rowling",
            categoria="Fantasia",
            ano_publicado="1997",
            imagem_capa="https://covers.openlibrary.org/b/id/666666-L.jpg",
            disponivel=True
        ),
        Livro(
            titulo="O Morro dos Ventos Uivantes",
            autor="Emily Brontë",
            categoria="Romance",
            ano_publicado="1847",
            imagem_capa="https://covers.openlibrary.org/b/id/777777-L.jpg",
            disponivel=True
        ),
        Livro(
            titulo="A Metamorfose",
            autor="Franz Kafka",
            categoria="Ficção",
            ano_publicado="1915",
            imagem_capa="https://covers.openlibrary.org/b/id/888888-L.jpg",
            disponivel=True
        ),
    ]
    db.session.add_all(livros)
    db.session.commit()

    # Criar exemplares
    exemplares = []
    for livro in livros:
        for i in range(random.randint(1, 3)):  # Criar de 1 a 3 exemplares por livro
            prateleira = random.choice(prateleiras)  # Associar a prateleira aleatória
            exemplares.append(
                Exemplar(
                    livro_id=livro.id, 
                    codigo_inventario=f"{livro.id}-{i+1}", 
                    disponivel=True, 
                    condicao="Bom", 
                    prateleira_id=prateleira.id
                )
            )
    db.session.add_all(exemplares)
    db.session.commit()

    # Criar empréstimos de exemplo
    emprestimos = [
        Emprestimo(exemplar_id=exemplares[i].id, usuario_id=usuarios[i % len(usuarios)].id, 
                   data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=(i + 5)), devolvido=False)
        for i in range(len(exemplares[:5]))  # Somente nos primeiros 5 livros
    ]
    db.session.add_all(emprestimos)
    db.session.commit()

    print("Dados de teste populados com sucesso.")
