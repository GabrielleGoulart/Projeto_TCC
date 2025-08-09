
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("aparelhoForm");

    form.addEventListener("submit", async function (event) {
      event.preventDefault(); 

      const formData = new FormData(form);

      try {
        const response = await fetch("/api/cadastro_aparelho", {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error("Erro ao cadastrar o aparelho.");
        }

        const result = await response.json();

        if (result.success) {
          alert("Aparelho cadastrado com sucesso!");
          form.reset(); // Limpa o formulário
        } else {
          alert("Erro: " + (result.message || "Não foi possível cadastrar o aparelho."));
        }
      } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        alert("Ocorreu um erro ao tentar cadastrar o aparelho.");
      }
    });
  }); /

