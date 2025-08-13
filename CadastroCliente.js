document.addEventListener("DOMContentLoaded", function () {
  // Elementos do formulário
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
  const formCliente = document.getElementById('clienteForm');
  const tabelaClientesBody = document.querySelector('#tabela-clientes tbody');

  // Aplicar máscaras
  function aplicarMascaras() {
    if (radioPF.checked) {
      VMasker(docInput).maskPattern('999.999.999-99');
    } else {
      VMasker(docInput).maskPattern('99.999.999/9999-99');
    }
    VMasker(telefone).maskPattern('(99) 9 9999-9999');
    VMasker(cep).maskPattern('99999-999');
  }

  // Alternar PF/PJ
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
    aplicarMascaras();
  }

  radioPF.addEventListener('change', updateDocField);
  radioPJ.addEventListener('change', updateDocField);
  updateDocField();

  // Buscar cliente
  buscarBtn.addEventListener('click', async () => {
    const documento = docInput.value.replace(/\D/g, '');
    if (!documento) {
      alert('Por favor, insira um CPF ou CNPJ para buscar.');
      return;
    }
    statusBusca.textContent = 'Buscando...';
    statusBusca.style.color = 'black';

    try {
      const endpoint = radioPF.checked 
        ? `http://localhost:8080/api/cliente/cpf/${documento}`
        : `http://localhost:8080/api/cliente/cnpj/${documento}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      });

      if (response.ok) {
        const cliente = await response.json();
        statusBusca.textContent = `Cliente encontrado: ${cliente.nome || cliente.nomeCompleto || cliente.nomeEmpresa}`;
        statusBusca.style.color = 'green';

        if (radioPF.checked && cliente.nomeCompleto) nomeCompleto.value = cliente.nomeCompleto;
        if (radioPJ.checked && cliente.nomeEmpresa) nomeEmpresa.value = cliente.nomeEmpresa;
        telefone.value = cliente.telefone || '';
        email.value = cliente.email || '';
        cep.value = cliente.cep || '';
        endereco.value = cliente.endereco || '';
        bairro.value = cliente.bairro || '';
        cidade.value = cliente.cidade || '';
        estado.value = cliente.estado || '';
      } else if (response.status === 404) {
        statusBusca.textContent = 'Cliente não encontrado.';
        statusBusca.style.color = 'orange';
      } else {
        statusBusca.textContent = 'Erro na busca.';
        statusBusca.style.color = 'red';
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      statusBusca.textContent = 'Erro ao conectar com o servidor.';
      statusBusca.style.color = 'red';
    }
  });

  // Cadastro de cliente com transição
  formCliente.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!docInput.value || !telefone.value || !email.value || !cep.value || !bairro.value || !cidade.value || !estado.value ||
        (radioPF.checked && !nomeCompleto.value) || (radioPJ.checked && !nomeEmpresa.value)) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const formData = {
      tipo: radioPF.checked ? 'pf' : 'pj',
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
        body: JSON.stringify(formData),
        mode: 'cors'
      });

      const result = await response.json();

      if (response.ok) {
        statusBusca.textContent = 'Cliente cadastrado com sucesso!';
        statusBusca.style.color = 'green';
        formCliente.reset();
        updateDocField();
        carregarClientes();

        // Transição suave para CadastroAparelho
        document.body.classList.add('fade-out');
        setTimeout(() => { window.location.href = "cadastroAparelho.html"; }, 500);
      } else {
        alert(`Erro no cadastro: ${result.message || 'Verifique os dados.'}`);
        statusBusca.textContent = 'Erro ao cadastrar cliente.';
        statusBusca.style.color = 'red';
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      statusBusca.textContent = 'Erro ao conectar com o servidor.';
      statusBusca.style.color = 'red';
    }
  });

  // Carregar clientes na tabela (opcional)
  async function carregarClientes() {
    if (!tabelaClientesBody) return;
    tabelaClientesBody.innerHTML = '<tr><td colspan="8">Carregando dados...</td></tr>';

    try {
      const response = await fetch('http://localhost:8080/api/cliente', { method: 'GET', headers: { 'Content-Type': 'application/json' }, mode: 'cors' });
      if (!response.ok) throw new Error(`Erro ${response.status}`);
      const clientes = await response.json();
      if (clientes.length === 0) {
        tabelaClientesBody.innerHTML = '<tr><td colspan="8">Nenhum cliente cadastrado</td></tr>';
        return;
      }
      tabelaClientesBody.innerHTML = '';
      clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${cliente.id || '-'}</td>
          <td>${cliente.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
          <td>${cliente.nome || '-'}</td>
          <td>${cliente.telefone || '-'}</td>
          <td>${cliente.email || '-'}</td>
          <td>${cliente.cep || '-'}</td>
          <td>${cliente.endereco || '-'}</td>
          <td><button onclick="excluirCliente(${cliente.id})" class="btn-excluir">Excluir</button></td>
        `;
        tabelaClientesBody.appendChild(tr);
      });
    } catch (error) {
      tabelaClientesBody.innerHTML = `<tr><td colspan="8" style="color:red;">Erro ao carregar clientes: ${error.message}</td></tr>`;
      console.error(error);
    }
  }

  // Excluir cliente
  window.excluirCliente = async function(id) {
    if (!confirm('Deseja realmente excluir este cliente?')) return;
    try {
      const response = await fetch(`http://localhost:8080/api/cliente/${id}`, { method: 'DELETE', mode: 'cors' });
      if (response.ok) {
        alert('Cliente excluído com sucesso!');
        carregarClientes();
      } else {
        alert('Erro ao excluir cliente.');
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao conectar com o servidor.');
    }
  }

  // Inicializa tabela
  carregarClientes();
});
