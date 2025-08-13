async function carregarPecasUtilizadas() {
  try {
    const tbody = document.querySelector('#tabela-pecas-utilizadas tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Carregando dados...</td></tr>';

    const response = await fetch('http://localhost:8080/api/pecas_utilizadas');

    if (!response.ok) {
      throw new Error('Erro ao buscar peças utilizadas: ' + response.status);
    }

    const pecasUtilizadas = await response.json();
    tbody.innerHTML = '';

    if (pecasUtilizadas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="no-data">Nenhuma peça utilizada cadastrada</td></tr>';
      return;
    }

    pecasUtilizadas.forEach(item => {
      const tr = document.createElement('tr');

      // Aqui pegamos o id do aparelho, nome da peça vindo do objeto peca, e data correta
      tr.innerHTML = `
        <td>${item.id || '-'}</td>
        <td>${item.aparelho?.id || '-'}</td>
        <td title="${item.peca?.nome || '-'}">${item.peca?.nome || '-'}</td>
        <td>${item.quantidade_utilizada || '-'}</td>
        <td>${item.data_utilizacao ? new Date(item.data_utilizacao).toLocaleDateString('pt-BR') : '-'}</td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Erro ao carregar peças utilizadas:', error);
    const tbody = document.querySelector('#tabela-pecas-utilizadas tbody');
    tbody.innerHTML = `<tr><td colspan="5" style="color: red; font-weight: 600;">Erro ao carregar dados: ${error.message}</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', carregarPecasUtilizadas);
