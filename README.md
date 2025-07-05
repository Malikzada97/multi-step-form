# Multi-Step Form with Progress Indicator

A modern, accessible, and feature-rich multi-step form built with vanilla JavaScript, HTML5, and Tailwind CSS. This project demonstrates best practices for form design, validation, and user experience.

## 🚀 Live Demo

[View Live Demo](https://your-username.github.io/multistepform)

## ✨ Features

### Core Functionality
- **6-Step Form Process**: Personal Info → Contact → Education → Experience → Skills → Review
- **Progress Indicator**: Visual progress bar with step indicators
- **Smart Navigation**: Previous/Next buttons with validation
- **Final Review**: Complete data summary before submission

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Transitions**: CSS animations and transitions between steps
- **Real-time Validation**: Instant feedback on form errors
- **Autosave**: Form data automatically saved to localStorage
- **Accessibility**: Full ARIA support, keyboard navigation, screen reader friendly

### Advanced Features
- **Dynamic Fields**: Add/remove certifications and previous jobs
- **File Upload**: Profile photo upload with preview
- **Country/City Selection**: Dynamic dropdowns with real data
- **Form Analytics**: Track user interactions and errors
- **Error Recovery**: Graceful handling of validation errors

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with modern form elements
- **CSS3**: Tailwind CSS for styling, custom animations
- **JavaScript (ES6+)**: Vanilla JS with modular architecture
- **Local Storage**: Data persistence across sessions
- **File API**: Image upload and preview functionality

## 📁 Project Structure

```
multistepform/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # Custom CSS styles
├── js/
│   ├── form.js             # Main form logic
│   ├── navigation.js       # Step navigation
│   ├── validation.js       # Form validation
│   ├── autosave.js         # Data persistence
│   ├── analytics.js        # User analytics
│   ├── dynamicFields.js    # Dynamic field management
│   └── countries.js        # Country/city data
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/multistepform.git
   cd multistepform
   ```

2. **Open in browser**
   - **Option 1**: Double-click `index.html` to open directly
   - **Option 2**: Use a local server (recommended)
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`

## 📋 Form Steps

### Step 1: Personal Information
- Full Name (required)
- Date of Birth (required, 18+ validation)
- Gender (required)
- National ID/Passport (required)
- Profile Photo (required, image upload)

### Step 2: Contact Information
- Email Address (required, email validation)
- Mobile Number (required, phone validation)
- Alternate Contact (optional)
- Current Address (optional)
- Permanent Address (optional)
- Country & City (required, dynamic dropdowns)

### Step 3: Educational Background
- Highest Degree (required)
- Field of Study (optional)
- University/Institution (optional)
- Graduation Year (required)
- GPA/Grade (optional)
- Additional Certifications (dynamic fields)

### Step 4: Work Experience
- Current Job Title (required)
- Company Name (required)
- Total Experience (required)
- Previous Job Titles (dynamic fields)
- Key Responsibilities (required)

### Step 5: Skills & Preferences
- Technical Skills (checkboxes)
- Soft Skills (checkboxes)
- Preferred Job Type (required)
- Willing to Relocate (required)
- Expected Salary (required, currency selection)

### Step 6: Review & Submit
- Complete data summary
- Profile photo preview
- Submit application

## 🔧 Configuration

### Customizing Validation Rules
Edit `js/validation.js` to modify validation rules:

```javascript
export const validationRules = {
    fullName: {
        required: true,
        minLength: 2,
        maxLength: 100
    },
    // Add more rules...
};
```

### Adding Countries/Cities
Edit `js/countries.js` to add more countries:

```javascript
window.countries = {
    US: {
        name: 'United States',
        cities: ['New York', 'Los Angeles', ...]
    },
    // Add more countries...
};
```

### Styling Customization
Modify `css/style.css` for custom styling:

```css
:root {
    --primary: #4f46e5;
    --primary-dark: #4338ca;
    --error: #dc2626;
    --success: #059669;
}
```

## 🎯 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Features

- **Client-side Validation**: Prevents invalid data submission
- **File Type Validation**: Only image files accepted for upload
- **Data Sanitization**: Input cleaning and validation
- **CSRF Protection**: Ready for server-side integration

## 📊 Analytics & Tracking

The form includes built-in analytics:
- Step completion times
- Field interaction tracking
- Error tracking and reporting
- Form abandonment detection

## 🚀 Deployment

### GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Connect your GitHub repository to Netlify
2. Deploy automatically on push
3. Custom domain support available

### Vercel
1. Import your GitHub repository
2. Automatic deployment and previews
3. Global CDN and edge functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Google Fonts** for the Poppins font family
- **Modern JavaScript** features and best practices
- **Web Accessibility Initiative (WAI)** for accessibility guidelines

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Check the documentation above
- Review the code comments for implementation details

---

**Built with ❤️ using modern web technologies** 