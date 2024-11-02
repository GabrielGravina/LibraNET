from app import app, db
from flask import request, jsonify
from models import Biblioteca, Livro, Usuario, Emprestimo, Multa
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

# CRUD para Livros
@app.route("/api/livros", methods=["GET"])
def get_livros():
    livros = Livro.query.all()
    result = [livro.to_json() for livro in livros]
    return jsonify(result), 200

@app.route("/api/livros", methods=["POST"])
def create_livro():
    try:
        data = request.json
        titulo = data.get("titulo")
        autor = data.get("autor")
        prateleira = data.get("prateleira")
        biblioteca_id = data.get("biblioteca_id")

        if not all([titulo, autor, prateleira, biblioteca_id]):
            return jsonify({"error": "Missing required fields"}), 400

        livro = Livro(titulo=titulo, autor=autor, prateleira=prateleira, biblioteca_id=biblioteca_id)
        db.session.add(livro)
        db.session.commit()

        return jsonify({"msg": "Livro criado com sucesso"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# CRUD para Usuários
@app.route("/api/usuarios", methods=["GET"])
def get_usuarios():
    usuarios = Usuario.query.all()
    result = [usuario.to_json() for usuario in usuarios]
    return jsonify(result), 200

@app.route("/api/usuarios", methods=["POST"])
def create_usuario():
    try:
        data = request.json
        nome = data.get("nome")
        cpf = data.get("cpf")

        if not nome or not cpf:
            return jsonify({"error": "Missing required fields"}), 400

        usuario = Usuario(nome=nome, cpf=cpf)
        db.session.add(usuario)
        db.session.commit()

        return jsonify({"msg": "Usuário criado com sucesso"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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
@app.route("/api/emprestimo/<int:emprestimo_id>", methods=["GET"])
def get_emprestimo_by_id(emprestimo_id):
    emprestimo = Emprestimo.query.get(emprestimo_id)
    
    if not emprestimo:
        return jsonify({"error": "Empréstimo não encontrado"}), 404

    # Serializa cada multa na lista
    multas_data = [{"valor": multa.valor} for multa in emprestimo.multa]

    # Constrói o dicionário de resposta
    emprestimo_data = {
        "emprestimo_id": emprestimo.id,
        "usuario_nome": emprestimo.usuario.nome,
        "data_emprestimo": emprestimo.data_emprestimo,
        "data_devolucao": emprestimo.data_devolucao,
        "devolvido": emprestimo.devolvido,
        "multas": multas_data  # Inclui a lista de multas serializáveis
    }
    
    return jsonify(emprestimo_data), 200


@app.route("/api/emprestimos", methods=["POST"])
def create_emprestimo():
    try:
        data = request.json
        livro_id = data.get("livro_id")
        usuario_id = data.get("usuario_id")
        prazo_dias = data.get("prazo_dias", 7)  # Prazo padrão de 7 dias
        devolvido = data.get("devolvido")

        if not livro_id or not usuario_id:
            return jsonify({"error": "Missing required fields"}), 400

        data_devolucao = datetime.utcnow() #+ timedelta(days=prazo_dias)
        emprestimo = Emprestimo(livro_id=livro_id, usuario_id=usuario_id, data_devolucao=data_devolucao, devolvido=devolvido)
        db.session.add(emprestimo)
        db.session.commit()

        return jsonify({"msg": "Empréstimo criado com sucesso"}), 201
    except Exception as e:
        db.session.rollback()
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
                # Buscar as multas associadas ao empréstimo
                multas = db.session.query(Multa).filter(Multa.emprestimo_id == emp.id).all()
                valor_multa = sum(multa.valor for multa in multas) if multas else 0.0  # Soma todas as multas, se houver

                emprestimos.append({
                    "emprestimo_id": emp.id,
                    "usuario_nome": usuario.nome,
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
    data_atual = datetime.now()  # Corrige para chamar o método para obter a data atual
    if data_atual > emprestimo.data_devolucao:
        # Calcula a multa (exemplo)
        dias_atraso = (data_atual - emprestimo.data_devolucao).days
        multa_valor = dias_atraso * 5  # Exemplo: R$5 por dia de atraso
        # Atualize ou crie a multa no banco de dados
        multa = Multa.query.filter_by(emprestimo_id=emprestimo.id).first()
        if multa:
            multa.valor = multa_valor
        else:
            multa = Multa(emprestimo_id=emprestimo.id, valor=multa_valor)
            db.session.add(multa)
        db.session.commit()


# CRUD para Multas
@app.route("/api/multas", methods=["GET"])
def get_multas():
    multas = Multa.query.all()
    result = [multa.to_json() for multa in multas]
    return jsonify(result), 200

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
@app.route("/api/emprestimo/<int:id>", methods=["PATCH"])
def update_emprestimo(id):
    try:
        emprestimo = Emprestimo.query.get(id)
        if emprestimo is None:
            return jsonify({"error": "Empréstimo não encontrado."}), 404

        data = request.json

        # Atualiza o campo status, se fornecido
        if "status" in data:
            emprestimo.status = data["status"]
        
        # Atualiza o campo devolvido, se fornecido
        if "devolvido" in data:
            emprestimo.devolvido = data["devolvido"]
        
        # Atualiza o campo multa
        if "multa" in data:
            if isinstance(emprestimo.multa, list):
                # Adiciona uma nova multa à coleção, criando um novo objeto Multa
                emprestimo.multa.append(Multa(valor=data["multa"]))
            else:
                # Retorna erro se 'multa' não for uma coleção
                return jsonify({"error": "Campo 'multa' não é uma coleção."}), 400

        # Salva as alterações no banco de dados
        db.session.commit()
        return jsonify({"msg": "Empréstimo atualizado com sucesso."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
