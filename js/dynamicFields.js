// dynamicFields.js
// Handles dynamic fields (certifications, previous jobs) for the multi-step form

/**
 * Add a new certification field with a unique ID and accessible label.
 * @param {HTMLElement} container - The container to append the field to.
 */
export function addCertificationField(container) {
    const id = `certification-${Date.now()}-${Math.floor(Math.random()*10000)}`;
    const div = document.createElement('div');
    div.className = 'flex items-center space-x-2';
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.className = 'sr-only';
    label.textContent = 'Certification';
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'certifications[]';
    input.id = id;
    input.className = 'w-full px-4 py-2 border border-gray-300 rounded-lg';
    input.placeholder = 'Certification';
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'ml-2 text-red-500 hover:underline remove-certification';
    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(removeBtn);
    container.appendChild(div);
}

/**
 * Add a new previous job field with a unique ID and accessible label.
 * @param {HTMLElement} container - The container to append the field to.
 */
export function addPreviousJobField(container) {
    const id = `previousJob-${Date.now()}-${Math.floor(Math.random()*10000)}`;
    const div = document.createElement('div');
    div.className = 'flex items-center space-x-2';
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.className = 'sr-only';
    label.textContent = 'Previous Job Title';
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'previousJobs[]';
    input.id = id;
    input.className = 'w-full px-4 py-2 border border-gray-300 rounded-lg';
    input.placeholder = 'Previous Job Title';
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'ml-2 text-red-500 hover:underline remove-previousJob';
    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(removeBtn);
    container.appendChild(div);
} 