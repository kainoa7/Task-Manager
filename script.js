document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Fetch tasks from server
    async function fetchTasks() {
        try {
            const response = await fetch('/tasks');
            const tasks = await response.json();
            taskList.innerHTML = '';
            tasks.forEach(task => renderTask(task));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Render a task
    function renderTask(task) {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.dataset.id = task._id;
        li.innerHTML = `
            <span>${task.title}</span>
            <div class="task-actions">
                <button class="toggle-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        li.querySelector('.toggle-btn').onclick = () => toggleTaskCompletion(task._id, !task.completed);
        li.querySelector('.delete-btn').onclick = () => deleteTask(task._id);

        taskList.appendChild(li);
    }

    // Add a task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newTask = {
            title: taskInput.value,
            completed: false
        };
        try {
            const response = await fetch('/tasks', {
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
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });

    // Toggle task completion
    async function toggleTaskCompletion(id, completed) {
        try {
            const response = await fetch(`/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed })
            });

            if (response.ok) {
                const updatedTask = await response.json();
                const taskElement = document.querySelector(`li[data-id="${id}"]`);
                taskElement.className = completed ? 'completed' : '';
                taskElement.querySelector('.toggle-btn').textContent = completed ? 'Undo' : 'Complete';
            } else {
                console.error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    // Delete a tasks
    async function deleteTask(id) {
        try {
            const response = await fetch(`/tasks/${id}`, { method: 'DELETE' });

            if (response.ok) {
                document.querySelector(`li[data-id="${id}"]`).remove();
            } else {
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    fetchTasks();
});
