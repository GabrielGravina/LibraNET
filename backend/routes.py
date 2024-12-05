from app import app, db
from flask import request, jsonify
from models import Biblioteca, Livro, Usuario, Emprestimo, Multa, Prateleira, Exemplar
from datetime import datetime, timedelta
import requests


# CRUD para Bibliotecas
@app.route("/api/bibliotecas", methods=["GET"])
def get_bibliotecas():
    bibliotecas = Biblioteca.query.all()
    result = [biblioteca.to_json() for biblioteca in bibliotecas]
    return jsonify(result), 200

@app.route("/api/bibliotecas", methods=["POST"])
def create_biblioteca():
    try:
        data = request.json
        nome = data.get("nome")
        endereco = data.get("endereco")

        if not nome or not endereco:
            return jsonify({"error": "Missing required fields"}), 400

        biblioteca = Biblioteca(nome=nome, endereco=endereco)
        db.session.add(biblioteca)
        db.session.commit()

        return jsonify({"msg": "Biblioteca criada com sucesso"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
    
#----------------------------------------------------
# CRUD para Livros -----------------------------------

# Isso filtra os resultados para a biblioteca selecionada

import uuid

class LivroController:
    @staticmethod
    
    @app.route('/api/livros', methods=['POST'])
    def criar_livro():
        try:
            data = request.get_json()

            titulo = data.get("titulo")
            autor = data.get("autor")
            categoria = data.get("categoria")
            ano_publicado = data.get("ano_publicado")
            prateleira_id = data.get("prateleira_id")
            exemplar_id = data.get("exemplar_id")
            disponivel = data.get("disponivel", True)
            quantidade_exemplares = int(data.get("quantidade_exemplares", 0))

            if not titulo or not categoria:
                return jsonify({"error": "Título e Categoria são obrigatórios"}), 400

            # Busca da imagem de capa
            imagem_capa = None
            try:
                response = requests.get(
                    "https://openlibrary.org/search.json",
                    params={"title": titulo}
                )
                if response.status_code == 200:
                    resultados = response.json().get("docs", [])
                    if resultados:
                        for resultado in resultados:
                            cover_key = resultado.get("cover_edition_key")
                            if cover_key:
                                imagem_capa = f"https://covers.openlibrary.org/b/olid/{cover_key}-L.jpg"
                                break
                    if not imagem_capa:
                        print("Nenhuma capa específica encontrada, utilizando fallback genérico.")
                else:
                    print(f"Erro na API OpenLibrary: {response.status_code}")
            except Exception as e:
                print(f"Erro ao buscar imagem de capa: {e}")

            # Fallback para uma imagem genérica, se nenhuma capa foi encontrada
            if not imagem_capa:
                imagem_capa = "https://via.placeholder.com/150?text=Imagem+Indisponível"

            # Criação do livro
            novo_livro = Livro(
                titulo=titulo,
                autor=autor,
                categoria=categoria,
                ano_publicado=ano_publicado,             
                disponivel=disponivel,
                imagem_capa=imagem_capa
            )
            db.session.add(novo_livro)
            db.session.flush()

            exemplares = []
            for i in range(quantidade_exemplares):
                codigo_inventario = f"{novo_livro.id}-{uuid.uuid4().hex[:8]}-{i + 1}"
                novo_exemplar = Exemplar(
                    livro_id=novo_livro.id,
                    codigo_inventario=codigo_inventario,
                    disponivel=True,
                    condicao="Bom",
                    prateleira_id=prateleira_id

                )
                exemplares.append(novo_exemplar)
                db.session.add(novo_exemplar)

            db.session.commit()
            print(f"Livro criado com sucesso: {novo_livro.titulo}, Capa: {novo_livro.imagem_capa}")
            return jsonify({
                "livro": novo_livro.to_json(),
                "exemplares_criados": len(exemplares)
            }), 201
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao criar livro: {e}")
            return jsonify({"error": "Erro ao criar livro com exemplares.", "details": str(e)}), 500

            
    @app.route('/api/livros/disponiveis', methods=['GET'])
    def get_livros_disponiveis():
        try:
            livros = db.session.query(
                Livro,
                db.func.count(Exemplar.id).label("quantidade_exemplares")
            ).join(
                Exemplar, Exemplar.livro_id == Livro.id
            ).filter(
                Exemplar.disponivel == True
            ).group_by(
                Livro.id
            ).all()

            resultado = [
                {
                    "id": livro.id,
                    "titulo": livro.titulo,
                    "autor": livro.autor,
                    "categoria": livro.categoria,
                    "ano_publicado": livro.ano_publicado,
                    "imagem_capa": livro.imagem_capa,
                    "quantidade_exemplares": quantidade_exemplares
                }
                for livro, quantidade_exemplares in livros
            ]

            return jsonify(resultado), 200
        except Exception as e:
            return jsonify({"error": "Erro ao obter livros disponíveis.", "details": str(e)}), 500


    
    @app.route('/api/exemplares/<int:livro_id>/disponiveis', methods=['GET'])
    def get_exemplares_disponiveis(livro_id):
        try:
            # Buscar exemplares disponíveis para o livro especificado
            exemplares = Exemplar.query.filter_by(livro_id=livro_id, disponivel=True).all()
            
            if not exemplares:
                return jsonify({"message": "Não há exemplares disponíveis para este livro."}), 404
            
            # Converter os exemplares para JSON
            resultado = [
                {
                    "id": exemplar.id,
                    "titulo": exemplar.livro.titulo,  # Título do livro associado ao exemplar
                    "condicao": exemplar.condicao,
                    "codigo_inventario": exemplar.codigo_inventario,  # Código único do exemplar
                    "disponivel": exemplar.disponivel,
                    "prateleira": exemplar.prateleira.localizacao,  # Localização da prateleira
                    "biblioteca": exemplar.prateleira.biblioteca.nome  # Nome da biblioteca associada à prateleira
                }
                for exemplar in exemplares
            ]
            
            return jsonify(resultado), 200
        except Exception as e:
            return jsonify({"error": "Erro ao buscar exemplares disponíveis.", "details": str(e)}), 500


        



    @app.route('/api/livros/<int:livro_id>', methods=['GET'])
    def get_livro(livro_id):
        try:
            # Consulta para encontrar o livro pelo ID
            livro = db.session.query(Livro).filter_by(id=livro_id).first()
            
            # Verifica se o livro foi encontrado
            if not livro:
                return jsonify({"error": "Livro não encontrado"}), 404
            
            # Retorna os dados do livro em formato JSON
            return jsonify(livro.to_json()), 200
        
        except Exception as e:
            # Retorna erro genérico em caso de exceção
            return jsonify({"error": "Erro ao buscar o livro", "details": str(e)}), 500
        
    
    @app.route('/api/livros/<int:livro_id>', methods=['PATCH'])
    def update_livro(livro_id):
        try:
            data = request.get_json()

            # Buscar o livro pelo ID
            livro = db.session.query(Livro).filter_by(id=livro_id).first()
            if not livro:
                return jsonify({"error": "Livro não encontrado"}), 404

            if "titulo" in data:
                livro.titulo = data["titulo"]
            if "autor" in data:
                livro.autor = data["autor"]

            if "categoria" in data:
                livro.categoria = data["categoria"]
            if "ano_publicado" in data:
                livro.ano_publicado = data["ano_publicado"]
        
            db.session.commit()
            return jsonify(livro.to_json()), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Erro ao atualizar o livro.", "details": str(e)}), 500
        


    @app.route('/api/livros/<int:livro_id>/exemplares', methods=['GET'])
    def get_exemplares(livro_id):
        try:
            # Verifica se o livro existe
            livro = Livro.query.get(livro_id)
            if not livro:
                return jsonify({"error": "Livro não encontrado."}), 404

            # Busca os exemplares associados ao livro
            exemplares = Exemplar.query.filter_by(livro_id=livro_id).all()
            exemplares_data = [
                {
                    "id": exemplar.id,
                    "codigo_inventario": exemplar.codigo_inventario,
                    "prateleira_id": exemplar.prateleira_id,
                    "condicao": exemplar.condicao,
                    "prateleira": {
                        "codigo": exemplar.prateleira.codigo,
                        "localizacao": exemplar.prateleira.localizacao,
                    } if exemplar.prateleira else None
                }
                for exemplar in exemplares
            ]
            return jsonify(exemplares_data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    @app.route('/api/exemplar/<int:exemplar_id>', methods=['PATCH'])
    def update_exemplar(exemplar_id):
        try:
            # Verifica se o exemplar existe
            exemplar = Exemplar.query.get(exemplar_id)
            if not exemplar:
                return jsonify({"error": "Exemplar não encontrado."}), 404

            # Atualiza os campos com os dados fornecidos
            data = request.json
            if "prateleira_id" in data:
                exemplar.prateleira_id = data["prateleira_id"]
            if "condicao" in data:
                exemplar.condicao = data["condicao"]

            # Salva as alterações no banco de dados
            db.session.commit()
            return jsonify({
                "id": exemplar.id,
                "codigo_inventario": exemplar.codigo_inventario,
                "prateleira_id": exemplar.prateleira_id,
                "condicao": exemplar.condicao,
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500    
        
    @app.route('/api/exemplares/<int:livro_id>/disponiveis', methods=['GET'])
    def get_exemplares_disponiveis_por_livro(livro_id):
        try:
            exemplares = Exemplar.query.filter_by(livro_id=livro_id, disponivel=True).all()

            resultado = [
                {
                    "id": exemplar.id,
                    "codigo": exemplar.codigo  # Adapte com campos relevantes
                }
                for exemplar in exemplares
            ]

            return jsonify(resultado), 200
        except Exception as e:
            return jsonify({"error": "Erro ao obter exemplares disponíveis.", "details": str(e)}), 500


@app.route('/api/popular-livros', methods=['POST'])
def popular_livros_openlibrary():
    try:
        query = request.args.get('query', 'programming')
        api_url = f'https://openlibrary.org/search.json?q={query}'

        response = requests.get(api_url)
        if response.status_code != 200:
            return jsonify({"error": "Erro ao buscar livros na API"}), 500

        livros_data = response.json().get("docs", [])

        for item in livros_data[:10]:  # Limita a 10 resultados para evitar sobrecarga
            titulo = item.get("title", "Título desconhecido")
            autor = ", ".join(item.get("author_name", ["Autor desconhecido"]))
            ano_publicado = item.get("first_publish_year", "Ano desconhecido")
            categoria = "Categoria não especificada"  # A API não fornece categorias diretamente
            openlibrary_id = item.get("cover_edition_key", None)
            
            # Gerar URL da capa do livro
            imagem_capa = f"https://covers.openlibrary.org/b/olid/{openlibrary_id}-M.jpg" if openlibrary_id else ""

            # Criar um novo livro
            novo_livro = Livro(
                titulo=titulo,
                autor=autor,
                categoria=categoria,
                ano_publicado=ano_publicado,
                disponivel=True,
                biblioteca_id=None  # Ajuste conforme necessário
            )
            db.session.add(novo_livro)
            db.session.flush()

            # Adicionar a URL da imagem ao livro
            if imagem_capa:
                novo_livro.imagem_capa = imagem_capa  # Adicione um campo imagem_capa ao modelo Livro

        db.session.commit()
        return jsonify({"message": "Livros adicionados com sucesso!"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Erro ao popular livros", "details": str(e)}), 500
    
    

#----------------------------------
class UsuarioController:

    @staticmethod
    @app.route("/login", methods=["POST"])
    def login():
        """Endpoint de login para usuários"""
        try:
            data = request.get_json()
            cpf = data.get("cpf")
            senha = data.get("senha")

            if not cpf or not senha:
                return jsonify({"error": "CPF e senha são obrigatórios!"}), 400

            usuario = Usuario.query.filter_by(cpf=cpf).first()
            print(usuario.id)
            if usuario and usuario.senha == senha:
                is_admin = usuario.cpf == "adminCpf"  # Lógica para verificar se o usuário é admin
                return jsonify({
                    "cpf": usuario.cpf,
                    "nome": usuario.nome,
                    "admin": usuario.admin,  # Envia o status de admin no retorno
                    "id": usuario.id
                    
                })
                
            else:
                return jsonify({"error": "Credenciais inválidas!"}), 401
        except Exception as e:
            return jsonify({"error": "Erro ao processar o login", "details": str(e)}), 500

    @staticmethod
    @app.route("/api/usuarios", methods=["GET"])
    def get_usuarios():
        """Endpoint para listar todos os usuários"""
        try:
            usuarios = Usuario.query.all()
            result = [UsuarioController.usuario_to_dict(usuario) for usuario in usuarios]
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": "Erro ao buscar os usuários", "details": str(e)}), 500

    @staticmethod
    @app.route("/api/usuarios", methods=["POST"])
    def create_usuario():
        """Endpoint para criar um novo usuário"""
        try:
            data = request.json
            nome = data.get("nome")
            cpf = data.get("cpf")
            senha = data.get("senha")

            if not nome or not cpf or not senha:
                return jsonify({"error": "Missing required fields"}), 400

            usuario = Usuario(nome=nome, cpf=cpf, senha=senha)
            db.session.add(usuario)
            db.session.commit()

            return jsonify({"msg": "Usuário criado com sucesso"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def usuario_to_dict(usuario):
        return {
            "id": usuario.id,
            "cpf": usuario.cpf,
            "nome": usuario.nome,
            "admin": usuario.admin,  # Campo que pode indicar se é admin ou não
        }

# CRUD para Empréstimos

@app.route("/api/emprestimos", methods=["GET"])
def get_emprestimos():
    emprestimos = Emprestimo.query.all()
    result = []
    for emprestimo in emprestimos:
        calcular_multa(emprestimo)
        # Adiciona o empréstimo ao resultado
        emprestimo_data = emprestimo.to_json()
        
        # Inclui informações de multa, se houver
        multa = Multa.query.filter_by(emprestimo_id=emprestimo.id).first()
        emprestimo_data["multa"] = multa.valor if multa else 0
        result.append(emprestimo_data)
    return jsonify(result), 200


# Busca um empréstimo específico pelo ID
@app.route('/api/emprestimo/<int:emprestimo_id>', methods=['GET'])
def get_emprestimo(emprestimo_id):
    emprestimo = Emprestimo.query.get(emprestimo_id)
    if not emprestimo:
        return jsonify({"error": "Empréstimo não encontrado."}), 404

    # Acessando o livro através do exemplar associado ao empréstimo
    exemplar = Exemplar.query.get(emprestimo.exemplar_id)  # A relação entre emprestimo e exemplar
    if not exemplar:
        return jsonify({"error": "Exemplar não encontrado."}), 404
    
    livro = exemplar.livro  # Agora acessamos o livro associado ao exemplar

    # A lógica de multa agora checa se existe e se data_pagamento não é None
    multa_data = None
    if emprestimo.multa:
        multa_data = {
            "valor": emprestimo.multa.valor,
            "data_pagamento": emprestimo.multa.data_pagamento.isoformat() if emprestimo.multa.data_pagamento else None
        }

    emprestimo_data = {
        "emprestimo_id": emprestimo.id,
        "usuario_nome": emprestimo.usuario.nome,
        "livro_titulo": livro.titulo if livro else None,  # Inclui o título do livro do exemplar
        "data_emprestimo": emprestimo.data_emprestimo.isoformat(),
        "data_devolucao": emprestimo.data_devolucao.isoformat() if emprestimo.data_devolucao else None,
        "devolvido": emprestimo.devolvido,
        "multa": multa_data,
    }

    return jsonify(emprestimo_data)




@app.route('/api/emprestimos', methods=['POST'])
def criar_emprestimo():
    data = request.get_json()
    exemplar_id = data.get('exemplar_id')  # Recebe o exemplar_id do front
    usuario_id = data.get('usuario_id')

    # Validações básicas
    if not exemplar_id or not usuario_id:
        return jsonify({"error": "Campos exemplar_id e usuario_id são obrigatórios."}), 400

    try:
        # Verifica se o exemplar existe e está disponível
        exemplar = Exemplar.query.filter_by(id=exemplar_id, disponivel=True).first()
        if not exemplar:
            return jsonify({"error": "Exemplar não encontrado ou indisponível."}), 404

        # Criar o empréstimo
        novo_emprestimo = Emprestimo(
            exemplar_id=exemplar.id,
            usuario_id=usuario_id,
            data_emprestimo=datetime.utcnow(),
            devolvido=False
        )

        # Atualizar a disponibilidade do exemplar
        exemplar.disponivel = False

        # Salvar no banco de dados
        db.session.add(novo_emprestimo)
        db.session.commit()

        return jsonify({"message": "Empréstimo criado com sucesso."}), 201

    except Exception as e:
        db.session.rollback()  # Reverte a transação em caso de erro
        return jsonify({"error": "Erro ao criar empréstimo.", "details": str(e)}), 500





@app.route("/api/emprestimo/user/<int:usuario_id>", methods=["GET"])
def buscar_emprestimos_do_usuario(usuario_id):
    try:
        # Buscar todos os empréstimos do usuário
        emprestimos = db.session.query(Emprestimo).filter(Emprestimo.usuario_id == usuario_id).all()

        # Lista para armazenar os dados dos empréstimos
        emprestimos_response = []
        for emp in emprestimos:
            # Buscar o exemplar associado ao empréstimo
            exemplar = db.session.query(Exemplar).filter(Exemplar.id == emp.exemplar_id).first()

            if exemplar:
                # Buscar o livro associado ao exemplar
                livro = db.session.query(Livro).filter(Livro.id == exemplar.livro_id).first()
                
                # Buscar as multas associadas ao empréstimo
                multas = db.session.query(Multa).filter(Multa.emprestimo_id == emp.id).all()
                valor_multa = sum(multa.valor for multa in multas) if multas else 0.0  # Soma todas as multas, se houver

                emprestimos_response.append({
                    "emprestimo_id": emp.id,
                    "livro_titulo": livro.titulo if livro else "Livro não encontrado",  # Nome do livro
                    "exemplar_id": exemplar.id,   # ID do exemplar
                    "data_emprestimo": emp.data_emprestimo,
                    "data_devolucao": emp.data_devolucao,
                    "devolvido": emp.devolvido,
                    "multa": valor_multa  # Inclui o valor da multa total
                })
            else:
                # Se não encontrar exemplar, adicionar erro na resposta
                emprestimos_response.append({
                    "emprestimo_id": emp.id,
                    "erro": "Exemplar não encontrado"
                })

        return jsonify(emprestimos_response), 200

    except Exception as e:
        print("Erro ao buscar empréstimos:", str(e))
        return jsonify({"error": str(e)}), 500




@app.route("/api/usuarios/emprestimos/nome/<string:nome>", methods=["GET"])
def buscar_emprestimos_por_nome(nome):
    try:
        # Filtrar usuários que correspondem ao nome fornecido
        usuarios = db.session.query(Usuario).filter(Usuario.nome.ilike(f"%{nome}%")).all()

        # Coletar os empréstimos correspondentes
        emprestimos = []
        for usuario in usuarios:
            usuario_emprestimos = db.session.query(Emprestimo).filter(Emprestimo.usuario_id == usuario.id).all()
            
            for emp in usuario_emprestimos:
                # Buscar o exemplar associado ao empréstimo
                exemplar = db.session.query(Exemplar).filter(Exemplar.id == emp.exemplar_id).first()
                livro = (
                    db.session.query(Livro)
                    .filter(Livro.id == exemplar.livro_id)
                    .first() if exemplar else None
                )

                # Buscar as multas associadas ao empréstimo
                multas = db.session.query(Multa).filter(Multa.emprestimo_id == emp.id).all()
                valor_multa = sum(multa.valor for multa in multas) if multas else 0.0  # Soma todas as multas, se houver

                emprestimos.append({
                    "emprestimo_id": emp.id,
                    "usuario_nome": usuario.nome,
                    "livro_titulo": livro.titulo if livro else "Livro não encontrado",  # Adiciona o título do livro
                    "codigo_exemplar": exemplar.id if exemplar else "Exemplar não encontrado",
                    "data_emprestimo": emp.data_emprestimo,
                    "data_devolucao": emp.data_devolucao,
                    "devolvido": emp.devolvido,
                    "multa": valor_multa  # Inclui o valor da multa total
                })

        return jsonify(emprestimos), 200

    except Exception as e:
        print("Erro ao buscar empréstimos:", str(e))
        return jsonify({"error": str(e)}), 500



def calcular_multa(emprestimo):
    if emprestimo.data_devolucao is not None:  # Verifica se a data de devolução é válida
        data_atual = datetime.now()
        if data_atual > emprestimo.data_devolucao:
            # Código para calcular a multa
            pass
    else:
        # Caso a data_devolucao seja None, você pode tratar isso de acordo com a sua lógica de negócio
        print("Data de devolução não foi definida para este empréstimo.")



# ---------------- CRUD para Multas --------------------------
@app.route("/api/multas", methods=["GET"])
def get_multas():
    multas = Multa.query.all()
    result = [multa.to_json() for multa in multas]
    return jsonify(result), 200

@app.route("/api/multas/<int:id>", methods=["GET"])
def get_multa_by_id(id):
    multa = Multa.query.get(id)  # Obtém a multa pelo ID
    if multa is None:
        return jsonify({"error": "Multa não encontrada"}), 404  # Retorna erro se não encontrar
    return jsonify(multa.to_json()), 200  # Retorna os dados da multa

@app.route("/api/multas", methods=["POST"])
def create_multa():
    try:
        data = request.json
        emprestimo_id = data.get("emprestimo_id")
        valor = data.get("valor")

        if not emprestimo_id or not valor:
            return jsonify({"error": "Missing required fields"}), 400

        multa = Multa(emprestimo_id=emprestimo_id, valor=valor)
        db.session.add(multa)
        db.session.commit()

        return jsonify({"msg": "Multa registrada com sucesso"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Atualizar Empréstimo para incluir a data de devolução
from datetime import datetime

@app.route("/api/emprestimo/<int:id>", methods=["PATCH"])
def update_emprestimo(id):
    data = request.json  # Pega os dados enviados na requisição

    # Busca o empréstimo pelo ID
    emprestimo = Emprestimo.query.get(id)
    if not emprestimo:
        return jsonify({"error": "Empréstimo não encontrado."}), 404

    # Atualiza os atributos do empréstimo
    emprestimo.data_devolucao = datetime.fromisoformat(data["data_devolucao"].replace("Z", ""))

    emprestimo.devolvido = data.get("devolvido", emprestimo.devolvido)

    # Verifica se há dados de multa na requisição
    multa_data = data.get("multa")
    if multa_data:
        if emprestimo.multa:
            # Atualiza a multa existente
            emprestimo.multa.valor = multa_data["valor"]
            emprestimo.multa.data_pagamento = multa_data.get("data_pagamento", emprestimo.multa.data_pagamento)
        else:
            # Cria uma nova multa
            nova_multa = Multa(
                emprestimo_id=emprestimo.id,
                valor=multa_data["valor"],
                data_pagamento=multa_data.get("data_pagamento")
            )
            db.session.add(nova_multa)
            emprestimo.multa = nova_multa  # Relaciona a nova multa ao empréstimo

    # Atualiza disponibilidade do exemplar
    if emprestimo.devolvido:
        exemplar = Exemplar.query.get(emprestimo.exemplar_id)  # Assumindo que emprestimo.exemplar_id é a chave do exemplar emprestado
        if exemplar:
            exemplar.disponivel = True  # Marca o exemplar como disponível

    db.session.commit()

    return jsonify(emprestimo.to_json()), 200



# Prateleiras
# Endpoint para retornar as prateleiras de uma biblioteca pelo ID
@app.route('/api/bibliotecas/<int:biblioteca_id>/prateleiras', methods=['GET'])
def get_prateleiras(biblioteca_id):
    # Buscar biblioteca pelo ID
    biblioteca = Biblioteca.query.get(biblioteca_id)

    if biblioteca is None:
        return jsonify({'error': 'Biblioteca não encontrada'}), 404

    # Buscar as prateleiras associadas à biblioteca
    prateleiras = Prateleira.query.filter_by(biblioteca_id=biblioteca_id).all()

    # Serializar os dados das prateleiras
    prateleiras_json = [prateleira.to_json() for prateleira in prateleiras]

    return jsonify(prateleiras_json), 200


# ------------- RELATÓRIOS ---------------
@app.route('/api/relatorios', methods=['GET'])
def gerar_relatorio():
    try:
        # Total de empréstimos por livro
        livros_mais_emprestados = db.session.query(
            Livro.titulo, db.func.count(Emprestimo.id).label('total_emprestimos')
        ).join(Exemplar, Exemplar.livro_id == Livro.id) \
         .join(Emprestimo, Emprestimo.exemplar_id == Exemplar.id) \
         .group_by(Livro.titulo).order_by(db.desc('total_emprestimos')).all()

        # Total de empréstimos por categoria
        categorias_mais_emprestadas = db.session.query(
            Livro.categoria, db.func.count(Emprestimo.id).label('total_emprestimos')
        ).join(Exemplar, Exemplar.livro_id == Livro.id) \
         .join(Emprestimo, Emprestimo.exemplar_id == Exemplar.id) \
         .group_by(Livro.categoria).order_by(db.desc('total_emprestimos')).all()

        # Porcentagem de livros danificados
        total_exemplares = db.session.query(Exemplar).count()
        exemplares_estragados = db.session.query(Exemplar).filter(Exemplar.condicao == 'Estragado').count()
        porcentagem_danificados = (exemplares_estragados / total_exemplares * 100) if total_exemplares > 0 else 0

        # Porcentagem de multas por empréstimo
        total_emprestimos = db.session.query(Emprestimo).count()
        total_multas = db.session.query(Multa).count()
        porcentagem_multas = (total_multas / total_emprestimos * 100) if total_emprestimos > 0 else 0

        # Retornar resultados como JSON
        return jsonify({
            "livros_mais_emprestados": [{"titulo": l[0], "total_emprestimos": l[1]} for l in livros_mais_emprestados],
            "categorias_mais_emprestadas": [{"categoria": c[0], "total_emprestimos": c[1]} for c in categorias_mais_emprestadas],
            "porcentagem_livros_danificados": porcentagem_danificados,
            "porcentagem_multas": porcentagem_multas
        }), 200
    except Exception as e:
        return jsonify({"error": "Erro ao gerar relatório.", "details": str(e)}), 500
