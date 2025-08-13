document.getElementById('form-login').addEventListener('submit', async function(event) {
  event.preventDefault(); // previne envio padrão do form

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const mensagemErro = document.getElementById('mensagem-erro');
  mensagemErro.textContent = '';

  if (!email || !senha) {
    mensagemErro.textContent = 'Por favor, preencha todos os campos.';
    return;
  }

  try {
    const resposta = await fetch('https://api.exemplo.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      localStorage.setItem('token', dados.token);
      window.location.href = 'inicio.html';
    } else {
      mensagemErro.textContent = dados.mensagem || 'Usuário ou senha inválidos.';
    }
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    mensagemErro.textContent = 'Erro na conexão com o servidor.';
  }
});
