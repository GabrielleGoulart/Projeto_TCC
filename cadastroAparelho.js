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

  // Renderizar lista de peças
  function renderLista() {
    lista.innerHTML = "";
    if (pecas.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Nenhuma peça adicionada.";
      lista.appendChild(li);
      return;
    }

    pecas.forEach((peca, index) => {
      const li = document.createElement("li");
      li.textContent = `${peca.nome} - Quantidade: ${peca.quantidade_utilizada}`;

      const btnRemover = document.createElement("button");
      btnRemover.textContent = "Remover";
      btnRemover.className = "btn-remover";
      btnRemover.type = "button";

      btnRemover.addEventListener("click", async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/pecas_utilizadas/${peca.id_peca}`, { method: "DELETE", mode: "cors" });
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

  // Carregar peças do banco
  async function carregarPecas() {
    lista.innerHTML = "<li>Carregando peças...</li>";
    try {
      const res = await fetch("http://localhost:8080/api/pecas_utilizadas", { method: "GET", mode: "cors" });
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      const dados = await res.json();

      // Ajuste para garantir que cada objeto tenha id_peca, quantidade_utilizada e data_utilizacao
      pecas = dados.map(p => ({
        id_peca: p.id_peca,
        nome: p.nome,
        quantidade_utilizada: p.quantidade_utilizada,
        data_utilizacao: p.data_utilizacao
      }));

      renderLista();
    } catch (err) {
      console.error("Erro ao carregar peças:", err);
      lista.innerHTML = `<li style="color:red;">Erro ao carregar peças: ${err.message}</li>`;
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
      const res = await fetch("http://localhost:8080/api/pecas_utilizadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, quantidade_utilizada: quantidade }), // correspondendo ao BD
        mode: "cors"
      });

      if (res.ok) {
        const novaPeca = await res.json(); 
        pecas.push({
          id_peca: novaPeca.id_peca,
          nome: novaPeca.nome,
          quantidade_utilizada: novaPeca.quantidade_utilizada,
          data_utilizacao: novaPeca.data_utilizacao
        });
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

  // Submissão do formulário de aparelho
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
      pecas: pecas.map(p => ({
        id_peca: p.id_peca,
        quantidade_utilizada: p.quantidade_utilizada,
        data_utilizacao: p.data_utilizacao
      }))
    };

    try {
      const res = await fetch("http://localhost:8080/api/aparelhos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAparelho),
        mode: "cors"
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
