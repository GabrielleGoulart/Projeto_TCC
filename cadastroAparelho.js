document.addEventListener("DOMContentLoaded", async function () {
  const API_BASE = "http://localhost:8080";

  // Elementos do formulário
  const form = document.getElementById("aparelhoForm");
  const selectPeca = document.getElementById("pecaNome");
  const quantidadeInput = document.getElementById("pecaQuantidade");
  const addBtn = document.getElementById("addPecaBtn");
  const lista = document.getElementById("listaPecas");
  const tabela = document.getElementById("tabela-aparelhos");

  let todasPecas = []; // Todas as peças do banco
  let pecas = [];      // Peças adicionadas ao aparelho

  // Mostrar nome do arquivo
  window.mostrarNomeArquivo = function (input) {
    const nomeArquivo = document.getElementById("nomeArquivo");
    nomeArquivo.textContent = input.files.length > 0 ? input.files[0].name : "Nenhum arquivo escolhido";
  };

  // Renderiza a lista de peças adicionadas
  function renderLista() {
    lista.innerHTML = "";
    pecas.forEach((peca, index) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      label.textContent = `${peca.nome} - Quantidade: ${peca.quantidade}`;

      const btnRemover = document.createElement("button");
      btnRemover.textContent = "Remover";
      btnRemover.type = "button";
      btnRemover.className = "btn-remover";
      btnRemover.addEventListener("click", () => {
        pecas.splice(index, 1);
        renderLista();
      });

      li.appendChild(label);
      li.appendChild(btnRemover);
      lista.appendChild(li);
    });
  }

  // Buscar todas as peças do backend e popular o select
  async function carregarTodasPecas() {
    try {
      const res = await fetch(`${API_BASE}/api/peca`);
      if (res.ok) {
        todasPecas = await res.json();
        selectPeca.innerHTML = '<option value="">Selecione uma peça</option>';
        todasPecas.forEach(p => {
          const option = document.createElement("option");
          option.value = p.id;
          option.textContent = `${p.nome} (Estoque: ${p.quantidade_estoque})`;
          selectPeca.appendChild(option);
        });
      } else {
        console.error("Erro ao buscar peças do banco.");
      }
    } catch (err) {
      console.error("Erro ao conectar com API:", err);
    }
  }

  await carregarTodasPecas();

  // Adicionar peça à lista
  addBtn.addEventListener("click", () => {
    const idPecaNum = Number(selectPeca.value);
    if (isNaN(idPecaNum) || idPecaNum <= 0) {
      alert("Selecione uma peça válida.");
      return;
    }

    const pecaSelecionada = todasPecas.find(p => p.id === idPecaNum);
    if (!pecaSelecionada) {
      alert("Peça selecionada é inválida.");
      return;
    }

    const quantidade = parseInt(quantidadeInput.value.trim());
    if (isNaN(quantidade) || quantidade <= 0) {
      alert("Informe uma quantidade válida.");
      return;
    }

    if (pecas.find(p => p.id === idPecaNum)) {
      alert("Essa peça já foi adicionada. Atualize a quantidade se necessário.");
      return;
    }

    pecas.push({
      id: pecaSelecionada.id,
      nome: pecaSelecionada.nome,
      quantidade: quantidade
    });

    renderLista();
    selectPeca.value = "";
    quantidadeInput.value = "";
  });

  // Adiciona o aparelho na tabela após cadastro
  function adicionarNaTabela(aparelho) {
    const row = document.createElement("tr");
    const pecasTexto = aparelho.pecas && aparelho.pecas.length > 0
      ? aparelho.pecas.map(p => `${p.nome} (${p.quantidade})`).join(", ")
      : "-";

    row.innerHTML = `
      <td>${aparelho.id}</td>
      <td>${aparelho.nome_aparelho}</td>
      <td>${aparelho.marca_aparelho}</td>
      <td>${aparelho.defeito_aparelho}</td>
      <td>${aparelho.nome_tecnico}</td>
      <td>${aparelho.data_entrega}</td>
      <td>${aparelho.valor_total}</td>
      <td>${pecasTexto}</td>
    `;
    tabela.appendChild(row);
  }

  // Submissão do formulário
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (pecas.length === 0) {
      alert("Adicione pelo menos uma peça ao aparelho.");
      return;
    }

    const dadosAparelho = {
      nome_aparelho: document.getElementById("nome_aparelho").value.trim(),
      marca_aparelho: document.getElementById("marca_aparelho").value.trim(),
      defeito_aparelho: document.getElementById("defeito_aparelho").value.trim(),
      nome_tecnico: document.getElementById("nome_tecnico").value.trim(),
      data_entrega: document.getElementById("data_entrega").value,
      observacoes: document.getElementById("observacoes").value.trim(),
      valor_total: parseFloat(document.getElementById("valor_total").value),
      pecas: pecas.map(p => ({ id: p.id, quantidade: p.quantidade, nome: p.nome }))
    };

    try {
      const res = await fetch(`${API_BASE}/api/aparelhos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAparelho)
      });

      if (res.ok) {
        const aparelhoCadastrado = await res.json();
        adicionarNaTabela(aparelhoCadastrado);

        alert("Aparelho cadastrado com sucesso!");
        form.reset();
        pecas = [];
        renderLista();
        document.getElementById("nomeArquivo").textContent = "Nenhum arquivo escolhido";
      } else {
        alert("Erro ao cadastrar aparelho.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  });
});
