document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Fetch tasks from server
    async function fetchTasks() {
        const response = await fetch('/tm/tasks');
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => renderTask(task));
    }

    // Render a task
    function renderTask(task) {
        const li = document.createElement('li');
        li.textContent = task.title;
        li.dataset.id = task._id;
        if (task.completed) {
            li.classList.add('completed');
        }

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = task.completed ? 'Undo' : 'Complete';
        toggleButton.onclick = () => toggleTaskCompletion(task._id, !task.completed);
        actions.appendChild(toggleButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.onclick = () => deleteTask(task._id);
        actions.appendChild(deleteButton);

        li.appendChild(actions);
        taskList.appendChild(li);
    }

    // Add a task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newTask = {
            title: taskInput.value,
            completed: false
        };
        const response = await fetch('/tm/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            const createdTask = await response.json();
            renderTask(createdTask);
            taskInput.value = '';
        } else {
            console.error('Failed to add task');
        }
    });

    // Toggle task completion
    async function toggleTaskCompletion(id, completed) {
        const response = await fetch(`/tm/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });

        if (response.ok) {
            const updatedTask = await response.json();
            const taskElement = document.querySelector(`li[data-id="${id}"]`);
            if (completed) {
                taskElement.classList.add('completed');
            } else {
                taskElement.classList.remove('completed');
            }
        } else {
            console.error('Failed to update task');
        }
    }

    // Delete a task
    async function deleteTask(id) {
        const response = await fetch(`/tm/tasks/${id}`, { method: 'DELETE' });

        if (response.ok) {
            document.querySelector(`li[data-id="${id}"]`).remove();
        } else {
            console.error('Failed to delete task');
        }
    }

    fetchTasks();
});
