 document.addEventListener("DOMContentLoaded", function() {
      const radioPF = document.querySelector('input[value="pf"]');
      const radioPJ = document.querySelector('input[value="pj"]');
      const docLabel = document.getElementById('cpfCnpjLabel');
      const docInput = document.getElementById('cpfCnpj');
      const nomePF = document.getElementById('nomePessoaFisica');
      const nomePJ = document.getElementById('nomePessoaJuridica');
      const telefoneInput = document.getElementById('telefone');
      const cepInput = document.getElementById('cep');
      
      // Função para alternar entre Pessoa Física e Pessoa Jurídica
      function updateDocField() {
        if (radioPF.checked) {
          docLabel.textContent = 'CPF *';
          docInput.placeholder = 'Insira o CPF';
          nomePF.style.display = 'block';
          nomePJ.style.display = 'none';
          VMasker(docInput).maskPattern('999.999.999-99'); // Formata CPF
        } else {
          docLabel.textContent = 'CNPJ *';
          docInput.placeholder = 'Insira o CNPJ';
          nomePF.style.display = 'none';
          nomePJ.style.display = 'block';
          VMasker(docInput).maskPattern('99.999.999/9999-99'); // Formata CNPJ
        }
      }

      // Máscara de Telefone
      VMasker(telefoneInput).maskPattern('(99) 9 9999-9999');

      // Máscara de CEP
      VMasker(cepInput).maskPattern('99999-999');

      // Iniciar a alternância de CPF/CNPJ
      radioPF.addEventListener('change', updateDocField);
      radioPJ.addEventListener('change', updateDocField);
      updateDocField(); // Inicialização

      // Função para validar o formulário antes do envio
      const form = document.getElementById('clienteForm');
      form.addEventListener('submit', function(event) {
        let valid = true;
        // Verificar se o CPF/CNPJ está preenchido corretamente
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
          event.preventDefault(); // Impede o envio do formulário se houver erros
        }
      });

      // Quando o formulário for enviado
      form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evitar o envio padrão do formulário
        
        // Coletar os dados do formulário
        const formData = new FormData(this);  // Pega todos os dados do formulário, incluindo o arquivo

        try {
          // Enviar os dados para a API (backend)
          const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            body: formData // Envia o formulário como FormData, permitindo envio de arquivos
          });

          // Verificar se a resposta foi bem-sucedida
          const result = await response.json();  // A resposta da API será no formato JSON

          if (response.ok) {
            alert('Cliente cadastrado com sucesso!');  // Mensagem de sucesso
            this.reset();  // Limpar o formulário após o envio
          } else {
            alert(`Erro: ${result.message}`);  // Mensagem de erro com base na resposta da API
          }
        } catch (error) {
          // Exibir erro caso algo falhe na requisição
          console.error('Erro ao tentar cadastrar o cliente:', error);
          alert('Ocorreu um erro ao tentar salvar o cliente. Tente novamente mais tarde.');
        }
      });
    });