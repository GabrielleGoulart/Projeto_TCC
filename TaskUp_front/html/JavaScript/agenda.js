const API_AGENDA = 'http://localhost:8080/api/agenda';

/** Buscar todas as agendas e exibir na tabela */
function carregarAgendas() {
  fetch(API_AGENDA)
    .then(res => res.json())
    .then(agendas => {
      const tabela = document.getElementById('tabela-agenda');
      tabela.innerHTML = ''; // Limpa a tabela

      agendas.forEach(agenda => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${agenda.id}</td>
          <td>${agenda.dataAgendada}</td>
          <td>${agenda.descricao}</td>
          <td>${agenda.aparelho?.modelo || '---'}</td>
          <td>
            <button onclick="deletarAgenda(${agenda.id})">Excluir</button>
          </td>
        `;
        tabela.appendChild(row);
      });
    })
    .catch(error => console.error('Erro ao carregar agendas:', error));
}

/*Buscar agendas por data (yyyy-mm-dd) */
function buscarPorData() {
  const data = document.getElementById('filtroData').value;

  if (!data) return alert('Informe uma data');

  fetch(`${API_AGENDA}/byDate?date=${data}`)
    .then(res => {
      if (res.status === 204) {
        alert('Nenhuma agenda encontrada para a data');
        return [];
      }
      return res.json();
    })
    .then(agendas => {
      const tabela = document.getElementById('tabela-agenda');
      tabela.innerHTML = '';

      agendas.forEach(agenda => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${agenda.id}</td>
          <td>${agenda.dataAgendada}</td>
          <td>${agenda.descricao}</td>
          <td>${agenda.aparelho?.modelo || '---'}</td>
          <td>
            <button onclick="deletarAgenda(${agenda.id})">Excluir</button>
          </td>
        `;
        tabela.appendChild(row);
      });
    })
    .catch(error => console.error('Erro ao buscar por data:', error));
}

/*Cadastrar nova agenda */
function cadastrarAgenda() {
  const data = document.getElementById('novaData').value;
  const descricao = document.getElementById('novaDescricao').value;
  const idAparelho = document.getElementById('idAparelho').value;

  const novaAgenda = {
    dataAgendada: data,
    descricao: descricao,
    aparelho: {
      id: idAparelho
    }
  };

  fetch(API_AGENDA, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novaAgenda)
  })
    .then(res => {
      if (res.ok) {
        alert('Agenda cadastrada!');
        carregarAgendas();
      } else {
        alert('Erro ao cadastrar agenda');
      }
    });
}

/*Deletar agenda por ID */
function deletarAgenda(id) {
  if (!confirm(`Tem certeza que deseja excluir a agenda ${id}?`)) return;

  fetch(`${API_AGENDA}/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.ok) {
        alert('Agenda excluída');
        carregarAgendas();
      } else {
        alert('Erro ao excluir agenda');
      }
    });
}

// Carregar agendas ao abrir a página
document.addEventListener('DOMContentLoaded', carregarAgendas);

async function carregarDadosGrafico() {
  try {
    const hoje = new Date();
    const dataFim = hoje.toISOString(); // ISO com horário
    const inicioSemana = new Date();
    inicioSemana.setDate(hoje.getDate() - 6);
    const dataInicio = inicioSemana.toISOString();

    const res = await fetch(`/api/historico/resumo-semanal?inicio=${encodeURIComponent(dataInicio)}&fim=${encodeURIComponent(dataFim)}`);
    if (!res.ok) throw new Error('Erro ao buscar dados');

    const data = await res.json();

    grafico.data.labels = data.labels;
    grafico.data.datasets[0].data = data.osEmAndamento;
    grafico.data.datasets[1].data = data.osFinalizadas;
    grafico.update();

  } catch (error) {
    console.error(error);
    alert('Não foi possível carregar os dados do gráfico.');
  }
}

carregarDadosGrafico();