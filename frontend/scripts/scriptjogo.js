const BASE_URL = 'https://jogo-forca-one.vercel.app';

fetch(`${BASE_URL}/categorias`)
  .then(response => response.json())
  .then(categorias => console.log(categorias))
  .catch(error => console.error('Erro ao obter categorias:', error));

fetch(`${BASE_URL}/palavras`)
  .then(response => response.json())
  .then(palavras => console.log(palavras))
  .catch(error => console.error('Erro ao obter palavras:', error));

let categoriaEscolhida = {};
let palavraEscolhida = "";
let letrasCorretas = new Set();
let letrasErradas = new Set();
let tentativas = 0;
const maxTentativas = 6;

const palavras = document.getElementById("palavras");
const tentativa = document.getElementById("tentativas");
const forcaImg = document.getElementById("forca-img");
const erros = document.getElementById("erros");
const teclado = document.getElementById("teclado");

function buscarCategorias() {
  return fetch('/categorias')
    .then(response => response.json())
    .catch(error => console.error('Erro ao obter categorias:', error));
}

function buscarPalavras() {
  return fetch('/palavras')
    .then(response => response.json())
    .catch(error => console.error('Erro ao obter palavras:', error));
}

function escolherCategoriaAleatoria(categorias) {
  return categorias[Math.floor(Math.random() * categorias.length)];
}

function escolherPalavraAleatoria(palavrasDaCategoria) {
  return palavrasDaCategoria[Math.floor(Math.random() * palavrasDaCategoria.length)].palavra;
}

function exibirPalavra() {
  let exibicao = "";
  for (const letra of palavraEscolhida) {
    if (letrasCorretas.has(letra)) {
      exibicao += letra;
    } else {
      exibicao += "_";
    }
    exibicao += " ";
  }
  palavras.textContent = exibicao;
  return exibicao;
}

function exibirCategoria() {
  document.getElementById("categoria").textContent = "Categoria: " + categoriaEscolhida.nome;
}

function selecionarLetra(letra) {
  verificarLetra(letra.toLowerCase());
}

function exibirLetrasErradas() {
  if (letrasErradas.size > 0) {
    const letrasErradasStr = Array.from(letrasErradas).join(", ");
    erros.textContent = "Letras erradas: " + letrasErradasStr;
  } else {
    erros.textContent = "Letras erradas:";
  }
}

function verificarLetra(letra) {
  if (!letra.match(/[a-z]/)) {
    Swal.fire({
      icon: 'warning',
      text: 'Digite uma letra válida.'
    })
    return;
  }

  if (letrasCorretas.has(letra) || letrasErradas.has(letra)) {
    Swal.fire({
      icon: 'warning',
      text: 'Você já digitou essa letra antes.'
    })
    return;
  }

  if (palavraEscolhida.includes(letra)) {
    letrasCorretas.add(letra);
  } else {
    letrasErradas.add(letra);
    tentativas++;
    forcaImg.style.background = `url('imagem/forca-${tentativas}.png')`;
  }

  tentativa.textContent = `Tentativas restantes: ${maxTentativas - tentativas}`;

  const palavraExibida = exibirPalavra();
  exibirLetrasErradas();
  atualizarJogo(palavraExibida);
}

function atualizarJogo(palavraExibida) {
  if (letrasErradas.size >= maxTentativas) {
    Swal.fire({
      icon: 'error',
      title: 'Você perdeu!',
      html: `A palavra correta era: <span class="perdeu-texto">${palavraEscolhida}</span>`,
    }).then(() => reiniciarJogo());
  } else if (!palavraExibida.includes("_")) {
    Swal.fire({
      icon: 'success',
      title: 'Parabéns!',
      html: `Você acertou a palavra: <span class="ganhou-texto">${palavraEscolhida}</span>`,
      confirmButtonText: 'OK'
    }).then(() => 
    reiniciarJogo());
  }
}

function reiniciarJogo() {
  letrasCorretas.clear();
  letrasErradas.clear();
  tentativas = 0;
  forcaImg.style.background = "url('imagem/forca.png')";
  teclado.querySelectorAll("button").forEach((button) => {
    button.disabled = false;
  });

  Promise.all([buscarCategorias(), buscarPalavras()]).then(([categorias, palavras]) => {
    categoriaEscolhida = escolherCategoriaAleatoria(categorias);
    exibirCategoria();
    const palavrasDaCategoria = palavras.filter(palavra => palavra.categorias_id === categoriaEscolhida.id);
    palavraEscolhida = escolherPalavraAleatoria(palavrasDaCategoria);
    exibirPalavra();
    exibirLetrasErradas();
  }).catch(error => console.error('Erro ao reiniciar o jogo:', error));

  tentativa.textContent = `Tentativas restantes: ${maxTentativas}`;
}

reiniciarJogo(); 

