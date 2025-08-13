const BACKEND_URL = 'http://localhost:8080';

// -------------------- CHAMADAS INICIAIS --------------------
window.addEventListener('DOMContentLoaded', () => {
  fetchTotalPecas();
  fetchAlertasEstoque();
  fetchOsEmAberto();
  fetchAgendamentosHoje();
  carregarGraficoOs();
  fetchPecasUtilizadas();
});

// -------------------- TOTAL PEÇAS --------------------
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

// -------------------- ALERTAS DE ESTOQUE --------------------
async function fetchAlertasEstoque() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/avisos`);
    if (!res.ok) throw new Error('Erro ao buscar avisos');
    const avisos = await res.json();

    document.getElementById('alertas-estoque').textContent = avisos.length;

    const tbody = document.getElementById('avisos-tbody');
    tbody.innerHTML = '';
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

// -------------------- OS EM ABERTO --------------------
async function fetchOsEmAberto() {
  try {
    const status = encodeURIComponent('Em analise');
    const response = await fetch(`${BACKEND_URL}/api/aparelhos/status/${status}`);
    if (!response.ok) throw new Error('Erro ao buscar OS em aberto');

    const aparelhos = await response.json();
    document.getElementById('os-em-aberto').textContent = aparelhos.length;

  } catch (error) {
    console.error('fetchOsEmAberto:', error);
  }
}

// -------------------- AGENDAMENTOS DE HOJE --------------------
async function fetchAgendamentosHoje() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/agenda`);
    if (!response.ok) throw new Error('Erro na requisição');
    const agendamentos = await response.json();

    const hoje = new Date();
    const anoHoje = hoje.getFullYear();
    const mesHoje = hoje.getMonth() + 1;
    const diaHoje = hoje.getDate();

    const agendamentosHoje = agendamentos.filter(item => {
      const data = item.dataAgendada;
      return data[0] === anoHoje && data[1] === mesHoje && data[2] === diaHoje;
    });

    document.getElementById('agendamentos-hoje').textContent = agendamentosHoje.length;

  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    document.getElementById('agendamentos-hoje').textContent = 'Erro';
  }
}

// -------------------- GRÁFICO DE OS --------------------
let graficoOs = null;

async function carregarGraficoOs() {
  const ctx = document.getElementById('graficoOs').getContext('2d');

  try {
    const response = await fetch(`${BACKEND_URL}/api/aparelhos/resumo-semanal`);
    if (!response.ok) throw new Error('Erro ao buscar dados do gráfico');

    const dados = await response.json();

    const labels = dados.map(item => item.dia);
    const finalizadas = dados.map(item => item.finalizadas);
    const emAndamento = dados.map(item => item.emAndamento);

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
        plugins: {
          title: {
            display: true,
            text: 'Desempenho Operacional por Semana',
            font: { size: 18 },
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Quantidade de Ordens' }
          },
          x: {
            title: { display: true, text: 'Dia' }
          }
        }
      }
    });

  } catch (error) {
    console.error('Erro no gráfico:', error);
  }
}



// -------------------- PEÇAS UTILIZADAS --------------------
async function fetchPecasUtilizadas() {
  const tabelaBody = document.getElementById("avisos-tbody");
  if (!tabelaBody) {
    console.error("Elemento #avisos-tbody não encontrado no DOM.");
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/pecas_utilizadas`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const pecas = await response.json();
    tabelaBody.innerHTML = "";

    pecas.forEach(pecaUtilizada => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
  <td>${aviso.id}</td>
  <td>${aviso.peca?.id ?? ''}</td>
  <td>${aviso.peca?.nome ?? ''}</td>
  <td>${aviso.peca?.quantidadeEstoque ?? ''}</td>
  <td>${aviso.peca?.estoqueMinimo ?? ''}</td>
  <td>${aviso.dataAlerta ?? ''}</td>
`;
      tabelaBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao buscar peças utilizadas:", error);
  }
}

async function fetchAlertasEstoque() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/avisos`);
    if (!res.ok) throw new Error('Erro ao buscar avisos');
    const avisos = await res.json();

    document.getElementById('alertas-estoque').textContent = avisos.length;

    const tbody = document.getElementById('avisos-tbody');
    tbody.innerHTML = '';
    avisos.forEach(aviso => {
      const d = aviso.dataAlerta;
      const dataFormatada = d
        ? new Date(d[0], d[1] - 1, d[2], d[3], d[4]).toLocaleString('pt-BR')
        : '';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${aviso.id}</td>
        <td>${aviso.peca?.id ?? ''}</td>
        <td>${aviso.peca?.nome ?? ''}</td>
        <td>${aviso.quantidadeEstoque ?? aviso.peca?.quantidade_estoque ?? ''}</td>
        <td>${aviso.estoqueMinimo ?? aviso.peca?.estoque_minimo ?? ''}</td>
        <td>${dataFormatada}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('fetchAlertasEstoque:', err);
  }
}
