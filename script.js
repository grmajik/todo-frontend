"use strict";

const add = document.getElementById('add');
const task = document.getElementById('task-name');
const answersWrapper = document.querySelector('.answers-wrapper');
const counter = document.querySelector('.counter');
const appControls = document.querySelector('.app-controls');
const clearTasks = document.querySelector('.completed');

////////////////////////////
// SORTABLE FUNCTIONALITY //
////////////////////////////

// Listen in for drag events globally //

const container = document.querySelector('.answers-wrapper');

document.addEventListener('dragstart', e => {
	e.target.classList.add('dragging');
})

document.addEventListener('dragend', e => {
	e.target.classList.remove('dragging');
})

container.addEventListener('dragover', (e) => {
	e.preventDefault();
	const afterElement = getDragAfterElement(container, e.clientY);
	const draggable = document.querySelector('.dragging');
	if (afterElement == null) {
		container.appendChild(draggable);
	} else {
		container.insertBefore(draggable, afterElement);
	}
})

function getDragAfterElement(container, y) {
	const draggableElements = [...container.querySelectorAll('.answer-input:not(.dragging)')];
	return draggableElements.reduce((closest, child) => {
		const box = child.getBoundingClientRect();
		const offset = y - box.top - box.height / 2;
		if (offset < 0 && offset > closest.offset) {
			return { offset: offset, element: child }
		} else {
			return closest;
		}
	}, { offset: Number.NEGATIVE_INFINITY }).element;
}

let divsCounter = 0;

function checkControlsState(divsCounter) {
	if (divsCounter != 0) {
		appControls.style.display = "flex";
	} else {
		appControls.style.display = "none";
	}
}

clearTasks.addEventListener('click', (e) => {
	const arr = [...answersWrapper.childNodes];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].firstChild.checked) {
			answersWrapper.removeChild(arr[i]);
		}
	}
	checkControlsState(divsCounter);
})

add.addEventListener('click', (e) => {
	// if (task.value == "") {
	// 	alert('Please enter a task!');
	// 	return;
	// } else {}
	e.preventDefault();
	const newDiv = document.createElement('div');
	newDiv.className = "answer-input";
	newDiv.draggable = true;
	const newCheckbox = document.createElement('input');
	newCheckbox.type = "checkbox";
	const newText = document.createElement('input');
	newText.type = "text";
	newText.className = "text draggable";
	newText.value = task.value;
	const newButton = document.createElement('input');
	newButton.type = 'button';
	newButton.value = 'Remove';
	newDiv.appendChild(newCheckbox);
	newDiv.appendChild(newText);
	newDiv.appendChild(newButton);
	answersWrapper.appendChild(newDiv);
	task.value = '';
	counter.textContent = `${divsCounter+= 1} items left`;
	checkControlsState(divsCounter);
})

answersWrapper.addEventListener('click', (e) => {
	if (e.target.type === "button") {
		answersWrapper.removeChild(e.target.parentElement);
		counter.textContent = `${divsCounter -= 1} items left`;
		checkControlsState(divsCounter);
	} else {
		return;
	}
})

answersWrapper.addEventListener('change', (e) => {
	if (e.target.checked) {
		counter.textContent = `${divsCounter -= 1} items left`
	} else if (e.target.checked === false) {
		counter.textContent = `${divsCounter += 1} items left`
	}
})

checkControlsState(divsCounter);