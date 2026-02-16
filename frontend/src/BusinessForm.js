import { useState } from 'react';
import './BusinessForm.css';

function BusinessForm() {
  // State object to manage all form inputs
  // Each field has its own property that updates when user types
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phoneNumber: '',
    estimatedShoes: '',
    eventDate: '',
    extraNotes: ''
  });

  // Handle input changes
  // This updates the specific field in formData when user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log('Business Form Data:', formData);
    // Reset form after submission
    setFormData({
      fullName: '',
      businessName: '',
      email: '',
      phoneNumber: '',
      estimatedShoes: '',
      eventDate: '',
      extraNotes: ''
    });
    // In future, this would send data to backend API
  };

  return (
    <section className="business-form">
      <div className="business-form__container">
        <div className="business-form__header">
          <h2 className="business-form__title">Get Branded Shoes For Your Business</h2>
          <p className="business-form__description">
            Work with our business team to design, produce, and deliver custom branded shoes at scale. 
            Designed for brand launches, marketing campaigns, and organization-wide programs.
          </p>
        </div>

        <form className="business-form__form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            {/* Business Name */}
            <div className="form-group">
              <label htmlFor="businessName" className="form-label">Business Name</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Your Company"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@company.com"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Cellphone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            {/* Estimated Number of Shoes */}
            <div className="form-group">
              <label htmlFor="estimatedShoes" className="form-label">Estimated Number of Shoes</label>
              <input
                type="number"
                id="estimatedShoes"
                name="estimatedShoes"
                value={formData.estimatedShoes}
                onChange={handleInputChange}
                placeholder="250"
                min="1"
                required
              />
            </div>

            {/* Event Date */}
            <div className="form-group">
              <label htmlFor="eventDate" className="form-label">Event Date <span className="optional">(Optional)</span></label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Extra Notes - Full Width */}
          <div className="form-group form-group--full">
            <label htmlFor="extraNotes" className="form-label">Extra Notes</label>
            <textarea
              id="extraNotes"
              name="extraNotes"
              value={formData.extraNotes}
              onChange={handleInputChange}
              placeholder="Tell us more about your project, special requirements, or timeline..."
              rows="5"
            />
          </div>

          {/* Submit Button */}
          <div className="business-form__button-container">
            <button type="submit" className="business-form__button">
              Book a Call
            </button>
          </div>

          {/* Disclaimer */}
          <p className="business-form__disclaimer">
            By submitting, you agree to occasional SMS updates. Msg &amp; data rates may apply. <a href="#terms">Terms &amp; Privacy</a>.
          </p>
        </form>
      </div>
    </section>
  );
}

export default BusinessForm;
