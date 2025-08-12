// ====== Função para criar botões Editar e Excluir ======
function criarBotoesEditarExcluir(tipoTabela) {
  const btnEditar = document.createElement('button');
  btnEditar.className = 'btn-editar';
  btnEditar.textContent = 'Editar';

  btnEditar.addEventListener('click', (event) => {
    const tr = event.target.closest('tr');
    const id = tr.querySelector('td').textContent.trim(); // pega o ID da primeira célula

    let urlEditar;

    switch (tipoTabela) {
      case 'clientes':
        urlEditar = `editar_cliente.html?id=${id}`;
        break;
      case 'aparelhos':
        urlEditar = `editar_aparelho.html?id=${id}`;
        break;
      case 'pecas':
        urlEditar = `editar_peca.html?id=${id}`;
        break;
      default:
        alert('Tipo de tabela desconhecido');
        return;
    }

    window.location.href = urlEditar;
  });

  const btnExcluir = document.createElement('button');
  btnExcluir.className = 'btn-excluir';
  btnExcluir.textContent = 'Excluir';

  btnExcluir.addEventListener('click', async (event) => {
    const tr = event.target.closest('tr');
    const id = tr.querySelector('td').textContent.trim();

    if (confirm(`Deseja realmente excluir o registro de ID ${id}?`)) {
      try {
        // Define a URL da API conforme o tipo de tabela
        let urlExcluir;
        switch (tipoTabela) {
          case 'clientes':
            urlExcluir = `http://localhost:8080/api/cliente/${id}`;
            break;
          case 'aparelhos':
            urlExcluir = `http://localhost:8080/api/aparelhos/${id}`;
            break;
          case 'pecas':
            urlExcluir = `http://localhost:8080/api/peca/${id}`;
            break;
          default:
            alert('Tipo de tabela desconhecido');
            return;
        }

        const res = await fetch(urlExcluir, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao excluir');

        alert(`Registro ${id} excluído com sucesso.`);
        tr.remove(); // Remove a linha da tabela visualmente
      } catch (error) {
        alert('Erro ao excluir registro.');
        console.error(error);
      }
    }
  });

  const container = document.createElement('div');
  container.appendChild(btnEditar);
  container.appendChild(btnExcluir);

  return container;
}

// ====== Função auxiliar para formatar data a partir de array ======
function formatarDataArray(dataArray) {
  if (!dataArray) return '';
  const [ano, mes, dia, hora, minuto] = dataArray;
  return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano} ${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
}

// ====== Função para gerar PDF da Ordem de Serviço (Histórico) ======
function gerarPDF(historico) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("TaskUP - Ordem de Serviço", 10, 10);

  doc.text(`ID Histórico: ${historico.id_historico ?? ''}`, 10, 20);
  doc.text(`Cliente: ${historico.cliente?.nome_cliente ?? ''}`, 10, 30);
  doc.text(`Aparelho: ${historico.aparelho?.nomeAparelho ?? ''}`, 10, 40);
  doc.text(`Defeito: ${historico.defeito ?? ''}`, 10, 50);
  doc.text(`Entrada: ${formatarDataArray(historico.data_entrada)}`, 10, 60);
  doc.text(`Saída: ${formatarDataArray(historico.data_saida)}`, 10, 70);
  doc.text(`Peças Utilizadas: ${historico.pecas_aplicadas ?? ''}`, 10, 80);
  doc.text(`Status: ${historico.status_servico ?? ''}`, 10, 90);
  doc.text(`Técnico: ${historico.nome_tecnico ?? ''}`, 10, 100);
  doc.text(`Valor: R$ ${historico.valor_total?.toFixed(2) ?? ''}`, 10, 110);

  doc.save(`OrdemServico_${historico.id_historico ?? 'sem-id'}.pdf`);
}

// ====== Funções para carregar tabelas via API ======

// Carregar clientes
async function carregarClientes() {
  try {
    const res = await fetch('http://localhost:8080/api/cliente');
    if (!res.ok) throw new Error('Erro ao buscar clientes');
    const clientes = await res.json();

    const tbody = document.querySelector('#tabela-clientes tbody');
    tbody.innerHTML = '';

    clientes.forEach(cliente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cliente.id}</td>
        <td>${cliente.nome_cliente}</td>
        <td>${cliente.cpf ?? ""}</td>
        <td>${cliente.cnpj ?? ""}</td>
        <td>${cliente.cep}</td>
        <td>${cliente.endereco}</td>
        <td>${cliente.numero}</td>
        <td>${cliente.bairro}</td>
        <td>${cliente.cidade}</td>
        <td>${cliente.estado}</td>
        <td>${cliente.email}</td>
        <td>${cliente.telefone}</td>
      `;

      const tdAcoes = document.createElement('td');
      tdAcoes.appendChild(criarBotoesEditarExcluir('clientes'));
      tr.appendChild(tdAcoes);

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar clientes');
  }
}

// Carregar aparelhos
async function carregarAparelhos() {
  try {
    const res = await fetch('http://localhost:8080/api/aparelhos');
    if (!res.ok) throw new Error('Erro ao buscar aparelhos');
    const aparelhos = await res.json();

    const tbody = document.querySelector('#tabela-aparelhos tbody');
    tbody.innerHTML = '';

    aparelhos.forEach(aparelho => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${aparelho.id}</td>
        <td>${aparelho.cliente?.id || ''}</td>
        <td>${aparelho.nomeAparelho || ''}</td>
        <td>${aparelho.defeito || ''}</td>
        <td>${aparelho.servico_executados || ''}</td>
        <td>${aparelho.pecas_aplicadas || ''}</td>
        <td>${aparelho.quantidade_aplicada || ''}</td>
        <td>${aparelho.nome_tecnico || ''}</td>
        <td>${aparelho.dataCadastro ? new Date(aparelho.dataCadastro).toLocaleDateString() : ''}</td>
        <td>${aparelho.observacoes || ''}</td>
        <td>${aparelho.valor_total || ''}</td>
        <td>${aparelho.status || ''}</td>
        <td><img src="${aparelho.foto_aparelho || '#'}" alt="Foto" style="max-width: 60px; max-height: 60px;"></td>
      `;
      const tdAcoes = document.createElement('td');
      tdAcoes.appendChild(criarBotoesEditarExcluir('aparelhos'));
      tr.appendChild(tdAcoes);

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar aparelhos');
  }
}

// Carregar peças
async function carregarPecas() {
  try {
    const res = await fetch('http://localhost:8080/api/peca');
    if (!res.ok) throw new Error('Erro ao buscar peças');
    const pecas = await res.json();

    const tbody = document.querySelector('#tabela-pecas tbody');
    tbody.innerHTML = '';

    pecas.forEach(peca => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${peca.id}</td>
        <td>${peca.nome}</td>
        <td>${peca.descricao || ''}</td>
        <td>${peca.preco_unitario || ''}</td>
        <td>${peca.quantidade_estoque || ''}</td>
        <td>${peca.estoque_minimo || ''}</td>
      `;

      const tdAcoes = document.createElement('td');
      tdAcoes.appendChild(criarBotoesEditarExcluir('pecas'));
      tr.appendChild(tdAcoes);

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar peças');
  }
}

// Carregar histórico
async function carregarHistorico() {
  try {
    const res = await fetch('http://localhost:8080/api/historico');
    if (!res.ok) throw new Error('Erro ao buscar histórico');
    const historicos = await res.json();

    const tbody = document.querySelector('#tabela-historico tbody');
    tbody.innerHTML = '';

    historicos.forEach(historico => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${historico.id_historico || ''}</td>
        <td>${historico.id_cliente || ''}</td>
        <td>${historico.id_aparelho || ''}</td>
        <td>${formatarDataArray(historico.data_entrada) || ''}</td>
        <td>${formatarDataArray(historico.data_saida) || ''}</td>
        <td>${historico.status_servico || ''}</td>
        <td>${historico.observacoes || ''}</td>
        <td>${historico.nome_tecnico || ''}</td>
        <td>${historico.pecas_aplicadas || ''}</td>
        <td>${historico.servico_executado || ''}</td>
        <td>${historico.defeito || ''}</td>
        <td>R$ ${historico.valor_total?.toFixed(2) || ''}</td>
      `;

      const tdAcoes = document.createElement('td');
      const btnPDF = document.createElement('button');
      btnPDF.className = 'btn-os';
      btnPDF.textContent = 'Gerar OS';

      btnPDF.addEventListener('click', () => {
        gerarPDF(historico);
      });

      tdAcoes.appendChild(btnPDF);
      tr.appendChild(tdAcoes);
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar histórico');
  }
}

// Carregar peças utilizadas
async function carregarPecasUtilizadas() {
  try {
    const res = await fetch('http://localhost:8080/api/pecas_utilizadas');
    if (!res.ok) throw new Error('Erro ao buscar peças utilizadas');
    const pecasUtilizadas = await res.json();

    const tbody = document.querySelector('#tabela-pecas-utilizadas tbody');
    tbody.innerHTML = '';

    pecasUtilizadas.forEach(item => {
      const dataArr = item.data_utilizacao;
      const dataObj = dataArr ? new Date(dataArr[0], dataArr[1] - 1, dataArr[2], dataArr[3], dataArr[4], dataArr[5]) : null;
      const dataFormatada = dataObj ? dataObj.toLocaleDateString() + ' ' + dataObj.toLocaleTimeString() : '';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.aparelho.id}</td>
        <td>${item.peca.id}</td>
        <td>${item.quantidade_utilizada}</td>
        <td>${item.data_utilizacao}</td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar peças utilizadas');
  }
}

// ====== Função para gerar Relatório de Peças Utilizadas PDF filtrado ======
async function gerarRelatorioPecasUtilizadas(dataInicio, dataFim) {
  try {
    const res = await fetch('http://localhost:8080/api/pecas_utilizadas');
    if (!res.ok) throw new Error('Erro ao buscar peças utilizadas');
    const pecasUtilizadas = await res.json();

    const filtradas = pecasUtilizadas.filter(item => {
      if (!item.data_utilizacao) return false;
      const d = new Date(
        item.data_utilizacao[0],
        item.data_utilizacao[1] - 1,
        item.data_utilizacao[2],
        item.data_utilizacao[3],
        item.data_utilizacao[4],
        item.data_utilizacao[5]
      );
      const dataInicioObj = new Date(dataInicio);
      const dataFimObj = new Date(dataFim);
      dataFimObj.setHours(23, 59, 59, 999);
      return d >= dataInicioObj && d <= dataFimObj;
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Relatório de Peças Utilizadas', 10, 10);
    const headers = ['ID', 'Aparelho ID', 'Peça ID', 'Quantidade', 'Data Utilização'];
    let y = 20;

    headers.forEach((header, i) => {
      doc.text(header, 10 + i * 35, y);
    });

    y += 10;

    filtradas.forEach(item => {
      doc.text(String(item.id), 10, y);
      doc.text(String(item.aparelho.id), 45, y);
      doc.text(String(item.peca.id), 80, y);
      doc.text(String(item.quantidade_utilizada), 115, y);

      const dataArr = item.data_utilizacao;
      const dataObj = dataArr ? new Date(dataArr[0], dataArr[1] - 1, dataArr[2], dataArr[3], dataArr[4], dataArr[5]) : null;
      const dataFormatada = dataObj ? dataObj.toLocaleDateString() + ' ' + dataObj.toLocaleTimeString() : '';

      doc.text(dataFormatada, 150, y);
      y += 10;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`Relatorio_Pecas_Utilizadas_${dataInicio}_a_${dataFim}.pdf`);
  } catch (error) {
    alert('Erro ao gerar relatório: ' + error.message);
    console.error(error);
  }
}

// ====== Função para gerar Relatório de Custo Operacional PDF ======
async function gerarRelatorioCustoOperacionalPDF(dataInicio, dataFim) {
  try {
    const res = await fetch('http://localhost:8080/api/aparelhos');
    if (!res.ok) throw new Error('Erro ao buscar aparelhos para relatório');
    const aparelhos = await res.json();

    // Filtrar aparelhos pelo período informado
    const dataInicioObj = new Date(dataInicio);
    const dataFimObj = new Date(dataFim);
    dataFimObj.setHours(23, 59, 59, 999);

    const aparelhosFiltrados = aparelhos.filter(aparelho => {
      const dataCadastro = new Date(aparelho.dataCadastro);
      return dataCadastro >= dataInicioObj && dataCadastro <= dataFimObj;
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont('courier'); // fonte monoespaçada para melhor alinhamento
    doc.setFontSize(12);

    let y = 10;

    doc.text('Relatório de Custo Operacional', 10, y);
    y += 10;
    doc.text(`Período: ${dataInicio} a ${dataFim}`, 10, y);
    y += 15;

    const colX = [10, 20, 65, 120, 145, 180];

    doc.text('ID', colX[0], y);
    doc.text('Cliente', colX[1], y);
    doc.text('Nome', colX[2], y);
    doc.text('Valor Total', colX[3], y);
    doc.text('Status', colX[4], y);
    doc.text('Técnico', colX[5], y);
    y += 7;

    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    y += 5;

    let somaTotal = 0;

aparelhosFiltrados.forEach(aparelho => {
  if (y > 280) {
    doc.addPage();
    y = 10;
  }

  // Converte para número com segurança
  let valor = parseFloat(aparelho.valor_total);
  if (isNaN(valor)) valor = 0;

  somaTotal += valor;

  doc.text(String(aparelho.id), colX[0], y);
  doc.text(aparelho.cliente?.nome_cliente || '', colX[1], y);
  doc.text(aparelho.nomeAparelho || '', colX[2], y);
  doc.text(`R$ ${valor.toFixed(2)}`, colX[3], y);
  doc.text(aparelho.status || '', colX[4], y);
  doc.text(aparelho.nome_tecnico || '', colX[5], y);

  y += 7;
});

// Exibir total no final
y += 5;
doc.line(10, y, 200, y);
y += 10;

doc.setFontSize(14);
doc.text(`Custo Operacional Total: R$ ${somaTotal.toFixed(2)}`, 10, y);


    y += 5;
    doc.line(10, y, 200, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`Custo Operacional Total: R$ ${somaTotal.toFixed(2)}`, 10, y);

    doc.save(`Relatorio_Custo_Operacional_${dataInicio}_a_${dataFim}.pdf`);

  } catch (error) {
    alert('Erro ao gerar relatório: ' + error.message);
    console.error(error);
  }
}

// ====== Configuração inicial do DOM ======
document.addEventListener('DOMContentLoaded', () => {
  // Carregar dados nas tabelas
  carregarClientes();
  carregarAparelhos();
  carregarPecas();
  carregarHistorico();
  carregarPecasUtilizadas();

  // Modais e botões do Relatório de Peças Utilizadas
  const btnAbrirModal = document.getElementById('btnAbrirModalRelatorio');
  const modal = document.getElementById('modalFiltroRelatorio');
  const btnCancelar = document.getElementById('btnCancelarFiltro');
  const btnConfirmar = document.getElementById('btnConfirmarFiltro');

  if (btnAbrirModal && modal && btnCancelar && btnConfirmar) {
    btnAbrirModal.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    btnCancelar.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    btnConfirmar.addEventListener('click', async () => {
      const dataInicio = document.getElementById('modalDataInicio').value;
      const dataFim = document.getElementById('modalDataFim').value;

      if (!dataInicio || !dataFim) {
        alert('Por favor, preencha as duas datas');
        return;
      }
      if (new Date(dataFim) < new Date(dataInicio)) {
        alert('Data fim não pode ser menor que data início');
        return;
      }

      await gerarRelatorioPecasUtilizadas(dataInicio, dataFim);
      modal.style.display = 'none';
    });
  }

  // Modal e botões para Relatório de Custo Operacional
  const btnRelatorioCusto = document.getElementById('btnRelatorioCusto');
  const modalCusto = document.getElementById('modalFiltroCusto');
  const btnCancelarCusto = document.getElementById('btnCancelarCusto');
  const btnConfirmarCusto = document.getElementById('btnConfirmarCusto');

  if (btnRelatorioCusto && modalCusto && btnCancelarCusto && btnConfirmarCusto) {
    btnRelatorioCusto.addEventListener('click', () => {
      modalCusto.style.display = 'flex';
    });

    btnCancelarCusto.addEventListener('click', () => {
      modalCusto.style.display = 'none';
    });

    btnConfirmarCusto.addEventListener('click', () => {
      const dataInicio = document.getElementById('dataInicioCusto').value;
      const dataFim = document.getElementById('dataFimCusto').value;

      if (!dataInicio || !dataFim) {
        alert('Por favor, preencha as duas datas');
        return;
      }
      if (new Date(dataFim) < new Date(dataInicio)) {
        alert('Data fim não pode ser menor que data início');
        return;
      }

      gerarRelatorioCustoOperacionalPDF(dataInicio, dataFim);
      modalCusto.style.display = 'none';
    });
  }
});
