document.addEventListener("DOMContentLoaded", async function () {
  const API_BASE = "http://localhost:8080";

  // Elementos do formulário
  const form = document.getElementById("aparelhoForm");
  const selectPeca = document.getElementById("pecaNome");
  const quantidadeInput = document.getElementById("pecaQuantidade");
  const addBtn = document.getElementById("addPecaBtn");
  const lista = document.getElementById("listaPecas");

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
      btnRemover.className = "btn-remover";
      btnRemover.type = "button";

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
    const idPecaStr = selectPeca.value;
    if (!idPecaStr) return;

    const idPecaNum = Number(idPecaStr);
    const pecaSelecionada = todasPecas.find(p => Number(p.id) === idPecaNum);
    if (!pecaSelecionada) return;

    const quantidade = parseInt(quantidadeInput.value.trim());
    if (isNaN(quantidade) || quantidade <= 0) return;

    const existe = pecas.find(p => Number(p.id) === idPecaNum);
    if (existe) return;

    pecas.push({
      id: pecaSelecionada.id,
      nome: pecaSelecionada.nome,
      quantidade: quantidade
    });

    renderLista();

    quantidadeInput.value = "";
    selectPeca.value = "";
  });

  // Submissão do formulário
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pecas.length === 0) return;

    const dadosAparelho = {
      nome_aparelho: document.getElementById("nome_aparelho").value.trim(),
      marca_aparelho: document.getElementById("marca_aparelho").value.trim(),
      defeito_aparelho: document.getElementById("defeito_aparelho").value.trim(),
      nome_tecnico: document.getElementById("nome_tecnico").value.trim(),
      data_entrega: document.getElementById("data_entrega").value,
      observacoes: document.getElementById("observacoes").value.trim(),
      valor_total: parseFloat(document.getElementById("valor_total").value),
      pecas: pecas.map(p => ({ id: p.id, quantidade: p.quantidade }))
    };

    try {
      // Cadastra o aparelho
      const res = await fetch(`${API_BASE}/api/aparelhos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAparelho)
      });

      if (res.ok) {
        const aparelhoCadastrado = await res.json();
        alert("Aparelho cadastrado com sucesso!");

        // Cadastra automaticamente na agenda
        const agenda = {
          dataAgendada: dadosAparelho.data_entrega,
          descricao: `Aparelho: ${dadosAparelho.nome_aparelho} - Defeito: ${dadosAparelho.defeito_aparelho}`,
          aparelho: { id: aparelhoCadastrado.id }
        };

        await fetch(`${API_BASE}/api/agenda`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(agenda)
        });

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
