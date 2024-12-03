import requests
from models import Biblioteca, Livro, Usuario, Emprestimo, Prateleira, Exemplar
from datetime import datetime, timedelta

def fetch_books_from_openlibrary(count=40):
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
    biblioteca1 = Biblioteca(nome="Biblioteca Central", endereco="Rua A, 123")
    biblioteca2 = Biblioteca(nome="Biblioteca Secundária", endereco="Rua B, 456")
    biblioteca3 = Biblioteca(nome="Biblioteca Plaza", endereco="Rua C, 789")
    db.session.add_all([biblioteca1, biblioteca2, biblioteca3])
    db.session.commit()

    # Criar prateleiras
    prateleira1 = Prateleira(codigo="A1", localizacao="Primeiro andar - Setor A", biblioteca_id=biblioteca1.id)
    prateleira2 = Prateleira(codigo="B2", localizacao="Segundo andar - Setor B", biblioteca_id=biblioteca2.id)
    prateleira3 = Prateleira(codigo="C3", localizacao="Terceiro andar - Setor C", biblioteca_id=biblioteca3.id)
    db.session.add_all([prateleira1, prateleira2, prateleira3])
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
        biblioteca_id = [biblioteca1.id, biblioteca2.id, biblioteca3.id][i % 3]  # Distribuir entre as bibliotecas
        livro = Livro(
            titulo=livro_data["titulo"],
            autor=livro_data["autor"],
            categoria="Diversos",  # Pode ajustar para refletir categorias reais
            ano_publicado=livro_data["ano_publicado"],
            biblioteca_id=biblioteca_id,
            imagem_capa=livro_data["imagem_capa"],
            disponivel=True  # Inicialmente marcados como disponíveis
        )
        livros.append(livro)
    db.session.add_all(livros)
    db.session.commit()

    # Criar exemplares
    exemplares = [
        Exemplar(livro_id=livro.id, codigo_inventario=f"{livro.id}-{i}", disponivel=True, condicao="Bom", biblioteca_id=livro.biblioteca_id)
        for i, livro in enumerate(livros)
    ]
    db.session.add_all(exemplares)
    db.session.commit()

    # Criar empréstimos de exemplo
    emprestimos = [
        Emprestimo(livro_id=livros[i].id, exemplar_id=exemplares[i].id, usuario_id=usuarios[i % len(usuarios)].id, 
                   data_emprestimo=datetime.utcnow(), data_devolucao=datetime.utcnow() + timedelta(days=(i + 5)), devolvido=False)
        for i in range(len(livros[:5]))  # Somente nos primeiros 5 livros
    ]
    db.session.add_all(emprestimos)
    db.session.commit()

    print("Dados de teste populados com sucesso.")
