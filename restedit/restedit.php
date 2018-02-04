<?php
/*
Plugin Name: Front-end redigering via REST API
Description: Använder cookie-autentisering till REST API:et för att möjliggöra front-end redigering.
Version: 0.1
Author: Daniel Andersen
Author URI: http://www.dnest.se
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Domain Path: /Languages
Text Domain: restedit
*/

function restedit_scripts() { // Funktion
  if (!is_admin() && is_single()) { // Ser till att nedan bara körs om det INTE är en adminsida och att endast en post visas.
    if (is_user_logged_in() && current_user_can('edit_others_posts')) { // Ser till att funktionen nedan endast körs om de är inloggade och har rättigheter till att redigera poster.
      wp_enqueue_script('restedit_script', plugin_dir_url(__FILE__) . 'js/restedit.ajax.js', array('jquery'), '0.1', true); // Gör så att wordpress vet vart javascriptet finns någonstans.
      wp_localize_script('restedit_script', 'WPsettings', array( // Använder wordpress inbyggda funktion för att skicka med en array som går att anropa i javascriptet.
        'root' => esc_url_raw(rest_url()), // Arraynyckel med URL till JSON.
        'nonce' => wp_create_nonce('wp_rest'), // Arraynyckel med nonce.
        'current_ID' => get_the_ID() // Arraynyckel med nuvarande vald postID.
      ));
    }
  }
} // Slut på restedit_scripts
add_action('wp_enqueue_scripts', 'restedit_scripts'); // Lägger till funktionen restedit_scripts så Wordpress känner till det.
?>
