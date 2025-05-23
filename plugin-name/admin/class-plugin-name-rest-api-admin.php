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

        $data_ = array(
			'username' => isset( $data['username'] ) ? $data['username'] : '',
			'password'          => isset( $data['password'] ) ? $data['password'] : '',
			'type'        => isset( $data['type'] ) ? $data['type'] : '',
        );

		// Save the data to the options.
		update_option( 'plugin_name_setup_data', $data_ );

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
	 * Get topsms automations woocommerce status settings, including enabled option and sms template.
	 * from the options table
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function topsms_get_automations_status_settings( WP_REST_Request $request ) {
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
		$enabled_option_name = 'topsms_order_' . $status_key . '_enabled';
		$enabled             = get_option( $enabled_option_name );
		// Set default to no (disabled).
		if ( false === $enabled ) {
			$enabled = 'no';
		}

		// Get sms template for this status.
		$message_option_name = 'topsms_order_' . $status_key . '_message';
		$template            = get_option( $message_option_name );
		// Set default to empty string.
		if ( false === $template ) {
			$template = '';
		}

		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => array(
					'status_key' => $status_key,
					'enabled'    => 'yes' === $enabled,
					'template'   => $template,
				),
			),
			200
		);
	}

	/**
	 * Save topsms automation woocommerce status enabled option.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function topsms_save_automations_status_enabled( WP_REST_Request $request ) {
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
		$enabled_option_name = 'topsms_order_' . $status_key . '_enabled';
		update_option( $enabled_option_name, $enabled );

		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => array(
					'message'    => 'Status settings saved successfully',
					'status_key' => $status_key,
					'enabled'    => 'yes' === $enabled,
				),
			),
			200
		);
	}

	/**
	 * Save topsms automation woocommerce status sms template.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function topsms_save_automations_status_template( WP_REST_Request $request ) {
		// Get status key and enabled option.
		$body_params = $request->get_json_params();

		if ( ! isset( $body_params['status_key'] ) || ! isset( $body_params['template'] ) ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array( 'message' => 'Missing required parameters: status_key and template.' ),
				),
				400
			);
		}

		$status_key = sanitize_text_field( $body_params['status_key'] );
		$template   = $body_params['template'];

		// Update the template.
		$message_option_name = 'topsms_order_' . $status_key . '_message';
		update_option( $message_option_name, $template );

		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => array(
					'message'    => 'Status settings saved successfully',
					'status_key' => $status_key,
					'template'   => $template,
				),
			),
			200
		);
	}

	/**
	 * Get topsms general setting from the options table.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function topsms_get_settings( WP_REST_Request $request ) {
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

		// Get option name.
		if ( 'sender' === $key ) {
			$option_name = 'topsms_' . $key;
		} else {
			$option_name = 'topsms_settings_' . $key;
		}
		$settings = get_option( $option_name, 'no' );

		// If option doesn't exist in database.
		if ( false === $settings ) {
			return new WP_REST_Response(
				array(
					'success' => true,
					'data'    => array(
						'key'     => $key,
						'enabled' => no, // Default for new settings.
						'value'   => '',
					),
				),
				200
			);
		}

		// For toggle settings.
		if ( 'yes' === $settings || 'no' === $settings ) {
			return new WP_REST_Response(
				array(
					'success' => true,
					'data'    => array(
						'key'     => $key,
						'enabled' => 'yes' === $settings,
						'value'   => '',
					),
				),
				200
			);
		}

		// For surcharge amount / sender name.
		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => array(
					'key'     => $key,
					'enabled' => 'no',
					'value'   => $settings,
				),
			),
			200
		);
	}

	/**
	 * Save topsms general settings.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function topsms_save_settings( WP_REST_Request $request ) {
		// Get data from request.
		$body_params = $request->get_json_params();

		// Validate required parameters.
		if ( ! isset( $body_params['key'] ) || ! isset( $body_params['enabled'] ) ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array(
						'message' => 'Missing required parameters: key and enabled',
					),
				),
				400
			);
		}

		$key = sanitize_text_field( $body_params['key'] );
		// Convert boolean to "yes"/"no" string.
		$enabled = filter_var( $body_params['enabled'], FILTER_VALIDATE_BOOLEAN ) ? 'yes' : 'no';

		// Get option name and update the settings to options.
		$option_name = 'topsms_settings_' . $key;
		update_option( $option_name, $enabled );

		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => array(
					'message' => 'Setting saved successfully',
					'key'     => $key,
					'enabled' => 'yes' === $enabled,
				),
			),
			200
		);
	}

	/**
	 * Save general input settings to the options.
	 *
	 * @param WP_REST_Request $request The request object.
	 * @return WP_REST_Response The response.
	 */
	public function topsms_save_settings_( WP_REST_Request $request ) {
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
		if ( 'sender' === $key ) {
			$option_name = 'topsms_' . $key;

			// Update sender name in Topsms api.
			return $this->topsms_update_api_sender_name( $value, $key, $option_name );
		} else {
			$option_name = 'topsms_settings_' . $key;

			// Update the option in the database.
			update_option( $option_name, $value );

			// Return success response.
			return new WP_REST_Response(
				array(
					'success' => true,
					'data'    => array(
						'message' => 'Setting saved successfully',
						'key'     => $key,
						'value'   => $value,
					),
				),
				200
			);
		}
	}

	/**
	 * Update sender name in TopSMS API.
	 *
	 * @param string $sender The sender name to update.
	 * @param string $key The option key.
	 * @param string $option_name The option name in the database.
	 * @return WP_REST_Response The response.
	 */
	private function topsms_update_api_sender_name( $sender, $key, $option_name ) {
		// Get access token for API request.
		$access_token = get_option( 'topsms_access_token' );

		if ( ! $access_token ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array(
						'message' => 'Access token not found',
						'key'     => $key,
						'value'   => $sender,
					),
				),
				200
			);
		}

		// Make a put request to the Topsms to update the sender name.
		$response = wp_remote_request(
			'https://api.topsms.com.au/functions/v1/user',
			array(
				'method'  => 'PUT',
				'headers' => array(
					'Content-Type'  => 'application/json',
					'Authorization' => 'Bearer ' . $access_token,
				),
				'body'    => wp_json_encode(
					array(
						'sender' => $sender,
					)
				),
			)
		);

		// Check for connection errors.
		if ( is_wp_error( $response ) ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array(
						'message' => 'Error saving sender name: ' . $response->get_error_message(),
						'key'     => $key,
						'value'   => $sender,
					),
				),
				200
			);
		}

		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body, true );

		// Check the status field in the response data.
		if ( isset( $data['status'] ) && 'success' === $data['status'] ) {
			// Update in the options.
			update_option( $option_name, $sender );

			return new WP_REST_Response(
				array(
					'success' => true,
					'data'    => array(
						'message'      => 'Setting saved successfully',
						'key'          => $key,
						'value'        => $sender,
						'api_response' => $data,
					),
				),
				200
			);
		} else {
			// If API update failed, still return success since we saved locally.
			$error_message = isset( $data['message'] ) ? $data['message'] : 'Failed to update sender on API';

			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array(
						'message' => 'Error saving sender name: ' . $error_message,
						'key'     => $key,
						'value'   => $sender,
					),
				),
				200
			);
		}
	}

	/**
	 * Get the user data, identified by the topsms access token in the options.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function topsms_get_user_data() {
		$access_token = get_option( 'topsms_access_token' );

		if ( ! $access_token ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array(
						'message' => 'Access token not found',
					),
				),
				401
			);
		}

		// Make api request to Topsms.
		$response = wp_remote_get(
			'https://api.topsms.com.au/functions/v1/user',
			array(
				'headers' => array(
					'Content-Type'  => 'application/json',
					'Authorization' => 'Bearer ' . $access_token,
				),
			)
		);

		// Check for connection errors.
		if ( is_wp_error( $response ) ) {
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array( 'message' => $response->get_error_message() ),
				),
				500
			);
		}

		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body, true );

		// Check the status field in the response data.
		if ( isset( $data['status'] ) && 'success' === $data['status'] ) {
			return new WP_REST_Response(
				array(
					'success' => true,
					'data'    => $data,
				),
				200
			);
		} else {
			// If status is not success or doesn't exist, send error.
			$error_message = isset( $data['message'] ) ? $data['message'] : 'Failed to fetch user data';
			return new WP_REST_Response(
				array(
					'success' => false,
					'data'    => array( 'message' => $error_message ),
				),
				400
			);
		}
	}
}
