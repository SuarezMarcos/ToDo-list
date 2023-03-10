
window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const URI_BASE = 'http://todo-api.ctd.academy:3000/v1';


    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {

        event.preventDefault();

        const user = {
            firstName: document.querySelector('#inputNombre').value,
            lastName: document.querySelector('#inputApellido').value,
            email: document.querySelector('#inputEmail').value,
            password: document.querySelector('#inputPassword').value,
        }

        // Validation
        let passwordRepetida = document.querySelector('#inputPasswordRepetida').value;

        try{
            //mailValidation(user.email)
            if(validarTexto(user.firstName) && validarTexto(user.lastName) 
                && validarEmail(user.email) && validarContrasenia(user.password) 
                && compararContrasenias(user.password, passwordRepetida)){
            userRegister(user);
        }

        }catch(error){
            console.log(error)
        }

        // redirigir a login en caso de éxito
       // window.location.assign('../index.html');

    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function userRegister(user) {
        const configuration = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json' 
            },
            body: JSON.stringify(user)
        }
        fetch(`${URI_BASE}/users`, configuration)
            .then(res => res.status)
            .then(status => {

                if(status == 200 || status == 201) {
                    location.replace('index.html');
                }
            });

    }; 
    

});