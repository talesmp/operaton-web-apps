import { useContext, useEffect, useState } from 'preact/hooks';
import "./style.css"
import { get_user_profile, put_user_profile } from '../../api';
import { AppState } from '../../state';

export const Account = () => {
  const state = useContext(AppState);
  const account = state.user_profile;

  const [activeTab, setActiveTab] = useState('account');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!account.value) {
      get_user_profile(state, 'tester');
    }
  }, [account.value]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const updatedUser = await put_user_profile(
        state,
        account.value.id, 
        {
          id: account.value.id,
          firstName: account.value.firstName,
          lastName: account.value.lastName,
          email: account.value.email
        }
      );
      
      setSuccessMessage('Profile successfully updated!');
      console.log('Updated user:', updatedUser);
    } catch (error) {
      console.error('Update failed:', error);
      setSuccessMessage('Error updating profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    account.value = { 
      ...account.value, 
      [name]: value 
    };
    
    const errors = { ...formErrors };
    if (!value.trim() && name !== 'email') {
      errors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      delete errors[name];
    }
    setFormErrors(errors);
  };

  const isFormValid = () => {
    return account.value?.firstName && 
           account.value?.lastName && 
           !Object.keys(formErrors).length;
  };

  return (
    <section class="account-container fade-in">
      <aside class="sidebar">
        <nav>
          <ul class="tile-list">
            {['account', 'groups', 'tenants'].map((tab) => (
              <li key={tab} class={`${activeTab === tab ? 'active' : ''}`}>
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

            {successMessage && (
              <div class={`message ${successMessage.includes('Error') ? 'error' : 'success'}`}>
                {successMessage}
              </div>
            )}

            <div class={`form-group ${formErrors.firstName ? 'has-error' : ''}`}>
              <label htmlFor="inputFirstname">First Name*</label>
              <input
                id="inputFirstname"
                name="firstName"
                class="form-input"
                type="text"
                value={account.value?.firstName || ''}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              {formErrors.firstName && (
                <p class="error-message">{formErrors.firstName}</p>
              )}
            </div>

            <div class={`form-group ${formErrors.lastName ? 'has-error' : ''}`}>
              <label htmlFor="inputLastname">Last Name*</label>
              <input
                id="inputLastname"
                name="lastName"
                class="form-input"
                type="text"
                value={account.value?.lastName || ''}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              {formErrors.lastName && (
                <p class="error-message">{formErrors.lastName}</p>
              )}
            </div>

            <div class="form-group">
              <label htmlFor="inputEmail">Email</label>
              <input
                id="inputEmail"
                name="email"
                class="form-input"
                type="email"
                value={account.value?.email || ''}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="submit-button"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update account'}
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