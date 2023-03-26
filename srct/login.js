window.addEventListener("load", () => {

    $('#inputUsuario').focus();
    
    $("#inputUsuario").on("keypress", function (event) {
        var keyPressed = event.keyCode || event.which;
        if (keyPressed === 13) {
            $('#btnSiguiente').click();
        }
    });

    if ($('#inputUsuario').val() != '') {
        $('#btnSiguiente').prop('disabled', false);
    }
    $('#inputUsuario').keyup(function () {
        if ($(this).val() != '') {
            $('#btnSiguiente').prop('disabled', false);
        } else {
            $('#btnSiguiente').prop('disabled', true);
        }
    });
    $('#inputPassword').keyup(function () {
        if ($(this).val() != '') {
            $('#btnIngreso').prop('disabled', false);
        } else {
            $('#btnIngreso').prop('disabled', true);
        }
    });
    $('#btnSiguiente').click(function () {
        $.ajax({
            url: '/usuarios/validarUsuarioLogin',
            type: 'post',
            dataType: 'json',
            data: {
                inputUsuario: $('#inputUsuario').val()
            },
            success: function (data) {
                if (data.error == "0") {
                    $('#div_usuario').hide();
                    $('#div_usuario_ingresado').show();
                    $('#div_contraseña').show();
                    $('#usuarioIngresado').text($('#inputUsuario').val());
                    $('#btnSiguiente').hide();
                    $('#btnComercio').hide();
                    $('#btnRegistro').hide();
                    $('#btnIngreso').removeClass('hidden');
                    $('#he_olvidado_btn').show();
                    $('input[name=password]').focus();
                    if (data.tipo == "app") {
                        $("#he_olvidado_btn").attr("href", "/login/resetapp");
                    } else {
                        $("#he_olvidado_btn").attr("href", "/login/resetear");
                    }
                    $('.tipo_ingreso').text(data.tipo_ingreso);
                } else {
                    $("#nro_doc_span").addClass("rojo_errores");
                    $("#aclaracion_punto_guion").text('El número es incorrecto, intentá nuevamente.').addClass("rojo_errores");
                }
            },
            error: function () {

            }
        })
    });

    $('.eye').click(function () {
        if ($('#inputPassword').attr('type') == 'password') {
            $('#inputPassword').attr('type', 'text');
            $(".eye").attr("src", "/assets/prex/img/icon_hide.svg");
        } else {
            $('#inputPassword').attr('type', 'password');
            $(".eye").attr("src", "/assets/prex/img/icon_showpass.svg");
        }
    });

});
