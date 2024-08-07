document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const tasksList = document.getElementById('tasks');

    const apiUrl = 'http://localhost:5500/tasks';

    fetch(apiUrl)
        .then(response => response.json())
        .then(tasks => tasks.forEach(addTaskToDOM));

    addTaskButton.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') return;

        const task = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(addTaskToDOM);

        newTaskInput.value = '';
        newTaskInput.focus();
    }

    function addTaskToDOM(task) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.dataset.id = task.id;

        const taskTextElement = document.createElement('span');
        taskTextElement.textContent = task.text;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.className = 'complete';
        completeButton.addEventListener('click', () => {
            taskTextElement.classList.toggle('line-through');
            taskTextElement.classList.toggle('text-gray-500');
            task.completed = !task.completed;
            taskItem.classList.toggle('completed');
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', () => {
            fetch(`${apiUrl}/${task.id}`, {
                method: 'DELETE'
            }).then(() => {
                tasksList.removeChild(taskItem);
            });
        });

        taskItem.appendChild(taskTextElement);
        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);
        tasksList.appendChild(taskItem);
    }
});
