export const TASKS_KEY = 'devtask-weather-tasks-v1';

// Leer: texto del navegador -> JSON.parse -> array de JavaScript
export function loadTasks(){
  // TODO EN VIVO:
  //   const raw = localStorage.getItem(TASKS_KEY);
  //   return raw ? JSON.parse(raw) : [];
  //   (bonus: envolver en try...catch y devolver [] si falla)
  return [];
}

// Guardar: array de JavaScript -> JSON.stringify -> texto en el navegador
export function saveTasks(tasks){
  // TODO EN VIVO:
  //   localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

}

export function renderTasks(container){
  const tasks = loadTasks();
  container.innerHTML = '';
  if(tasks.length === 0){
    container.innerHTML = '<li>Sin tareas</li>';
    return;
  }
  tasks.forEach((t, idx)=>{
    const li = document.createElement('li');

    const left = document.createElement('div');
    left.className = 'task-left';
    const text = document.createElement('span');
    text.textContent = t.text;
    if(t.done) text.classList.add('completed');
    left.appendChild(text);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = t.done ? 'Deshacer' : 'Hecho';
    toggleBtn.addEventListener('click', ()=>{
      toggleTask(idx, container);
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Eliminar';
    delBtn.addEventListener('click', ()=>{
      deleteTask(idx, container);
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    container.appendChild(li);
  });
}

export function addTask(text, container){
  const tasks = loadTasks();
  tasks.push({text, done:false, created: Date.now()});
  saveTasks(tasks);
  renderTasks(container);
}

export function toggleTask(index, container){
  const tasks = loadTasks();
  if(!tasks[index]) return;
  tasks[index].done = !tasks[index].done;
  saveTasks(tasks);
  renderTasks(container);
}

export function deleteTask(index, container){
  let tasks = loadTasks();
  tasks = tasks.filter((_,i)=>i!==index);
  saveTasks(tasks);
  renderTasks(container);
}
