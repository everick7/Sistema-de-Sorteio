let participantes = [];
let vencedoresBloqueados = new Set();

function adicionarNome() {
  const input = document.getElementById("nomeInput");
  const textoEntrada = input.value.trim();

  if (!textoEntrada) {
    alert("Por favor, digite um ou mais nomes.");
    return;
  }

  // O "pulo do gato": usamos uma Expressão Regular (Regex)
  // Ela separa o texto por vírgulas (,), pontos (.) ou quebras de linha (\n)
  const nomesParaAdicionar = textoEntrada.split(/[,.\n]/);

  nomesParaAdicionar.forEach(item => {
    const nomeLimpo = item.trim(); // Remove espaços inúteis ao redor do nome
    
    // Só adiciona se o nome não estiver vazio (evita problemas com vírgulas extras)
    if (nomeLimpo.length > 0) {
      participantes.push(nomeLimpo);
    }
  });

  input.value = ""; // Limpa o campo
  input.focus();    // Deixa o cursor pronto para o próximo
  atualizarTabela();
}

function deletarNome() {
  const input = document.getElementById("deleteIndex");
  const index = parseInt(input.value) - 1;

  if (isNaN(index) || index < 0 || index >= participantes.length) {
    alert("Código inválido.");
    return;
  }

  // Remove o nome e ajusta a lista (evita espaços vazios)
  participantes.splice(index, 1);
  // Remove do bloqueio se o código deletado existia lá (opcional)
  vencedoresBloqueados.clear(); 
  
  input.value = "";
  atualizarTabela();
}

function deletarTodos() {
  if(confirm("Deseja apagar toda a lista?")) {
    participantes = [];
    vencedoresBloqueados.clear();
    atualizarTabela();
    document.getElementById("tabelaVencedores").innerHTML = "";
  }
}

function resetarBloqueios() {
  vencedoresBloqueados.clear();
  document.getElementById("tabelaVencedores").innerHTML = "";
  atualizarTabela();
  alert("Os vencedores anteriores agora podem ser sorteados novamente!");
}

function atualizarTabela() {
  const tabela = document.getElementById("tabelaNomes");
  tabela.innerHTML = "";

  participantes.forEach((nome, i) => {
    const cod = i + 1;
    const jaSorteado = vencedoresBloqueados.has(cod);
    
    const row = document.createElement("tr");
    if (jaSorteado) row.style.opacity = "0.5";

    row.innerHTML = `
      <td>${cod}</td>
      <td>${nome} ${jaSorteado ? "<strong>(Sorteado)</strong>" : ""}</td>
    `;
    tabela.appendChild(row);
  });
}

function sortear() {
  const qtdInput = document.getElementById("qtdVencedores");
  const qtd = parseInt(qtdInput.value);

  // Filtra apenas participantes que ainda não ganharam
  const disponiveis = participantes
    .map((nome, i) => ({ nome, cod: i + 1 }))
    .filter(p => !vencedoresBloqueados.has(p.cod));

  if (isNaN(qtd) || qtd <= 0) {
    alert("Insira uma quantidade válida de vencedores.");
    return;
  }

  if (disponiveis.length === 0) {
    alert("Não há participantes disponíveis para sorteio.");
    return;
  }

  if (qtd > disponiveis.length) {
    alert(`Quantidade solicitada (${qtd}) é maior que participantes disponíveis (${disponiveis.length}).`);
    return;
  }

  const sorteados = [];
  const copiaCandidatos = [...disponiveis];

  for (let i = 0; i < qtd; i++) {
    const randomIndex = Math.floor(Math.random() * copiaCandidatos.length);
    const vencedor = copiaCandidatos.splice(randomIndex, 1)[0];
    sorteados.push(vencedor);
    vencedoresBloqueados.add(vencedor.cod);
  }

  mostrarVencedores(sorteados);
  atualizarTabela(); // Atualiza a lista principal para mostrar quem foi bloqueado
}

function mostrarVencedores(lista) {
  const tabela = document.getElementById("tabelaVencedores");
  tabela.innerHTML = ""; // Limpa sorteio anterior

  lista.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.cod}</td>
      <td>${p.nome}</td>
    `;
    tabela.appendChild(row);
  });
}