from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('mongodb://localhost:27017/')  # Conexão com o MongoDB

# Criação do banco de dados
db = client['app_de_academia']
usuarios_collection = db['usuarios']
treinos_collection = db['treinos']

@app.route('/cadastrar-usuario', methods=['GET', 'POST'])
def cadastrar_usuario():
    if request.method == 'POST':
        data = request.get_json()
        email = data['email']

        # Verificar se o e-mail já está cadastrado
        if usuarios_collection.find_one({'email': email}):
            return 'E-mail já cadastrado. Por favor, escolha outro e-mail.'

        # Restante do código para obter os dados do formulário e inserir o usuário no banco de dados
        nome = data['nome']
        idade = int(data['idade'])
        peso = float(data['peso'])
        altura = float(data['altura'])
        senha = data['senha']

        usuario = {
            'nome': nome,
            'idade': idade,
            'peso': peso,
            'altura': altura,
            'email': email,
            'senha': senha
        }

        usuarios_collection.insert_one(usuario)

        return 'Usuário cadastrado com sucesso!'

    return render_template('cadastrarUsuario/cadastrarUsuario.html')



@app.route('/entrar-usuario', methods=['GET', 'POST'])
def entrar_usuario():    
    if request.method == 'POST':
        data = request.get_json()
        email = data['email']
        senha = data['senha']

        # Verificar se o usuário existe no banco de dados
        usuario = usuarios_collection.find_one({'email': email, 'senha': senha})

        if usuario:
            return str(usuario['_id'])  # Retorna o ID do usuário se ele existir
        else:
            return 'Erro: email ou senha inválidos'


    # Renderizar o template 'entrarUsuario.html' para solicitações GET
    return render_template('entrarUsuario/entrarUsuario.html')



@app.route('/cadastrar-treino', methods=['GET', 'POST'])
def cadastrar_treino():
    if request.method == 'POST':
        data = request.get_json()
        if data is None:
            return 'Erro: Dados do treino ausentes'

        # Extrair os dados do formulário
        nome_treino = data.get('nome_treino')
        exercicios = data.get('exercicios')

        if nome_treino is None or exercicios is None:
            return 'Erro: Nome do treino ou exercícios ausentes'

        # Verificar se há um ID no localStorage
        userID = request.headers.get('userID')

        if userID:
            # Criar o documento para inserir no banco de dados
            treino = {
                'userID': userID,
                'nome_treino': nome_treino,
                'exercicios': exercicios
            }

            # Atualizar o treino para o usuário identificado pelo ID
            treinos_collection.update_one({'userID': userID}, {'$set': treino}, upsert=True)

            return 'Treino cadastrado com sucesso!'

        return 'Erro: ID do usuário não encontrado no header'

    return render_template('cadastrarTreino/cadastrarTreino.html')





@app.route('/')
def home():
    return render_template('home/index.html')


if __name__ == '__main__':
    app.run()
