<?php
    $host = 'localhost';
    $db = 'isdm_api';
    $user = 'root';
    $password = '';

    $conn = new mysqli($host, $user, $password, $db);

    if ($conn->connect_error) {
        die('Error de conexion: ' . $conn->connect_error);
    }
?>