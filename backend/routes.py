from app import app, db
from flask import request, jsonify
from models import Biblioteca, Livro, Usuario, Emprestimo, Multa, Prateleira
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

class LivroController:

    @staticmethod
    @app.route('/api/livros', methods=['GET'])
    def get_livros():
        try:
            # Verifica se há um título ou ID na query string
            livro_id = request.args.get('id')
            titulo = request.args.get('titulo')

            if livro_id:
                livro = Livro.query.get(livro_id)
                if livro is None:
                    return jsonify({"error": "Livro não encontrado"}), 404
                return jsonify(LivroController.livro_to_dict(livro)), 200

            if titulo:
                livros = Livro.query.filter(Livro.titulo.ilike(f"%{titulo}%")).all()
                if not livros:
                    return jsonify({"error": "Livro não encontrado"}), 404
                return jsonify([LivroController.livro_to_dict(livro) for livro in livros]), 200

            # Caso não tenha título nem ID, retorna todos os livros
            livros = Livro.query.all()
            return jsonify([LivroController.livro_to_dict(livro) for livro in livros]), 200
        except Exception as e:
            return jsonify({"error": "Erro ao buscar os livros", "details": str(e)}), 500

    @staticmethod
    @app.route("/api/livro/<int:id>", methods=["GET"])
    def get_livro_by_id(id):
        try:
            livro = Livro.query.get(id)
            if livro is None:
                return jsonify({"error": "Livro não encontrado"}), 404
            return jsonify(LivroController.livro_to_dict(livro)), 200
        except Exception as e:
            return jsonify({"error": "Erro ao buscar o livro", "details": str(e)}), 500

    @staticmethod
    @app.route("/api/livros", methods=["POST"])
    @app.route("/api/livros", methods=["POST"])
    @app.route("/api/livros", methods=["POST"])
  
  
    @app.route("/api/livros", methods=["POST"])
    def criar_livro():
        data = request.get_json()

        titulo = data.get("titulo")
        autor = data.get("autor")
        prateleira_id = data.get("prateleira_id")
        categoria = data.get("categoria")
        ano_publicado = data.get("ano_publicado")
        biblioteca_id = data.get("biblioteca_id")
        disponivel = data.get("disponivel")

        # Verificar se o campo categoria foi passado corretamente
        if not categoria:
            return jsonify({"error": "Categoria é obrigatória"}), 400
        
        biblioteca = db.session.query(Biblioteca).filter_by(id=biblioteca_id).first()

        if not biblioteca:
            return jsonify({"error": "Biblioteca não encontrada"}), 404
        
        
        prateleira = db.session.query(Prateleira).filter_by(id=prateleira_id).first()
        
        if not prateleira:
            return jsonify({"error": "Prateleira não encontrada."}), 404

        novo_livro = Livro(
            titulo=titulo,
            autor=autor,
            prateleira_id=prateleira_id,
            categoria=categoria,
            ano_publicado=ano_publicado,
            biblioteca_id=biblioteca_id,
            disponivel=disponivel
        )

        try:
            db.session.add(novo_livro)
            db.session.commit()
            return jsonify(novo_livro.to_json()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Erro ao criar livro.", "details": str(e)}), 500


    @staticmethod
    @app.route("/api/livros/<int:id>", methods=["PATCH"])
    def update_livro(id):
        try:
            data = request.json
            livro = Livro.query.get(id)
            if not livro:
                return jsonify({"error": "Livro não encontrado."}), 404

            if 'titulo' in data:
                livro.titulo = data['titulo']
            if 'autor' in data:
                livro.autor = data['autor']
            if 'ano_publicado' in data:
                livro.ano_publicado = data['ano_publicado']
            if 'disponivel' in data:
                livro.disponivel = data['disponivel']
            if 'status' in data:
                livro.status = data['status']

            db.session.commit()
            return jsonify({"message": "Livro atualizado com sucesso.", "livro": LivroController.livro_to_dict(livro)}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Erro ao atualizar o livro.", "details": str(e)}), 500

    @staticmethod
    def livro_to_dict(livro):
        """Método para converter o livro em um dicionário"""
        return {
            "id": livro.id,
            "titulo": livro.titulo,
            "autor": livro.autor,
            "ano_publicado": livro.ano_publicado,
            "disponivel": livro.disponivel,
            "status": livro.status,
            "categoria": livro.categoria,
            "biblioteca_nome": livro.biblioteca.nome  # Supondo que o nome da biblioteca está acessível
        }

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

            if usuario and usuario.senha == senha:
                is_admin = usuario.cpf == "adminCpf"  # Lógica para verificar se o usuário é admin
                return jsonify({
                    "cpf": usuario.cpf,
                    "nome": usuario.nome,
                    "admin": usuario.admin  # Envia o status de admin no retorno
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

    # Supondo que `livro` é uma relação do modelo `Emprestimo` com `Livro`
    emprestimo_data = {
        "emprestimo_id": emprestimo.id,
        "usuario_nome": emprestimo.usuario.nome,
        "livro_titulo": emprestimo.livro.titulo,  # Inclua o nome do livro aqui
        "data_emprestimo": emprestimo.data_emprestimo.isoformat(),
        "data_devolucao": emprestimo.data_devolucao.isoformat() if emprestimo.data_devolucao else None,
        "devolvido": emprestimo.devolvido,
        "multa": {
            "valor": emprestimo.multa.valor if emprestimo.multa else None,
            "data_pagamento": emprestimo.multa.data_pagamento.isoformat() if emprestimo.multa else None,
        },
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

    # Verifica se o livro está disponível
    if not livro.disponivel:
        return jsonify({"error": "O livro já está emprestado."}), 400

    try:
        # Criar o empréstimo
        novo_emprestimo = Emprestimo(livro_id=livro.id, usuario_id=usuario_id)
        print("Livro.disponivel: ------------------")
        livro.disponivel = False  # Atualiza a disponibilidade do livro
        db.session.add(novo_emprestimo)
        db.session.commit()

        return jsonify({"message": "Empréstimo criado com sucesso."}), 201

    except Exception as e:
        db.session.rollback()  # Garante que a transação será revertida em caso de erro
        return jsonify({"error": "Erro ao criar empréstimo.", "details": str(e)}), 500


    


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
