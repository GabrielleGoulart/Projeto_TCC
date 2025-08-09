
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch("/api/peca", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Erro ao cadastrar a peça.");
        }

        const result = await response.json();

        if (result.success) {
          alert("Peça cadastrada com sucesso!");
          form.reset();
        } else {
          alert("Erro: " + (result.message || "Não foi possível cadastrar a peça."));
        }
      } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        alert("Erro ao processar o cadastro. Tente novamente mais tarde.");
      }
    });
  });

