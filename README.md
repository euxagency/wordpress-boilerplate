# WordPress React Plugin Boilerplate

A modern WordPress plugin boilerplate that extends the [WordPress Plugin Boilerplate](https://github.com/DevinVinson/WordPress-Plugin-Boilerplate) with full React component support, Webpack build process, and Tailwind CSS integration.

## 📦 Table of Contents

- [WordPress React Plugin Boilerplate](#wordpress-react-plugin-boilerplate)
  - [📦 Table of Contents](#-table-of-contents)
  - [Features](#features)
  - [Initial Setup and Configuration](#initial-setup-and-configuration)
    - [Step 1: Copy the Boilerplate](#step-1-copy-the-boilerplate)
    - [Step 2: Global Find and Replace](#step-2-global-find-and-replace)
  - [🔧 Installation](#-installation)
    - [Step 1: Install Dependencies](#step-1-install-dependencies)
    - [Step 2: Build Assets](#step-2-build-assets)
    - [Step 3: Activate plugin](#step-3-activate-plugin)
  - [💻 Development Setup](#-development-setup)
    - [Development Commands](#development-commands)
    - [Development Workflow](#development-workflow)
  - [Project Structure](#project-structure)
  - [WordPress and React Integration](#wordpress-and-react-integration)
    - [Asset Enqueuing and Setup](#asset-enqueuing-and-setup)
      - [Enqueuing Scripts and Styles](#enqueuing-scripts-and-styles)
      - [HTML Container](#html-container)
      - [Style Scoping with PostCSS](#style-scoping-with-postcss)
      - [Custom CSS and Tailwind Integration](#custom-css-and-tailwind-integration)
    - [React Component Architecture](#react-component-architecture)
      - [Entry Point Connection](#entry-point-connection)
      - [Building Components with WordPress Dependencies](#building-components-with-wordpress-dependencies)
    - [REST API Development](#rest-api-development)
      - [API Handler Implementation](#api-handler-implementation)
    - [Frontend-Server Communication](#frontend-server-communication)
      - [React to WordPress API Calls](#react-to-wordpress-api-calls)
      - [WordPress Nonces Logic](#wordpress-nonces-logic)
      - [Extending the Plugin](#extending-the-plugin)
  - [Troubleshooting](#troubleshooting)
  - [Credits](#credits)
  - [Support](#support)

## Features

- **React Integration**: Full React support with WordPress's built-in React dependencies.
- **Modern Build Process**: Webpack configuration with hot reloading during development.
- **Tailwind CSS**: Pre-configured utility-first CSS framework.
- **REST API Ready**: Built-in structure for custom WordPress REST endpoints.
- **WordPress Standards**: Follows WordPress coding standards and best practices.
  
## Initial Setup and Configuration

### Step 1: Copy the Boilerplate

```bash
cd wp-content/plugins
git clone <your-repo-url> plugin-name
cd plugin-name
```

### Step 2: Global Find and Replace

**CRITICAL**: Before installing dependencies or making any changes, you must replace all placeholder names with your actual plugin name. This is essential for proper functionality.
Replace the following placeholders throughout **ALL FILES**, including **ALL FILES NAME** in the project:

| Placeholder | Replace With | Example |
| --- | --- | --- |
| `plugin-name` | your-plugin-slug | `my-awesome-plugin` |
| `plugin_name` | your_plugin_underscore | `my_awesome_plugin` |
| `PLUGIN_NAME` | YOUR_PLUGIN_CONSTANT | `MY_AWESOME_PLUGIN` |
| `Plugin_Name` | Your_Plugin_Class_Name | `My_Awesome_Plugin` |
| `Plugin Name` | Your Plugin Display Name | `My Awesome Plugin` |

## 🔧 Installation

### Step 1: Install Dependencies

```bash
cd plugin-name
npm install
```

### Step 2: Build Assets

```bash
npm run build
```

### Step 3: Activate plugin

1. Navigate to **Plugins** → **Installed Plugins** and activate the plugin.


2. Activate the plugin from the WordPress Admin Dashboard.

## 💻 Development Setup

### Development Commands

```bash
# Start development mode with file watching
npm run dev

# Build for production
npm run build
```

### Development Workflow

1. **Start development mode**:
    ```
    npm run dev
    ```
2. **Edit React components**: Make changes to files in `src/admin` - Webpack will automatically rebuild.
3. **View changes**: Refresh the page to view changes.

## Project Structure

```
plugin-name/
├── admin/                                   # Admin-specific functionality
│   ├── class-plugin-name-admin.php          # Main admin class
│   ├── class-plugin-name-rest-api-admin.php # Admin class for REST API routes
│   ├── css/                        
│       ├── plugin-name-admin-app.css        # Compiled CSS file (generated)
│       └── plugin-name-admin.css     
│   └── js/                          
│       ├── plugin-name-admin-app.js         # Compiled CSS file (generated)
│       └── plugin-name-admin.js     
│
├── includes/                             # Core plugin functionality
│   ├── class-plugin-name.php             # Main plugin class
│   ├── class-plugin-name-loader.php      # Hook loader
│   ├── class-plugin-name-i18n.php        # Internationalization
│   ├── class-plugin-name-activator.php   # Plugin activation
│   └── class-plugin-name-deactivator.php # Plugin deactivation
│
├── languages/                    # Translation files
├── public/                       # Public-facing functionality
├── src/                             # Source files (development)
│   └── admin/                       # React source files
│       ├── plugin-name-admin-app.js # Main React entry point
│       ├── components/              # React components
│       └── css/                     # Custom CSS files
├── plugin-name.php               # Main plugin file
├── webpack.config.js             # Webpack build configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
└── package.json                  # NPM package configuration
```

## WordPress and React Integration

### Asset Enqueuing and Setup

The plugin connects WordPress with React through proper asset enqueuing and container setup in the admin class (`admin/class-plugin-name-admin.php`):

#### Enqueuing Scripts and Styles

```php
// Enqueue styles including WordPress components
wp_enqueue_style( 
   $this->plugin_name . '-admin-app-style', 
   plugin_dir_url( __FILE__ ) . 'css/plugin-name-admin-app.css', 
   array(), 
   time(), 
   'all' 
);
wp_enqueue_style( 'wp-components' );

// Enqueue scripts with WordPress React dependencies
wp_enqueue_script(
   $this->plugin_name . '-admin-app',
   plugin_dir_url( __FILE__ ) . 'js/plugin-name-admin-app.js',
   array(
       'wp-element',      // React and ReactDOM
       'wp-components',   // WordPress UI components
       'wp-i18n',         // Internationalization
       'wp-data',         // State management
       'wp-api-fetch',    // API utilities
   ),
   time(),
   true
);

// Provide REST API settings for nonce to JavaScript
wp_localize_script(
   'wp-api',
   'wpApiSettings',
   array(
       'root'  => esc_url_raw( rest_url() ),
       'nonce' => wp_create_nonce( 'wp_rest' ),
   )
);
wp_enqueue_script( 'wp-api' );
```

#### HTML Container

```php
public function display_setup_page() {
    // Container for React app.
    echo '<div class="wrap">';
    echo '<div id="plugin-name-admin-setup" class="plugin-name-app"></div>';
    echo '</div>';
}
```

#### Style Scoping with PostCSS

To prevent Tailwind CSS styles from affecting other WordPress admin elements, the plugin uses PostCSS to scope all styles to the .plugin-name-app class:

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-prefix-selector')({
      prefix: '.plugin-name-app',  
    }),
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}
```

This configuration ensures that all Tailwind CSS classes are automatically prefixed and only apply within elements that have the plugin-name-app class, preventing style conflicts with WordPress admin interface.

#### Custom CSS and Tailwind Integration

You can add custom styles to `src/admin/css/plugin-name-admin-app.css`. This file includes Tailwind CSS directives and your custom styles.

### React Component Architecture

#### Entry Point Connection

The main React file `src/admin/plugin-name-admin-app.js` connects to the WordPress HTML container:

```js
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
```

#### Building Components with WordPress Dependencies

Build components in the `src/admin/components` folder by utilising WordPress's React ecosystem and UI components.

### REST API Development

REST endpoints are registered in the admin class (`admin/class-plugin-name-admin.php`):

```php
// Saving setup data
register_rest_route(
    'plugin-name/v1',
    '/setup/save',
    array(
        'methods'             => 'POST',
        'callback'            => array( $this->rest_api, 'save_setup_settings' ),
        'permission_callback' => function () {
            // return current_user_can( 'manage_options' );
            return true;
        },
    )
);
```

#### API Handler Implementation

The callback function are implemented in the REST API admin class (`admin/class-plugin-name-rest-api-admin.php`), which processes requests and returns structured responses:

```php
public function save_setup_settings( WP_REST_Request $request ) {
    // Get the sent data (from frontend).
    $body_params = $request->get_json_params();
    $data = $body_params['payload'];

    $username = isset( $data['username'] ) ? $data['username'] : '';
    $password = isset( $data['password'] ) ? $data['password'] : '';
    $type = isset( $data['type'] ) ? $data['type'] : '';

    // Save the data to the options.
    update_option( 'plugin_name_username', $username );
    update_option( 'plugin_name_password', $password );
    update_option( 'plugin_name_type', $type );

    return new WP_REST_Response(
        array(
            'success' => true,
            'data'    => array(
                'message'    => 'Setup settings saved successfully',
            ),
        ),
        200
    );
}
```

### Frontend-Server Communication

#### React to WordPress API Calls

React components make secure API calls using WordPress nonces:

```js
// Make request to the server to save settings
const saveSettings = useCallback(async () => {
    setIsSaving(true);
    
    try {
        // Get the nonce from WordPress
        const nonce = window.wpApiSettings?.nonce;
        if (!nonce) {
            console.error('WordPress REST API nonce not available');
            return;
        }

        // Form data 
        const newData = {
            username: formData.username,
            password: formData.password,
            type: formData.type || '',
        };
        // Data to send 
        const sendData = {
            payload: newData
        }

        const response = await fetch("/wp-json/plugin-name/v1/setup/save", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce,
            },
            body: JSON.stringify(sendData)
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.data.message || 'Unknown error');
        }
    } catch (err) {
        console.error(`Failed to save data: ${err.message || 'Unknown error'}`);
    } finally {
        setIsSaving(false);
    }
}, [formData]);
```

#### WordPress Nonces Logic

1. `wp_create_nonce( 'wp_rest' )` generates a security token.
2. `wp_localize_script` makes the nonce available to JavaScript.
3. React sends nonce in the `X-WP-Nonce` header.
4. WordPress automatically verifies nonces for REST API requests.


#### Extending the Plugin

1. Add new components: Place them inside `src/admin/components`.
2. REST endpoints can be defined in `admin/class-plugin-name-admin.php`.
3. Callback functions can be defined in `admin/class-plugin-name-rest-api-admin.php`.

## Troubleshooting

## Credits
Based on the [WordPress Plugin Boilerplate](https://github.com/DevinVinson/WordPress-Plugin-Boilerplate) by DevinVinson.

## Support