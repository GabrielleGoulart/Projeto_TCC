// Função para criar botões de ação (editar e excluir)
function criarBotoesAcao(id, tipo) {
  const container = document.createElement('div');

  // Botão Editar
  const btnEditar = document.createElement('button');
  btnEditar.className = 'btn-editar';
  btnEditar.textContent = 'Editar';
  btnEditar.onclick = () => window.location.href = `editar${tipo}.html?id=${id}`;

  // Botão Excluir
  const btnExcluir = document.createElement('button');
  btnExcluir.className = 'btn-excluir';
  btnExcluir.textContent = 'Excluir';
  btnExcluir.onclick = async () => {
    if (confirm(`Deseja realmente excluir esta ${tipo.toLowerCase()}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/${tipo.toLowerCase()}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('Excluído com sucesso!');
          window.location.reload();
        } else {
          throw new Error('Falha ao excluir');
        }
      } catch (error) {
        alert('Erro ao excluir: ' + error.message);
      }
    }
  };

  container.appendChild(btnEditar);
  container.appendChild(btnExcluir);
  return container;
}

// Função para carregar TODAS as peças
// pecas.js

async function carregarTodasPecas() {
  const tbody = document.querySelector('#tabela-pecas-completa tbody');
  tbody.innerHTML = '<tr><td colspan="7" class="loading">Carregando dados...</td></tr>';

  try {
    const response = await fetch('http://localhost:8080/api/peca');
    if (!response.ok) {
      throw new Error(`Erro ao buscar peças: ${response.status} ${response.statusText}`);
    }

    const pecas = await response.json();

    if (pecas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="no-data">Nenhuma peça cadastrada</td></tr>';
      return;
    }

    tbody.innerHTML = '';

    pecas.forEach(peca => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${peca.id || '-'}</td>
        <td title="${peca.nome || '-'}">${peca.nome || '-'}</td>
        <td title="${peca.descricao || '-'}">${peca.descricao || '-'}</td>
        <td>${peca.preco_unitario != null ? peca.preco_unitario.toFixed(2) : '-'}</td>
        <td>${peca.quantidade_estoque != null ? peca.quantidade_estoque : '-'}</td>
        <td>${peca.estoque_minimo != null ? peca.estoque_minimo : '-'}</td>
        <td>
          <button class="btn-editar" onclick="editarPeca(${peca.id})">Editar</button>
          <button class="btn-excluir" onclick="excluirPeca(${peca.id})">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:red; font-weight:600;">Erro ao carregar peças: ${error.message}</td></tr>`;
  }
}

// Função para editar (redirecionar para página de edição)
function editarPeca(id) {
  window.location.href = `editarPeca.html?id=${id}`;
}

// Função para excluir a peça via API
async function excluirPeca(id) {
  if (confirm('Deseja realmente excluir esta peça?')) {
    try {
      const response = await fetch(`http://localhost:8080/api/peca/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Falha ao excluir');

      alert('Peça excluída com sucesso!');
      carregarTodasPecas(); // Recarrega a tabela
    } catch (error) {
      alert('Erro ao excluir peça: ' + error.message);
    }
  }
}

// Carrega as peças quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', carregarTodasPecas);
