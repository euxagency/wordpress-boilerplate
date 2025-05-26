<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://example.com.au
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
class Plugin_Name_Rest_Api_Admin {

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
	}

	/**
	 * Save setup page data.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
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

	/**
	 * Get status settings, including enabled/toggle option and message.
	 * from the options table
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function get_status_settings( WP_REST_Request $request ) {
		// Get status key from the url params.
		$status_key = $request->get_param( 'status_key' );
		if ( empty( $status_key ) ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array( 'message' => 'Status key is required' ),
				),
				400
			);
		}

		// Get enabled setting for this status.
		$enabled_option_name = 'plugin_name_' . $status_key . '_enabled';
		$enabled             = get_option( $enabled_option_name );
		// Set default to no (disabled).
		if ( false === $enabled ) {
			$enabled = 'no';
		}

		// Get message for this status.
		$message_option_name = 'plugin_name_' . $status_key . '_message';
		$message            = get_option( $message_option_name );
		// Set default to empty string.
		if ( false === $message ) {
			$message = '';
		}

		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => array(
					'status_key' => $status_key,
					'enabled'    => 'yes' === $enabled,
					'message'   => $message,
				),
			),
			200
		);
	}

	/**
	 * Save  status enabled option.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function save_status_enabled( WP_REST_Request $request ) {
		// Get status key and enabled option.
		$body_params = $request->get_json_params();

		if ( ! isset( $body_params['status_key'] ) || ! isset( $body_params['enabled'] ) ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array( 'message' => 'Missing required parameters: status_key and enabled.' ),
				),
				400
			);
		}

		$status_key = sanitize_text_field( $body_params['status_key'] );
		// Convert boolean to "yes"/"no" string.
		$enabled = filter_var( $body_params['enabled'], FILTER_VALIDATE_BOOLEAN ) ? 'yes' : 'no';

		// Update the enabled setting.
		$enabled_option_name = 'plugin_name_' . $status_key . '_enabled';
		update_option( $enabled_option_name, $enabled );

		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => array(
					'message'    => 'Status settings saved successfully'
				),
			),
			200
		);
	}

	/**
	 * Save status message.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function save_status_message( WP_REST_Request $request ) {
		// Get status key and enabled option.
		$body_params = $request->get_json_params();

		if ( ! isset( $body_params['status_key'] ) || ! isset( $body_params['message'] ) ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array( 'message' => 'Missing required parameters: status_key and message.' ),
				),
				400
			);
		}

		$status_key = sanitize_text_field( $body_params['status_key'] );
		$message   = $body_params['message'];

		// Update the message.
		$message_option_name = 'plugin_name_' . $status_key . '_message';
		update_option( $message_option_name, $message );

		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => array(
					'message'    => 'Status settings saved successfully'
				),
			),
			200
		);
	}

	/**
	 * Get value specified by the key from the options table.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function fetch_input( WP_REST_Request $request ) {
		// Get key from request.
		$key = $request->get_param( 'key' );

		if ( empty( $key ) ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array(
						'message' => 'Missing required parameter: key.',
					),
				),
				400
			);
		}

        $option_name = 'plugin_name_' . $key;
		$settings = get_option( $option_name, '' );

		// If option doesn't exist in database.
		if ( false === $settings ) {
			return new WP_REST_Response(
				array(
					'success' => true,
					'data'    => array(
						'key'     => $key,
						'value'   => '',
					),
				),
				200
			);
		}

		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => array(
					'key'     => $key,
					'value'   => $settings,
				),
			),
			200
		);
	}

	/**
	 * Save input value to the options.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function save_input( WP_REST_Request $request ) {
		// Get data from request.
		$body_params = $request->get_json_params();

		// Validate required parameters.
		if ( ! isset( $body_params['key'] ) || ! isset( $body_params['value'] ) ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array(
						'message' => 'Missing required parameters: key and value',
					),
				),
				400
			);
		}

		$key   = sanitize_text_field( $body_params['key'] );
		$value = $body_params['value'];

		// Get option name based on key.
        $option_name = 'plugin_name' . $key;

        // Update the option in the database.
        update_option( $option_name, $value );

        // Return success response.
        return new WP_REST_Response(
            array(
                'success' => true,
                'data'    => array(
                    'message' => 'Input saved successfully',
                ),
            ),
            200
        );
	}
}
