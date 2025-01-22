import { useState } from 'preact/hooks';
import "./style.css"

export const Account = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [account, setaccount] = useState({
    // dummy data
    firstName: 'Admin',
    lastName: 'Administrator',
    email: 'admin@example.com'
  });
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = (e) => {
    alert("Submit Data")
    console.log('Account updated:', account);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setaccount(prev => ({ ...prev, [name]: value }));
    
    const errors = { ...formErrors };
    if (!value.trim() && name !== 'email') {
      errors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      delete errors[name];
    }
    setFormErrors(errors);
  };

  const isFormValid = () => {
    return account.firstName && account.lastName && !Object.keys(formErrors).length;
  };

  return (
    <section class="account-container fade-in">
      <aside class="sidebar">
        <nav>
          <ul class="tile-list">
            {['account', 'groups', 'tenants'].map((tab) => (
              <li 
                key={tab} 
                class={`${activeTab === tab ? 'active' : ''}`}
              >
                <a
                  href={`#/${tab}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab);
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div class="content">
        {activeTab === 'account' ? (
          <form class="account-form" onSubmit={handleSubmit}>
            <h3 class="form-title">Account</h3>

            <div class={`form-group ${formErrors.firstName ? 'has-error' : ''}`}>
              <label htmlFor="inputFirstname">
                First Name*
              </label>
              <input
                id="inputFirstname"
                name="firstName"
                class="form-input"
                type="text"
                value={account.firstName}
                onChange={handleInputChange}
                required
              />
              {formErrors.firstName && (
                <p class="error-message">{formErrors.firstName}</p>
              )}
            </div>

            <div class={`form-group ${formErrors.lastName ? 'has-error' : ''}`}>
              <label htmlFor="inputLastname">
                Last Name*
              </label>
              <input
                id="inputLastname"
                name="lastName"
                class="form-input"
                type="text"
                value={account.lastName}
                onChange={handleInputChange}
                required
              />
              {formErrors.lastName && (
                <p class="error-message">{formErrors.lastName}</p>
              )}
            </div>

            <div class="form-group">
              <label htmlFor="inputEmail">
                Email
              </label>
              <input
                id="inputEmail"
                name="email"
                class="form-input"
                type="email"
                value={account.email}
                onChange={handleInputChange}
              />
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="submit-button"
                disabled={!isFormValid()}
              >
                Update account
              </button>
            </div>
          </form>
        ) : (
          <div class="info-box">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section coming soon
          </div>
        )}
      </div>
    </section>
  );
};