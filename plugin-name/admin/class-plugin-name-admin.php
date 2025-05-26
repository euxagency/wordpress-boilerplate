<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin
 * @author     Your Name <email@example.com>
 */
class Plugin_Name_Admin {
	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $plugin_name       The name of this plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;
		$this->load_dependencies();

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Plugin_Name_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Plugin_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/plugin-name-admin.css', array(), $this->version, 'all' );
		wp_enqueue_style( $this->plugin_name . '-admin-app-style', plugin_dir_url( __FILE__ ) . 'css/plugin-name-admin-app.css', array(), time(), 'all' );
		wp_enqueue_style( 'wp-components' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Plugin_Name_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Plugin_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/plugin-name-admin.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script(
			$this->plugin_name . '-admin-app',
			plugin_dir_url( __FILE__ ) . 'js/plugin-name-admin-app.js',
			array(
				'wp-element',
				'wp-components',
				'wp-i18n',
				'wp-data',
				'wp-api-fetch',
			),
			time(),
			true
		);

		wp_localize_script(
			'wp-api',
			'wpApiSettings',
			array(
				'root'  => esc_url_raw( rest_url() ),
				'nonce' => wp_create_nonce( 'wp_rest' ),
			)
		);
		wp_enqueue_script( 'wp-api' );
	}

	/**
	 * Load files all files and dependencies required.
	 *
	 * @since    1.0.0
	 */
	private function load_dependencies() {
		require_once plugin_dir_path( __DIR__ ) . 'admin/class-plugin-name-rest-api-admin.php';
		$this->rest_api = new Plugin_Name_Rest_Api_Admin( $this->plugin_name, $this->version );
	}

	/**
	 * Register custom routes for the REST API.
	 *
	 * @since    1.0.0
	 */
	public function register_routes() {
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

		// Fetching status settings.
		register_rest_route(
			'plugin-name/v1',
			'/settings/status/(?P<status_key>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this->rest_api, 'get_status_settings' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		// Saving status enabled (toggle) setting.
		register_rest_route(
			'plugin-name/v1',
			'/settings/status/save',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this->rest_api, 'save_status_enabled' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		// Saving status message (text area).
		register_rest_route(
			'plugin-name/v1',
			'/settings/status/save-message',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this->rest_api, 'save_status_message' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		// Fetching input (e.g. username).
		register_rest_route(
			'plugin-name/v1',
			'/settings/(?P<key>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this->rest_api, 'fetch_input' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		// Saving input fields for general settings.
		register_rest_route(
			'plugin-name/v1',
			'/settings/save-input',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this->rest_api, 'save_input' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}

	/**
	 * Add an admin menu.
	 *
	 * @since 1.0.0
	 */
	public function add_admin_menu() {
		add_menu_page(
			__( 'Plugin_Name', 'plugin-name' ),
			__( 'Plugin_Name', 'plugin-name' ),
			'manage_options',
			'plugin-name',
			array( $this, 'display_setup_page' ),
			'dashicons-admin-generic',
			55
		);

        add_submenu_page(
			'plugin-name',
			__( 'Settings', 'plugin-name' ),
			__( 'Settings', 'plugin-name' ),
			'manage_options',
			'plugin-name-settings',
			array( $this, 'display_settings_page' )
		);
	}

	/**
	 * Render the setup page.
	 *
	 * @since    1.0.0
	 */
	public function display_setup_page() {
		// Container for React app.
		echo '<div class="wrap">';
		echo '<div id="plugin-name-admin-setup" class="plugin-name-app"></div>';
		echo '</div>';
	}

    /**
	 * Render the settings page.
	 *
	 * @since    1.0.0
	 */
	public function display_settings_page() {
		// Container for React app.
		echo '<div class="wrap">';
		echo '<div id="plugin-name-admin-settings" class="plugin-name-app"></div>';
		echo '</div>';
	}
}
