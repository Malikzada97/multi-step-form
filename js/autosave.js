// autosave.js
// Handles autosave, load, and restore for the multi-step form

/**
 * Save all form data to localStorage for autosave/restore.
 * @param {HTMLFormElement} form
 */
export function saveFormData(form) {
    const data = {};
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
            data[field.name] = form.querySelectorAll(`[name="${field.name}"]:checked`).length > 0
                ? Array.from(form.querySelectorAll(`[name="${field.name}"]:checked`)).map(el => el.value)
                : [];
        } else {
            data[field.name] = field.value;
        }
    });
    localStorage.setItem('multiStepFormData', JSON.stringify(data));
}

/**
 * Load saved form data from localStorage and populate the form.
 * @param {HTMLFormElement} form
 */
export function loadSavedData(form) {
    const saved = localStorage.getItem('multiStepFormData');
    if (!saved) return;
    const data = JSON.parse(saved);
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        if (data[field.name] !== undefined) {
            if (field.type === 'file') {
                // Cannot set value for file inputs; skip
                return;
            }
            if (field.type === 'checkbox' || field.type === 'radio') {
                if (Array.isArray(data[field.name])) {
                    field.checked = data[field.name].includes(field.value);
                } else {
                    field.checked = data[field.name] === field.value;
                }
            } else {
                field.value = data[field.name];
            }
        }
    });
}

 