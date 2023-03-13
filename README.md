# SPA para cadastro de dados de pontos de coleta
 
 `Plataforma para cadastro de dados de pontos de coleta. Esta plataforma irá auxiliar a equipes de Soluções para Áreas Contaminadas a fazer um melhor
gerenciamento dos dados coletados.`
 
 ## 🚀 Começando
 Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.
 
 ## 📋 Pré-requisitos
 - Docker
 - API Key Google (Com api javascript do Google Maps ativada)

## 💡 Tecnologias Utilizadas:
- ReactJS/Typescript
- Yup - Para validação de dados
- Formik - Para formulários
- Material UI - Para estilização

## 📋 Para executar o projeto
 
#### 1 - É necessário clonar o repositório com o comando `git clone https://github.com/zehenrique0822/safe-collection-web.git`

#### 2 - Crie o .env de acordo com o .env.example e preencha a api key do google ( mais informações sobre em https://maplink.global/blog/como-obter-chave-api-google-maps/ a API que deve ser ativada e Maps JavaScript API )

#### 3 - Execute o comando `docker build -t safe-collection-web .`

#### 4 - Execute o comando `docker run -p 3001:3001 safe-collection-web`

#### 5 - Após iniciar a SPA utilizará a porta `3001` para acessar -> http://localhost:3001

#### Desenvolvido por José Henrique. 
