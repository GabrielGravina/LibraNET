from app import db
from datetime import datetime

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
    #prateleira = db.Column(db.String(50), nullable=False)
    biblioteca_id = db.Column(db.Integer, db.ForeignKey('biblioteca.id'), nullable=False)
    emprestimos = db.relationship('Emprestimo', backref='livro', lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "autor": self.autor,
            #"prateleira": self.prateleira,
            "biblioteca_id": self.biblioteca_id
        }

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(11), unique=True, nullable=False)
    emprestimos = db.relationship('Emprestimo', backref='usuario', lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "cpf": self.cpf
        }

class Emprestimo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    livro_id = db.Column(db.Integer, db.ForeignKey('livro.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    data_emprestimo = db.Column(db.DateTime, default=datetime.utcnow)
    data_devolucao = db.Column(db.DateTime, nullable=True)
    devolvido = db.Column(db.Boolean, default=False) 
    multa = db.relationship('Multa', backref='emprestimo', lazy=True)
    

    def to_json(self):
        return {
            "id": self.id,
            "livro_id": self.livro_id,
            "usuario_id": self.usuario_id,
            "data_emprestimo": self.data_emprestimo,
            "data_devolucao": self.data_devolucao,
            "devolvido": self.devolvido
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
    id_prateleira = db.Column(db.Integer, Primary_key=True)
    codigo = db.Column(db.String(50), )
    localizacao = db.Column(db.String(255), )
    biblioteca_id = db.Column(db.Integer, )
    biblioteca = db.relationship('Biblioteca', backref='prateleira', lazy=True)

    def to_json(self):
        return {
            "idPrateleira": self.id_prateleira,
            "codigo": self.codigo,
            "localizacao": self.localizacao,
            "bibliotecaId": self.biblioteca_id,
        }
    
class Reserva(db.Model):
    reserva_id = db.Column(db.Integer, Primary_key=True)
    usuario_id = db.Column(db.Integer, nullable=False)
    livro_id = db.Column(db.Integer, nullable=False)
    data_reserva = db.Column(db.DateTime, nullable=False)
    data_validade = db.Column(db.DateTime, nullable=False)

    def to_json(self):
        return {
            "reservaId": self.reserva_id,
            "usuarioId": self.usuario_id,
            "livroId": self.livro_id,
            "dataReserva": self.data_reserva,
            "dataValidade": self.data_validade
        }