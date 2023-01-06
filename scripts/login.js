window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const URI_BASE = 'http://todo-api.ctd.academy:3000//v1';
    const form = document.querySelector('form');
    const email = document.querySelector('#inputEmail');
    const password = document.querySelector('#inputPassword');
    
    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const login = {
            email : email.value,
            password : password.value
        }

        const settings = {
            method : 'POST',
            body : JSON.stringify(login),
            headers : {
                'Content-Type' : 'application/json'
            }
        }

        //lanzamos la consulta de login a la API
        realizarLogin(settings);

        //limpio los campos del formulario
        form.reset();
    
    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
        
        fetch(`${URI_BASE}/users/login`, settings)
            .then(res => {
                if (res.ok != true) {
                    mostrarMensaje("Alguno de los datos es incorrecto.");
                }

                return res.json();
            })
            .then(data => {
                if(data.jwt) {
                    // guardo Token en storage
                    localStorage.setItem('userToken', JSON.stringify(data.jwt))
                }

                location.replace('mis-tareas.html');

            }).catch(err => {
                mostrarMensajeError("Promesa rechazada:");
                console.log(err);
            })
    };

});