import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RefundPolicy.css';

function RefundPolicy() {
  const navigate = useNavigate();

  // State object to manage all form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    orderNumber: '',
    dateOrdered: '',
    dateDelivered: '',
    issueType: '',
    description: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Refund Request Data:', formData);
    
    // Reset form after submission
    setFormData({
      fullName: '',
      email: '',
      orderNumber: '',
      dateOrdered: '',
      dateDelivered: '',
      issueType: '',
      description: ''
    });

    alert('Refund request submitted! Check console for details.');
  };

  return (
    <div className="refund-policy">
      <div className="refund-policy__container">
        {/* Back Button */}
        <button 
          className="refund-policy__back"
          onClick={() => navigate('/')}
          aria-label="Go back to homepage"
        >
          ← Back to Home
        </button>

        {/* Page Title */}
        <div className="refund-policy__header">
          <h1 className="refund-policy__title">Refund Policy</h1>
        </div>

        {/* Policy Description */}
        <div className="refund-policy__description">
          <p className="refund-policy__text">
            We accept refund requests within 7 days of delivery. Items must be unused and in original condition. 
            Custom-designed shoes may have limited refund eligibility depending on the issue.
          </p>
        </div>

        {/* Refund Request Form */}
        <div className="refund-policy__form-section">
          <h2 className="refund-policy__form-title">Submit a Refund Request</h2>
          
          <form className="refund-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Order Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="orderNumber">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., ORD-123456"
                  required
                />
              </div>

              {/* Date Ordered */}
              <div className="form-group">
                <label className="form-label" htmlFor="dateOrdered">
                  Date Ordered
                </label>
                <input
                  type="date"
                  id="dateOrdered"
                  name="dateOrdered"
                  value={formData.dateOrdered}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Date Delivered */}
              <div className="form-group">
                <label className="form-label" htmlFor="dateDelivered">
                  Date Delivered
                </label>
                <input
                  type="date"
                  id="dateDelivered"
                  name="dateDelivered"
                  value={formData.dateDelivered}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Type of Issue */}
              <div className="form-group">
                <label className="form-label" htmlFor="issueType">
                  Type of Issue
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an issue</option>
                  <option value="wrong-size">Wrong Size</option>
                  <option value="damaged-product">Damaged Product</option>
                  <option value="manufacturing-defect">Manufacturing Defect</option>
                  <option value="wrong-item">Wrong Item Received</option>
                  <option value="late-delivery">Late Delivery</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description of the Issue */}
              <div className="form-group form-group--full">
                <label className="form-label" htmlFor="description">
                  Description of the Issue
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please describe the issue in detail..."
                  rows="5"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="refund-form__button-container">
              <button type="submit" className="refund-form__button">
                Submit Refund Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RefundPolicy;
