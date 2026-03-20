from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
from sqlalchemy import func
import requests

app = Flask(__name__)

# --- CONFIGURAÇÃO SQL (Histórico de Vendas) ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vendas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Venda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    categoria = db.Column(db.String(50), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    valor_total = db.Column(db.Float, nullable=False)


with app.app_context():
    db.create_all()

# --- CONFIGURAÇÃO MONGODB (Carrinho Temporário) ---
mongo_client = MongoClient('mongodb://localhost:27017/')
mongo_db = mongo_client['loja_db']
colecao_carrinho = mongo_db['carrinhos']


# ==========================================
# ROTAS DE TELA (Frontend)
# ==========================================
@app.route('/')
def vitrine():
    return render_template('index.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


# ==========================================
# ROTAS DE API (Backend)
# ==========================================
@app.route('/api/produtos', methods=['GET'])
def get_produtos():
    # Busca produtos da Fake Store
    resposta = requests.get('https://fakestoreapi.com/products')
    return jsonify(resposta.json())


@app.route('/api/carrinho', methods=['POST'])
def adicionar_ao_carrinho():
    # Recebe o produto clicado e salva no MongoDB
    produto = request.get_json()
    if not produto:
        return jsonify({"erro": "Nenhum dado recebido"}), 400

    colecao_carrinho.insert_one(produto)
    return jsonify({"mensagem": "Adicionado!"}), 201


@app.route('/api/carrinho', methods=['GET'])
def listar_carrinho():
    # Conta quantos itens tem no MongoDB
    itens = list(colecao_carrinho.find({}, {'_id': 0}))
    return jsonify(itens), 200


@app.route('/api/checkout', methods=['POST'])
def finalizar_compra():
    # 1. Pega do MongoDB
    itens = list(colecao_carrinho.find({}))
    if not itens:
        return jsonify({"erro": "Carrinho vazio!"}), 400

    # 2. Agrupa por categoria
    vendas_cat = {}
    for item in itens:
        cat = item.get('category', 'Outros')
        preco = float(item.get('price', 0))
        if cat not in vendas_cat:
            vendas_cat[cat] = {'qtd': 0, 'total': 0.0}
        vendas_cat[cat]['qtd'] += 1
        vendas_cat[cat]['total'] += preco

    # 3. Salva no SQL
    for cat, dados in vendas_cat.items():
        nova_venda = Venda(categoria=cat, quantidade=dados['qtd'], valor_total=dados['total'])
        db.session.add(nova_venda)
    db.session.commit()

    # 4. Limpa o MongoDB
    colecao_carrinho.delete_many({})
    return jsonify({"mensagem": "Sucesso!"}), 200


@app.route('/api/dashboard/dados', methods=['GET'])
def dados_dashboard():
    # Puxa os dados consolidados do SQL para o Chart.js
    resultados = db.session.query(
        Venda.categoria,
        func.sum(Venda.valor_total).label('total_vendido')
    ).group_by(Venda.categoria).all()

    return jsonify({
        "categorias": [r.categoria for r in resultados],
        "vendas": [round(r.total_vendido, 2) for r in resultados]
    })


if __name__ == '__main__':
    app.run(debug=True)