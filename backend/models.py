from app import db
from datetime import datetime
import requests


class Biblioteca(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    endereco = db.Column(db.String(200), nullable=False)
    livros = db.relationship('Livro', backref='biblioteca', lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "endereco": self.endereco
        }

class Livro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    autor = db.Column(db.String(100), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    ano_publicado = db.Column(db.String(10))
    biblioteca_id = db.Column(db.Integer, db.ForeignKey('biblioteca.id'), nullable=False)
    disponivel = db.Column(db.Boolean)
    imagem_capa = db.Column(db.String(300))  # URL da imagem da capa


    exemplares = db.relationship('Exemplar', backref='livro', lazy=True)

    disponivel = db.Column(db.Boolean) # [ ] Isso fere a 2FN, já que disponível acaba dependendo da tabela exemplares, e não do livro em si.
    def to_json(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "autor": self.autor,
            "categoria": self.categoria,
            "ano_publicado": self.ano_publicado,
            "biblioteca_id": self.biblioteca_id,
            "disponivel": self.disponivel,
            "imagem_capa": self.imagem_capa
        }




class Exemplar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    livro_id = db.Column(db.Integer, db.ForeignKey('livro.id'), nullable=False)
    codigo_inventario = db.Column(db.String(50), unique=False, nullable=False, default="Default_Code")  #[ ] FIX Unique = False. Identificador único do exemplar
    disponivel = db.Column(db.Boolean, default=True)
    condicao = db.Column(db.String(50), default="Bom")  # Opcional: Condição do exemplar (ex: Bom, Ruim, etc.)
    biblioteca_id = db.Column(db.Integer, db.ForeignKey('biblioteca.id'), nullable=False)
    def to_json(self):
        return {
            "id": self.id,
            "codigo_inventario": self.codigo_inventario,
            "disponivel": self.disponivel,
            "condicao": self.condicao,
            "livro_id": self.livro_id
        }

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(11), unique=True, nullable=False)
    senha = db.Column(db.String(128), nullable=False)  # Senha do usuário
    admin = db.Column(db.Boolean, default=False)       # Propriedade admin
    emprestimos = db.relationship('Emprestimo', backref='usuario', lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "cpf": self.cpf,
            "admin": self.admin,
            "senha": self.senha
        }

class Emprestimo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    livro_id = db.Column(db.Integer, db.ForeignKey('livro.id'), nullable=False)
    exemplar_id = db.Column(db.Integer, db.ForeignKey('exemplar.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    data_emprestimo = db.Column(db.DateTime, default=datetime.utcnow)
    data_devolucao = db.Column(db.DateTime, nullable=True)
    devolvido = db.Column(db.Boolean, default=False) 
    multa = db.relationship('Multa', uselist=False, backref='emprestimo')

    # Relação com Exemplar
    exemplar = db.relationship('Exemplar', backref='emprestimos', uselist=False)

    # Relação com Livro através do Exemplar
    livro = db.relationship('Livro', backref='emprestimos', uselist=False)

    def to_json(self):
        # Verifica se existe multa e, em caso positivo, inclui os dados de multa
        multa_data = None
        if self.multa:
            multa_data = {
                "valor": self.multa.valor,
                "data_pagamento": self.multa.data_pagamento.isoformat() if self.multa.data_pagamento else None
            }

        return {
            "id": self.id,
            "livro_id": self.livro_id,
            "exemplar_id": self.exemplar_id,
            "usuario_id": self.usuario_id,
            "data_emprestimo": self.data_emprestimo.isoformat(),
            "data_devolucao": self.data_devolucao.isoformat() if self.data_devolucao else None,
            "devolvido": self.devolvido,
            "livro_titulo": self.livro.titulo if self.livro else None,  # Título do livro relacionado
            "exemplar_codigo": self.exemplar.codigo_inventario if self.exemplar else None,  # Código do exemplar relacionado
            "usuario_nome": self.usuario.nome if self.usuario else None,  # Nome do usuário relacionado
            "multa": multa_data
        }

    

class Multa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    emprestimo_id = db.Column(db.Integer, db.ForeignKey('emprestimo.id'), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    data_pagamento = db.Column(db.DateTime, nullable=True)

    def to_json(self):
        return {
            "id": self.id,
            "emprestimo_id": self.emprestimo_id,
            "valor": self.valor,
            "data_pagamento": self.data_pagamento
        }

class Prateleira(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(50), nullable=False)
    localizacao = db.Column(db.String(255), nullable=False)
    biblioteca_id = db.Column(db.Integer, db.ForeignKey('biblioteca.id'), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "localizacao": self.localizacao
        }
# class Reserva(db.Model):
#     reserva_id = db.Column(db.Integer, Primary_key=True)
#     usuario_id = db.Column(db.Integer, nullable=False)
#     livro_id = db.Column(db.Integer, nullable=False)
#     data_reserva = db.Column(db.DateTime, nullable=False)
#     data_validade = db.Column(db.DateTime, nullable=False)

#     def to_json(self):
#         return {
#             "reservaId": self.reserva_id,
#             "usuarioId": self.usuario_id,
#             "livroId": self.livro_id,
#             "dataReserva": self.data_reserva,
#             "dataValidade": self.data_validade
#         }