/**
 * Multi-Step Form with Progress Indicator, Validation, and Autosave
 * 
 * Features:
 * - Step-by-step form navigation
 * - Dynamic progress indicator
 * - Field validation before proceeding
 * - Autosave to localStorage
 * - Final review before submission
 * - Smooth transitions between steps
 * - Loading state management
 * - Enhanced validation
 * - Error recovery
 * - Form analytics
 * - Form backup/restore
 * - Field dependencies
 */

// Modularized imports
import { showStep } from './navigation.js';
import { validationRules, fieldDependencies, validateStep } from './validation.js';
import { saveFormData, loadSavedData } from './autosave.js';
import { analytics, trackStepTime } from './analytics.js';
import { addCertificationField, addPreviousJobField } from './dynamicFields.js';

/**
 * Main entry point for the multi-step form application.
 * Handles initialization, event listeners, and high-level workflow.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('multiStepForm');
    const formSteps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const currentStepDisplay = document.getElementById('current-step');
    const totalStepsDisplay = document.getElementById('total-steps');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Dynamic field containers
    const certificationsContainer = document.getElementById('certifications-container');
    const addCertificationBtn = document.getElementById('add-certification');
    const previousJobsContainer = document.getElementById('previousJobs-container');
    const addPreviousJobBtn = document.getElementById('add-previousJob');
    
    // Country and city dropdowns
    const countrySelect = document.getElementById('country');
    const citySelect = document.getElementById('city');

    // Form state management
    const formState = {
        currentStep: 1,
        data: {},
        errors: {},
        lastValidStep: 1,
        isSubmitting: false
    };

    /**
     * Initialize the form: set up event listeners, load saved data, and show the first step.
     */
    function initForm() {
        totalStepsDisplay.textContent = formSteps.length;
        populateCountries();
        loadSavedData(form);
        setupEventListeners();
        showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
        updateNavigationButtons();
        setupAccessibility();
        updateCities(form);
    }

    /**
     * Set up accessibility features (keyboard navigation, ARIA live regions).
     */
    function setupAccessibility() {
        // Add keyboard navigation for step indicators
        stepIndicators.forEach(indicator => {
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const stepToGo = parseInt(indicator.getAttribute('data-step'));
                    if (stepToGo < formState.currentStep) {
                        formState.currentStep = stepToGo;
                        showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
                        updateNavigationButtons();
                    }
                }
            });
        });

        // Add ARIA live regions for error messages
        const errorRegion = document.createElement('div');
        errorRegion.setAttribute('aria-live', 'polite');
        errorRegion.setAttribute('aria-atomic', 'true');
        errorRegion.className = 'visually-hidden';
        document.body.appendChild(errorRegion);
    }

    /**
     * Show or hide the loading overlay and update button states.
     * @param {boolean} show - Whether to show the loading overlay.
     */
    function showLoading(show) {
        loadingOverlay.classList.toggle('hidden', !show);
        formState.isSubmitting = show;
        if (show) {
            nextBtn.disabled = true;
            prevBtn.disabled = true;
            submitBtn.disabled = true;
        } else {
            nextBtn.disabled = false;
            prevBtn.disabled = false;
            submitBtn.disabled = false;
        }
    }

    /**
     * Set up all event listeners for navigation, dynamic fields, autosave, and analytics.
     */
    function setupEventListeners() {
        // Navigation buttons
        prevBtn.addEventListener('click', () => {
            showError('');
            trackStepTime(formState);
            if (formState.currentStep > 1) {
                formState.currentStep--;
                showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
                updateNavigationButtons();
            }
        });
        nextBtn.addEventListener('click', () => {
            showError('');
            trackStepTime(formState);
            if (validateStep(formState.currentStep, formSteps, validationRules, fieldDependencies)) {
                if (formState.currentStep < formSteps.length) {
                    formState.currentStep++;
                    showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
                    updateNavigationButtons();
                }
            }
        });
        submitBtn.addEventListener('click', submitForm);
        
        // Step indicator clicks
        stepIndicators.forEach(indicator => {
            indicator.addEventListener('click', function() {
                const stepToGo = parseInt(this.getAttribute('data-step'));
                if (stepToGo < formState.currentStep) {
                    formState.currentStep = stepToGo;
                    showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
                    updateNavigationButtons();
                }
            });
        });
        
        // Dynamic field additions
        addCertificationBtn.addEventListener('click', () => addCertificationField(certificationsContainer));
        addPreviousJobBtn.addEventListener('click', () => addPreviousJobField(previousJobsContainer));
        
        // Event delegation for removing dynamic fields
        certificationsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-certification')) {
                e.target.closest('div').remove();
            }
        });
        previousJobsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-previousJob')) {
                e.target.closest('div').remove();
            }
        });
        
        // Country change event for dynamic cities
        countrySelect.addEventListener('change', () => updateCities(form));
        
        // Debounce function to limit how often a function is called
        function debounce(func, wait) {
            let timeout;
            return function() {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.call(context, form);
                }, wait);
            };
        }

        // Create a single debounced saveFormData function
        const debouncedSaveFormData = debounce(saveFormData, 500);

        // Autosave on field changes
        form.addEventListener('input', debouncedSaveFormData);
        form.addEventListener('change', debouncedSaveFormData);

        // Track field interactions
        form.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                analytics.fieldInteractions[e.target.name] = (analytics.fieldInteractions[e.target.name] || 0) + 1;
            }
        }, true);

        // Track form errors
        form.addEventListener('invalid', (e) => {
            analytics.errors.push({
                field: e.target.name,
                step: formState.currentStep,
                timestamp: Date.now()
            });
        }, true);
    }

    /**
     * Update navigation buttons visibility based on current step
     */
    function updateNavigationButtons() {
        if (formState.currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
        
        if (formState.currentStep === formSteps.length) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
            collectFormData();
            updateReviewSummary();
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    /**
     * Handle form submission: validate all steps, send data, and handle errors.
     * @param {Event} e - The submit event.
     */
    async function submitForm(e) {
        e.preventDefault();
        if (formState.isSubmitting) return;
        submitBtn.disabled = true;
        try {
            showLoading(true);
            
            // Validate all steps
            for (let step = 1; step <= formSteps.length; step++) {
                if (!validateStep(step, formSteps, validationRules, fieldDependencies)) {
                    formState.currentStep = step;
                    showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
                    updateNavigationButtons();
                    throw new Error('Please fix the errors before submitting');
                }
            }

            // Get form data
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Send data to server
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    formData: data,
                    analytics: analytics
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            // Clear saved data
            localStorage.removeItem('formData');
            localStorage.removeItem('formBackup');
            
            // Show success message
            alert('Form submitted successfully!');
            
            // Reset form
            form.reset();
            formState.currentStep = 1;
            showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
            updateNavigationButtons();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showError(error.message || 'An unexpected error occurred. Please try again.');
            recoverFromError();
        } finally {
            showLoading(false);
            submitBtn.disabled = false;
        }
    }

    /**
     * Recover from an error by returning to the last valid step.
     */
    function recoverFromError() {
        if (formState.lastValidStep < formState.currentStep) {
            formState.currentStep = formState.lastValidStep;
            showStep(formState.currentStep, formSteps, stepIndicators, progressBar, progressPercentage, currentStepDisplay);
            updateNavigationButtons();
        }
    }

    /**
     * Collect all form data and update formState.data in the correct structure.
     */
    function collectFormData() {
        const formData = new FormData(form);
        formState.data = {
            personalInfo: {
                fullName: formData.get('fullName') || '',
                dob: formData.get('dob') || '',
                gender: formData.get('gender') || '',
                nationalId: formData.get('nationalId') || ''
            },
            contactInfo: {
                email: formData.get('email') || '',
                mobile: formData.get('mobile') || '',
                alternateContact: formData.get('alternateContact') || '',
                country: formData.get('country') || '',
                city: formData.get('city') || '',
                currentAddress: formData.get('currentAddress') || '',
                permanentAddress: formData.get('permanentAddress') || ''
            },
            education: {
                highestDegree: formData.get('highestDegree') || '',
                fieldOfStudy: formData.get('fieldOfStudy') || '',
                institution: formData.get('institution') || '',
                graduationYear: formData.get('graduationYear') || '',
                gpa: formData.get('gpa') || '',
                certifications: formData.getAll('certifications[]') || []
            },
            experience: {
                currentJobTitle: formData.get('currentJobTitle') || '',
                companyName: formData.get('companyName') || '',
                totalExperience: formData.get('totalExperience') || '',
                previousJobs: formData.getAll('previousJobs[]') || [],
                responsibilities: formData.get('responsibilities') || ''
            },
            skills: {
                technicalSkills: formData.getAll('technicalSkills') || [],
                softSkills: formData.getAll('softSkills') || [],
                jobType: formData.get('jobType') || '',
                relocate: formData.get('relocate') || '',
                expectedSalary: formData.get('expectedSalary') || '',
                salaryCurrency: formData.get('salaryCurrency') || ''
            }
        };
    }


    
    /**
     * Populate the country dropdown with all countries from countries-list.
     */
    function populateCountries() {
        countrySelect.innerHTML = '<option value="">Select Country</option>';
        if (!window.countries) {
            // Show a visible error in the dropdown and log to console
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Country data not loaded';
            countrySelect.appendChild(option);
            console.error('countries.js not loaded or window.countries is undefined');
            return;
        }
        Object.entries(window.countries).forEach(([code, country]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
    }

    /**
     * Populate the city dropdown based on the selected country using countries-list data.
     */
    function updateCities(form) {
        const countryCode = countrySelect.value;
        citySelect.innerHTML = '<option value="">Select City</option>';
        if (!countryCode || !window.countries || !window.countries[countryCode]) return;
        const cities = window.countries[countryCode].cities || [];
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        saveFormData(form);
    }
    
    /**
     * Update the review summary with all form data for the final step.
     */
    function updateReviewSummary() {
        try {
            // Profile Photo
            const profilePhotoInput = document.getElementById('profilePhoto');
            const reviewPhotoDiv = document.getElementById('review-profilePhoto');
            
            if (reviewPhotoDiv) {
                // Remove any previous image or placeholder
                reviewPhotoDiv.innerHTML = '';
                if (profilePhotoInput && profilePhotoInput.files && profilePhotoInput.files[0]) {
                    const file = profilePhotoInput.files[0];
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = 'Profile Photo';
                        img.className = 'object-cover w-32 h-32 rounded-full';
                        reviewPhotoDiv.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                } else {
                    // Show placeholder if no image
                    const span = document.createElement('span');
                    span.className = 'text-gray-400 text-sm';
                    span.textContent = 'No Image';
                    reviewPhotoDiv.appendChild(span);
                }
            }

            // Helper function to safely update review elements
            function updateReviewElement(elementId, value, defaultValue = 'Not provided') {
                const element = document.getElementById(elementId);
                if (element) {
                    element.textContent = value || defaultValue;
                }
            }

            // Personal Info
            updateReviewElement('review-fullName', document.getElementById('fullName')?.value);
            updateReviewElement('review-dob', document.getElementById('dob')?.value);
            updateReviewElement('review-gender', document.querySelector('input[name="gender"]:checked')?.value);
            updateReviewElement('review-nationalId', document.getElementById('nationalId')?.value);
            
            // Contact Info
            updateReviewElement('review-email', document.getElementById('email')?.value);
            updateReviewElement('review-mobile', document.getElementById('mobile')?.value);
            updateReviewElement('review-alternateContact', document.getElementById('alternateContact')?.value);
            updateReviewElement('review-country', document.getElementById('country')?.value);
            updateReviewElement('review-city', document.getElementById('city')?.value);
            updateReviewElement('review-currentAddress', document.getElementById('currentAddress')?.value);
            updateReviewElement('review-permanentAddress', document.getElementById('permanentAddress')?.value);
            
            // Education
            updateReviewElement('review-highestDegree', document.getElementById('highestDegree')?.value);
            updateReviewElement('review-fieldOfStudy', document.getElementById('fieldOfStudy')?.value);
            updateReviewElement('review-institution', document.getElementById('institution')?.value);
            updateReviewElement('review-graduationYear', document.getElementById('graduationYear')?.value);
            updateReviewElement('review-gpa', document.getElementById('gpa')?.value);
            
            // Certifications
            const certificationInputs = document.querySelectorAll('input[name="certifications[]"]');
            const certifications = Array.from(certificationInputs).map(input => input.value).filter(value => value.trim() !== '');
            updateReviewElement('review-certifications', certifications.length > 0 ? certifications.join(', ') : null, 'None');
            
            // Experience
            updateReviewElement('review-currentJobTitle', document.getElementById('currentJobTitle')?.value);
            updateReviewElement('review-companyName', document.getElementById('companyName')?.value);
            updateReviewElement('review-totalExperience', document.getElementById('totalExperience')?.value);
            
            // Previous Jobs
            const previousJobInputs = document.querySelectorAll('input[name="previousJobs[]"]');
            const previousJobs = Array.from(previousJobInputs).map(input => input.value).filter(value => value.trim() !== '');
            updateReviewElement('review-previousJobs', previousJobs.length > 0 ? previousJobs.join(', ') : null, 'None');
            
            updateReviewElement('review-responsibilities', document.getElementById('responsibilities')?.value);
            
            // Skills
            const technicalSkills = Array.from(document.querySelectorAll('input[name="technicalSkills"]:checked')).map(input => input.value);
            updateReviewElement('review-technicalSkills', technicalSkills.length > 0 ? technicalSkills.join(', ') : null, 'None');
            
            const softSkills = Array.from(document.querySelectorAll('input[name="softSkills"]:checked')).map(input => input.value);
            updateReviewElement('review-softSkills', softSkills.length > 0 ? softSkills.join(', ') : null, 'None');
            
            updateReviewElement('review-jobType', document.getElementById('jobType')?.value, 'Not specified');
            updateReviewElement('review-relocate', document.querySelector('input[name="relocate"]:checked')?.value, 'Not specified');
            
            const expectedSalary = document.getElementById('expectedSalary')?.value;
            const salaryCurrency = document.getElementById('salaryCurrency')?.value;
            updateReviewElement('review-expectedSalary', expectedSalary ? `${salaryCurrency} ${expectedSalary}` : null, 'Not specified');
            
        } catch (error) {
            console.error('Error updating review summary:', error);
        }
    }
    
    /**
     * Show a global error message in the error region and ARIA live region.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        const errorRegion = document.getElementById('globalError');
        if (errorRegion) {
            errorRegion.textContent = message;
            errorRegion.style.display = message ? '' : 'none';
        }
        // Also update the ARIA live region for screen readers
        const ariaRegion = document.querySelector('[aria-live="polite"]');
        if (ariaRegion) {
            ariaRegion.textContent = message;
        }
    }

    // Initialize the form
    initForm();
});