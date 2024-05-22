document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-name');
    const taskList = document.getElementById('task-list');
    const totalPointsDisplay = document.getElementById('total-points');
    let totalPoints = 0;

    const categories = ["GSD", "personal", "logistics", "work"];

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const inputValue = taskInput.value;
        let [taskName, taskPoints] = inputValue.split('-');
        taskPoints = parseInt(taskPoints) || Math.floor(Math.random() * 10) + 1;
        const taskCategory = categories[Math.floor(Math.random() * categories.length)];

        if (!taskName.trim()) {
            alert('Task name cannot be empty');
            return;
        }

        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.dataset.importance = taskPoints;
        taskItem.dataset.category = taskCategory;
        taskItem.dataset.completed = 'false';

        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.addEventListener('click', toggleCompletion);

        const taskLabel = document.createElement('span');
        taskLabel.textContent = `${taskName.trim()} - ${taskPoints}`;
        
        const categoryLabel = document.createElement('span');
        categoryLabel.textContent = taskCategory;
        categoryLabel.classList.add('editable');
        categoryLabel.contentEditable = true;

        taskItem.appendChild(taskCheckbox);
        taskItem.appendChild(taskLabel);
        taskItem.appendChild(categoryLabel);
        taskItem.addEventListener('contextmenu', (event) => deleteTask(event, taskItem));
        taskList.appendChild(taskItem);

        taskInput.value = '';
        sortTasks();
    }

    function toggleCompletion(event) {
        const taskItem = event.target.parentElement;
        const taskPoints = parseInt(taskItem.dataset.importance);
        const isCompleted = taskItem.dataset.completed === 'true';

        if (isCompleted) {
            taskItem.classList.remove('completed');
            taskItem.dataset.completed = 'false';
            totalPoints -= taskPoints;
        } else {
            taskItem.classList.add('completed');
            taskItem.dataset.completed = 'true';
            totalPoints += taskPoints;
        }

        totalPointsDisplay.textContent = totalPoints;
        sortTasks();
    }

    function deleteTask(event, taskItem) {
        event.preventDefault();
        const taskPoints = parseInt(taskItem.dataset.importance);
        const isCompleted = taskItem.dataset.completed === 'true';

        if (isCompleted) {
            totalPoints -= taskPoints;
        }

        taskItem.remove();
        totalPointsDisplay.textContent = totalPoints;
    }

    function sortTasks() {
        const tasks = Array.from(taskList.children);

        tasks.sort((a, b) => {
            const aCompleted = a.dataset.completed === 'true';
            const bCompleted = b.dataset.completed === 'true';
            const aPoints = parseInt(a.dataset.importance);
            const bPoints = parseInt(b.dataset.importance);

            if (aCompleted !== bCompleted) {
                return aCompleted - bCompleted;
            }

            return bPoints - aPoints;
        });

        tasks.forEach((task, index) => {
            task.style.transform = `translateY(${index * 10}px)`;
        });

        // Add a slight delay to ensure the animation takes effect
        setTimeout(() => {
            tasks.forEach(task => taskList.appendChild(task));
        }, 300);
    }
});
