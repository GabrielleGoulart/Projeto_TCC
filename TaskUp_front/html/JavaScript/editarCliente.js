document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.formulario');
    const tipoClienteSelect = document.getElementById('tipoCliente');
    const nomeLabel = document.getElementById('nomeLabel');
    const nomeInput = document.querySelector('input[name="nome"]');
    const cpfCnpjLabel = document.getElementById('cpfCnpjLabel');
    const cpfCnpjInput = document.querySelector('input[name="cpfCnpj"]');
    const telefoneInput = document.querySelector('input[name="telefone"]');
    const cepInput = document.querySelector('input[name="cep"]');
    
    let tipoAnterior = tipoClienteSelect.value;
    const params = new URLSearchParams(window.location.search);
    const clienteId = params.get('id');

    // Aplica as máscaras nos campos
    VMasker(telefoneInput).maskPattern('(99) 99999-9999');
    VMasker(cepInput).maskPattern('99999-999');
    
    // Função para aplicar a máscara correta de CPF ou CNPJ e atualizar os rótulos
    function aplicarMascaraCpfCnpj(tipo) {
        if (tipo === 'fisica') {
            VMasker(cpfCnpjInput).maskPattern('999.999.999-99');
            nomeLabel.textContent = 'Nome:';
            nomeInput.placeholder = 'Nome Completo';
            cpfCnpjLabel.textContent = 'CPF:';
            cpfCnpjInput.placeholder = 'Digite o CPF';
        } else {
            VMasker(cpfCnpjInput).maskPattern('99.999.999/9999-99');
            nomeLabel.textContent = 'Nome da Empresa:';
            nomeInput.placeholder = 'Razão Social ou Nome Fantasia';
            cpfCnpjLabel.textContent = 'CNPJ:';
            cpfCnpjInput.placeholder = 'Digite o CNPJ';
        }
    }

    // Função para buscar os dados do cliente na API e preencher o formulário
    async function buscarEPreencherCliente(id) {
        try {
            // URL da sua API para buscar um cliente pelo ID
            const response = await fetch(`/api/cliente/${id}`);
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar cliente: ${response.statusText}`);
            }
            
            const cliente = await response.json();
            
            // Preenche os campos do formulário com os dados da API
            tipoClienteSelect.value = cliente.tipoCliente || 'fisica';
            tipoAnterior = tipoClienteSelect.value; // Atualiza o tipo anterior
            aplicarMascaraCpfCnpj(cliente.tipoCliente || 'fisica');
            
            form.querySelector('input[name="nome"]').value = cliente.nome || '';
            form.querySelector('input[name="cpfCnpj"]').value = cliente.cpfCnpj || '';
            form.querySelector('input[name="telefone"]').value = cliente.telefone || '';
            form.querySelector('input[name="email"]').value = cliente.email || '';
            form.querySelector('input[name="cep"]').value = cliente.cep || '';
            form.querySelector('input[name="endereco"]').value = cliente.endereco || '';
            form.querySelector('input[name="bairro"]').value = cliente.bairro || '';
            form.querySelector('input[name="cidade"]').value = cliente.cidade || '';
            form.querySelector('input[name="estado"]').value = cliente.estado || '';

        } catch (error) {
            console.error("Houve um erro na busca do cliente:", error);
            alert("Não foi possível carregar os dados do cliente. Por favor, tente novamente.");
            window.location.href = 'tabelas.html';
        }
    }

    // Função para enviar os dados atualizados para a API
    async function salvarAlteracoes(id, dados) {
        try {
            // URL da sua API para atualizar um cliente pelo ID
            const response = await fetch(`/api/cliente/${id}`, {
                method: 'PUT', // Método para atualização
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            if (!response.ok) {
                throw new Error(`Erro ao salvar alterações: ${response.statusText}`);
            }
            
            alert('Cliente atualizado com sucesso!');
            window.location.href = 'tabelas.html';

        } catch (error) {
            console.error("Houve um erro ao salvar os dados:", error);
            alert("Não foi possível salvar as alterações. Tente novamente.");
        }
    }

    // --- Lógica de inicialização da página ---
    if (clienteId) {
        buscarEPreencherCliente(clienteId);
    } else {
        // Se não houver ID, aplica a máscara inicial de CPF e labels
        aplicarMascaraCpfCnpj('fisica');
        console.log('Nenhum ID de cliente encontrado. O formulário está vazio.');
    }

    // Evento para quando o tipo de cliente mudar
    tipoClienteSelect.addEventListener('change', function() {
        const tipoSelecionado = this.value;
        const confirmacao = confirm('Você tem certeza que deseja mudar o tipo de pessoa? Esta ação irá reformatar o campo de CPF/CNPJ.');
        
        if (confirmacao) {
            aplicarMascaraCpfCnpj(tipoSelecionado);
            tipoAnterior = tipoSelecionado;
            cpfCnpjInput.value = ''; // Limpa o campo ao mudar o tipo
        } else {
            this.value = tipoAnterior;
        }
    });

    // Adiciona o "listener" para o evento de envio do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!clienteId) {
            alert('Não é possível salvar sem um ID de cliente.');
            return;
        }

        const dadosAtualizados = {
            id: clienteId,
            tipoCliente: tipoClienteSelect.value,
            nome: nomeInput.value,
            cpfCnpj: cpfCnpjInput.value,
            telefone: telefoneInput.value,
            email: form.querySelector('input[name="email"]').value,
            cep: cepInput.value,
            endereco: form.querySelector('input[name="endereco"]').value,
            bairro: form.querySelector('input[name="bairro"]').value,
            cidade: form.querySelector('input[name="cidade"]').value,
            estado: form.querySelector('input[name="estado"]').value,
        };

        salvarAlteracoes(clienteId, dadosAtualizados);
    });
});