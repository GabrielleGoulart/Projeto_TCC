document.addEventListener('DOMContentLoaded', function () {
  const radioPf = document.getElementById('radioPf');
  const radioPj = document.getElementById('radioPj');

  const pfInput = document.getElementById('pfInput');
  const pjInput = document.getElementById('pjInput');
  const searchClientBtn = document.getElementById('searchClientBtn');

  const cpfCliente = document.getElementById('cpfCliente');
  const cnpjCliente = document.getElementById('cnpjCliente');

  const nomeCliente = document.getElementById('nomeCliente');

  function handleClientTypeSelection() {
    pfInput.style.display = 'none';
    pjInput.style.display = 'none';
    searchClientBtn.style.display = 'none';

    if (radioPf.checked) {
      pfInput.style.display = 'flex';
    } else if (radioPj.checked) {
      pjInput.style.display = 'flex';
    }

    toggleSearchButtonVisibility();
  }

  function toggleSearchButtonVisibility() {
    let currentInput = radioPf.checked ? cpfCliente : radioPj.checked ? cnpjCliente : null;

    if (currentInput && currentInput.value.trim() !== '') {
      searchClientBtn.style.display = 'block';
    } else {
      searchClientBtn.style.display = 'none';
    }
  }

  function handleSearchClient() {
    let searchTerm = radioPf.checked ? cpfCliente.value.trim() : cnpjCliente.value.trim();

    if (!searchTerm) {
      alert("Por favor, insira o CPF ou CNPJ.");
      return;
    }

    alert(`Busca simulada para ${searchTerm}. Cliente pode ser novo ou já existente.`);
    nomeCliente.focus();
  }

  radioPf.addEventListener('change', handleClientTypeSelection);
  radioPj.addEventListener('change', handleClientTypeSelection);

  cpfCliente.addEventListener('input', toggleSearchButtonVisibility);
  cnpjCliente.addEventListener('input', toggleSearchButtonVisibility);

  searchClientBtn.addEventListener('click', handleSearchClient);

  handleClientTypeSelection(); // Executa ao iniciar
});
