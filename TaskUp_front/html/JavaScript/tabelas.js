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
        urlEditar = `editarCliente.html?id=${id}`;
        break;
      case 'aparelhos':
        urlEditar = `editarAparelho.html?id=${id}`;
        break;
      case 'pecas':
        urlEditar = `editarPeca.html?id=${id}`;
        break;
      default:
        Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Tipo de tabela desconhecido',
      confirmButtonText: 'Ok'
    });
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

      // SweetAlert2 confirm
  const result = await Swal.fire({
    title: `Deseja realmente excluir o registro de ID ${id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  });

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
            await Swal.fire({
      icon: 'error',
      title: 'Tipo de tabela desconhecido',
      text: 'Não foi possível identificar o tipo de tabela para exclusão.',
    });
    return;
}

        const res = await fetch(urlExcluir, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao excluir');

       Swal.fire({
  icon: 'success',
  title: 'Excluído!',
  text: `Registro ${id} excluído com sucesso.`,
  timer: 2000,
  showConfirmButton: false
});
        tr.remove(); // Remove a linha da tabela visualmente
      } catch (error) {
Swal.fire({
  icon: 'error',
  title: 'Erro',
  text: 'Erro ao excluir registro. Tente novamente mais tarde.'
});
        console.error(error);
      }
    }
  );

  const container = document.createElement('div');
  container.appendChild(btnEditar);
  container.appendChild(btnExcluir);

  return container;

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
// Carregar clientes (versão correta para mostrar apenas 5 últimos)
async function carregarClientes() {
  try {
    const res = await fetch('http://localhost:8080/api/cliente');
    if (!res.ok) throw new Error('Erro ao buscar clientes');
    const clientes = await res.json();
    
    // Pegar apenas os 5 últimos clientes e inverter a ordem (mais recentes primeiro)
    const ultimosClientes = clientes.slice(-5).reverse();

    const tbody = document.querySelector('#tabela-clientes tbody');
    tbody.innerHTML = '';

    ultimosClientes.forEach(cliente => {
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
Swal.fire({
  icon: 'error',
  title: 'Erro',
  text: 'Erro ao carregar clientes. Tente novamente mais tarde.'
});
  }
}

// Carregar aparelhos (versão corrigida)
async function carregarAparelhos() {
  try {
    const res = await fetch('http://localhost:8080/api/aparelhos');
    if (!res.ok) throw new Error('Erro ao buscar aparelhos');
    const aparelhos = await res.json();
    
    // Pegar apenas os 5 últimos aparelhos
    const ultimosAparelhos = aparelhos.slice(-5).reverse();

    const tbody = document.querySelector('#tabela-aparelhos tbody');
    tbody.innerHTML = '';

    ultimosAparelhos.forEach(aparelho => {
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

// Carregar peças (versão corrigida)
async function carregarPecas() {
  try {
    const res = await fetch('http://localhost:8080/api/peca');
    if (!res.ok) throw new Error('Erro ao buscar peças');
    const pecas = await res.json();
    
    // Pegar apenas as 5 últimas peças
    const ultimasPecas = pecas.slice(-5).reverse();

    const tbody = document.querySelector('#tabela-pecas tbody');
    tbody.innerHTML = '';

    ultimasPecas.forEach(peca => {
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
    Swal.fire({
  icon: 'error',
  title: 'Erro',
  text: 'Erro ao carregar [peças]. Tente novamente mais tarde.'
});

  }
}

// Carregar histórico (versão corrigida)
async function carregarHistorico() {
  try {
    const res = await fetch('http://localhost:8080/api/historico');
    if (!res.ok) throw new Error('Erro ao buscar histórico');
    const historicos = await res.json();
    
    // Pegar apenas os 5 últimos históricos
    const ultimosHistoricos = historicos.slice(-5).reverse();

    const tbody = document.querySelector('#tabela-historico tbody');
    tbody.innerHTML = '';

    ultimosHistoricos.forEach(historico => {
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
    Swal.fire({
  icon: 'error',
  title: 'Erro',
  text: 'Erro ao carregar [histórico]. Tente novamente mais tarde.'
});

  }
}

// Carregar peças utilizadas (versão corrigida)
async function carregarPecasUtilizadas() {
  try {
    const res = await fetch('http://localhost:8080/api/pecas_utilizadas');
    if (!res.ok) throw new Error('Erro ao buscar peças utilizadas');
    const pecasUtilizadas = await res.json();
    
    // Pegar apenas as 5 últimas peças utilizadas
    const ultimasPecasUtilizadas = pecasUtilizadas.slice(-5).reverse();

    const tbody = document.querySelector('#tabela-pecas-utilizadas tbody');
    tbody.innerHTML = '';

    ultimasPecasUtilizadas.forEach(item => {
      const dataArr = item.data_utilizacao;
      const dataObj = dataArr ? new Date(dataArr[0], dataArr[1] - 1, dataArr[2], dataArr[3], dataArr[4], dataArr[5]) : null;
      const dataFormatada = dataObj ? dataObj.toLocaleDateString() + ' ' + dataObj.toLocaleTimeString() : '';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.aparelho.id}</td>
        <td>${item.peca.id}</td>
        <td>${item.quantidade_utilizada}</td>
        <td>${dataFormatada}</td>
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

     const ultimosClientes = clientes.slice(-5).reverse();

    const tbody = document.querySelector('#tabela-clientes tbody');
    tbody.innerHTML = '';

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
       Swal.fire({
         icon: 'warning',
         title: 'Atenção',
         text: 'Por favor, preencha as duas datas'
       });

        return;
      }
      if (new Date(dataFim) < new Date(dataInicio)) {
        Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: 'Data fim não pode ser menor que data início'
        });
        return;
      }

      gerarRelatorioCustoOperacionalPDF(dataInicio, dataFim);
      modalCusto.style.display = 'none';
    });
  }
});
}
