from app import app, db
from flask import request, jsonify
from models import Biblioteca, Livro, Usuario, Emprestimo, Multa, Prateleira, Exemplar
from datetime import datetime, timedelta



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
            prateleira_id = data.get("prateleira_id")
            categoria = data.get("categoria")
            ano_publicado = data.get("ano_publicado")
            biblioteca_id = data.get("biblioteca_id")
            disponivel = data.get("disponivel", True)  # Padrão: disponível
            quantidade_exemplares = int(data.get("quantidade_exemplares", 0))

            # Verificar campos obrigatórios
            if not categoria:
                return jsonify({"error": "Categoria é obrigatória"}), 400

            biblioteca = db.session.query(Biblioteca).filter_by(id=biblioteca_id).first()
            if not biblioteca:
                return jsonify({"error": "Biblioteca não encontrada"}), 404

            prateleira = db.session.query(Prateleira).filter_by(id=prateleira_id).first()
            if not prateleira:
                return jsonify({"error": "Prateleira não encontrada."}), 404

            # Criar o livro
            novo_livro = Livro(
                titulo=titulo,
                autor=autor,
                prateleira_id=prateleira_id,
                categoria=categoria,
                ano_publicado=ano_publicado,
                biblioteca_id=biblioteca_id,
                disponivel=disponivel
            )
            db.session.add(novo_livro)
            db.session.flush()  # Garante que o ID do livro seja gerado

            # Criar exemplares, se quantidade especificada for maior que zero
            exemplares = []
            for i in range(quantidade_exemplares):
                # Gerar código único para o exemplar
                codigo_inventario = f"{novo_livro.id}-{uuid.uuid4().hex[:8]}-{i + 1}"
                novo_exemplar = Exemplar(
                    livro_id=novo_livro.id,
                    codigo_inventario=codigo_inventario,
                    disponivel=True,
                    condicao="Bom",
                    biblioteca_id=biblioteca_id
                )
                exemplares.append(novo_exemplar)
                db.session.add(novo_exemplar)

            # Confirmar as mudanças no banco
            db.session.commit()
            return jsonify({
                "livro": novo_livro.to_json(),
                "exemplares_criados": len(exemplares)
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Erro ao criar livro com exemplares.", "details": str(e)}), 500
        
    @app.route('/api/livros', methods=['GET'])
    def get_livros_disponiveis():
        try:
            # Fazer um join entre Livro e Biblioteca para obter os dados necessários
            livros = db.session.query(
                Livro,
                Biblioteca.nome.label("biblioteca_nome")
            ).join(
                Biblioteca, Livro.biblioteca_id == Biblioteca.id
            ).all()

            resultado = []

            for livro, biblioteca_nome in livros:
                # Contar exemplares disponíveis
                exemplares_disponiveis = db.session.query(Exemplar).filter_by(
                    livro_id=livro.id, disponivel=True
                ).count()

                # O livro é considerado disponível se houver ao menos um exemplar disponível
                
                disponivel = exemplares_disponiveis > 0
                if disponivel > 0:
                    resultado.append({
                        "id": livro.id,
                        "titulo": livro.titulo,
                        "autor": livro.autor,
                        "categoria": livro.categoria,
                        "ano_publicado": livro.ano_publicado,
                        "biblioteca_id": livro.biblioteca_id,
                        "biblioteca_nome": biblioteca_nome,  # Nome da biblioteca incluído
                        "quantidade_exemplares": exemplares_disponiveis,
                        "disponivel": disponivel
                    })

            return jsonify(resultado), 200
        except Exception as e:
            return jsonify({"error": "Erro ao obter livros.", "details": str(e)}), 500

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

            # Atualizar os campos fornecidos no payload
            if "titulo" in data:
                livro.titulo = data["titulo"]
            if "autor" in data:
                livro.autor = data["autor"]
            if "prateleira_id" in data:
                prateleira = db.session.query(Prateleira).filter_by(id=data["prateleira_id"]).first()
                if not prateleira:
                    return jsonify({"error": "Prateleira não encontrada"}), 404
                livro.prateleira_id = data["prateleira_id"]
            if "categoria" in data:
                livro.categoria = data["categoria"]
            if "ano_publicado" in data:
                livro.ano_publicado = data["ano_publicado"]
            if "biblioteca_id" in data:
                biblioteca = db.session.query(Biblioteca).filter_by(id=data["biblioteca_id"]).first()
                if not biblioteca:
                    return jsonify({"error": "Biblioteca não encontrada"}), 404
                livro.biblioteca_id = data["biblioteca_id"]
            if "disponivel" in data:
                livro.disponivel = data["disponivel"]
            if "status" in data:
                livro.status = data["status"]

            # Confirmar as mudanças no banco de dados
            db.session.commit()
            return jsonify(livro.to_json()), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Erro ao atualizar o livro.", "details": str(e)}), 500

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
        """Método para converter o objeto Usuario em dicionário"""
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

    # O livro agora é acessado diretamente pela relação do Emprestimo
    livro = emprestimo.livro  # Agora já existe a relação direta

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
        "livro_titulo": livro.titulo if livro else None,  # Inclui o título do livro
        "data_emprestimo": emprestimo.data_emprestimo.isoformat(),
        "data_devolucao": emprestimo.data_devolucao.isoformat() if emprestimo.data_devolucao else None,
        "devolvido": emprestimo.devolvido,
        "multa": multa_data,
    }

    return jsonify(emprestimo_data)



@app.route('/api/emprestimos', methods=['POST'])
def criar_emprestimo():
    data = request.get_json()
    livro_id = data.get('livro_id')
    usuario_id = data.get('usuario_id')

    # Validações básicas
    if not livro_id or not usuario_id:
        return jsonify({"error": "Campos livro_id e usuario_id são obrigatórios."}), 400

    # Busca o livro
    livro = Livro.query.filter_by(id=livro_id).first()
    if not livro:
        return jsonify({"error": "Livro não encontrado."}), 404

    # Verifica se há exemplares disponíveis para o livro
    exemplar_disponivel = Exemplar.query.filter_by(livro_id=livro.id, disponivel=True).first()
    if not exemplar_disponivel:
        return jsonify({"error": "Não há exemplares disponíveis para empréstimo."}), 400

    try:
        # Criar o empréstimo
        novo_emprestimo = Emprestimo(
            livro_id=livro.id,
            usuario_id=usuario_id,
            exemplar_id=exemplar_disponivel.id  # Relaciona com o exemplar
        )

        # Atualizar a disponibilidade do exemplar
        exemplar_disponivel.disponivel = False

        # Verificar se ainda há exemplares disponíveis após o empréstimo
        exemplares_disponiveis = Exemplar.query.filter_by(livro_id=livro.id, disponivel=True).count()
        livro.disponivel = exemplares_disponiveis > 0  # Atualiza o status do livro

        # Salvar no banco de dados
        db.session.add(novo_emprestimo)
        db.session.commit()

        return jsonify({"message": "Empréstimo criado com sucesso."}), 201

    except Exception as e:
        db.session.rollback()  # Reverter transações em caso de erro
        return jsonify({"error": "Erro ao criar empréstimo.", "details": str(e)}), 500


@app.route("/api/emprestimo/user/<int:usuario_id>", methods=["GET"])
def buscar_emprestimos_do_usuario(usuario_id):
    try:
        emprestimos = db.session.query(Emprestimo).filter(Emprestimo.usuario_id == usuario_id).all()

        # Lista para armazenar os dados dos empréstimos
        emprestimos_response = []
        for emp in emprestimos:
            # Buscar o livro associado ao empréstimo
            livro = db.session.query(Livro).filter(Livro.id == emp.livro_id).first()

            # Buscar as multas associadas ao empréstimo
            multas = db.session.query(Multa).filter(Multa.emprestimo_id == emp.id).all()
            valor_multa = sum(multa.valor for multa in multas) if multas else 0.0  # Soma todas as multas, se houver

            emprestimos_response.append({
                "emprestimo_id": emp.id,
                "livro_titulo": livro.titulo if livro else "Livro não encontrado",  # Adiciona o nome do livro
                "data_emprestimo": emp.data_emprestimo,
                "data_devolucao": emp.data_devolucao,
                "devolvido": emp.devolvido,
                "multa": valor_multa  # Inclui o valor da multa total
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
                # Buscar o livro associado ao empréstimo
                livro = db.session.query(Livro).filter(Livro.id == emp.livro_id).first()

                # Buscar as multas associadas ao empréstimo
                multas = db.session.query(Multa).filter(Multa.emprestimo_id == emp.id).all()
                valor_multa = sum(multa.valor for multa in multas) if multas else 0.0  # Soma todas as multas, se houver

                emprestimos.append({
                    "emprestimo_id": emp.id,
                    "usuario_nome": usuario.nome,
                    "livro_titulo": livro.titulo if livro else "Livro não encontrado",  # Adiciona o nome do livro
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
    emprestimo.data_devolucao = datetime.strptime(data["data_devolucao"], "%a, %d %b %Y %H:%M:%S %Z")
    emprestimo.devolvido = data.get("devolvido", emprestimo.devolvido)

    # Atualiza a multa se ela existir
    if emprestimo.multa:
        emprestimo.multa.valor = data["multa"]["valor"]  # Atualiza o valor da multa
        emprestimo.multa.data_pagamento = data["multa"].get("data_pagamento", emprestimo.multa.data_pagamento)
    else:
        # Se não existir, cria uma nova multa
        nova_multa = Multa(
            emprestimo_id=emprestimo.id,
            valor=data["multa"]["valor"],
            data_pagamento=data["multa"].get("data_pagamento")
        )
        db.session.add(nova_multa)

    # Salva as mudanças no banco de dados
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
