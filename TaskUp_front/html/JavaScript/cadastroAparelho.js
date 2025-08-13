document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("aparelhoForm");
    const pecasContainer = document.getElementById("pecasContainer");
    const addPecaBtn = document.getElementById("adicionarPeca");
    const listaPecasAplicadas = document.getElementById("listaPecasAplicadas");

    // Inputs de peças
    const nomePecaInput = document.getElementById("nomePeca");
    const quantidadePecaInput = document.getElementById("quantidadePeca");

    // Array para guardar peças
    const pecasAdicionadas = [];

    // Adicionar peça na lista
    addPecaBtn.addEventListener("click", () => {
        const nome = nomePecaInput.value.trim();
        const quantidade = quantidadePecaInput.value.trim();

        if (!nome || !quantidade) {
            alert("Preencha o nome da peça e a quantidade.");
            return;
        }

        pecasAdicionadas.push({ nome, quantidade: parseInt(quantidade) });

        const li = document.createElement("li");
        li.textContent = `${nome} - Quantidade: ${quantidade}`;

        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.style.marginLeft = "10px";
        btnRemover.style.background = "#e74c3c";
        btnRemover.style.color = "#fff";
        btnRemover.style.border = "none";
        btnRemover.style.padding = "3px 8px";
        btnRemover.style.borderRadius = "5px";
        btnRemover.style.cursor = "pointer";

        btnRemover.addEventListener("click", () => {
            pecasAdicionadas.splice(
                pecasAdicionadas.indexOf(
                    pecasAdicionadas.find(p => p.nome === nome && p.quantidade == quantidade)
                ), 1
            );
            li.remove();
        });

        li.appendChild(btnRemover);
        listaPecasAplicadas.appendChild(li);

        nomePecaInput.value = "";
        quantidadePecaInput.value = "";
    });

    // Submissão do formulário de cadastro de aparelho
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Pegando valores
        const nomeAparelho = document.getElementById("nome_aparelho").value.trim();
        const marcaAparelho = document.getElementById("marca_aparelho").value.trim();
        const defeitoAparelho = document.getElementById("defeito_aparelho").value.trim();
        const dataEntregaInput = document.getElementById("data_entrega").value;
        const dataEntrega = dataEntregaInput ? `${dataEntregaInput}T10:00:00` : "";

        // Validação
        if (!nomeAparelho || !marcaAparelho || !defeitoAparelho || !dataEntrega) {
            alert("Preencha todos os campos obrigatórios do aparelho!");
            return;
        }

        if (pecasAdicionadas.length === 0) {
            alert("Adicione pelo menos uma peça utilizada!");
            return;
        }

        // Objeto para enviar
        const dados = {
            nome_aparelho: nomeAparelho,
            marca_aparelho: marcaAparelho,
            defeito_aparelho: defeitoAparelho,
            data_entrega: dataEntrega,
            pecas: pecasAdicionadas
        };

        console.log("Dados para enviar:", dados);
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("aparelhoForm");
    const listaPecasAplicadas = document.getElementById("listaPecasAplicadas");
    const addPecaBtn = document.getElementById("adicionarPeca");

    const nomePecaInput = document.getElementById("nomePeca");
    const quantidadePecaInput = document.getElementById("quantidadePeca");

    const pecasAdicionadas = [];

    // Adicionar peça na lista
    addPecaBtn.addEventListener("click", () => {
        const nome = nomePecaInput.value.trim();
        const quantidadeStr = quantidadePecaInput.value.trim();
        const quantidade = parseInt(quantidadeStr);

        if (!nome || !quantidadeStr || isNaN(quantidade) || quantidade <= 0) {
            alert("Preencha o nome da peça e a quantidade corretamente.");
            return;
        }

        // Adiciona no array
        pecasAdicionadas.push({ nome, quantidade });

        // Cria item na lista visual
        const li = document.createElement("li");
        li.textContent = `${nome} - Quantidade: ${quantidade}`;

        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.style.marginLeft = "10px";
        btnRemover.style.background = "#e74c3c";
        btnRemover.style.color = "#fff";
        btnRemover.style.border = "none";
        btnRemover.style.padding = "3px 8px";
        btnRemover.style.borderRadius = "5px";
        btnRemover.style.cursor = "pointer";

        btnRemover.addEventListener("click", () => {
            // Remove do array
            const index = pecasAdicionadas.findIndex(p => p.nome === nome && p.quantidade === quantidade);
            if (index > -1) pecasAdicionadas.splice(index, 1);

            // Remove do DOM
            li.remove();
        });

        li.appendChild(btnRemover);
        listaPecasAplicadas.appendChild(li);

        // Limpa inputs
        nomePecaInput.value = "";
        quantidadePecaInput.value = "";
    });

    // Submissão do formulário
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nomeAparelho = document.getElementById("nome_aparelho").value.trim();
        const marcaAparelho = document.getElementById("marca_aparelho").value.trim();
        const defeitoAparelho = document.getElementById("defeito_aparelho").value.trim();
        const dataEntregaInput = document.getElementById("data_entrega").value;
        const dataEntrega = dataEntregaInput ? `${dataEntregaInput}T10:00:00` : "";

        if (!nomeAparelho || !marcaAparelho || !defeitoAparelho || !dataEntrega) {
            alert("Preencha todos os campos obrigatórios do aparelho!");
            return;
        }

        if (pecasAdicionadas.length === 0) {
            alert("Adicione pelo menos uma peça utilizada!");
            return;
        }

        const dados = {
            nome_aparelho: nomeAparelho,
            marca_aparelho: marcaAparelho,
            defeito_aparelho: defeitoAparelho,
            data_entrega: dataEntrega,
            pecas: pecasAdicionadas
        };

        console.log("Dados para enviar:", dados);

        try {
            const resposta = await fetch("/api/cadastrar-aparelho", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            if (resposta.ok) {
                alert("Aparelho cadastrado com sucesso!");
                form.reset();
                listaPecasAplicadas.innerHTML = "";
                pecasAdicionadas.length = 0;
            } else {
                alert("Erro ao cadastrar o aparelho.");
            }
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Falha na comunicação com o servidor.");
        }
    });
});

        // Aqui você faria o envio para seu backend
        try {
            const resposta = await fetch("/api/cadastrar-aparelho", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            if (resposta.ok) {
                alert("Aparelho cadastrado com sucesso!");
                form.reset();
                listaPecasAplicadas.innerHTML = "";
                pecasAdicionadas.length = 0;
            } else {
                alert("Erro ao cadastrar o aparelho.");
            }
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Falha na comunicação com o servidor.");
        }
    });
});
