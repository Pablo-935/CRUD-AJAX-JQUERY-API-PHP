<?php
    require("../../database/connection.php");

    //Obtener el ID del producto a mostrar
    $id = $_GET['id'];

    //Obtener el producto de la base de datos
    $sql = "SELECT * FROM products WHERE id=$id;";
    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $product = $result->fetch_assoc();

        $response = array(
            'status' => true,
            'code' => 200, 
            'message' => '',
            'data' => $product
        );
    } else {
        $response = array(
            'status' => false,
            'code' => 401,
            'message' => 'No se encontró el producto con el id = ' . $id,
            'data' => null
        );
    }
?>                  