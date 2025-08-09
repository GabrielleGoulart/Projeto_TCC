document.addEventListener("DOMContentLoaded", function() {

  VMasker(document.querySelector('input#cpfCnpj')).maskPattern('999.999.999-99');

  VMasker(document.querySelector('input#cpfCnpj')).maskPattern('99.999.999/9999-99');
  
  VMasker(document.querySelector('input[type="tel"]')).maskPattern('(99) 9 9999-9999');
  
  VMasker(document.querySelector('input[type="text"]:not([id="cpfCnpj"])')).maskPattern('99999-999');
  
  // Alternar entre CPF e CNPJ
  const radioPF = document.querySelector('input[value="pf"]');
  const radioPJ = document.querySelector('input[value="pj"]');
  const docLabel = document.getElementById('cpfCnpjLabel');
  const docInput = document.getElementById('cpfCnpj');
  const nomePF = document.getElementById('nomePessoaFisica');
  const nomePJ = document.getElementById('nomePessoaJuridica');

  // Função para alternar entre Pessoa Física e Pessoa Jurídica
  function updateDocField() {
    if (radioPF.checked) {
      docLabel.textContent = 'CPF *';
      docInput.placeholder = 'Insira o CPF';
      nomePF.style.display = 'block';
      nomePJ.style.display = 'none';
      VMasker(docInput).maskPattern('999.999.999-99');
    } else {
      docLabel.textContent = 'CNPJ *';
      docInput.placeholder = 'Insira o CNPJ';
      nomePF.style.display = 'none';
      nomePJ.style.display = 'block';
      VMasker(docInput).maskPattern('99.999.999/9999-99'); 
    }
  }

  radioPF.addEventListener('change', updateDocField);
  radioPJ.addEventListener('change', updateDocField);
  updateDocField(); // Inicialização

  
  const form = document.getElementById('clienteForm');
  form.addEventListener('submit', function(event) {
    let valid = true;

    if (!docInput.value) {
      valid = false;
      alert("Por favor, insira um CPF ou CNPJ.");
    }

    // Verificar se os campos obrigatórios estão preenchidos
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
      if (!input.value) {
        valid = false;
        alert(`Por favor, preencha o campo ${input.previousElementSibling.textContent.trim()}`);
      }
    });

    if (!valid) {
      event.preventDefault(); 
    }
  });

  form.addEventListener('submit', async function(event) {
    event.preventDefault(); // 
    
    const formData = new FormData(this); 

    try {
      const response = await fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        body: formData 
      });

    
      const result = await response.json();  

      if (response.ok) {
        alert('Cliente cadastrado com sucesso!');  
        this.reset();    
      } else {
        alert(`Erro: ${result.message}`);  
      }
    } catch (error) {
      console.error('Erro ao tentar cadastrar o cliente:', error);
      alert('Ocorreu um erro ao tentar salvar o cliente. Tente novamente mais tarde.');
    }
  });
});
