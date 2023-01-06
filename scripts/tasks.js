// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
if(!localStorage.getItem('userToken')){
  location.replace('index.html');
}


/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const urlUser = 'http://todo-api.ctd.academy:3000/v1/users/getMe';
  const urlTasks = 'http://todo-api.ctd.academy:3000/v1/tasks';
  const token = JSON.parse(localStorage.getItem('userToken')); 

  const btnCerrarSesion = document.querySelector('#closeApp');
  const userName = document.querySelector('.user-info');
  const formCrearTarea = document.querySelector('form');
  const newTask = document.querySelector('#nuevaTarea');



  obtenerNombreUsuario();
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {

    const cerrarSesion = confirm("¿Desea cerrar sesión?");

    if(cerrarSesion){
      //limpiamos el localstorage y redireccioamos a login
      localStorage.clear();
      location.replace('index.html');
    }

  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {

    let settings = {
      method : 'GET',
      headers : {
        authorization : token
      }
    }

    fetch(urlUser, settings)
      .then(res => res.json())
      .then(data => {
        userName.firstChild.textContent = data.firstName.toUpperCase();
      })
      .catch(err => console.log(err))


  };


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    
    let settings = {
      method : 'GET',
      headers : {
        authorization : token
      }
    }

    fetch(urlTasks,settings)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        renderizarTareas(data);
        botonesCambioEstado();
        botonBorrarTarea();
      })
      .catch(err => console.log(err))
  };

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault();

    const task = {
      description : newTask.value.trim(),
    }

    let settings = {
      method : 'POST',
      body : JSON.stringify(task),
      headers : {
        'Content-Type' : 'application/json',
        authorization : token
      }
    }

    fetch(urlTasks, settings)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        consultarTareas();
        mostrarMensaje('Nueva tarea creada :)')
      })
      .catch(err => console.log(err))

      formCrearTarea.reset();
  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    
    // Limpio el contenido
    const tasks = document.querySelector('.tareas-pendientes');
    const finishedTasks = document.querySelector('.tareas-terminadas');
    tasks.innerHTML = '';
    finishedTasks.innerHTML = '';

     // buscamos el numero de finalizadas
     const numberFinished = document.querySelector('#cantidad-finalizadas');
     let acc = 0;
     numberFinished.innerText = acc;


     listado.forEach(task => {
      //variable intermedia para manipular la fecha
      let date = new Date(task.createdAt);

      if (task.completed) {
          acc++;
          //lo mandamos al listado de tareas completas
          finishedTasks.innerHTML += `
          <li class="tarea">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${task.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${task.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${task.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>
                      `
        } else {
              //lo mandamos al listado de tareas sin terminar
              tasks.innerHTML += `
              <li class="tarea">
                <button class="change" id="${task.id}"><i class="fa-regular fa-circle"></i></button>
                <div class="descripcion">
                  <p class="nombre">${task.description}</p>
                  <p class="timestamp">${date.toLocaleDateString()}</p>
                </div>
              </li>
                      `
      }
      // actualizamos el contador en la pantalla
      numberFinished.innerText = acc;
  })


  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    const btnCambio = document.querySelectorAll('.change');
    
    btnCambio.forEach(boton => {
      boton.addEventListener('click', e => {

        const id = e.target.id;
        const url = `${urlTasks}/${id}`;
        const payload = {};

        if(e.target.classList.contains('incompleta')) {
          payload.completed = false;
        } else {
          payload.completed = true;
        } 

        const settings = {
          method : 'PUT',
          headers : {
            authorization: token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }

        fetch(url, settings)
          .then(res => res.json())
          .then(data => {
            console.log(data)
            consultarTareas()
          })
          .catch(err => {
            mostrarMensajeError(err);
          })
      })
    })
  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {

    const btnDelete = document.querySelectorAll('.borrar');

    btnDelete.forEach(el => {
      el.addEventListener('click', e => {
        const id = e.target.id;
        const url = `${urlTasks}/${id}`;

        const settings = {
          method : 'DELETE',
          headers: {
            authorization : token,
            'Content-Type': 'application/json'
          }
        }

        fetch(url, settings)
          .then(res => {
            consultarTareas();
            mostrarMensaje('Tarea eliminada satisfactoriamente');
          })
      });
    })
  };
});