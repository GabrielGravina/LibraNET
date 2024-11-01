from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
#from flask_migrate import Migrate

# Inicialização da aplicação Flask
app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///library.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Importa as rotas e modelos
import routes  # A importação deve estar aqui

# Cria as tabelas no banco de dados
with app.app_context():
    db.create_all()
    from populate_data import populate_data  # Mover a importação aqui
    populate_data(db)  # Chama a função de populamento
    print(app.url_map)  # Adicione esta linha para ver as rotas


if __name__ == "__main__":
    app.run(debug=True)
