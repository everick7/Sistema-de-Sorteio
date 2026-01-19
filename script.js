let participantes = [];
let vencedoresBloqueados = new Set();

function adicionarNome() {
    const input = document.getElementById("nomeInput");
    const textoEntrada = input.value.trim();

    if (!textoEntrada) {
        alert("Por favor, digite um ou mais nomes.");
        return;
    }

    // Separa por vírgula, ponto ou quebra de linha
    const nomesParaAdicionar = textoEntrada.split(/[,.\n]/);

    nomesParaAdicionar.forEach(item => {
        const nomeLimpo = item.trim();
        if (nomeLimpo.length > 0) {
            participantes.push(nomeLimpo);
        }
    });

    input.value = "";
    input.focus();
    atualizarTabela();
}

function deletarNome() {
    const input = document.getElementById("deleteIndex");
    const index = parseInt(input.value) - 1;

    if (isNaN(index) || index < 0 || index >= participantes.length) {
        alert("Código inválido.");
        return;
    }

    participantes.splice(index, 1);
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
    alert("Vencedores liberados para novo sorteio!");
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
            <td class="col-cod">${cod}</td>
            <td>${nome} ${jaSorteado ? "<strong>(Sorteado)</strong>" : ""}</td>
        `;
        tabela.appendChild(row);
    });
}

function sortear() {
    const qtdInput = document.getElementById("qtdVencedores");
    const qtd = parseInt(qtdInput.value);

    const disponiveis = participantes
        .map((nome, i) => ({ nome, cod: i + 1 }))
        .filter(p => !vencedoresBloqueados.has(p.cod));

    if (isNaN(qtd) || qtd <= 0) {
        alert("Insira uma quantidade válida.");
        return;
    }

    if (disponiveis.length === 0 || qtd > disponiveis.length) {
        alert("Não há participantes suficientes disponíveis.");
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
    atualizarTabela();
}

function mostrarVencedores(lista) {
    const tabela = document.getElementById("tabelaVencedores");
    tabela.innerHTML = ""; 

    lista.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="col-cod">${p.cod}</td>
            <td>${p.nome}</td>
        `;
        tabela.appendChild(row);
    });
}
