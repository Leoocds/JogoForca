const loginForm = document.getElementById('login-form');
function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    fetch('/login', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/index';
            } else {
                alert('Falha no login. Verifique suas credenciais e tente novamente.');
            }
        })
        .catch(error => {
            console.error('Erro ao enviar solicitação de login:', error);
            alert('Erro ao enviar solicitação de login. Tente novamente mais tarde.');
        });
}

loginForm.addEventListener('submit', handleLogin)