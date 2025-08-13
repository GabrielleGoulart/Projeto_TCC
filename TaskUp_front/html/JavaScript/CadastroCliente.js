document.addEventListener("DOMContentLoaded", function () {
  const radioPF = document.querySelector('input[value="pf"]');
  const radioPJ = document.querySelector('input[value="pj"]');
  const docLabel = document.getElementById('cpfCnpjLabel');
  const docInput = document.getElementById('cpfCnpj');
  const nomePF = document.getElementById('nomePessoaFisica');
  const nomePJ = document.getElementById('nomePessoaJuridica');
  const nomeCompleto = document.getElementById('nomeCompleto');
  const nomeEmpresa = document.getElementById('nomeEmpresa');
  const telefone = document.getElementById('telefone');
  const email = document.getElementById('email');
  const cep = document.getElementById('cep');
  const endereco = document.getElementById('endereco');
  const bairro = document.getElementById('bairro');
  const cidade = document.getElementById('cidade');
  const estado = document.getElementById('estado');
  const buscarBtn = document.getElementById('buscarBtn');
  const statusBusca = document.getElementById('statusBusca');
  const form = document.getElementById('clienteForm');

  function updateDocField() {
    docInput.value = '';
    statusBusca.textContent = '';
    if (radioPF.checked) {
      docLabel.textContent = 'CPF *';
      docInput.placeholder = 'Insira o CPF';
      nomePF.style.display = 'block';
      nomePJ.style.display = 'none';
    } else {
      docLabel.textContent = 'CNPJ *';
      docInput.placeholder = 'Insira o CNPJ';
      nomePF.style.display = 'none';
      nomePJ.style.display = 'block';
    }
  }

  radioPF.addEventListener('change', updateDocField);
  radioPJ.addEventListener('change', updateDocField);
  updateDocField();

  buscarBtn.addEventListener('click', async () => {
    console.log('Buscar clicado');
    const documento = docInput.value.replace(/\D/g, '');
    if (!documento) {
      statusBusca.textContent = 'Por favor, insira um CPF ou CNPJ para buscar.';
      statusBusca.style.color = 'red';
      return;
    }
    statusBusca.textContent = 'Buscando...';
    statusBusca.style.color = 'black';

    try {
      const response = await fetch(`http://localhost:8080/api/cliente/${documento}`);
      if (response.ok) {
        const cliente = await response.json();
        statusBusca.textContent = `Cliente encontrado: ${cliente.nomeCompleto || cliente.nomeEmpresa}`;
        statusBusca.style.color = 'green';

        if (radioPF.checked && cliente.nomeCompleto) {
          nomeCompleto.value = cliente.nomeCompleto;
        } else if (radioPJ.checked && cliente.nomeEmpresa) {
          nomeEmpresa.value = cliente.nomeEmpresa;
        }
        telefone.value = cliente.telefone || '';
        email.value = cliente.email || '';
        cep.value = cliente.cep || '';
        endereco.value = cliente.endereco || '';
        bairro.value = cliente.bairro || '';
        cidade.value = cliente.cidade || '';
        estado.value = cliente.estado || '';
      } else if (response.status === 404) {
        statusBusca.textContent = 'Cliente não encontrado. Você pode cadastrá-lo.';
        statusBusca.style.color = 'orange';
      } else {
        statusBusca.textContent = 'Erro ao buscar cliente.';
        statusBusca.style.color = 'red';
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      statusBusca.textContent = 'Erro ao conectar com o servidor.';
      statusBusca.style.color = 'red';
    }
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log('Cadastro enviado');

    const camposObrigatorios = [
      docInput,
      telefone,
      email,
      cep,
      bairro,
      cidade,
      estado,
      radioPF.checked ? nomeCompleto : nomeEmpresa
    ];

    for (const campo of camposObrigatorios) {
      if (!campo.value.trim()) {
        alert(`Por favor, preencha o campo: ${campo.previousElementSibling.textContent.replace('*','').trim()}`);
        campo.focus();
        return;
      }
    }

    const formData = {
      tipo: document.querySelector('input[name="tipo"]:checked').value,
      documento: docInput.value.replace(/\D/g, ''),
      nome: radioPF.checked ? nomeCompleto.value.trim() : nomeEmpresa.value.trim(),
      telefone: telefone.value.replace(/\D/g, ''),
      email: email.value.trim(),
      cep: cep.value.replace(/\D/g, ''),
      endereco: endereco.value.trim(),
      bairro: bairro.value.trim(),
      cidade: cidade.value.trim(),
      estado: estado.value.trim()
    };

    try {
      statusBusca.textContent = 'Cadastrando...';
      statusBusca.style.color = 'black';

      const response = await fetch('http://localhost:8080/api/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        statusBusca.textContent = '✅ Cliente cadastrado com sucesso!';
        statusBusca.style.color = 'green';
        form.reset();
        updateDocField();
      } else {
        statusBusca.textContent = `Erro no cadastro: ${result.message || 'Tente novamente.'}`;
        statusBusca.style.color = 'red';
      }
    } catch (error) {
      console.error('Erro ao tentar cadastrar o cliente:', error);
      statusBusca.textContent = 'Erro ao tentar salvar o cliente. Tente novamente mais tarde.';
      statusBusca.style.color = 'red';
    }
  });
});
