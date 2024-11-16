const notesTextarea = document.getElementById('notes');
const convertBtn = document.getElementById('convertBtn');
const taskList = document.getElementById('taskList');

// Load saved notes and tasks from local storage
window.addEventListener('load', () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notesTextarea.value = savedNotes;
    }

    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTaskToList(task.text, task.done));
});

// Save notes to local storage when typing
notesTextarea.addEventListener('input', () => {
    localStorage.setItem('notes', notesTextarea.value);
});

// Convert notes to tasks
convertBtn.addEventListener('click', () => {
    const notes = notesTextarea.value.trim();
    if (notes) {
        const tasks = notes.split('\n').filter(task => task.trim() !== '');
        tasks.forEach(task => addTaskToList(task));
        notesTextarea.value = '';
        localStorage.setItem('notes', '');
        saveTasks();
    }
});

function addTaskToList(taskText, isDone = false) {
    const li = document.createElement('li');
    
    // Create div to wrap checkbox and text
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isDone;
    checkbox.addEventListener('change', () => {
        li.classList.toggle('done');
        saveTasks();
    });

    const span = document.createElement('span');
    span.textContent = taskText;

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
        // Show confirmation dialog
        if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            li.remove();
            saveTasks();
        }
    });

    // Append elements in the correct order
    taskContent.appendChild(checkbox);
    taskContent.appendChild(span);
    li.appendChild(taskContent);
    li.appendChild(deleteBtn);

    if (isDone) {
        li.classList.add('done');
    }

    taskList.appendChild(li);
}

function saveTasks() {
    const tasks = Array.from(taskList.children).map(li => ({
        text: li.querySelector('span').textContent,
        done: li.querySelector('input').checked
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}   