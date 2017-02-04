<?php
/**
 * Granular functions and definitions
 *
 * @package Granular
 */

require get_template_directory() . '/inc/version.php';


if ( ! function_exists( 'granular_setup' ) ) :

function granular_setup() {


	// load_theme_textdomain( 'launchframe', get_template_directory() . '/languages' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'launchframe' ),
		'footer' => __( 'Footer Menu', 'launchframe' ),
	) );

	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list', 'gallery', 'caption',
	) );

}
endif; 

add_action( 'after_setup_theme', 'granular_setup' );
add_theme_support( 'post-thumbnails' );


// Removes comments from admin bar
add_action( 'admin_menu', 'my_remove_admin_menus' );
function my_remove_admin_menus() {
    remove_menu_page( 'edit-comments.php' );
}

function granular_scripts() {
	// Theme definition
	global $package_version;
	wp_enqueue_style( 'launchframe-style', get_stylesheet_uri() );
	wp_enqueue_script( 'lf-modernizr', 'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js', null, $package_version, false);
	wp_enqueue_script( 'lf-jquery', 'https://code.jquery.com/jquery-1.11.2.min.js', null, $package_version, true);
	wp_enqueue_style( 'launchframe-style-custom', get_template_directory_uri() . "/assets/dist/css/style.css"  );
	wp_enqueue_script( 'buildjs', get_template_directory_uri() . '/assets/dist/js/script.js', array( 'lf-jquery' ), $package_version, true );
	// GO LIVE - min files
		// wp_enqueue_style( 'launchframe-style-custom', get_template_directory_uri() . "/assets/dist/css/style.min.css"  );
		// wp_enqueue_script( 'buildjs', get_template_directory_uri() . '/assets/dist/js/script.min.js', array( 'lf-jquery' ), $package_version, true );


	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'granular_scripts' );

require get_template_directory() . '/inc/template-tags.php';
require get_template_directory() . '/inc/extras.php';
require get_template_directory() . '/inc/custom-post-types.php';

function return_imgix($url, $width, $height) {
	$url_endpoint = parse_url($url);
	$url_endpoint = $url_endpoint['path'];
	// echo 'http://ftf.imgix.net'.$url_endpoint.'?w='.$width.'&h='.$height;
}

function youtube_vimeo_video() {
	$url = get_field('video_url'); 
	$type = 'youtube';
	if (preg_match('/vimeo\.com\/([^\&\?\/]+)/', $url, $id)) {   
		$type = 'vimeo';
		$values = $id[1];
	} else if (preg_match('/youtube\.com\/watch\?v=([^\&\?\/]+)/', $url, $id)) {
	  $values = $id[1];
	} else if (preg_match('/youtube\.com\/embed\/([^\&\?\/]+)/', $url, $id)) {
	  $values = $id[1];
	} else if (preg_match('/youtube\.com\/v\/([^\&\?\/]+)/', $url, $id)) {
	  $values = $id[1];
	} else if (preg_match('/youtu\.be\/([^\&\?\/]+)/', $url, $id)) {
	  $values = $id[1];
	} else {
		$type = 'pbs';
	}
	if ($type == 'vimeo') {
		echo '//player.vimeo.com/video/'.$values.'?autoplay=1&amp;title=0&amp;byline=0&amp;portrait=0&amp;color=00aeef';
	} else if ($type == 'youtube') {
		echo '//www.youtube.com/embed/'.$values.'';
	} else {
		$values = parse_url($url, PHP_URL_PATH);
		$values = explode('/', $values);
		echo '//video.pbs.org/viralplayer/'.$values[2].'?autoplay=1&amp;title=0&amp;byline=0&amp;portrait=0&amp;color=00aeef&topbar="0"';
	}
}