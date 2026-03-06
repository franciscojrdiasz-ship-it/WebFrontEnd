from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)


# --- CONFIGURAÇÃO DO BANCO DE DADOS (SQLite) ---
def init_db():
    conn = sqlite3.connect('vendas.db')
    cursor = conn.cursor()

    # Cria a tabela
    cursor.execute('''
                   CREATE TABLE IF NOT EXISTS vendas
                   (
                       id
                       INTEGER
                       PRIMARY
                       KEY
                       AUTOINCREMENT,
                       produto
                       TEXT,
                       regiao
                       TEXT,
                       mes
                       TEXT,
                       valor
                       REAL
                   )
                   ''')

    # Se a tabela estiver vazia, insere dados de teste
    cursor.execute('SELECT COUNT(*) FROM vendas')
    if cursor.fetchone()[0] == 0:
        dados_iniciais = [
            ('Laptop', 'Norte', 'Jan', 4500.00), ('Smartphone', 'Sul', 'Jan', 3200.00),
            ('Laptop', 'Sul', 'Fev', 5000.00), ('Tablet', 'Norte', 'Fev', 1500.00),
            ('Smartphone', 'Norte', 'Mar', 4100.00), ('Tablet', 'Sul', 'Mar', 2000.00)
        ]
        cursor.executemany('INSERT INTO vendas (produto, regiao, mes, valor) VALUES (?, ?, ?, ?)', dados_iniciais)
        conn.commit()
    conn.close()


# Inicializa o banco ao rodar o script
init_db()


# --- ROTAS DA NOSSA APLICAÇÃO ---
@app.route('/')
def index():
    # Serve o arquivo HTML principal
    return render_template('index.html')


@app.route('/api/vendas')
def obter_vendas():
    # Captura os filtros da URL (ex: ?regiao=Norte&produto=Laptop)
    filtro_regiao = request.args.get('regiao', 'Todas')
    filtro_produto = request.args.get('produto', 'Todos')

    conn = sqlite3.connect('vendas.db')
    cursor = conn.cursor()

    # Constrói a query SQL baseada nos filtros
    query = 'SELECT mes, SUM(valor) FROM vendas WHERE 1=1'
    parametros = []

    if filtro_regiao != 'Todas':
        query += ' AND regiao = ?'
        parametros.append(filtro_regiao)

    if filtro_produto != 'Todos':
        query += ' AND produto = ?'
        parametros.append(filtro_produto)

    query += ' GROUP BY mes ORDER BY mes'

    cursor.execute(query, parametros)
    resultados = cursor.fetchall()
    conn.close()

    # Formata os dados para o formato que o Chart.js entende (JSON)
    meses = [linha[0] for linha in resultados]
    valores = [linha[1] for linha in resultados]

    return jsonify({"labels": meses, "data": valores})


if __name__ == '__main__':
    app.run(debug=True)
