# WebFrontEnd
# 🛒 Dashboard de Vendas Full-Stack (Persistência Poliglota)

Este é um projeto full-stack completo que simula um e-commerce com integração de API externa, carrinho de compras e um dashboard analítico. O grande diferencial desta aplicação é a utilização de **Persistência Poliglota**, combinando bancos de dados NoSQL e SQL para extrair o melhor de cada arquitetura.

## 🚀 Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Flexbox), JavaScript (Vanilla)
* **Backend:** Python, Flask
* **Banco de Dados Temporário (NoSQL):** MongoDB (via `pymongo`) - Utilizado para gerenciar o carrinho de compras de forma flexível e rápida.
* **Banco de Dados Relacional (SQL):** SQLite (via `flask_sqlalchemy`) - Utilizado para registrar o histórico de vendas e garantir a integridade dos dados financeiros.
* **APIs e Bibliotecas:** * [Fake Store API](https://fakestoreapi.com/) (Catálogo de produtos em tempo real)
  * [Chart.js](https://www.chartjs.org/) (Renderização de gráficos dinâmicos)

## ⚙️ Funcionalidades

- **Vitrine Dinâmica:** Consumo de API externa para renderizar produtos, imagens e preços formatados em Reais (BRL).
- **Carrinho Inteligente:** Adição de itens com verificação de duplicidade e cálculo automático de quantidades armazenados no MongoDB.
- **Checkout e Migração de Dados:** Ao finalizar a compra, o sistema processa os itens do NoSQL, calcula os totais por categoria e consolida os dados de forma permanente no banco relacional (SQL), esvaziando o carrinho em seguida.
- **Dashboard de BI:** Geração de gráficos em tempo real lendo os dados consolidados do banco SQL.
- **UI/UX:** Notificações assíncronas (Toasts) e layout 100% responsivo.

## 🛠️ Como executar o projeto localmente

1. Clone o repositório:
   ```bash
   git clone [https://github.com/SEU_USUARIO/dashboard-vendas-flask.git](https://github.com/SEU_USUARIO/dashboard-vendas-flask.git)
