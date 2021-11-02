import React, { useState, useEffect } from 'react';
import { firebase } from './firebase';

function App() {

    const [tareas, setTareas] = useState([]);
    const [tarea, setTarea] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [id, setId] = useState('');

    // Obtención de datos de Firestore
    useEffect (() => {
        const obtenerDatos = async () => {

            try {

                // Inicio de llamada a Firestore (utilizando el método firestore)
                const db = firebase.firestore();

                // Traemos los datos de la colección 'tareas' de Firestore (utilizando los métodos collection y get de Firestore)
                const data = await db.collection('tareas').get();
                
                // Dentro de la propiedad docs de los datos traídos se encuentra el array de datos. El método data() trae los de cada tarea correspondiente a un id determinado en forma de objeto 
                const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                
                // Actualizamos nuestro array de tareas
                setTareas(arrayData);

            } catch (error) {
                console.log(error);
            }

        }

        obtenerDatos();

    }, []);

    // Agregar tarea
    const agregar = async (e) => {
        e.preventDefault();
        
        if(!tarea.trim()) {
            console.log('está vacío')
            return
        }

        try {

            const db = firebase.firestore()

            // Creamos la nueva tarea sin el id
            const nuevaTarea = {
                name: tarea, 
                fecha: Date.now()
            }

            // Esperamos que firestore reciba el objeto (con el método add - el id es aleatorio)
            const data = await db.collection('tareas').add(nuevaTarea);
            
            //
            setTareas([
                ...tareas,
                {...nuevaTarea, id: data.id}
            ])

            // Limpiamos el input de tarea
            setTarea('');
            
        } catch (error) {
            
        }
    }

    // Eliminar tarea
    const eliminar = async (id) => {
        try {

            const db = firebase.firestore();

            // Pasamos el id con el método doc de Firestore y lo borramos la tarea con el método delete
            await db.collection('tareas').doc(id).delete();

            // Filtramos las tareas con id diferente al pasado por parámetro
            const arrayFiltrado = tareas.filter(item => item.id !== id);

            // Actualización del array de tareas
            setTareas(arrayFiltrado);
            
        } catch (error) {
            console.log(error)
        }
    }

    // Activar modo edición
    const activarEdicion = item => {
        setModoEdicion(true);
        setTarea(item.name);
        setId(item.id);
    }

    // Editar
    const editar = async (e) => {
        e.preventDefault();
        if(!tarea.trim()) {
            console.log('está vacío')
            return
        }
        try {

            const db = firebase.firestore();

            // Actualizamos los datos en Firestore con el método update
            await db.collection('tareas').doc(id).update({
                name: tarea
            });

            // Actualizamos el array de tareas
            const arrayEditado = tareas.map(item => (
                item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
            ));
            setTareas(arrayEditado);
            setModoEdicion(false);
            setTarea('');
            setId('');
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-6">
                    <ul className="list-group">
                        {
                            tareas.map(item => (
                                <li className="list-group-item" key={item.id}>
                                    {item.name}
                                    <button 
                                        className="btn btn-danger btn-sm float-right"
                                        onClick={() => eliminar(item.id)}
                                    >
                                        Eliminar
                                    </button>    
                                    <button 
                                        className="btn btn-warning btn-sm float-right mr-2"
                                        onClick={() => activarEdicion(item)}
                                    >
                                        Editar
                                    </button>    
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="col-md-6">
                    <h3>
                        {
                            modoEdicion ? 'Editar tarea' : 'Agregar tarea'
                        }
                    </h3>
                    <form onSubmit={modoEdicion ? editar : agregar}>
                        <input 
                        type="text" 
                        placeholder="Ingrese tarea"
                        className="form-control mb-2"
                        onChange={e => setTarea(e.target.value)}
                        value={tarea}
                        />
                        <button 
                        className={
                            modoEdicion ? "btn btn-warning btn-block" : "btn btn-dark btn-block"
                        }
                        type="submit"
                        >
                            {
                                modoEdicion ? 'Editar' : 'Agregar'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;


