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

 