export const TASKS_KEY = 'devtask-weather-tasks-v1';

export function loadTasks(){
  try{
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    console.error('Error leyendo tasks:', e);
    return [];
  }
}

export function saveTasks(tasks){
  try{
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }catch(e){
    console.error('Error guardando tasks:', e);
  }
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
