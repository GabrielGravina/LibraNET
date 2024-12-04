import requests
from models import Biblioteca, Livro, Usuario, Emprestimo, Prateleira, Exemplar
from datetime import datetime, timedelta
import random

def fetch_books_from_openlibrary(count=8):
    """
    Busca livros da OpenLibrary API.
    """
    url = "https://openlibrary.org/search.json"
    query = "fiction"  # Palavra-chave para buscar livros (pode ser alterada conforme necessário)
    params = {"q": query, "limit": count}

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        books = data.get('docs', [])
        return [
            {
                "titulo": book.get("title", "Título Desconhecido"),
                "autor": ", ".join(book.get("author_name", ["Autor Desconhecido"])),
                "ano_publicado": str(book.get("first_publish_year", "Ano Desconhecido")),
                "imagem_capa": f"https://covers.openlibrary.org/b/id/{book.get('cover_i')}-L.jpg" if book.get("cover_i") else None,
                # "imagem_capa": "imagemaleatoria"
            }
            for book in books
        ]
    else:
        print("Erro ao buscar livros da API OpenLibrary.")
        return []

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
        for i in range(3):  # Três prateleiras por biblioteca
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

    # Buscar livros da OpenLibrary API
    livros_da_api = fetch_books_from_openlibrary(count=40)

    # Criar objetos de Livro e associar a bibliotecas aleatórias
    livros = []
    for i, livro_data in enumerate(livros_da_api):
        biblioteca = random.choice(bibliotecas)  # Selecionar biblioteca aleatória
        livro = Livro(
            titulo=livro_data["titulo"],
            autor=livro_data["autor"],
            categoria="Diversos",  # Pode ajustar para refletir categorias reais
            ano_publicado=livro_data["ano_publicado"],
            imagem_capa=livro_data["imagem_capa"],
            disponivel=True  # Inicialmente marcados como disponíveis
        )
        livros.append(livro)
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
