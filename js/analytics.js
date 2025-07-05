// analytics.js
// Handles analytics tracking for the multi-step form

/**
 * Analytics object to track user interactions, step times, and errors.
 */
export const analytics = {
    startTime: Date.now(),
    stepTimes: {},
    fieldInteractions: {},
    errors: []
};

/**
 * Track the time spent on the current step.
 * @param {Object} formState
 */
export function trackStepTime(formState) {
    const now = Date.now();
    analytics.stepTimes[formState.currentStep] = (analytics.stepTimes[formState.currentStep] || 0) + (now - analytics.startTime);
    analytics.startTime = now;
}

/**
 * Track a field interaction (focus event).
 * @param {string} fieldName
 */
export function trackFieldInteraction(fieldName) {
    analytics.fieldInteractions[fieldName] = (analytics.fieldInteractions[fieldName] || 0) + 1;
}

/**
 * Track a validation error for analytics.
 * @param {string} field
 * @param {number} step
 */
export function trackError(field, step) {
    analytics.errors.push({
        field,
        step,
        timestamp: Date.now()
    });
} 