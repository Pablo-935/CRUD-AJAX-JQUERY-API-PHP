$(document).ready(function (event){
    // UTILS
    const changeToCreateButton = function() {
        //Actualizamos el boton a Crear Producto
        $('button[type="submit"]')
            .text('Crear Producto')
            .removeClass('btn-warning')
            .addClass('btn-success');

        $('input[name="_method"]').val('POST');

        // Limpiamos el formulario y eliminamos el action

        $('#form')
            .removeAttr('action')
            .get(0).reset();
        
        // Eliminamos el boton de cancelar
        $('#cancel-update').remove();
    }

    // CRUD
    const loadProductList = function() {
        $.ajax({
            url: 'api/products/get-all.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log(response);

                const productList = response.data;
                const tableBody = $('#product-table tbody');
                // Limpia la tabla 
                tableBody.empty();

                $.each(productList, function(index, product) {
                    let row = `
                        <tr>
                            <td>${product.id} </td>
                            <td>${product.name} </td>
                            <td>${product.price} </td>
                            <td>${product.stock} </td>
                            <td>
                                <button 
                                    class="btn btn-warning btn-sm edit-btn"
                                    data-id="${product.id}"
                                    data-name="${product.name}"
                                    data-price="${product.price}"
                                    data-stock="${product.stock}"
                                >Editar
                                </button>

                                <button 
                                    class="btn btn-danger btn-sm delete-btn"
                                    data-id="${product.id}"
                                    data-name="${product.name}"
                                >Eliminar
                                </button>
                            </td>
                        </tr>
                    `;
                    tableBody.append(row);
                })
            },
            error: function(error){
                console.log('Error: ' , error);
            }
        });
    }
    
    // Evento para crear/actualizar un producto

    $('#form').submit(function(el){
        el.preventDefault();

        const method = $('input[name="_method"]').val();

        const name = $('#name').val();
        const price = $('#price').val();
        const stock = $('#stock').val();

        if (method === 'POST') {
            // Se debe insertar un nuevo producto
            $.ajax({
                url: 'api/products/create.php',
                type: 'POST',
                data: {name: name, price: price, stock: stock},
                dataType: 'json',
                success: function(response) {
                    console.log(response);

                    if(response.status) {
                        loadProductList();
                        $('#form').get(0).reset();
                    }
                },
                error: function(error) {
                    console.log(error)
                }
            });
        } else {
            //Se debe actualizar el producto
            const url = $(this).attr('action');

            //Enviar una solicitud AJAX POST para actualizar el producto
            $.ajax({
                url: url,
                type: 'POST',
                data: {name: name, price: price, stock: stock},
                dataType: 'json',
                success: function(response) {
                    console.log(response);

                    if (response.status) {
                        changeToCreateButton();
                        loadProductList();
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    });

    //Evento para cargar los datos del producto a actualizar
    $(this).on('click', '.edit-btn', function (e2) {
        const productId = $(this).data('id');
        const productName = $(this).data('name');
        const productPrice = $(this).data('price');
        const productStock = $(this).data('stock');

        $('#name').val(productName);
        $('#price').val(productPrice);
        $('#stock').val(productStock);

        $('input[name="_method"]').val('PUT');
        $('#form').attr('action', `api/products/update.php?id=${productId}`);

        if(! $('button[type="submit"]').siblings().length) {
            //Si no tiene hermanos significa que no tiene el boton de cancelar
            $('button[type="submit"]')
                .text('Actualizar Producto')
                .removeClass('btn-success')
                .addClass('btn-warning')
                .after('<button id="cancel-update" class="btn btn-outline-danger">Cancelar</button>');
        }
        $('#cancel-update').click(function(e3){
            changeToCreateButton();
        });
    })

    //Evento para eliminar un producto
    $(this).on('click', '.delete-btn', function(e2){
        const productId = $(this).data('id');
        const productName = $(this).data('name');
        
        if(confirm(`¿Está seguro de eliminar el producto con el id = ${productName}?`)) {
            $.ajax({
                url: 'api/products/delete.php',
                type: 'POST',
                data: {id: productId},
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    loadProductList();
                },
                error: function (error) { 
                    consola.log(error)
                }
            });
        }
    });

    loadProductList();
});