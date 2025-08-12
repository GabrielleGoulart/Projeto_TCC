window.addEventListener('DOMContentLoaded', () => {
  fetchTotalPecas();
  fetchAlertasEstoque();
  fetchOsEmAberto();
});

const BACKEND_URL = 'http://localhost:8080';

async function fetchTotalPecas() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/peca`);
    if (!res.ok) throw new Error('Erro ao buscar peças');
    const pecas = await res.json();
    document.getElementById('total-pecas').textContent = pecas.length;
  } catch (err) {
    console.error('fetchTotalPecas:', err);
  }
}

async function fetchAlertasEstoque() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/avisos`);
    if (!res.ok) throw new Error('Erro ao buscar avisos');
    const avisos = await res.json();

    document.getElementById('alertas-estoque').textContent = avisos.length;

    const tbody = document.getElementById('avisos-tbody');
    tbody.innerHTML = ''; // limpa tabela
    avisos.forEach(aviso => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${aviso.id}</td>
        <td>${aviso.pecaId}</td>
        <td>${aviso.nomePeca}</td>
        <td>${aviso.quantidadeEstoque}</td>
        <td>${aviso.estoqueMinimo}</td>
        <td>${aviso.dataAlerta}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('fetchAlertasEstoque:', err);
  }
}

async function fetchOsEmAberto() {
  try {
    const status = encodeURIComponent('Em analise'); // cuidado com espaços
    const response = await fetch(`${BACKEND_URL}/api/aparelhos/status/${status}`);
    if (!response.ok) throw new Error('Erro ao buscar OS em aberto');

    const aparelhos = await response.json();

    // Atualizar o elemento com a quantidade encontrada
    document.getElementById('os-em-aberto').textContent = aparelhos.length;

  } catch (error) {
    console.error('fetchOsEmAberto:', error);
  }
}
async function fetchResumoSemanal() {
  try {
    const res = await fetch('http://localhost:8080/api/aparelhos/resumo-semanal');
    if (!res.ok) throw new Error('Erro ao buscar resumo semanal');
    const dados = await res.json();

    const labels = dados.map(d => d.dia);
    const finalizadas = dados.map(d => d.finalizadas);
    const emAndamento = dados.map(d => d.emAndamento);

    const ctx = document.getElementById('graficoOs').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Finalizadas',
            data: finalizadas,
            backgroundColor: 'rgba(36, 192, 235, 0.7)'
          },
          {
            label: 'Em andamento',
            data: emAndamento,
            backgroundColor: 'rgba(240, 128, 128, 0.7)'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });

  } catch (error) {
    console.error(error);
  }
}


let graficoOs = null;  // variável global para o gráfico

async function carregarGraficoOs() {
  const ctx = document.getElementById('graficoOs').getContext('2d');

  try {
    const response = await fetch('http://localhost:8080/api/aparelhos/resumo-semanal');
    if (!response.ok) throw new Error('Erro ao buscar dados do gráfico');

    const dados = await response.json();

    const labels = dados.map(item => item.dia);
    const finalizadas = dados.map(item => item.finalizadas);
    const emAndamento = dados.map(item => item.emAndamento);

    // Se já existe um gráfico, destrua antes de criar outro
    if (graficoOs) {
      graficoOs.destroy();
    }

    graficoOs = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Finalizadas',
            data: finalizadas,
            borderColor: '#24c0eb',
            backgroundColor: 'rgba(36, 192, 235, 0.2)',
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Em andamento',
            data: emAndamento,
            borderColor: '#f39c12',
            backgroundColor: 'rgba(243, 156, 18, 0.2)',
            fill: true,
            tension: 0.3,
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: 'Desempenho Operacional por Semana',
            font: { size: 18 },
          },
          tooltip: {
            enabled: true,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade de Ordens',
            }
          },
          x: {
            title: {
              display: true,
              text: 'Dia',
            }
          }
        }
      }
    });

  } catch (error) {
    console.error('Erro no gráfico:', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  carregarGraficoOs();
});

async function fetchAgendamentosHoje() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/agenda`);
    if (!response.ok) throw new Error('Erro na requisição');
    const agendamentos = await response.json();

    // Pega a data atual (ano, mês, dia)
    const hoje = new Date();
    const anoHoje = hoje.getFullYear();
    const mesHoje = hoje.getMonth() + 1;  // getMonth() vai de 0 a 11
    const diaHoje = hoje.getDate();

    // Filtra os agendamentos cuja dataAgendada tem ano, mes e dia iguais a hoje
    const agendamentosHoje = agendamentos.filter(item => {
      const data = item.dataAgendada; // Exemplo: [2025, 8, 11, 14, 0]
      return data[0] === anoHoje && data[1] === mesHoje && data[2] === diaHoje;
    });

    // Atualiza o campo na tela
    document.getElementById('agendamentos-hoje').textContent = agendamentosHoje.length;

  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    document.getElementById('agendamentos-hoje').textContent = 'Erro';
  }
}

// No carregamento da página, chama a função junto com os outros fetches:
window.addEventListener('DOMContentLoaded', () => {
  fetchTotalPecas();
  fetchAlertasEstoque();
  fetchOsEmAberto();
  fetchAgendamentosHoje();
});