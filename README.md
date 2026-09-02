Vou deixar um README com cara de projeto real, não aquele clássico `# Tetris` seguido de três linhas e abandono no GitHub. 😐

# 🕹️ Tetris Retrô 2D

Um jogo de **Tetris clássico em 2D**, desenvolvido com **HTML, CSS e JavaScript**, utilizando a API **Canvas 2D** para renderização do tabuleiro e das peças.

O projeto possui uma estética inspirada nos antigos jogos de arcade, com visual pixelado, grade retrô e interface simples.

## 🎮 Demonstração

O jogo funciona diretamente no navegador, sem necessidade de servidor ou instalação de dependências.

## ✨ Recursos

* 🧱 Tabuleiro 2D com Canvas
* 🎮 7 peças clássicas do Tetris
* ⬅️ Movimento para esquerda e direita
* ⬇️ Queda da peça
* 🔄 Rotação das peças
* ⚡ Queda instantânea
* 🧹 Remoção de linhas completas
* 🏆 Sistema de pontuação
* 📈 Sistema de níveis
* ⏩ Aumento progressivo da velocidade
* ⏸️ Sistema de pausa
* 💀 Game Over
* 🕹️ Interface inspirada em arcades retrô
* 📱 Layout adaptável para telas menores

## 🛠️ Tecnologias

* **HTML5**
* **CSS3**
* **JavaScript**
* **Canvas 2D**

Não são utilizadas bibliotecas ou frameworks externos.

## 📁 Estrutura do projeto

```text
tetris/
│
├── index.html
├── style.css
└── script.js
```

### `index.html`

Responsável pela estrutura da página, incluindo:

* Tabuleiro
* Placar
* Pontuação
* Linhas
* Nível
* Botão de início
* Instruções

### `style.css`

Responsável pelo visual da aplicação:

* Tema retrô
* Cores neon
* Interface arcade
* Bordas e efeitos
* Responsividade

### `script.js`

Responsável pela lógica do jogo:

* Criação do tabuleiro
* Geração das peças
* Movimentação
* Rotação
* Colisão
* Queda das peças
* Limpeza de linhas
* Pontuação
* Níveis
* Pausa
* Game Over
* Renderização no Canvas

## 🎯 Controles

| Tecla    | Ação                |
| -------- | ------------------- |
| `←`      | Mover para esquerda |
| `→`      | Mover para direita  |
| `↓`      | Descer peça         |
| `↑`      | Girar peça          |
| `Espaço` | Queda instantânea   |
| `P`      | Pausar              |

## 🧮 Pontuação

A pontuação aumenta conforme o número de linhas removidas.

| Linhas | Pontos |
| -----: | -----: |
|      1 |    100 |
|      2 |    300 |
|      3 |    500 |
|      4 |    800 |

A pontuação também é multiplicada pelo nível atual.

## 📈 Níveis

A cada **10 linhas removidas**, o nível aumenta.

Conforme o nível aumenta, as peças caem mais rapidamente.

## 🖥️ Como executar

### 1. Clone o projeto

```bash
git clone https://github.com/gabrstackbuild/tetris.git
```

### 2. Entre na pasta

```bash
cd tetris
```

### 3. Abra o jogo

Abra o arquivo:

```text
index.html
```

diretamente no navegador.

Também é possível utilizar uma extensão como **Live Server** no VS Code.

## 🎨 Estilo visual

O projeto utiliza uma estética inspirada nos primeiros jogos de arcade:

* Fundo preto
* Verde neon
* Bordas brilhantes
* Blocos coloridos
* Grade escura
* Fonte monoespaçada
* Efeito pixelado

O Canvas utiliza:

```javascript
ctx = canvas.getContext("2d");
```

para desenhar o jogo em duas dimensões.

## 🚀 Possíveis melhorias

Algumas funcionalidades podem ser adicionadas futuramente:

* 👀 Sistema de próxima peça
* 🧲 Sistema de Hold
* 🏅 Recorde salvo no `localStorage`
* 🔊 Efeitos sonoros
* 🎵 Música retrô
* 📱 Controles touchscreen
* 🎨 Diferentes temas visuais
* 💥 Animação ao destruir linhas
* 🏆 Ranking de pontuações
* 👻 Ghost Piece
* ⚙️ Tela de configurações
* 🎚️ Diferentes níveis de dificuldade

## 📚 Objetivo do projeto

Este projeto foi desenvolvido para praticar conceitos fundamentais de desenvolvimento Web, principalmente:

* Manipulação do Canvas
* JavaScript
* Arrays e Matrizes
* Eventos de Teclado
* Loops de Animação
* Detecção de Colisão
* Lógica de Jogos
* Manipulação do DOM
* CSS Responsivo

## 📄 Licença

Este Projeto Pode Ser Utilizado Para Fins De Estudo e Aprendizado.

---

### 🕹️ tetris 2D

**HTML + CSS + JavaScript + Canvas 2D**

> Build it. Play it. Improve it.
