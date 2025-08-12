document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("aparelhoForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Captura dos dados do formulário
    const data = {
      nome_aparelho: document.getElementById("nome_aparelho").value,
      defeito: document.getElementById("defeito").value,
      servico_executados: document.getElementById("servicos_executados").value,
      pecas_aplicadas: document.getElementById("pecas_aplicadas").value,
      quantidade_aplicada: parseInt(document.getElementById("quantidade_aplicada").value),
      nome_tecnico: document.getElementById("nome_tecnico").value,
      data_entrega: document.getElementById("data_entrega").value,  
      observacoes: document.getElementById("observacoes").value,
      valor_total: parseFloat(document.getElementById("valor_total").value),
      foto_aparelho: document.getElementById("foto_aparelho").value 
    };

    try {
      const response = await fetch("http://localhost:8080/api/Cadastro_Aparelhos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar o aparelho.");
      }

      const result = await response.json();

      alert("Aparelho cadastrado com sucesso!");
      form.reset();

      // Salva data entrega para exibir na agenda, caso precise
      if (result.aparelho && result.aparelho.data_entrega) {
        localStorage.setItem("ultimaDataEntrega", result.aparelho.data_entrega);
      }

      // Redireciona para agenda ou outra página
      window.location.href = "agenda.html";

    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert("Erro ao processar o cadastro. Tente novamente mais tarde.");
    }
  });
});
