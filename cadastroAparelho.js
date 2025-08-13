document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("aparelhoForm");
  const nomePecaInput = document.getElementById("pecaNome");
  const quantidadePecaInput = document.getElementById("pecaQuantidade");
  const addPecaBtn = document.getElementById("addPecaBtn");
  const lista = document.getElementById("listaPecas");

  let pecas = [];

  // Mostrar nome do arquivo
  window.mostrarNomeArquivo = function (input) {
    const nomeArquivo = document.getElementById("nomeArquivo");
    nomeArquivo.textContent = input.files.length > 0 ? input.files[0].name : "Nenhum arquivo escolhido";
  };

  // Função para renderizar lista de peças
  function renderLista() {
    lista.innerHTML = "";
    pecas.forEach((peca, index) => {
      const li = document.createElement("li");
      li.textContent = `${peca.nome} - Quantidade: ${peca.quantidade_utilizada}`;

      const btnRemover = document.createElement("button");
      btnRemover.textContent = "Remover";
      btnRemover.className = "btn-remover";
      btnRemover.type = "button";

      btnRemover.addEventListener("click", async () => {
        try {
          const res = await fetch(`/api/pecas_utilizadas/${peca.id_peca}`, { method: "DELETE" });
          if (res.ok) {
            pecas.splice(index, 1);
            renderLista();
          } else {
            alert("Erro ao remover peça do banco.");
          }
        } catch (err) {
          console.error(err);
          alert("Erro ao remover peça.");
        }
      });

      li.appendChild(btnRemover);
      lista.appendChild(li);
    });
  }

  // Buscar peças do banco ao carregar a página
  async function carregarPecas() {
    try {
      const res = await fetch("/api/pecas_utilizadas"); 
      if (res.ok) {
        const dados = await res.json();
        pecas = dados; 
        renderLista();
      } else {
        console.error("Erro ao buscar peças do banco.");
      }
    } catch (err) {
      console.error("Erro ao conectar com API de peças:", err);
    }
  }

  await carregarPecas();

  // Adicionar nova peça
  addPecaBtn.addEventListener("click", async () => {
    const nome = nomePecaInput.value.trim();
    const quantidade = parseInt(quantidadePecaInput.value.trim());

    if (!nome || isNaN(quantidade) || quantidade <= 0) {
      alert("Preencha o nome da peça e uma quantidade válida.");
      return;
    }

    try {
      const res = await fetch("/api/pecas_utilizadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, quantidade_utilizada: quantidade })
      });

      if (res.ok) {
        const novaPeca = await res.json(); 
        pecas.push(novaPeca);
        renderLista();
        nomePecaInput.value = "";
        quantidadePecaInput.value = "";
      } else {
        alert("Erro ao adicionar peça.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com API.");
    }
  });

  // Submissão do formulário
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dadosAparelho = {
      nome_aparelho: document.getElementById("nome_aparelho").value.trim(),
      marca_aparelho: document.getElementById("marca_aparelho").value.trim(),
      defeito_aparelho: document.getElementById("defeito_aparelho").value.trim(),
      nome_tecnico: document.getElementById("nome_tecnico").value.trim(),
      data_entrega: document.getElementById("data_entrega").value,
      observacoes: document.getElementById("observacoes").value.trim(),
      valor_total: parseFloat(document.getElementById("valor_total").value),
      pecas: pecas.map(p => p.id_peca)
    };

    try {
      const res = await fetch("/api/aparelhos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAparelho)
      });

      if (res.ok) {
        alert("Aparelho cadastrado com sucesso!");
        form.reset();
        pecas = [];
        renderLista();
        document.getElementById("nomeArquivo").textContent = "Nenhum arquivo escolhido";
        await carregarPecas(); 
      } else {
        alert("Erro ao cadastrar aparelho.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  });
});
