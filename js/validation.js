// validation.js
// Handles validation logic for the multi-step form

/**
 * Centralized error messages for validation.
 */
export const validationMessages = {
    required: 'This field is required',
    invalidFormat: 'Invalid format',
    invalidValue: 'Invalid value',
    countryRequired: 'Please select a country',
    cityRequired: 'Please select a city',
    dependency: (dep) => `This field depends on ${dep}`
};

/**
 * Validation rules for each field in the form.
 * - required: field must not be empty
 * - pattern: RegExp to match valid input
 * - validate: custom function for complex validation
 */
export const validationRules = {
    fullName: {
        required: true,
        minLength: 2,
        maxLength: 100
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    mobile: {
        required: true,
        pattern: /^\+?[\d\s-]{10,}$/
    },
    dob: {
        required: true,
        validate: (value) => {
            const date = new Date(value);
            const age = (new Date() - date) / (365.25 * 24 * 60 * 60 * 1000);
            return age >= 18 && age <= 100;
        }
    },
    country: {
        required: true
    },
    city: {
        required: true
    },
    expectedSalary: {
        validate: (value) => value > 0 && value < 1000000
    }
};

/**
 * Field dependencies for cross-field validation.
 * E.g., city depends on country being selected.
 */
export const fieldDependencies = {
    city: {
        dependsOn: 'country',
        validate: (value, dependentValue) => {
            return value && dependentValue;
        }
    },
    alternateContact: {
        dependsOn: 'mobile',
        validate: (value, dependentValue) => {
            return !value || value !== dependentValue;
        }
    }
};

/**
 * Validate all fields in the current step.
 * @param {number} step - The step number to validate.
 * @param {NodeList} formSteps - All form step elements.
 * @param {Object} validationRules - The validation rules object.
 * @param {Object} fieldDependencies - The field dependencies object.
 * @returns {boolean} - True if all fields are valid, false otherwise.
 */
export function validateStep(step, formSteps, validationRules, fieldDependencies) {
    let isValid = true;
    let firstErrorField = null;
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const fields = currentStepElement.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        const rules = validationRules[field.name];
        const errorElement = field.closest('div').querySelector('.error-message');
        if (errorElement) errorElement.textContent = '';
        // Remove previous error border
        field.classList.remove('border-red-500', 'focus:border-red-500', 'ring-red-500');
        if (rules) {
            if (rules.required && !field.value.trim()) {
                isValid = false;
                if (!firstErrorField) firstErrorField = field;
                if (errorElement) errorElement.textContent = validationMessages.required;
                field.classList.add('border-red-500', 'focus:border-red-500', 'ring-red-500');
            } else if (rules.pattern && !rules.pattern.test(field.value)) {
                isValid = false;
                if (!firstErrorField) firstErrorField = field;
                if (errorElement) errorElement.textContent = validationMessages.invalidFormat;
                field.classList.add('border-red-500', 'focus:border-red-500', 'ring-red-500');
            } else if (rules.validate && !rules.validate(field.value)) {
                isValid = false;
                if (!firstErrorField) firstErrorField = field;
                if (errorElement) errorElement.textContent = validationMessages.invalidValue;
                field.classList.add('border-red-500', 'focus:border-red-500', 'ring-red-500');
            }
        }
        // Check field dependencies
        const dependency = fieldDependencies[field.name];
        if (dependency) {
            const dependentField = currentStepElement.querySelector(`[name="${dependency.dependsOn}"]`);
            if (dependentField && !dependency.validate(field.value, dependentField.value)) {
                isValid = false;
                if (!firstErrorField) firstErrorField = field;
                if (errorElement) {
                    errorElement.textContent = validationMessages.dependency(dependency.dependsOn);
                }
                field.classList.add('border-red-500', 'focus:border-red-500', 'ring-red-500');
            }
        }
    });
    if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus({ preventScroll: true });
    }
    return isValid;
} 