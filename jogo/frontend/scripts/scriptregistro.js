const registroForm = document.getElementById('registro-form');

function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    fetch('/registro', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/login';
            } else {
                alert('Falha no registro. Verifique se todos os campos estão preenchidos corretamente.');
            }
        })
        .catch(error => {
            console.error('Erro ao enviar solicitação de registro:', error);
            alert('Erro ao enviar solicitação de registro. Tente novamente mais tarde.');
        });
}

registroForm.addEventListener('submit', handleRegister);    
