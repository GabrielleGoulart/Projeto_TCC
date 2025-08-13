document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.formulario');
    const precoInput = document.querySelector('input[name="preco"]');
    const quantidadeInput = document.querySelector('input[name="quantidade_estoque"]');
    const estoqueMinimoInput = document.querySelector('input[name="estoque_minimo"]');
    const params = new URLSearchParams(window.location.search);
    const pecaId = params.get('id');

    if (precoInput) {
        VMasker(precoInput).maskMoney();
    }

    async function buscarEPreencherPeca(id) {
        try {
            const response = await fetch(`http://localhost:8080/api/peca/${id}`);

            if (!response.ok) {
                throw new Error(`Erro ao buscar peça: ${response.statusText}`);
            }

            const peca = await response.json();

           form.querySelector('input[name="peca"]').value = peca.nome || '';
form.querySelector('input[name="descricao"]').value = peca.descricao || '';
form.querySelector('input[name="preco"]').value = peca.preco_unitario != null 
    ? peca.preco_unitario.toFixed(2).replace('.', ',') 
    : '';
form.querySelector('input[name="quantidade_estoque"]').value = peca.quantidade_estoque != null 
    ? peca.quantidade_estoque 
    : '';
form.querySelector('input[name="estoque_minimo"]').value = peca.estoque_minimo != null 
    ? peca.estoque_minimo 
    : '';

        } catch (error) {
            console.error("Houve um erro na busca da peça:", error);
            alert("Não foi possível carregar os dados da peça. Por favor, tente novamente.");
            // removido redirecionamento para 'estoque.html'
        }
    }

    async function salvarAlteracoes(id, dados) {
        try {
            const response = await fetch(`http://localhost:8080/api/peca/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            if (!response.ok) {
                throw new Error(`Erro ao salvar alterações: ${response.statusText}`);
            }

            alert('Peça atualizada com sucesso!');
            window.location.href = 'tabelas.html'; // mantém redirecionamento para tabelas.html

        } catch (error) {
            console.error("Houve um erro ao salvar os dados:", error);
            alert("Não foi possível salvar as alterações. Tente novamente.");
        }
    }

    if (pecaId) {
        buscarEPreencherPeca(pecaId);
    } else {
        console.log('Nenhum ID de peça encontrado. O formulário está vazio.');
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!pecaId) {
            alert('Não é possível salvar sem um ID de peça.');
            return;
        }

        const dadosAtualizados = {
  id: pecaId,
  nome: form.querySelector('input[name="peca"]').value,
  descricao: form.querySelector('input[name="descricao"]').value,
  preco_unitario: parseFloat(precoInput.value.replace(',', '.')) || 0,
  quantidade_estoque: parseInt(form.querySelector('input[name="quantidade_estoque"]').value) || 0,
  estoque_minimo: parseInt(form.querySelector('input[name="estoque_minimo"]').value) || 0
};


        salvarAlteracoes(pecaId, dadosAtualizados);
    });
});
