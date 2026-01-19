let participantes = [];
let vencedoresBloqueados = new Set();

function adicionarNome() {
    const input = document.getElementById("nomeInput");
    const nomes = input.value.trim().split(/[,.\n]/);
    if (!input.value.trim()) return;

    nomes.forEach(n => {
        const nomeLimpo = n.trim();
        if (nomeLimpo) participantes.push(nomeLimpo);
    });

    input.value = "";
    atualizarTabela();
}

function deletarNome() {
    const input = document.getElementById("deleteIndex");
    const index = parseInt(input.value) - 1;
    if (isNaN(index) || index < 0 || index >= participantes.length) {
        alert("Cód. inválido");
        return;
    }
    participantes.splice(index, 1);
    vencedoresBloqueados.clear();
    atualizarTabela();
}

function deletarTodos() {
    if (confirm("Limpar lista completa?")) {
        participantes = [];
        vencedoresBloqueados.clear();
        atualizarTabela();
        document.getElementById("tabelaVencedores").innerHTML = "";
    }
}

function atualizarTabela() {
    const tabela = document.getElementById("tabelaNomes");
    tabela.innerHTML = "";
    participantes.forEach((nome, i) => {
        const cod = i + 1;
        const jaSorteado = vencedoresBloqueados.has(cod);
        const row = document.createElement("tr");
        if (jaSorteado) row.style.opacity = "0.5";
        row.innerHTML = `<td class="col-cod">${cod}</td><td>${nome} ${jaSorteado ? "<strong>(Sorteado)</strong>" : ""}</td>`;
        tabela.appendChild(row);
    });
}

function sortear() {
    const qtd = parseInt(document.getElementById("qtdVencedores").value);
    const disponiveis = participantes.map((n, i) => ({nome: n, cod: i+1})).filter(p => !vencedoresBloqueados.has(p.cod));

    if (isNaN(qtd) || qtd <= 0 || qtd > disponiveis.length) {
        alert("Quantidade inválida ou insuficiente.");
        return;
    }

    const sorteados = [];
    for (let i = 0; i < qtd; i++) {
        const res = disponiveis.splice(Math.floor(Math.random() * disponiveis.length), 1)[0];
        sorteados.push(res);
        vencedoresBloqueados.add(res.cod);
    }
    mostrarVencedores(sorteados);
    atualizarTabela();
}

function mostrarVencedores(lista) {
    const tabela = document.getElementById("tabelaVencedores");
    tabela.innerHTML = "";
    lista.forEach(p => {
        tabela.innerHTML += `<tr><td class="col-cod">${p.cod}</td><td>${p.nome}</td></tr>`;
    });
}

function resetarBloqueios() {
    vencedoresBloqueados.clear();
    document.getElementById("tabelaVencedores").innerHTML = "";
    atualizarTabela();
}
