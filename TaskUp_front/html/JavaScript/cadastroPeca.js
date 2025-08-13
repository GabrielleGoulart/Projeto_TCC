document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = {
      nome: document.getElementById('peca').value,
      descricao: document.getElementById('descricao').value,
      preco_unitario: parseFloat(document.getElementById('preco').value),
      quantidade_estoque: parseInt(document.getElementById('estoque').value),
      estoque_minimo: parseInt(document.getElementById('minimo').value)
    };

    try {
      const response = await fetch("http://localhost:8080/api/peca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar a peça.");
      }

      alert("Peça cadastrada com sucesso!");
      form.reset();

    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert("Erro ao processar o cadastro. Tente novamente mais tarde.");
    }
  });
});
