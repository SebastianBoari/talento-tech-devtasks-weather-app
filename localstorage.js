const tareas = [{ text: "Estudiar", estado: false}]

const tareasStringify = JSON.stringify(tareas)

localStorage.setItem("tareas", tareasStringify)

