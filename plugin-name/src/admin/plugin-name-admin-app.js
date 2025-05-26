import { render } from '@wordpress/element';

import Setup from './components/Setup';
import Settings from './components/Settings';

import './css/plugin-name-admin-app.css';

// Render the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('plugin-name-admin-setup');
  if (container) {
    render(<Setup />, container);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('plugin-name-admin-settings');
  if (container) {
    render(<Settings />, container);
  }
});
