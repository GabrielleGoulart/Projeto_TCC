document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.formulario');
    const params = new URLSearchParams(window.location.search);
    const aparelhoId = params.get('id');

    // Função para buscar os dados de um aparelho na API e preencher o formulário
    async function buscarEPreencherAparelho(id) {
        try {
            // Em um projeto real, substitua esta URL pela URL da sua API
            const response = await fetch(`/api/aparelhos/${id}`);
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar aparelho: ${response.statusText}`);
            }
            
            const aparelho = await response.json();
            
            // Preenche os campos do formulário com os dados da API
            form.querySelector('input[name="modelo"]').value = aparelho.modelo || '';
            form.querySelector('input[name="data"]').value = aparelho.data || '';
            form.querySelector('input[name="defeito"]').value = aparelho.defeito || '';
            form.querySelector('textarea[name="observacao"]').value = aparelho.observacao || '';
            form.querySelector('input[name="servico"]').value = aparelho.servico || '';
            form.querySelector('input[name="pecas"]').value = aparelho.pecas || '';
            form.querySelector('input[name="valor"]').value = aparelho.valor || '';

        } catch (error) {
            console.error("Houve um erro na busca do aparelho:", error);
            alert("Não foi possível carregar os dados do aparelho. Por favor, tente novamente.");
            // Redireciona de volta para a página de onde o usuário veio, caso a busca falhe
            window.location.href = 'tabelas.html';
        }
    }

    // Função para enviar os dados atualizados para a API
    async function salvarAlteracoes(id, dados) {
        try {
            // Em um projeto real, substitua esta URL pela URL da sua API
            // Usa o método 'PUT' para atualizar um recurso existente
            const response = await fetch(`/api/aparelhos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            if (!response.ok) {
                throw new Error(`Erro ao salvar alterações: ${response.statusText}`);
            }
            
            alert('Aparelho atualizado com sucesso!');
            window.location.href = 'tabelas.html'; // Redireciona após o sucesso

        } catch (error) {
            console.error("Houve um erro ao salvar os dados:", error);
            alert("Não foi possível salvar as alterações. Tente novamente.");
        }
    }

    // --- Lógica de inicialização da página ---
    if (aparelhoId) {
        // Se um ID foi encontrado na URL, inicia a busca pelos dados
        buscarEPreencherAparelho(aparelhoId);
    } else {
        // Se não houver ID, o formulário permanece vazio (pode ser usado para novo cadastro)
        console.log('Nenhum ID de aparelho encontrado. O formulário está vazio.');
    }

    // Adiciona o "listener" para o evento de envio do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!aparelhoId) {
            alert('Não é possível salvar sem um ID de aparelho.');
            return;
        }

        const dadosAtualizados = {
            id: aparelhoId,
            modelo: form.querySelector('input[name="modelo"]').value,
            data: form.querySelector('input[name="data"]').value,
            defeito: form.querySelector('input[name="defeito"]').value,
            observacao: form.querySelector('textarea[name="observacao"]').value,
            servico: form.querySelector('input[name="servico"]').value,
            pecas: form.querySelector('input[name="pecas"]').value,
            valor: form.querySelector('input[name="valor"]').value,
        };

        salvarAlteracoes(aparelhoId, dadosAtualizados);
    });
});