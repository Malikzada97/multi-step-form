// navigation.js
// Handles step navigation and progress bar updates for the multi-step form

export function showStep(step, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay) {
    // Guard: if the requested step is already active, do nothing
    const currentActive = Array.from(formSteps).findIndex(el => el.classList.contains('active')) + 1;
    if (currentActive === step) return;
    formSteps.forEach((stepEl, idx) => {
        const isActive = idx + 1 === step;
        stepEl.classList.toggle('hidden', !isActive);
        stepEl.classList.toggle('active', isActive);
        stepEl.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        if (isActive) {
            // Move focus to the first input/select/textarea in the step
            const firstField = stepEl.querySelector('input, select, textarea');
            if (firstField) {
                setTimeout(() => firstField.focus(), 0);
            }
        }
    });
    stepIndicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx + 1 === step);
        indicator.classList.toggle('completed', idx + 1 < step);
        indicator.setAttribute('aria-selected', idx + 1 === step ? 'true' : 'false');
        indicator.setAttribute('tabindex', idx + 1 === step ? '0' : '-1');
    });
    const percent = Math.round(((step - 1) / (formSteps.length - 1)) * 100);
    progressBar.style.width = percent + '%';
    progressPercentage.textContent = percent + '%';
    currentStepDisplay.textContent = step;
}

export function nextStep(formState, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay) {
    if (formState.currentStep < formSteps.length) {
        formState.currentStep++;
        showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
    }
}

export function prevStep(formState, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay) {
    if (formState.currentStep > 1) {
        formState.currentStep--;
        showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
    }
}

export function goToStep(step, formState, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay) {
    if (step >= 1 && step <= formSteps.length) {
        formState.currentStep = step;
        showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
    }
} 