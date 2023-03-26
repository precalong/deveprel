var i = 0,
    ComisionUSD    = "U$S 2,4",
    ComisionUSDLow = "U$S 50",
    Comision       = "$ 69",
    ComisionLow    = "$ 1500";
function chukupax() {
    this.mid             = $("#_mid").val();
    this.midConfig       = jQuery.parseJSON($("#_midConfig").val());
    this.mobile          = false;
    this.ajaxWorking     = false;
    this.documentChange  = false;
    this.emailChange     = false;
    this.iboxInnerHeight = 600; 
    this.iboxInnerWidth  = 800;
    this.l_rdt           = '/usuarios/';
    
    if ($("#logged").val() == 1) {
        this.logged = 1;	
    } else {
        this.logged = 0;
    }
    this.init = function () {

        $('.d-hotline').css('background-color', 'red!important');
        Chukupax.mobile = false;
        try {
            $(".cbox").colorbox();
            $(".ibox").colorbox({
                iframe: true,
                innerWidth: Chukupax.iboxInnerWidth,
                innerHeight: Chukupax.iboxInnerHeight
            });
        } catch (e) {}

        $(".doPrint").css("cursor", "pointer").click(() => {
            window.print();
        });

        $(".btBack").click(e => {
            e.preventDefault();
            window.history.back();
        });

        (function(a){a.fn.check=function(b){a(this).on({keypress:function(a){var c=a.which,d=a.keyCode,e=String.fromCharCode(c).toLowerCase(),f=b;(-1!=f.indexOf(e)||9==d||37!=c&&37==d||39==d&&39!=c||8==d||46==d&&46!=c)&&161!=c||a.preventDefault()}})}})(jQuery);

        $("#btnCargarSaldo").click(() => {
            Chukupax.l_rdt = '/carga/saldo/';
            location.href = Chukupax.basePath + Chukupax.l_rdt;
        });

        $("#btnCargarP2P").click(() => {
            Chukupax.l_rdt = '/carga/prexpay_envios/';
            location.href = Chukupax.basePath + Chukupax.l_rdt;
        });

        $("#go-inicio").click(function(e) {
            window.location.replace("/usuarios/editar/" + $(this).data('id'))
        });

        $("#formLogin").validationEngine();
        $("#formLogin input").keydown(event => {
            if (event.keyCode == '13') $("#btnIngreso").click();
        });

        $("#btnIngreso").click(() => {
            if ($('input[name="password"]').val() == ''){
                return false;
            }
            if (!Chukupax.ajaxWorking) {
                Chukupax.ajaxWorking = true;
                if ($("#formLogin").validationEngine('validate')) {
                    Swal.fire({
                        type: 'info',
                        title: `Entrando`,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        }
                    });
                    $.ajax(
                        Chukupax.basePath + "/login/_do", {
                            data: $("#formLogin").serialize(),
                            success: data => {
                                Swal.close()
                                if (data.error == 'ok') {
                                    Swal.fire({
                                        type: 'success',
                                        title: `Perfecto`,
                                        showConfirmButton: false,
                                        allowOutsideClick: false
                                    });
                                    if (data.estado != '-3') {
                                        $("#formLogin").attr("action", Chukupax.basePath + "/usuarios");
                                        $("#formLogin").submit();
                                    } else {
                                        $("#formLogin").attr("action", Chukupax.basePath + "/prexpal");
                                        $("#formLogin").submit();
                                    }
                                }
                                else if(data.error == 'mantenimiento'){
                                    $("#formLogin").attr("action", Chukupax.basePath + "/mantenimiento");
                                    $("#formLogin").submit();
                                }
                                else {
                                    Swal.fire({
                                        type: 'error',
                                        title: `Datos incorrectos`,
                                        showConfirmButton: true,
                                        timer: 2500
                                    });
                                    Chukupax.ajaxWorking = false;
                                }
                            },
                            error: () => {
                                Swal.fire({
                                    type: 'error',
                                    title: `Por favor intente mas tarde`,
                                    showConfirmButton: true,
                                    timer: 2500
                                });
                                Chukupax.ajaxWorking = false;
                            },
                            dataType: 'json',
                            type: 'POST'
                        }
                    );
                } else {
                    Chukupax.ajaxWorking = false;
                }
            }
        });

        $(".btnChat").click(() => {
            window.open('https://chatserver5.comm100.com/chatwindow.aspx?planId=581&partnerId=-1&siteId=126107&visitorId=-3841&pageTitle=Fortex%20%3A%3A%20Portada&pageUrl=http%3A%2F%2Fwww.fortex.com.uy%2Fsitio%2Findex.html%3Flang%3Des&comm100marketingaooooooa=1&r=6', 'livechat', 'width=640,height=480');
        });

        $(".btnAviso").click(() => {
            $("#aviso").fadeOut(500, 0, () => {
                $("body").css("overflow", "auto");
            });
        });

        $("#btnImprimir").click(() => {
            if (Chukupax.mid != "usuarios.cuentav2") {
                location.href = Chukupax.basePath + "/usuarios/cuentasv2";
            } else {
                var request = $("#formMovs").serialize();
                request += "&pdf=true";
                window.open(Chukupax.basePath + "/usuarios/cuentav2/" + $("#idc").val() + "/?" + request, "print");
            }
        });
        /*--------------- MAIN SWITCH --------------------*/
        switch (Chukupax.mid) {
            case "portada":
                Chukupax.modulo = new portada();
                Chukupax.modulo.init();
                break;
            case 'contacto':
                Chukupax.modulo = new contacto();
                Chukupax.modulo.init();
                break;
            case 'html':
                Chukupax.modulo = new html();
                Chukupax.modulo.init();
                break;
            case 'solicitud.cuenta':
                Chukupax.modulo = new solicitud();
                Chukupax.modulo.init();
                Chukupax.modulo.cuenta();
                break;          
            case 'solicitud.crear':                                 
                Chukupax.modulo = new solicitud();
                Chukupax.modulo.init();
                Chukupax.modulo.crear();
                break;  
            case 'solicitud.datostitular':                                 
                Chukupax.modulo = new solicitud();
                Chukupax.modulo.init();
                Chukupax.modulo.datostitular();
                break;   
            case 'solicitud.datosmenor':                                 
                Chukupax.modulo = new solicitud();
                Chukupax.modulo.init();
                Chukupax.modulo.datosmenor();
                break;
            case 'solicitud.opciones':                                 
                Chukupax.modulo = new solicitud();
                Chukupax.modulo.init();
                Chukupax.modulo.opciones();
                break;
            case 'solicitud.tarjeta':
                Chukupax.modulo = new solicitud();
                Chukupax.modulo.init();
                Chukupax.modulo.tarjeta();
                break;
            case 'solicitud.gripper':
                Chukupax.modulo = new solicitud();
                Chukupax.modulo.init();
                Chukupax.modulo.gripper();
                break;
            case 'usuarios.cuentasv2':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.cuentasv2();
                break;
            case 'usuarios.cuentav2':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.cuentav2();
                break;
            case 'usuarios.spi':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.spi();
                break;
            case 'usuarios.editar':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.editar();
                break;
            case 'usuarios.actualizardatos':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.actualizardatos();
                break;	
            case 'usuarios.cambiarpass':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.cambiarpass();
                break;
            case 'usuarios.cambiarmail':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.cambiarmail();
                break;	
            case 'usuarios.cambiarmail_confirmacion':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.cambiarmail_confirmacion();
                break;		
            case 'usuarios.nuevosterminos':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.nuevosterminos();
                break;
            case 'usuarios.info':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.info();
                break;     
            case 'login.recuperar':
                Chukupax.modulo = new login();
                Chukupax.modulo.init();
                Chukupax.modulo.recuperar();
                break;
            case 'login.resetear':
                Chukupax.modulo = new login();
                Chukupax.modulo.init();
                Chukupax.modulo.resetear();
                break;
            case 'login.reset':
                Chukupax.modulo = new login();
                Chukupax.modulo.init();
                Chukupax.modulo.reset();
                break;
            case 'carga.saldo':
                Chukupax.modulo = new carga();
                Chukupax.modulo.saldo();
                break;
            case 'carga.ok':
                Chukupax.modulo = new carga();
                Chukupax.modulo.ok();
                break;
            case 'carga.envio_dinero':
                Chukupax.modulo = new carga();
                Chukupax.modulo.envio_dinero();
                break;
            case 'cargados.saldo':
                Chukupax.modulo = new cargados();
                Chukupax.modulo.saldo();      
                break;
            case 'checkout':
                checkout();
                break;
            case 'prexpay_p2p':
                prexpay_p2p();
                break;
            case 'contactless':
                Chukupax.modulo = new contactless();
                Chukupax.modulo.init();
                break;
            case 'usuarios.viaje':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.viaje();
                break;
            case 'usuarios.viajeOk':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.init();
                Chukupax.modulo.viaje();
                break;
            case 'beneficios':
                Chukupax.modulo = new beneficios();
                Chukupax.modulo.init();
                Chukupax.modulo.beneficios();
                break; 
            case 'beneficiosprex':
                Chukupax.modulo = new beneficios();
                Chukupax.modulo.init();
                Chukupax.modulo.init();
            break; 
            case 'solicitud.nuevaTarjeta':
                Chukupax.modulo.init();
                break;
            case 'registro.editar':
                Chukupax.modulo = new registro();
                Chukupax.modulo.editar();
                break; 
            case 'registro':
                Chukupax.modulo = new registro();
                Chukupax.modulo.init();
                break;
            case 'registro.paso1u':
                Chukupax.modulo = new registro();
                Chukupax.modulo.paso1u();
                break;
            case 'registro.paso1e':
                Chukupax.modulo = new registro();
                Chukupax.modulo.paso1e();
                break;
            case 'registro.paso2':
                Chukupax.modulo = new registro();
                Chukupax.modulo.paso2();
                break;
            case 'registro.paso3':
                Chukupax.modulo = new registro();
                Chukupax.modulo.paso3();
                break;     
            case 'ayuda_2_3_4':
                Chukupax.modulo = new ayuda();
                Chukupax.modulo.ayuda_2_3_4();
                break;
            case 'ayuda_2_3':
                Chukupax.modulo = new ayuda();
                Chukupax.modulo.ayuda_2_3();
                break;
            case 'ayuda.solicitudCorporativa':
                Chukupax.modulo = new ayuda();
                Chukupax.modulo.solicitudCorporativa();
                break;
            case 'ayuda':
                Chukupax.modulo = new ayuda();
                Chukupax.modulo.init();
                break; 
            case 'ayuda.faqs':
                Chukupax.modulo = new ayuda();
                Chukupax.modulo.faqs();
                break; 
            case 'ayuda.solicitudSueldos':
                Chukupax.modulo = new ayuda();
                Chukupax.modulo.solicitudSueldos();
                break;
            case 'mapa':
                Chukupax.modulo = new mapa();
                Chukupax.modulo.init();
                break; 
            case 'promociones':
                Chukupax.modulo = new promociones();
                Chukupax.modulo.uberNostalgia();
                break;
            case 'promociones.promoUber':
                Chukupax.modulo = new promociones();
                Chukupax.modulo.promoUber();
                break; 
            case 'promociones.promoPedidosYa':
                Chukupax.modulo = new promociones();
                Chukupax.modulo.promoPedidosYa();
                break;                   
            case 'prextamo.info':
                Chukupax.modulo = new prextamo();
                Chukupax.modulo.init();
                break;
            case 'prextamo_paravos':
                Chukupax.modulo = new prextamo_paravos();
                Chukupax.modulo.init();
            break;
            case 'prextamo':
                Chukupax.modulo = new prextamo();
                Chukupax.modulo.init();
            break; 
            case 'uber':
                Chukupax.modulo = new uber();
                Chukupax.modulo.init();
            break;        
            case 'cambiomoneda':
                Chukupax.modulo = new cambiomoneda();
                Chukupax.modulo.init();
                break;
            case 'promoamigo':
                Chukupax.modulo = new promoamigo();
                Chukupax.modulo.init();
                break;
            case 'p2p':
                Chukupax.modulo = new p2p();
                Chukupax.modulo.init();
                break;
            case 'usuarios.afiliaciones':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.afiliaciones();
                break;
            case 'solicitar':
                Chukupax.modulo = new solicitar();
                Chukupax.modulo.init();
                break;
            case 'solicitar.paso1u':
                Chukupax.modulo = new solicitar();
                Chukupax.modulo.paso1u();
                break;
            case 'solicitar.paso1e':
                Chukupax.modulo = new solicitar();
                Chukupax.modulo.paso1e();
                break;
            case 'solicitar.paso2':
                Chukupax.modulo = new solicitar();
                Chukupax.modulo.paso2();
                break;
            case 'solicitar.paso3':
                Chukupax.modulo = new solicitar();
                Chukupax.modulo.paso3();
                break;
            case 'solicitar.envio':
                Chukupax.modulo = new solicitar();
                Chukupax.modulo.envio();
                break;
            case 'paypalprex':
                Chukupax.modulo = new paypalprex();
                Chukupax.modulo.init();
                break;
            case 'paypal':
                Chukupax.modulo = new paypal();
                Chukupax.modulo.init();
                break;
            case 'paypal.preguntasfrecuentes':
                Chukupax.modulo = new paypal();
                Chukupax.modulo.preguntasfrecuentes();
                break;
            case 'paypal.soporte':
                Chukupax.modulo = new paypal();
                Chukupax.modulo.soporte();
                break;
            case 'paypal.retiro':
                Chukupax.modulo = new paypal();
                Chukupax.modulo.retiro();
                break;
            case 'paypal.calculadora':
                Chukupax.modulo = new paypal();
                Chukupax.modulo.calculadora();
                break;
            case 'paypal.informacion':
                Chukupax.modulo = new paypal();
                Chukupax.modulo.informacion();
                break;
            case 'paypal.syncOk':
                Chukupax.modulo = new paypal();
                Chukupax.modulo.syncOk();
                break;
            case 'notificaciones':
                Chukupax.modulo = new notificaciones();
                Chukupax.modulo.init();
                break;
            case 'registropaypal.paso3':
                Chukupax.modulo = new registropaypal();
                Chukupax.modulo.paso3();
                break;
            case 'registropaypal.paso3n':
                Chukupax.modulo = new registropaypal();
                Chukupax.modulo.paso3n();
                break;
            case 'penca':
                Chukupax.modulo = new penca();
                Chukupax.modulo.init();
                break;
            case 'usuarios.generarPIN':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.generarPIN();
                break;
            case 'usuarios.actualizarDistribucion':
                Chukupax.modulo = new usuarios();
                Chukupax.modulo.actualizarDistribucion();
            break;
            case 'bps':
                Chukupax.modulo = new bps();
                Chukupax.modulo.init();
            break;

            case 'cargasaterceros':
                Chukupax.modulo = new cargasaterceros();
                Chukupax.modulo.init();
            break;

            case 'encasaconprex':
                Chukupax.modulo = new encasaconprex();
                Chukupax.modulo.init();
            break;

            case 'victor.saldo':
                Chukupax.modulo = new du4lh();
                Chukupax.modulo.saldo();
                break;   

            case 'cargaritau': 
                Chukupax.modulo = new cargaritau();
                Chukupax.modulo.init(); 
            break;

            case 'cargaritau.logged': 
                Chukupax.modulo = new cargaritau();
                Chukupax.modulo.logged(); 
            break;

            case 'ruedapremiox': 
                Chukupax.modulo = new ruedapremiox();
                Chukupax.modulo.init(); 
            break;

            case 'cargasporbanco': 
                Chukupax.modulo = new cargasporbanco();
                Chukupax.modulo.init(); 
            break;

            case 'cargasprex':
                Chukupax.modulo = new cargasprex();
                Chukupax.modulo.init(); 
            break;
            case 'solicitarPrexConPayoneer':
                Chukupax.modulo = new solicitarPrexConPayoneer();
                Chukupax.modulo.init();
            break;
            case 'inversiones-cripto':
                Chukupax.modulo = new inversionesCripto();
                Chukupax.modulo.init();
            break;
        }

        this.request = (d, m, u) => {
            var formBody = [];
            for (var property in d) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(d[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
    
            var opts = { 
                method: m,
                body: formBody,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                mode: 'cors',
                cache: 'default' 
            };
    
            return fetch(u, opts)
            .then(response => { 
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json() 
            })
            .catch(e => {
                Swal.fire(
                    'Fallo al realizar el request',
                    `Por favor intente mas tarde`,
                    'error'
                );
            });
        }
    }

    $("#cerrarSesion_header").click(() => {
        window.location.href = "/login/logout";
    });
}

$("#recargarPagina").click(function() {
    location.reload();
});

function resizeContainer(width) {
    if (width < 768) {
        $("#inMobile").val(1);
        var heightCabezal = $('div.header-v7.header-left-v7').height();
        $(".content-side-right").css('height', 'calc(100vh - '+heightCabezal+'px)');
    } else {
        var heightCabezal = $('div.col-md-10.logo.floating-top-left.px-bg-first').height();
        $(".content-side-right").css('height', 'calc(100vh)');
    }
}

$(document).ready(function() {
    if (Chukupax.logged == 1) {
        var user_active = 1,
        interval_inactive,
        cantidad_noti = 0,
        recorriendo = 0;

        var timer = function(){
            interval_inactive = setInterval(function(){
                user_active = 0;
            }, 3600000);
        };

        document.addEventListener('click', function(e){
            clearInterval(interval_inactive);
            timer()
            user_active = 1;
        }, true);

        document.addEventListener('scroll', function(e){
            clearInterval(interval_inactive);
            timer();
            user_active = 1;
        }, true);

        setInterval(function(){
            if (user_active == 0) {
                swal({
                    title: "Inactividad",
                    text: "Ha estado mucho tiempo inactivo, por su seguridad será deslogueado",
                    type: "info",
                    html: true,
                    closeOnConfirm: false,
                    confirmButtonText: "Confirmar"
                },
                function(){
                    window.location.replace('/login/logout');
                });
            }
        }, 300000);

        $(".btnActivarSpinner").click(function() {
            $("#spinner-loading").removeClass('hide-spinner');
        });

        $("#actualizarCelular").dialog({
            modal: true, 
            width: 500,
            draggable: false,
            resizable: false,
            open: function() {
                $('.ui-widget-overlay').addClass('custom-overlay');
            },
            buttons: {
                "Actualizar": function() {
                    $(".page-enter").fadeIn("slow");
                    var html = $("#textoTituloASSE").text();
                    $.ajax({
                        url : Chukupax.basePath + "/webservice/actualizarCelular",
                        dataType : "json",
                        data : {
                            nuevoCelular: $("#nuevoCelular").val()
                        },
                        success : function (data) {
                            $("body").addClass('overflow-y-scroll');
                            $(".page-enter").fadeOut("slow");

                            if(data.error == 0){
                                $("#textoTituloASSE").text("Número de celular actualizado con éxito."); 	
                                $("#labelASSE").css('display', 'none');
                                $("#nuevoCelular").css('display', 'none');
                                $("#recargarPagina").css('display', 'block');
                                $("body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-buttons > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css('display', 'none');
                            }else{
                                $("#textoTituloASSE").text(data.textoError);
                                $("#labelASSE").css('display', 'none');
                                $("#nuevoCelular").css('display', 'none');
                                $("#recargarPagina").css('display', 'block');
                                $("body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-buttons > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css('display', 'none');
                            }
                            setTimeout(function(){
                                location.reload();
                            }, 3000);
                        },
                        error : function () {
                            $("body").addClass('overflow-y-scroll');
                            $(".page-enter").fadeOut('slow');

                            $("#textoTituloASSE").text("No se ha podido actualizar, intente más tarde.");

                            $("#labelASSE").css('display', 'none');
                            $("#nuevoCelular").css('display', 'none');
                            $("#recargarPagina").css('display', 'block');
                            $("body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-buttons > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css('display', 'none');
                        },
                        type : 'POST'
                    });
                },
                "Cancelar": function() {
                    $(this).dialog( "close" );
                }
            }
        });

        $("#actualizarSaldo_header").click(function() {
            var _DOM_px_disponible_pesos = $("#_px-disponible-pesos"),
                _DOM_px_disponible_dolares = $("#_px-disponible-dolares"),
                actual_saldo_pesos = _DOM_px_disponible_pesos.html(),
                actial_saldo_dolar = _DOM_px_disponible_dolares.html();

            _DOM_px_disponible_dolares.addClass('fadeIn animated');
            _DOM_px_disponible_pesos.addClass('fadeIn animated');

            _DOM_px_disponible_dolares.html('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>');
            _DOM_px_disponible_pesos.html('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>');

            setTimeout(function(){
                _DOM_px_disponible_dolares.removeClass('fadeIn animated');
                _DOM_px_disponible_pesos.removeClass('fadeIn animated');
            }, 500);

            $.ajax({
                url: '/usuarios/actualizarSaldo',
                type: 'post',
                dataType: 'json',
                data: {from_ajax: true}
            })
            .done(function(data) {
                if (data.saldo_dolares != undefined && data.saldo_pesos   != undefined) {
                    _DOM_px_disponible_dolares.html("U$S " + data.saldo_dolares);
                    _DOM_px_disponible_pesos.html("$ " + data.saldo_pesos);
                }else{
                    _DOM_px_disponible_dolares.html(actual_saldo_dolares);
                    _DOM_px_disponible_pesos.html(actual_saldo_pesos);
                }

                setTimeout(function(){
                    _DOM_px_disponible_dolares.removeClass('fadeIn animated');
                    _DOM_px_disponible_pesos.removeClass('fadeIn animated');
                }, 500);
            })
            .fail(function() {
                window.location.replace('/usuarios/cuentav2/' + $("#idc").val());
            })
            .always(function() {
                _DOM_px_disponible_dolares.addClass('fadeIn animated');
                _DOM_px_disponible_pesos.addClass('fadeIn animated');
            });
        });

        // Controles de escalado
        var width = $(window).width(),
            mid = Chukupax.mid,
            title = '',
            idU = $("#idU").val(),
            title = document.title,
            noti_abierto = 0;


        if ($("#inMobile").val() == 0) {
            $(window).on('resize', function(){
                if($(this).width() != width){
                    width = $(this).width();
                    if(mid == 'usuarios.editar'){
                        if (width < 768) {
                            $("#inMobile").val(1);
                        } else {
                            $("#inMobile").val(0);
                        }
                    }
                    resizeContainer(width);
                }
            });
        }

        resizeContainer(width);

        if (mid != 'ayuda.faqs'){
            $(".mensaje-de-prex").hide();
        }

        switch(mid){
            case 'usuarios.spi':
            case 'p2p':
            case 'transferenciaexterior':
                $("#btn-submenu-transferencias").click();
            break;

            case 'mapa':
            case 'ayuda.faqs':
            case 'ayuda.solicitudSueldos':
            case 'usuarios.afiliaciones':
            case 'solicitud.tarjeta':
                $("#btn-submenu-servicios").click();
            break;

            case 'usuarios.editar':
                if (width < 768) {
                    $("#inMobile").val(1);
                }
            case 'usuarios.cambiarpass':
            case 'usuarios.cambiarmail':
                $("#btn-submenu-micuenta").click();	
                $("#btn-submenu-editar-datos").click();
            break;

            case 'paypal':
            case 'paypal.retiro':
            case 'paypal.preguntasfrecuentes':
            case 'paypal.soporte':
            case 'paypal.calculadora':
                if ($('#sync_pp').val() == 1) {
                    $("#btn-submenu-retiropp").click();
                }
            break;
        }

        if (mid != 'usuarios.cuentasv2' && mid != 'usuarios') {
            get_notification_vistas(idU, title);
            get_notification_nuevas(idU, title);

            setInterval(function(){		
                get_notification_nuevas(idU, title);
            }, 600000);
        }

        $('#noti_Button').click(function () {
            if (noti_abierto == 0) {
                document.title = title;
                $('#notifications').fadeToggle('fast', 'linear', function () {});

                if ($(".add-html").length > 0) {
                    $(".notification-container").removeClass('notification-added');
                    markNotification($(".add-html").data('notifiid'));
                    $(".add-html").removeClass('add-html');
                }

                $('#noti_Counter').fadeOut('slows');
                var mostrando_interval = setInterval(function(){
                    $("#idNotification").val("");
                    if ($("#notifications").is(":visible")) {
                        if (cantidad_noti > recorriendo) {
                            if (!$(".nro-orden-"+recorriendo).hasClass('fadeIn animated')) {
                                $(".nro-orden-"+recorriendo).removeClass('px-display-none');
                                $(".nro-orden-"+recorriendo).addClass('fadeIn animated');
                                if ($("#noti_Counter").html() == 0) {
                                    document.title = title;
                                } else {
                                    document.title = "(" + $("#noti_Counter").html() + ") " + title;
                                }

                                if ($("#noti_Counter").html() == 0) {
                                    $('#noti_Counter').fadeOut('slows');
                                }
                                recorriendo ++;
                            }
                        } else {
                            $(".notification-container").removeClass('fadeIn animated');
                            clearInterval(mostrando_interval);
                        }
                    }
                }, 150);
                noti_abierto = 1;
                return false;
            } else {
                $('#notifications').fadeToggle('fast', 'linear', function () {});
                noti_abierto = 0;
            }
        });

        $("#notifications > div.seeAll > a").click(function() {
            window.location.href = '/notificaciones/'+$("#idc").val();
        });

        $(document).click(function() {
            if (noti_abierto == 1) {
                $('#notifications').fadeToggle('fast', 'linear', function () {});
                noti_abierto = 0;
            }
        });

        $('.closeBoxNotification').click(function() {
            if (noti_abierto == 1) {
                $('#notifications').fadeToggle('fast', 'linear', function () {});
                noti_abierto = 0;
            }
        });

        $('#notifications').click(function () {
            return false;
        });
    } else {
        switch(Chukupax.mid){
            case 'portada':
            case 'solicitar':
                $('#cerrar_decarga').click(function() {
                    $('#download-app').hide();
                });
                break;
        }
    }
    $("#spinner-loading").addClass('hide-spinner');
});

function penca(){}

function encasaconprex() {
    this.init = function () { 

    }
}

function lol() {
    this.init = function () { 

    }
}

function ruedapremiox() {
    this.init = function () { 

    }
}

function cargasporbanco(){
    this.init = function (){
        var pathname = window.location.href;
        var banco = pathname.split('#');
        var bancosmenunombres = ["eBrou","Santander","Itau","Scotiabank","BBVA",
        "HSBC","Creditel","Citibank","Banred","Bandes",
        "Micuenta"];
        var bancosmenu = [0,0,0,0,0,0,0,0,0,0,0];
        
        if( banco[1] == 'Micuenta'){
            cambiarmenuB();
            mob_desplegar( banco[1] );
        }else if( banco[1] != null && banco[1] != '' && banco[1] != 'Banred'){//Baja Banred
            cambiarmenu( banco[1] );
            mob_desplegar( banco[1] , 1);
        }else{
            location.href = '#eBrou';
        }
        

        $('.divimgtext').click(function(){
            cambiarmenu( $(this).data('menu') );
            location.href = '#' + $(this).data('menu');
        })

        $('.div_cuentaprex').click(function(){
            cambiarmenuB();
            location.href = '#Micuenta';
            topWeb();
        })

        $('.pri_link').click(function(){
            cambiarmenuB();
            location.href = '#Micuenta';
            topWeb();
        })

        function cambiarmenu(textomenu){
            $('.cuentaprex_img').css('transform','rotate(0deg)');
            $('.divimgtext').removeClass('menuactive');
            $('.divimgtext_' + textomenu).addClass('menuactive');
            $('.menus').removeClass('menubancoactive');
            $('.menu_' + textomenu).addClass('menubancoactive');
            if (textomenu == 'Micuenta'){
                $('.cuentaprex_img').css('transform','rotate(270deg)');
            }
            topWeb();
            
        }

        function cambiarmenuB(){
            $('.cuentaprex_img').css('transform','rotate(0deg)');
            $('.divimgtext').removeClass('menuactive');
            $('.menus').removeClass('menubancoactive');
            $('.menu_Micuenta').addClass('menubancoactive');
            $('.cuentaprex_img').css('transform','rotate(270deg)');
            topWeb();
        }

        function copiarA() {
            var copyText = document.getElementById("copiarA");  

            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/

            document.execCommand("copy");

            $('.itau_textocopiadoA').css('display','initial');
            setTimeout(function(){
                $('.itau_textocopiadoA').css('display','none');
            }, 1500);
            
        }

        function copiarB() {
            var copyText = document.getElementById("copiarB");  

            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/

            document.execCommand("copy");

            $('.itau_textocopiadoB').css('display','initial');
            setTimeout(function(){
                $('.itau_textocopiadoB').css('display','none');
            }, 1500);
        }

        $('.mob_divbancos').click(function(){
            var menu = $(this).data('banco');
            mob_desplegar(menu , 0);
        })

        function mob_desplegar(menu, tipo){

            switch(menu){
                case 'eBrou':
                    banco = 0;
                    topWeb(banco * 60 + 100);
                    break;
                case 'Santander':
                    banco = 1;
                    topWeb(banco * 60 + 100);
                    break;
                case 'Itau':
                    banco = 2;
                    topWeb(banco * 60 + 100);
                    break;
                case 'Scotiabank':
                    banco = 3;
                    topWeb(banco * 60 + 100);
                    break;
                case 'BBVA':
                    banco = 4;
                    topWeb(banco * 60 + 100);
                    break;
                case 'HSBC':
                    banco = 5;
                    topWeb(banco * 60 + 100);
                    break;
                case 'Creditel':
                    banco = 6;
                    topWeb(banco * 60 + 100);
                    break;
                case 'Citibank':
                    banco = 7;
                    topWeb(banco * 60 + 100);
                    break;
                case 'Banred':
                    banco = 8;
                    topWeb(banco * 60 + 100);
                    break;
                case 'Bandes':
                    banco = 9;
                    topWeb(banco * 60 + 100);
                    break;
                case 'Micuenta':
                    banco = 10;
                    topWeb(banco * 60 + 100);
                    break;
            }

            /* ocultar todos */
            $('.mob_principal').hide();
            for(i = 0; i < bancosmenu.length; i++){
                $('#mob_simbolo_' + bancosmenunombres[i]).html('+');
                if (bancosmenu[banco] != bancosmenu[i]){
                    bancosmenu[i] = 0;
                }
            }

            if (bancosmenu[banco] == 0){ 
                $('#mob_principal_' + menu).show();
                $('#mob_simbolo_' + menu).html('-');
                bancosmenu[banco] = 1;
                if (banco == 10){
                    $('.cuentaprex_img').css('transform','rotate(270deg)');
                }
            } else if(bancosmenu[banco] == 1){
                $('#mob_principal_' + menu).hide();
                $('#mob_simbolo_' + menu).html('+');
                bancosmenu[banco] = 0;
                if (banco == 10){
                    $('.cuentaprex_img').css('transform','rotate(0deg)');
                }
                $('.divimgtext').removeClass('menuactive');
            }

            if (tipo == 1){
                bancosmenu[banco] = 1;
            }

            if  (window.innerWidth > 768){
                topWeb();
            }

            
        }

        function topWeb(top = 0){
            window.scroll({
                top: top,
                behavior: 'smooth'
                });
        }

        function toggleVideo(state, idvideo) {
            var div = document.getElementById("videos_div_" + idvideo);
            var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
            div.style.display = state == 'hide' ? 'none' : 'block';
            func = state == 'hide' ? 'pauseVideo' : 'playVideo';
            iframe.postMessage('{"event":"command","func":"' + func + '","args":""}','*');
        }

        $('.linksvideos').click(function(){
            var video = $(this).data('idvideo');
            if ( $('.' + $(this).data('video')).css('display') == 'block' ){
                $('.videos_div').hide();
                $('.' + $(this).data('video') ).hide();
            }else{
                $('.videos_div').hide();
                
                $('.' + $(this).data('video') ).show();
                setTimeout( function() {
                    toggleVideo('see',video);
                    $('.close_video').css('display','block');
                 }, 3500); 
            }
        })

        $('.close_video').click(function(){
            toggleVideo('hide',$(this).data('idvideo'));
            $('.close_video').css('display','none');
        })
    
    /* FIN BANCOS */
    }
}

function cargasprex (){
    this.init = () => {

        function topWeb(top = 0){
            window.scroll({
                top: top,
                behavior: 'smooth'
                });
        }

        function toggleVideo(state, idvideo) {
            var div = document.getElementById("videos_div_" + idvideo);
            var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
            div.style.display = state == 'hide' ? 'none' : 'block';
            func = state == 'hide' ? 'pauseVideo' : 'playVideo';
            iframe.postMessage('{"event":"command","func":"' + func + '","args":""}','*');
        }

        $('.linksvideos').click(function(){
            var video = $(this).data('idvideo');
            if ( $('.' + $(this).data('video')).css('display') == 'block' ){
                $('.videos_div').hide();
                $('.' + $(this).data('video') ).hide();
            }else{
                $('.videos_div').hide();
                
                $('.' + $(this).data('video') ).show();
                setTimeout( function() {
                    toggleVideo('see',video);
                    $('.close_video').css('display','block');
                 }, 3500); 
            }
        });

        $('.close_video').click(function(){
            toggleVideo('hide',$(this).data('idvideo'));
            $('.close_video').css('display','none');
            topWeb(501);
        });
    }
}

function cargaritau (){  
    this.init = () => {
        $('.toast').hide();

        $('.copiartexto').click(function(){
            $('.toast').show();

            setTimeout( function() {
               $('.toast').hide();
            }, 2000);  
        })
    }

    this.logged = () => {
        $('.toast').hide();

        $('.copiartexto').click(function(){
            $('.toast').show();

            setTimeout( function() {
               $('.toast').hide();
            }, 2000);  
        })
    }
}

function cargasaterceros() {
    this.init = function () {
        if (screen.width <= 619) {
            $('#textoBotonMobile').text("¿Aún no tenés la App de Prex?");
        }
    }
}

function bps() {
    this.init = function () {
        $(".showAlert").click( function() {  
            if (Chukupax.logged) {
                flujoAlertas();
            } else {
                Swal.fire({
                    title: 'Ingresá con tu usuario Prex',
                    footer: '<a href="/login/resetear" target="_blank">¿Olvidaste tu contraseña?</a>',
                    html:
                    '<div class="input-group"><div class="input-group-addon"><div class="swal2-input icon-content"><img class="swal-icon" src="/assets/prex/img/bps/user-icon.svg"/></div></div><input id="swal-input1" class="swal2-input input-content" placeholder="Documento o correo"></div>' +
                    '<div class="input-group"><div class="input-group-addon"><div class="swal2-input icon-content"><img class="swal-icon" src="/assets/prex/img/bps/key-icon.svg" /></div></div><input id="swal-input2" class="swal2-input input-content" placeholder="Contraseña" type="password"></div>',
                    focusConfirm: false,
                    confirmButtonText: "Ingresar",
                    confirmButtonClass: 'boton-confirmar-ingresar',
                    showCloseButton: true,
                    preConfirm: () => {
                        let user = document.getElementById('swal-input1').value;
                        let password = document.getElementById('swal-input2').value;
                        $.ajax(
                            Chukupax.basePath + "/login/_do", {
                                data: {
                                    usuario: user,
                                    password: password
                                },
                                success: function (data) {
                                    if (data.error == "ok") {
                                        if (data.estado != '-3') {
                                            flujoAlertas();
                                        }else{
                                            Swal.fire(
                                                'Error',
                                                'No puedes vincular tu cuenta',
                                                'error'
                                            )
                                        }
                                    } else if (data.error == "bloqueado"){
                                        Swal.fire(
                                            'Error',
                                            'No puedes vincular tu cuenta',
                                            'error'
                                        )
                                    } else {
                                        Swal.fire(
                                            'Error',
                                            'Datos incorrectos',
                                            'error'
                                        )
                                    }
                                },
                                error: function () {
                                    Swal.fire(
                                        'Error',
                                        'Intente mas tarde',
                                        'error'
                                    )
                                },
                                dataType: 'json',
                                type: 'POST'
                            }
                        );
                    }
                })
            }
           
        })
    }

    flujoAlertas = function () {
        /* TODO DIEGO */
        var name;
        $.ajax({
            url: Chukupax.basePath + '/bps/obtname',
            type: 'POST',
            async: false
        }).success( function (data) {
            console.log(data);
            name = data.username;
        }) 

        console.log(name);

        Swal.fire({
            title: "",
            html: "<img src='/assets/prex/img/bps/BPS_logo.svg'/><p class='alert1Info'>" + name + " Si das click en el botón Cobrar en Prex, automáticamente BPS nos enviará todos tus pagos y los acreditaremos en tu cuenta Prex.</p>",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonClass: 'boton-cancelar',
            confirmButtonClass: 'boton-confirmar',
            confirmButtonText: 'Cobrar en Prex',
            reverseButtons: true,
            }).then(result => {
            if (result.value) {
                // Logica para vinculacion
                $.ajax({
                    url: Chukupax.basePath + '/bps/vincular',
                    type: 'POST'
                }).success( function (data) {
                    if(data.error == 0){
                        Swal.fire({
                            type: 'success',
                            html: "<p class='alert1Info'>Tu cuenta Prex ha sido registrada en pagos BPS con éxito. Te notificaremos por la App cuando recibas un pago.</p>",
                            confirmButtonClass: 'boton-confirmar',
                            confirmButtonText: 'Mi cuenta',
                            showCloseButton: true,
                        })
                        .then(res => {
                            if (res.value) {
                                window.location.replace('/');
                            }
                        })
                    } else {
                        Swal.fire({
                            title: "",
                            html: "<img src='/assets/prex/img/bps/BPS_logo.svg'/><p class='alert1Info'>Para poder cobrar tus pagos BPS es necesario que te dirijas a un Abitab para validar, por única vez, tu cuenta Prex con tu cédula de identidad.</p>",
                            confirmButtonClass: 'boton-confirmar',
                            confirmButtonText: 'OK, entiendo',
                        });
                    }
                })
            }
        })
    }
    
    if (screen.width <= 619) {
        $('#textoBotonMobile').text("¿Aún no tenés la App de Prex?");
    }
}

function du4lh() {
    this.saldo = () => {
		const informacion = {
			modoCarga: 'me',
			dato: '',
			tipo: '',
			datoVerficiado: false,
			habilitarCarga: true,
			metodo: 0,
			metodoNombre: '',
			moneda: 858,
            monto: 0,
            iniciales: '',
            actualStep: 0,
			placeholder: {
				ci: 'Ingresa número de CI sin puntos ni guiones',
				cel: 'Ingresa número de celular',
				email: 'Ingresa el email'
			},
			permitidos: {
				monedas: [840, 858],
				metodos: [2, 3, 4, 13, 77],
				tiposContacto: ['ci', 'cel', 'email']
			},
			creditel: {
				imagenTarjeta: 'https://de2aqb3kqoyo2.cloudfront.net/web/tarjetaCompletaCreditel.png',
				ultimosCuatro: '',
				disponible: 0,
				plazo: 1,
			},
			cotizacionUsd: {
				venta: 0,
				compra: 0
			},
			limites: {
				maximos: {
					2: {
						840: 3000,
						858: 80000
					},
					3: {
						840: 500,
						858: 15000
					},
					4: {
						840: 500,
						858: 10000
					},
					13: {
						840: 300,
						858: 10000
					},
					77: {
						840: 0,
						858: 0
					}
				}
			},
			limiteTexto: (metodo, moneda) => {
				return `El monto máximo por carga con ${informacion.metodoNombre} es de ${(moneda == 840 ? 'U$S' : '$')} ${informacion.limites.maximos[metodo][moneda]} por transacción.`
			}
		};

		const helpers = {
			opciones: {
				ci: false,
				cel: false,
				email: false
			},

			modificarClase: (metodo, selector, clase) => {
				if (metodo == 'ADD') {
					if (!$(selector).hasClass(clase)) {
						$(selector).addClass(clase);
					}
				} else if (metodo == 'REMOVE') {
					if ($(selector).hasClass(clase)) {
						$(selector).removeClass(clase);
					}
				}
			},

			activarElementos: (active, type = 'ok') => {
				if (type == 'ok') {
					if (active) {
						helpers.modificarClase('REMOVE', '.imagenVerificado', 'hidden');
						helpers.modificarClase('REMOVE', '.containerVerificado', 'hidden');
						helpers.modificarClase('ADD', '.inputDestinatario', 'ok');
					} else {
						helpers.modificarClase('REMOVE', '.inputDestinatario', 'ok');
						helpers.modificarClase('ADD', '.imagenVerificado', 'hidden');
						helpers.modificarClase('ADD', '.containerVerificado', 'hidden');
					}
				} else {
					if (active) {
						helpers.modificarClase('REMOVE', '.imagenError', 'hidden');
						helpers.modificarClase('REMOVE', '.containerError', 'hidden');
						helpers.modificarClase('ADD', '.inputDestinatario', 'fail');
					} else {
						helpers.modificarClase('REMOVE', '.inputDestinatario', 'fail');
						helpers.modificarClase('ADD', '.imagenError', 'hidden');
						helpers.modificarClase('ADD', '.containerError', 'hidden');
					}
				}
			},

			cambiarInfoDestinatario: dato => {
				$(".destinatario").html(dato);
            },
            
            cambiarInfoDestinatarioMobile: dato => {
				$(".destinatario-mobile").html(dato);
            },
            
			formatearNumero: () => {
				switch(informacion.tipo) {
					case 'ci':
						const ci = informacion.dato;

						const ciSinVerificador = ci.slice(0, -1);
						const ciVerificador    = ci.slice(-1);
						
						let ciFormateada = `-${ciVerificador}`;

						const puntosDetectados = Math.ceil(ciSinVerificador.length / 3);
						const ciDivisor = -3;
						
						for (let index = 0; index < puntosDetectados; index++) {
							if (index == 0) {
								ciFormateada = ciSinVerificador.slice(-3) + ciFormateada;
							} else {
								ciFormateada = ciSinVerificador.slice(ciDivisor * (index + 1), ciDivisor * index) + '.' + ciFormateada;
							}
						}

						return ciFormateada;

					case 'cel':
						const celular = informacion.dato;

						let celFormateado = '';
						const celDivisor = -3;
						if (celular.length == 9) {
							for (let index = 0; index < 3; index++) {
								if (index == 0) {
									celFormateado = celular.slice(celDivisor) + ' ';
								} else {
									celFormateado = celular.slice(celDivisor * (index + 1), celDivisor * index) + ' ' + celFormateado;
								}
							}
						}

						return celFormateado;
				}
			},

			cambiarOpcion: (opt, desmarcar = 0) => {
                
				const tipos = Object.keys(helpers.opciones);
				tipos.map(o => {
                    helpers.modificarClase('REMOVE', `.${o}`, 'activo');

                    helpers.opciones[o] = false;
				});

				$(".inputDestinatario").val('');
				if (desmarcar == 1) {
                    informacion.tipo = 'ci';
                    
					$("#tipoDocumento").val('ci');

					helpers.modificarClase('ADD', 'button.verificar', 'hidden');
					helpers.modificarClase('ADD', 'button.siguiente-0', 'hidden');
					helpers.modificarClase('REMOVE', '.containerCi', 'hidden');
					helpers.modificarClase('ADD', '.containerCelular', 'hidden');
					helpers.modificarClase('ADD', '.containerEmail', 'hidden');
				} else {
					helpers.opciones[opt] = true;
					
					Object.values(helpers.opciones).map((o, i) => {
						if (o) {
							informacion.tipo = tipos[i];
                            helpers.modificarClase('REMOVE', '.containerInput' + tipos[i], 'hidden');
                            helpers.modificarClase('ADD', '.containerInput' + tipos[i], 'active');
						} else {
                            helpers.modificarClase('ADD', '.containerInput' + tipos[i], 'hidden');
                            helpers.modificarClase('REMOVE', '.containerInput' + tipos[i], 'active');
                            helpers.modificarClase('ADD', '.containerInput' + tipos[i], 'hidden');
                            helpers.modificarClase('REMOVE', '.containerInput' + tipos[i], 'active');
                        }
					});
					
					$("#tipoDocumento").val(informacion.tipo);

					helpers.modificarClase('ADD', `.${opt}`, 'activo');
					helpers.modificarClase('REMOVE', 'button.verificar', 'hidden');
                    helpers.modificarClase('ADD', 'button.siguiente-0', 'hidden');
                    if ($("div.wrapper").width() > 991) {
                        helpers.modificarClase('REMOVE', '.containerInput', 'hidden');     
                        helpers.modificarClase('ADD', '.containerInput', 'active');     
                    }               
				}

				helpers.modificarClase('ADD', 'button.verificar', 'deshabilitado');

				helpers.cambiarInfoDestinatario('Tipo de destinatario');

				helpers.activarElementos(false, 'error');
				helpers.activarElementos(false, 'ok');

				$(".inputDestinatario").attr('placeholder', informacion.placeholder[informacion.tipo]);
			},

			cambiarPaso: (from, to) => {
                window.scrollTo(0, 0);
                $(".paso.correcto").unbind();
                
                informacion.actualStep = to;
				helpers.modificarClase('ADD', `.carga-paso-${from}`, 'hidden');
				helpers.modificarClase('REMOVE', `.carga-paso-${to}`, 'hidden');
				
				helpers.modificarClase('ADD', `.paso-${to}`, 'activo');
                helpers.modificarClase('REMOVE', `.paso-${from}`, 'activo');
                if ($("div.wrapper").width() < 992) {
                    helpers.modificarClase('ADD', `.paso-${from}`, 'hidden');
                    helpers.modificarClase('REMOVE', `.paso-${to}`, 'hidden');
                    switch (to) {
                        case 0:
                            $('div.progress-bar').css({'width': '25%'});
                            break
                        case 1:
                            $('div.progress-bar').css({'width': '50%'});
                            break
                        case 2:
                            $('div.progress-bar').css({'width': '75%'});
                            break    
                        case 3:
                            $('div.progress-bar').css({'width': '90%'});
                            break
                    }
                }
                
				if (from < to) {
                    helpers.modificarClase('REMOVE', `.pasoCumplido-${from}`, 'hidden');
                    helpers.modificarClase('ADD', `.pasoNoCumplido-${from}`, 'hidden');
                    helpers.modificarClase('ADD', `.paso-${from}`, 'correcto');
				} else {
                    helpers.modificarClase('ADD', `.pasoCumplido-${to}`, 'hidden');
                    helpers.modificarClase('REMOVE', `.pasoNoCumplido-${to}`, 'hidden');
                    helpers.modificarClase('REMOVE', `.paso-${to}`, 'correcto');
                }
                
                $(".paso.correcto").click(function() {
                    helpers.cambiarPaso(informacion.actualStep, $(this).data('to'));
                });
			},

			verificar: () => {
                
				helpers.modificarClase('REMOVE', '.containerCargando', 'hidden');
				helpers.modificarClase('ADD', '.containerVerificar', 'hidden');
				$('.inputDestinatario').attr('disabled', 'disabled');
                
				$.ajax({
					url: "/carga/verificar_doc",
					dataType: "json",
					data: {  
						tipoDocumento: informacion.tipo,
                        documento: informacion.dato,
                        token: $("#receiverToken").val()
					},
					success: function(data) {
						if (data['error'] == 'ok' && data.iniciales && data.cuenta) {
                            informacion.datoVerficiado = true;
                            informacion.iniciales = data.iniciales;
							$("#IDcuentas").val(data.cuenta);
							$(".iniciales").html(data.iniciales);

							let extraInfoDestinatario = '';
							let extraInfoDestinatarioMobile = '';
                            switch (informacion.tipo) {
                                case 'ci':
                                    extraInfoDestinatario = '<br>CI ' + helpers.formatearNumero();
                                    extraInfoDestinatarioMobile = helpers.formatearNumero();
                                    break;

                                case 'cel':
                                    extraInfoDestinatario = '<br>Celular ' + helpers.formatearNumero();
                                    extraInfoDestinatarioMobile = helpers.formatearNumero();
                                    break;

                                case 'email':
                                    extraInfoDestinatario = '<br>Email ' + informacion.dato;
                                    extraInfoDestinatarioMobile = informacion.dato;
                                    break;
                            }
                            data.iniciales = '<br>' + data.iniciales;
                            data.inicialesMobile = data.iniciales.split("<br>")[1];
                            
                            helpers.cambiarInfoDestinatario('Destinatario ' + data.iniciales + extraInfoDestinatario);
                            helpers.cambiarInfoDestinatarioMobile(data.inicialesMobile + " " +extraInfoDestinatarioMobile)

							helpers.activarElementos(true, 'ok');
							helpers.activarElementos(false, 'error');

							helpers.modificarClase('ADD', 'button.verificar', 'hidden');
                            helpers.modificarClase('REMOVE', 'button.siguiente-0', 'hidden');         

						} else if (data.error != 'ok' && data.textoError) {
							$('.errorG').html(data.textoError);
                            
							helpers.activarElementos(false, 'ok');
							helpers.activarElementos(true, 'error');
						} else {
							$('.errorG').html('Este usuario no existe. Corrobora el número e intenta de nuevo');
                            
							helpers.activarElementos(false, 'ok');
							helpers.activarElementos(true, 'error');
						}

						helpers.modificarClase('ADD', '.containerCargando', 'hidden');
						helpers.modificarClase('REMOVE', '.containerVerificar', 'hidden');

						$('.inputDestinatario').removeAttr('disabled');
					},
					error: function(data) {
						$('.errorG').html('Este usuario no existe. Corrobora el número e intenta de nuevo');
                            
						helpers.activarElementos(false, 'ok');
						helpers.activarElementos(true, 'error');

						helpers.modificarClase('ADD', '.containerCargando', 'hidden');
						helpers.modificarClase('REMOVE', '.containerVerificar', 'hidden');

						$('.inputDestinatario').removeAttr('disabled');
					},
					type: 'POST'
				});
			},
			
			mostrarAlertaMonto: (texto) => {
				$("div.alerta > p > span").html(texto);

				if ($("div.alerta").hasClass('hidden')) {
					helpers.modificarClase('REMOVE', 'div.alerta', 'hidden');

					let timeOut = setTimeout(() => {
						helpers.modificarClase('ADD', 'div.alerta', 'hidden');

						clearTimeout(timeOut);
					}, 10000);
				}
			},
			
			comprobarMonto: (moneda, monto) => {
				informacion.habilitarCarga = true;
                
				informacion.moneda = Number(moneda);
				informacion.monto  = Number(monto);
                if(informacion.moneda == 858 && informacion.monto < 1500 && informacion.monto != 0) {
                    $("#textoAlerta").text("Se sumarán $ 69 de comisión porque la carga es inferior a $ 1.500");
                    helpers.modificarClase('REMOVE', 'div.alerta', 'hidden');
                } else if (informacion.moneda == 840 && informacion.monto < 50 && informacion.monto != 0){
                    $("#textoAlerta").text("Se sumarán U$S 2,5 de comisión porque la carga es inferior a U$S 50");
                    helpers.modificarClase('REMOVE', 'div.alerta', 'hidden');
                } else {
                    helpers.modificarClase('ADD', 'div.alerta', 'hidden');
                }

				$("#moneda").val(informacion.moneda);
                $("#monto").val(informacion.monto);
                
                $("p.montoCargar-mobile").html((informacion.moneda == 840) ? 'U$S' : '$' + " " + informacion.monto);
				
				if (isNaN(informacion.monto) || informacion.monto < 1) {
					informacion.habilitarCarga = false;

					helpers.modificarClase('ADD', '.siguiente-2', 'deshabilitado');

					return;
				}

				if (!informacion.permitidos.monedas.includes(informacion.moneda)) {
					informacion.habilitarCarga = false;
				}

				if (!informacion.permitidos.metodos.includes(informacion.metodo)) {
					informacion.habilitarCarga = false;
				}

				if (!informacion.permitidos.tiposContacto.includes(informacion.tipo)) {
					informacion.habilitarCarga = false;
				}

				if (informacion.monto > informacion.limites.maximos[informacion.metodo][informacion.moneda]) {
					informacion.habilitarCarga = false;
				}

				if (informacion.habilitarCarga) {
                    helpers.modificarClase('REMOVE', '.siguiente-2', 'deshabilitado');
                    if (informacion.metodo == 13 || informacion.metodo == 1303 || informacion.metodo == 1305) helpers.modificarClase('ADD', 'div.avisoBanredCarga', 'hidden')
                    else if (informacion.metodo == 1301 || informacion.metodo == 1304) helpers.modificarClase('ADD', 'div.avisoSistarbancCarga', 'hidden')
                    else if (informacion.metodo == 2) helpers.modificarClase('ADD', 'div.avisoBrouCarga', 'hidden')
                    else if (informacion.metodo == 3) helpers.modificarClase('ADD', 'div.avisoSantanderCarga', 'hidden')
                    else if (informacion.metodo == 4) helpers.modificarClase('ADD', 'div.avisoBbvaCarga', 'hidden');
				} else {
                    helpers.modificarClase('ADD', '.siguiente-2', 'deshabilitado');
                    if (informacion.metodo == 13 || informacion.metodo == 1303) helpers.modificarClase('REMOVE', 'div.avisoBanredCarga', 'hidden')
                    else if (informacion.metodo == 1301 || informacion.metodo == 1304) helpers.modificarClase('REMOVE', 'div.avisoSistarbancCarga', 'hidden')
                    else if (informacion.metodo == 2) helpers.modificarClase('REMOVE', 'div.avisoBrouCarga', 'hidden')
                    else if (informacion.metodo == 3) helpers.modificarClase('REMOVE', 'div.avisoSantanderCarga', 'hidden')
                    else if (informacion.metodo == 4) helpers.modificarClase('REMOVE', 'div.avisoBbvaCarga', 'hidden');
				}
			},

			verificarCarga: () => {
				if (isNaN(informacion.monto) || informacion.monto < 1) {
					return false;
				}

				if (!informacion.permitidos.monedas.includes(informacion.moneda)) {
					return false;
				}

				if (!informacion.permitidos.metodos.includes(informacion.metodo)) {
					return false;
				}

				if (!informacion.permitidos.tiposContacto.includes(informacion.tipo)) {
					return false;
				}

				if (informacion.monto > informacion.limites.maximos[informacion.metodo][informacion.moneda]) {
					Swal.fire(
						'Aviso',
						informacion.limiteTexto(informacion.metodo, informacion.moneda),
						'warning'
					);

					return false;
				}

				if (!informacion.habilitarCarga) {
					return false;
				}
				
				return true;
			},

			cambiarMedioPago: (_this, desmarcar = 0) => {
				helpers.modificarClase('REMOVE', '.pago-medio.seleccionado', 'seleccionado');

				if (desmarcar == 0) {
					informacion.metodo       = $(_this).data('metodo');
					informacion.metodoNombre = $(_this).data('nombre').toUpperCase();

                    if ($("div.wrapper").width() > 991) {
                        $(".siguiente-2").html(informacion.metodo != 77 ? 'cargar' : 'siguiente');
                    }
					helpers.modificarClase('ADD', _this, 'seleccionado');
					helpers.modificarClase('REMOVE', '.siguiente-1', 'deshabilitado');
					
					if (informacion.metodo == 77) {
						if ($("#ultimosCuatroCreditel").val().length == 4) {
							informacion.creditel.ultimosCuatro = $("#ultimosCuatroCreditel").val();
						} else {
							helpers.consultarTarjetaCreditel();
						}
					}
				} else {
					informacion.metodo       = 0;
					informacion.metodoNombre = '';

					helpers.modificarClase('ADD', '.siguiente-1', 'deshabilitado');
				}

				$("#IDmetodos").val(informacion.metodo);
				$("#nombreMetodo").html(informacion.metodoNombre);
				$("p.metodoPago-mobile").html(informacion.metodoNombre);
                $('.metodo-de-pago').html('Método de pago<br>' + informacion.metodoNombre);

				helpers.modificarClase((informacion.metodo == 13 || informacion.metodo == 1303) ? 'REMOVE' : 'ADD', 'div.avisoBanred', 'hidden');
                helpers.modificarClase((informacion.metodo == 1301 || informacion.metodo == 1304) ? 'REMOVE' : 'ADD', 'div.avisoSistarbanc', 'hidden');
				helpers.modificarClase((informacion.metodo == 3) ? 'REMOVE' : 'ADD', 'div.avisoSantander', 'hidden');
				helpers.modificarClase((informacion.metodo == 4) ? 'REMOVE' : 'ADD', 'div.avisoBbva', 'hidden');
			},

			actualizarCotizacion: () => {
				$.ajax({
					url: '/carga/cotizacion_usd',
                    dataType: 'json',
                    data: {
                        token: $("#cotizacionToken").val()
                    },
					type: "POST",
					success: cotizacion => {
						if (cotizacion.error == 0) {
							informacion.cotizacionUsd.venta  = cotizacion.venta;
							informacion.cotizacionUsd.compra = cotizacion.compra;
						}
					}
				});
			},

			consultarTarjetaCreditel: () => {
					Swal.fire({
						html: `
							<img width="80%" src="${informacion.creditel.imagenTarjeta}">
							<br><br>Por seguridad debe ingresar los últimos cuatro dígitos de su tarjeta creditel.
						`,
						input: 'number',
						inputPlaceholder: 'XXXX',
						showCancelButton: true,
						cancelButtonText: 'Cancelar',
						confirmButtonText: 'Confirmar',
						showLoaderOnConfirm: true,
						preConfirm: (numeroTarjeta) => {
							return $.ajax({
								url: '/creditel/vincularActualizarBDD',
								dataType: 'json',
								data: {
									tarjetaCreditel: numeroTarjeta,
									tipoConsulta: 'ajax'
								},
								success: data => {
                                    console.log(data);
									if (data.error == 0) {
										informacion.creditel.ultimosCuatro = numeroTarjeta;
										$("#ultimosCuatroCreditel").val(informacion.creditel.ultimosCuatro);

										return data;
									} else {
										Swal.showValidationMessage((data.textoError != undefined) ? data.textoError : 'Ha ocurrido un error, consulte');
									}
								},
								type: 'POST'
							});
						},
						allowOutsideClick: () => !Swal.isLoading()
				}).then(result => {
					if (result.value) {
						helpers.consultarDisponibleCreditel();
					} else {
						helpers.cambiarMedioPago(null, 1);
					}
				});
			},

			consultarCuotasCarga: (monto, moneda) => {
					Swal.fire({
						type: 'info',
						title: 'Consultando cuotas...',
						showConfirmButton: false
					});

					$.ajax({
						url: "/creditel/recargaConsulta",
						dataType: "json",
						data: {
							importe: monto,
							moneda: moneda
						},
						success: data => {
							if ([0, 99990000].includes(data.error)) {
								if (data.error == 99990000) {
										Swal.fire({
											title: 'Error',
											type: 'warning',
											text: 'No tienes suficiente saldo disponible en tu tarjeta CREDITEL',
											allowOutsideClick: false
										})
										.then(res => {
											if (res.value) {
												// CERRO
											} else {
												// CERRO
											}
										});
										// $("#btn-cargar").prop('disabled', true);
										// $("#btn-cargar").css("background", "#a8dcff");
										// $("#errorCuotasCreditel").html(data.textoError);
										// $("#ErrorCodeCreditel").html('Error: ' + data.error);
										// $("#dialogCuotas").dialog( "close" );
										// if (Math.round(parseFloat(monto)) > 0) {
										//     $("#monto").val(Math.round(parseFloat(data.importe)));
										// } else {
										//     $("#monto").val(1);
										// }
				
										// $("#dialogErrorCuotas").dialog({
										//     modal:true,
										//     buttons: {
										//         "Cerrar": function() {                                            
										//             $(this).dialog( "close" );
										//         }
										//     }
										// });
										// $(".ui-dialog-titlebar").hide();
										// $("#errorCuotasCreditel").fadeIn("slow");
								} else {
									if (data.importe < 0) {
										// $("#dialogImporteMenor").dialog({
										//     modal:true,
										//     buttons: {
										//         "Cerrar": function() {                                            
										//             $(this).dialog( "close" );
										//         }
										//     }
										// });

										// $("#btn-cargar").prop('disabled', true);
										// $("#btn-cargar").css("background", "#a8dcff");
										// $("#btnNuevasCuotas").css('display', 'none');
										// $("#creditel").prop("checked", false);
									} else {
										$(".cuota-monto").html(`${(moneda == 840) ? 'U$S' : '$'} ${parseFloat(data.importe).toFixed(2)}`);
															
										const generateLineaCuota = (plazo, valorCuota, total) => {
											return `
												<div class='col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1 cuota-opcion' data-image='cuota-opcion-${plazo}' data-plazo='${plazo}' data-valor='${valorCuota}' data-total='${total}'>
													${plazo} cuota${(plazo != 1) ? 's' : '' } de $ ${parseFloat(valorCuota).toFixed(2)}
													<img class='cuota-imagen cuota-opcion-${plazo} hidden' src='/assets/prex/img/carga/icon_ok.svg'> 
												</div>
											`;
										}
															
										let domCuotas = '';
										data.listaCuotas.map(cuota => {
											domCuotas += generateLineaCuota(cuota.plazo, cuota.valor_cuota, cuota.total);
										});
										
										$(".carga-cuotas-listado").html(domCuotas);

										helpers.eventoCantidadCuotas();

										helpers.modificarClase('ADD', '.carga-paso-2', 'hidden');
										helpers.modificarClase('REMOVE', '.carga-paso-cuotas', 'hidden');

										Swal.close();
									}                                                  
								}
							} else {
								// $.ajax({
								//     url: Chukupax.basePath + "/webservice/statusServidoresCreditel",
								//     dataType: "json",
								//     data: {
								//         codError: data.error,
								//         textoError: data.textoError
								//     },
								//     type: 'POST'
								// });
								// $("#btn-cargar").prop('disabled', true);
								// $("#btn-cargar").css("background", "#a8dcff");
								// $("#errorCuotasCreditel").html(data.textoError.replace("?", "�ni"));
								// $("#ErrorCodeCreditel").html('Error: ' + data.error);
								// $("#dialogCuotas").dialog( "close" );
								// $("#dialogErrorCuotas").dialog({
								//     modal:true,
								//     buttons: {
								//         "Cerrar": function() {
								//             $("#listado_creditos").hide();
								//             $(this).dialog( "close" );
								//             $("#btnNuevasCuotas").css('display', 'none');
								//             $("#btn-cargar").prop('disabled', true);
								//             $("#btn-cargar").css("background", "#a8dcff");
								//         }
								//     }
								// });
								// $(".ui-dialog-titlebar").hide();
								// $("#errorCuotasCreditel").fadeIn("slow");
							}
						},
						error: () => {
							// $("#dialogCuotas").dialog( "close" );
							// $.ajax({
							//     url : Chukupax.basePath + "/webservice/statusServidoresCreditel",
							//     dataType : "json",
							//     data :{
							//         codError: 1999,
							//         textoError: "Error de conexi�n con Creditel."
							//     },
							//     type : 'POST'
							// });
							// $("#dialogErrorSVCreditel").dialog({
							//     modal:true,
							//     buttons: {
							//         "Cerrar": function() {
							//             $(this).dialog( "close" );
							//             $("#listado_creditos").hide();
							//             $("#btnNuevasCuotas").css('display', 'none');
							//             $("#btn-cargar").prop('disabled', true);
							//             $("#btn-cargar").css("background", "#a8dcff");
							//             $("#creditel").prop('checked', false);
							//         }
							//     }
							// });
						},
						type: 'POST'
				});
			},

			consultarDisponibleCreditel: () => {
				Swal.fire({
					title: 'Consultando disponible...',
					type: 'info',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false
				});

                //console.log(informacion);

                //helpers.cambiarPaso(1, 2); 
                
                
				$.ajax({
					url: '/creditel/getDisponible2Tarjeta22222',
					dataType: 'json',
					type: "POST",
					success: disponible => {
						if (disponible.error == 0) {
							informacion.creditel.disponible = Number(disponible.disponible);
							informacion.limites.maximos[77][858] = informacion.creditel.disponible;
							informacion.limites.maximos[77][840] = Number.parseFloat(Number(informacion.creditel.disponible / informacion.cotizacionUsd.venta).toFixed(2));

							helpers.cambiarPaso(1, 2);

							Swal.close();
						} else {
							Swal.fire({
								title: 'Ha ocurrido un error',
								html: (disponible.textoError != undefined) ? disponible.textoError : 'Ha ocurrido un error, intente mas tarde',
								type: 'error',
								showCancelButton: false,
								showConfirmButton: true
							})
							.then(result => {
								helpers.cambiarMedioPago(null, 1);
							});
						}
					},
					error: err => {
						Swal.fire({
							title: 'Ha ocurrido un error',
							html: 'Ha ocurrido un error, intente mas tarde',
							type: 'error',
							showCancelButton: false,
							showConfirmButton: true
						})
						.then(result => {
							helpers.cambiarMedioPago(null, 1);
						});
					}
				});
			},

			eventoCantidadCuotas: () => {
				$(".cuota-opcion").click(function() {
					informacion.creditel.plazo = $(this).data('plazo');

					$("#plazo").val(informacion.creditel.plazo);

					helpers.modificarClase('REMOVE', '.cuota-opcion.marcada', 'marcada');

					Object.values($("img.cuota-imagen")).map(e => {
						helpers.modificarClase('ADD', e, 'hidden');
					});

					const image = 'img.' + $(this).data('image');
					helpers.modificarClase('REMOVE', image, 'hidden');

					helpers.modificarClase('ADD', this, 'marcada');
					helpers.modificarClase('REMOVE', 'button.siguiente-cuota', 'deshabilitado');
				});
			},

			cambiarOpcionCarga: (_this) => {
				helpers.modificarClase('REMOVE', '.tabChanger.activo', 'activo');
				helpers.modificarClase('ADD', _this, 'activo');
                
				informacion.modoCarga = $(_this).data('mode');
                const modoCarga = informacion.modoCarga;
                
				$(`img.${modoCarga}TabImage`).attr('src', '/assets/prex/img/carga/icon_tarjActive.svg');
				$((modoCarga == 'me' ? 'img.otherTabImage' : 'img.meTabImage')).attr('src', '/assets/prex/img/carga/icon_tarjinactive.svg');

				helpers.modificarClase('ADD', '.carga-paso-2', 'hidden');

				$("#IDcuentas").val($('#IDcuentasBackup').val());
				if (modoCarga == 'me') {
                    helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-md-6');
                    helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-xs-6');
                    helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-md-4');
                    helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-xs-4');
                    $(".pasoNoCumplido-1").html("1");
                    $(".pasoNoCumplido-2").html("2");
                    helpers.modificarClase('REMOVE', '.containerCuentas', 'hidden');
                    $('div.pasos div.paso-1').addClass('auxpaso1');
                    $("p.destinatario-mobile").html('');
                    // $('div.nombre-paso > p').html('');
                    informacion.dato = $('#documento').val();
                    informacion.iniciales = $('#iniciales').val();
                    informacion.tipo = 'ci';

					const cantidadPasos = 4;
					for (let i = 0; i < cantidadPasos; i++) {
						if (!$(`div.pasos div.paso-${i}`).hasClass('col-md-6')) {
							$(`div.pasos div.paso-${i}`).removeClass('col-md-4');

							if (!$(`div.pasos div.paso-${i}`).hasClass('col-md-6')) {
								$(`div.pasos div.paso-${i}`).addClass('col-md-6');
							}
						}

						if (!$(`div.pasos div.paso-${i}`).hasClass('col-xs-6')) {
							$(`div.pasos div.paso-${i}`).removeClass('col-xs-4');

							if (!$(`div.pasos div.paso-${i}`).hasClass('col-xs-6')) {
								$(`div.pasos div.paso-${i}`).addClass('col-xs-6');
							}
						}
					}

					helpers.modificarClase('ADD', '.paso-0', 'hidden');

					if ($(".paso-2").hasClass('activo')) {
						helpers.cambiarPaso(2, 1);
                    }
                    
                    if ($(".paso-3").hasClass('activo')) {
						helpers.cambiarPaso(3, 2);
						helpers.cambiarPaso(2, 1);
					}

					if ($(".paso-0").hasClass('activo')) {
						helpers.cambiarPaso(0, 1);
					}

					helpers.modificarClase('ADD', '.anterior-0', 'hidden');

					helpers.cambiarOpcion(null, 1);
				} else {
					helpers.modificarClase('ADD', '.containerCuentas', 'hidden');
                    helpers.modificarClase('ADD', 'div.containerInputci', 'hidden');
                    helpers.modificarClase('ADD', 'div.containerInputcel', 'hidden');
                    helpers.modificarClase('ADD', 'div.containerInputemail', 'hidden');
                    helpers.modificarClase('ADD', 'div.containerInput', 'hidden');
                    helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-md-6');
                    helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-xs-6');
                    helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-md-4');
                    helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-xs-4');
                    $('div.pasos div.paso-1').removeClass('auxpaso1');
                    $("p.destinatario-mobile").html('');
                    $(".pasoNoCumplido-1").html("2");
                    $(".pasoNoCumplido-2").html("3");

					const cantidadPasos = 4;
					for (let i = 0; i < cantidadPasos; i++) {
						if ($(`div.pasos div.paso-${i}`).hasClass('col-md-6')) {
							$(`div.pasos div.paso-${i}`).removeClass('col-md-6');

							if (!$(`div.pasos div.paso-${i}`).hasClass('col-md-4')) {
								$(`div.pasos div.paso-${i}`).addClass('col-md-4');
							}
						}

						if ($(`div.pasos div.paso-${i}`).hasClass('col-xs-6')) {
							$(`div.pasos div.paso-${i}`).removeClass('col-xs-6');

							if (!$(`div.pasos div.paso-${i}`).hasClass('col-xs-4')) {
								$(`div.pasos div.paso-${i}`).addClass('col-xs-4');
							}
						}
					}

					helpers.modificarClase('ADD', '.carga-paso-cuotas', 'hidden');
					helpers.modificarClase('ADD', 'button.siguiente-cuota', 'deshabilitado');

                    helpers.modificarClase('REMOVE', '.paso-0', 'hidden');
					helpers.modificarClase('REMOVE', '.anterior-0', 'hidden');

                    if ($(".paso-3").hasClass('activo')) {
						helpers.cambiarPaso(3, 2);
						helpers.cambiarPaso(2, 1);
						helpers.cambiarPaso(1, 0);
                    }
                    
					if ($(".paso-2").hasClass('activo')) {
						helpers.cambiarPaso(2, 1);
						helpers.cambiarPaso(1, 0);
                    }

					if ($(".paso-1").hasClass('activo')) {
						helpers.cambiarPaso(1, 0);
					}
				}
			}
		};

		const modulo = {
			common: () => {
				// SE CLICKEA UNA OPCION A CARGAR
				$('div.metodo, div.tituloMetodo').click(function() {
					helpers.cambiarOpcion($(this).data('option'));
				});

				// SE ESCRIBE EL DATO DEL DESTINATARIO
				$('.inputDestinatario').keydown(function() {
                    helpers.modificarClase((this.value.length >= 5) ? 'REMOVE' : 'ADD', 'button.verificar', 'deshabilitado');
                    if (this.value.length >= 5) {
                        helpers.modificarClase('REMOVE', 'button.verificar', 'hidden');
                        helpers.modificarClase('ADD', 'button.siguiente-0', 'hidden');
                        helpers.activarElementos(false, 'ok');
                    }
                });


                $(".inputDestinatario").keypress( function() {
                    if (this.value.length >= 5) {
                        helpers.modificarClase('REMOVE', 'button.verificar', 'hidden');
                        helpers.modificarClase('ADD', 'button.siguiente-0', 'hidden');
                        helpers.activarElementos(false, 'ok');
                    }
                });

                // $(".inputDestinatario").change( function() {
                //     debugger
                // helpers.modificarClase((this.value.length >= 5) ? 'REMOVE' : 'ADD', 'button.verificar', 'deshabilitado');
                // if (this.value.length >= 5) {
                //     helpers.modificarClase('REMOVE', 'button.verificar', 'hidden');
                //     helpers.modificarClase('ADD', 'button.siguiente-0', 'hidden');
                //     helpers.activarElementos(false, 'ok');
                // }
                // });

				$('button.deshabilitado').click(function(e) {
					e.preventDefault();
                });

				// SE CLICKEA EL BOTON VERIFICAR
				$('button.verificar').click(function(e) {
                    alert("holaaa1");
					e.preventDefault();

					informacion.dato = $('div.active > div > .inputDestinatario')[0].value;
					if (informacion.tipo != '' && informacion.dato.length >= 5) {
                        helpers.verificar();
                    }
                }); 
						
				$('.siguiente-0').click(function() {
                    alert("holaaa2");
					helpers.cambiarPaso(0, 1);
				});
						
				$('.siguiente-1').click(function() {
                    alert(informacion.metodo);
					if (informacion.metodo != 0) {
						if (informacion.metodo != 77) {
							helpers.cambiarPaso(1, 2);
						} else if(informacion.metodo == 13){

                            Swal.fire({
                                title: 'Ha ocurrido un error',          
                                html: 'Ha ocurrido un error, intente mas tarde',
                                type: 'error',                                         
                                showCancelButton: false,           
                                showConfirmButton: true
                            });
                        }else{
							helpers.consultarDisponibleCreditel();
						}
					}
				});

				$('.siguiente-2').click(function() {
                    if(!$('.siguiente-2').hasClass('deshabilitado')){
                        if ($("div.wrapper").width() > 991) {
                            if (helpers.verificarCarga()) {
                                if (informacion.metodo != 77) {
                                    $("#documento").val(
                                        informacion.dato
                                    );
                                    informacion.IDmetodos = $("#IDmetodos").val();
                                    informacion.IDcuentas = $("#IDcuentas").val();
                                    $.ajax({
                                        type: "POST",
                                        url: "/carga/controlCargaOnline",
                                        dataType: 'json',
                                        data: {
                                            moneda: informacion.moneda,
                                            monto: informacion.monto,
                                            IDmetodos: informacion.IDmetodos,
                                            IDcuentas: informacion.IDcuentas
                                        },
                                        success: function (data) {
                                            if (data.error == 0) {
                                                $("#formCarga").submit(); 
                                            } else {
                                                Swal.fire(
                                                    'Aviso',
                                                    data.textoError,
                                                    'warning'
                                                );
                                            }
                                        },
                                    });
                                } else {
                                    helpers.consultarCuotasCarga(informacion.monto, informacion.moneda);
                                }
                            }
                        } else {
                            helpers.cambiarPaso(2, 3);
                            $("span.info.infoDocumento").html(informacion.tipo + " " +informacion.dato);
                            $("span.info.infoIniciales").html(informacion.iniciales);
                            $("span.info.infoBanco").html(informacion.metodoNombre);
                            $("span.info.infoMonto").html(((informacion.moneda == 858) ? "$" : "U$S") + informacion.monto);
                        }
                    }
                });

                $('.siguiente-3').click(function() {
                    if (helpers.verificarCarga()) {
                        if (informacion.metodo != 77) {
                            $("#documento").val(
                                informacion.dato
                            );
                            informacion.IDmetodos = $("#IDmetodos").val();
                            informacion.IDcuentas = $("#IDcuentas").val();
                            $.ajax({
                                type: "POST",
                                url: "/carga/controlCargaOnline",
                                dataType: 'json',
                                data: {
                                    moneda: informacion.moneda,
                                    monto: informacion.monto,
                                    IDmetodos: informacion.IDmetodos,
                                    IDcuentas: informacion.IDcuentas
                                },
                                success: function (data) {
                                    if (data.error == 0) {
                                        $("#formCarga").submit(); 
                                    } else {
                                        Swal.fire(
                                            'Aviso',
                                            data.textoError,
                                            'warning'
                                        );
                                    }
                                },
                            });
                        } else {
                            helpers.consultarCuotasCarga(informacion.monto, informacion.moneda);
                        }
                    }
				});

				$('.anterior-0').click(function() {
					helpers.cambiarPaso(1, 0);
				});
						
				$('.anterior-1').click(function() {
					helpers.cambiarPaso(2, 1);
                });
                
                $('.anterior-2').click(function() {
					helpers.cambiarPaso(3, 2);
				});

				$('.pago-medio').click(function() {
					helpers.cambiarMedioPago(this);
				});
						
				$("#monedaCarga, #montoCarga").change(function() {
					helpers.comprobarMonto(
						$("#monedaCarga").val(), 
						$("#montoCarga").val()
					);
                });

				$("#montoCarga").keyup(function() {
					helpers.comprobarMonto(
						$("#monedaCarga").val(), 
						$("#montoCarga").val()
					);
                });
			},

			logged: () => {
                helpers.modificarClase('ADD', '#btn-menu-carga', 'px-selected');
                $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged

                helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-md-6');
                helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-xs-6');
                helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-md-4');
                helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-xs-4');

                helpers.actualizarCotizacion();
                
                helpers.cambiarPaso(0, 1);
                helpers.modificarClase('ADD', 'div.row.paso-0', 'hidden');

				informacion.dato = $('#documento').val();
				informacion.iniciales = $('#iniciales').val();
                informacion.tipo = 'ci';
                
                $(".pasoNoCumplido-1").html("1");
                $(".pasoNoCumplido-2").html("2");

				$(".tabChanger").click(function() {
					helpers.cambiarOpcionCarga(this);
				});

				$("button.anterior-cuota").click(function() {
					helpers.modificarClase('REMOVE', '.carga-paso-2', 'hidden');
					helpers.modificarClase('ADD', '.carga-paso-cuotas', 'hidden');
					helpers.modificarClase('ADD', 'button.siguiente-cuota', 'deshabilitado');
				});

				$("button.siguiente-cuota").click(function() {
					$("#formCarga").submit();
				});

				$("#IDcuentasMultiple").change(function() {
					$("#IDcuentas").val($(this).val());
				});

				modulo.common();
			},

			logout: () => modulo.common()
		}
        
		if (Chukupax.logged == 1) {
			modulo.logged();
		} else {
			modulo.logout();
		}
	};
}


function registropaypal(){
    this.paso3 = function(){
        $("#departamento").change(function() {
            $("#spinner-loading").removeClass('hide-spinner');
            var o = $(this).val();
            $.ajax({
                url: "/usuarios/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                success: function(o) {
                    $("#localidad").html(o)
                    $("#spinner-loading").addClass('hide-spinner');
                },
                error: function(o) {
                    $("#localidad").html("")
                    $("#spinner-loading").addClass('hide-spinner');
                },
                type: "POST"
            })
        });
    }
    
    this.paso3n = function(){ 
        $("#departamento").change(function() {
            $("#spinner-loading").removeClass('hide-spinner');
            var o = $(this).val();
            $.ajax({
                url: "/usuarios/getCiudades",
                dataType: "json",
                data: {
                    departamento: o,
                    check: 1
                },
                success: function(o) {
                    $("#localidad").html(o)
                    $("#spinner-loading").addClass('hide-spinner');
                },
                error: function(o) {
                    $("#localidad").html("")
                    $("#spinner-loading").addClass('hide-spinner');
                },
                type: "POST"
            })
        });
    }
}

function solicitar(){
    function completarFDSolicitar(){
        $("#lc_chat_name").val($("#_nombre1").val() +" "+ $("#_apellido1").val());
        $("#lc_chat_email").val($("#_email").val());
        $("#lc_chat_phone").val($("#_documento").val());

        if ($("#lc_chat_phone").val() == '' ) {
            $("#lc_chat_phone").focus();
        }f

        if ($("#lc_chat_email").val() == '' ) {
            $("#lc_chat_email").focus();
        }
        
        if ($("#lc_chat_name").val() == ' ' ) {
            $("#lc_chat_name").focus();
        }
    }

    if (Chukupax.mid != 'solicitar.correcto') {
        $(document).ready(function() {
            setTimeout(function(){
                $("#lc_chat_layout").click(function(){
                    completarFDSolicitar();
                });
            }, 1000);
        });
    }

    this.init = function(){};

    this.paso1u = function(){
        $(document).ready(function() {
            $(".openFD").click(function(event) {
                var chat = $(".lc-header-bg");
                if (chat['0'] == undefined) {
                    var url = '/ayuda/2.1',
                    win = window.open(url, '_blank');
                    win.focus();
                } else {
                    completarFDSolicitar();
                    if($("#lc_chat_layout").attr("class") != 'lc-prechat lc-support-widget lc-expanded'){
                        $(".lc-header-bg").click();
                    }
                }
            });

            setTimeout(function(){
                $("#lc_chat_layout").click(function(){
                    completarFDSolicitar();
                });
            }, 1000);

            $('#documento').change(function(){
                console.log($('#documento').val());
                $.ajax({
                    url: "/solicitar/checkinfouser",
                    dataType: "json",
                    data: {
                        documento: $('#documento').val()
                    }, 
                    type: "POST",
                    success: function(o) {
                        if (o) {
                            Swal.fire({
                                title: 'Atención',
                                text: "Documento registrado como tarjeta prepago, redireccionando...",
                                type: 'info',
                                showCancelButton: false,
                                showconfirmButton: false
                            })

                            setTimeout(function(){
                                location.replace('/registro');
                            }, 4000);
                        }
                    },
                })
            });
        });
    }

    this.paso1e = function(){
        $(document).ready(function() {
            $(".openFD").click(function(event) {
                var chat = $(".lc-header-bg");
                if (chat['0'] == undefined) {
                    var url = '/ayuda/2.1',
                        win = window.open(url, '_blank');
                        win.focus();
                } else {
                    completarFDSolicitar();
                    if($("#lc_chat_layout").attr("class") != 'lc-prechat lc-support-widget lc-expanded'){
                        $(".lc-header-bg").click();
                    }
                }
            });

            setTimeout(function(){
                $("#lc_chat_layout").click(function(){
                    completarFDSolicitar();
                });
            }, 1000);

            $('#documento').change(function(){
                console.log($('#documento').val());
                $.ajax({
                    url: "/solicitar/checkinfouser",
                    dataType: "json",
                    data: {
                        documento: $('#documento').val()
                    }, 
                    type: "POST",
                    success: function(o) {
                        if (o) {
                            Swal.fire({
                                title: 'Atención',
                                text: "Documento registrado como tarjeta prepago, redireccionando...",
                                type: 'info',
                                showCancelButton: false,
                                showconfirmButton: false
                            })

                            setTimeout(function(){
                                location.replace('/registro');
                            }, 4000);
                        }
                    },
                })
            });
            
        });
    }

    this.paso2 = function(){
        $(document).ready(function() {
            setTimeout(function(){
                $("#lc_chat_layout").click(function(){
                    completarFDSolicitar();
                });
            }, 1000);
        });
    }

    this.envio = function(){
        var sucursalseleccionada = '';
        $(document).ready(function() {
            setTimeout(function(){
                $("#lc_chat_layout").click(function(){
                    completarFDSolicitar();
                });
            }, 1000);

            sucursales($("#departamento").val());
            cargarlocalidades($('#departamento').val(),0);
        });

        /* -------------------------- */

        $('.sucursaltipo').click(function(){
            sucursalseleccionada = $(this).data('sucursal');
            seccion('agencias');
            cargarlocalidades($('#departamento').val(),$(this).data('sucursal')); 
            agencias( $(this).data('sucursal') , $( ".combolocalidades" ).val() );
            $(".departamentotitulo").empty();
            $('.departamentotitulo').append($('#departamento option:selected').text().trim());
        });

        $('.agenciatipo').click(function(){ // se selecciona agencia
            $('.agenciatipo').addClass('hidden');
            $(this).removeClass('hidden');
            $(this).addClass('agenciaseleccionada');
            $('.btnagenciaseleccionada').removeClass('hidden');
            $('.seleccionaunaopcion').addClass('hidden');
            $('#agencia').val($(this).data('agencia'));
            $('#continuaragencia').attr('disabled',false);
            $('#continuaragencia').removeClass('btndesactivado');

            $('#flechaback3').addClass('hidden');
            $('#flechabacksucursal').addClass('hidden');

            if (sucursalseleccionada == '1' || sucursalseleccionada == '2' || sucursalseleccionada == '3') {
                sucursalseleccionada = $(this).data('agencia');
                $('#sucursal').val($(this).data('agencia'));
            } else {
                $('#agencia').val($(this).data('agencia')); 
            }
        });


        $('#flechabacksucursal').click(function(){
            seccion('sucursales');
            $('#continuaragencia').attr('disabled',true);
            $('#continuaragencia').addClass('btndesactivado');
        });

        $('.btncambiaragencia').click(function(){
            seccion('agencias');
            agencias(sucursalseleccionada,$( ".combolocalidades" ).val());
            $('.agenciatipo').removeClass('agenciaseleccionada');
            $('#continuaragencia').attr('disabled',true);
            $('#continuaragencia').addClass('btndesactivado');
            $('#flechaback3').addClass('hidden');
            $('#flechabacksucursal').removeClass('hidden');
        })

        $('.combolocalidades').change(function(){
            agencias(sucursalseleccionada,$( this ).val());
        })

        
        $("#departamento").change(function() {
            sucursales($(this).val());

            $("#spinner-loading").removeClass('hide-spinner');
            var o = $(this).val();
            $.ajax({
                url: "/usuarios/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                success: function(data) {
                    $("#spinner-loading").addClass('hide-spinner');
                    $(".departamentotitulo").empty();
                    $('.departamentotitulo').append($('#departamento option:selected').text().trim());
                },
                error: function(data) {
                    $("#spinner-loading").addClass('hide-spinner');
                },
                type: "POST"
            })
        })

        function cargarlocalidades(departamento,sucursal){
            sucursales(departamento);

            $("#spinner-loading").removeClass('hide-spinner'); 
            $.ajax({
                url: "/usuarios/getCiudadessolicitar",
                dataType: "json",
                data: {
                    departamento: departamento,
                    sucursal: sucursal
                },
                async: false,
                success: function(data) {
                    console.log(data);
                    $("#localidadmoba").html(data)
                    $("#localidadmobb").html(data)
                    $("#spinner-loading").addClass('hide-spinner');
                    $(".departamentotitulo").empty();
                    $('.departamentotitulo').append($('#departamento option:selected').text().trim());
                },
                error: function(data) {
                    $("#localidadmoba").html("")
                    $("#localidadmobb").html("")
                    $("#spinner-loading").addClass('hide-spinner');
                },
                type: "POST"
            })
        }



        function seccion(seccion){
            switch(seccion){
                case 'sucursales':
                    $('.agencias').addClass('hidden');
                    $('.sucursales').removeClass('hidden');
                    $('#flechaback3').removeClass('hidden');
                    $('#flechabacksucursal').addClass('hidden');
                    sucursales($("#departamento").val());
                    $('.btnagenciaseleccionada').addClass('hidden');
                    $('.seleccionaunaopcion').removeClass('hidden');
                break;
                case 'agencias':
                    $('.agencias').removeClass('hidden');
                    $('.agenciatipo').removeClass('hidden');
                    $('.sucursales').addClass('hidden');
                    $('#flechaback3').addClass('hidden');
                    $('#flechabacksucursal').removeClass('hidden');
                    $('.btnagenciaseleccionada').addClass('hidden');
                    $('.seleccionaunaopcion').removeClass('hidden');
                break;
            }
        }

        function sucursales(departamento){
            switch(departamento){
                case '1':
                    $('.fortex').removeClass('hidden');
                    $('.abitab').removeClass('hidden');
                    $('.domicilio').removeClass('hidden');
                    $('.correo').addClass('hidden');
                break;
                case '10':
                    $('.fortex').addClass('hidden');
                    $('.abitab').removeClass('hidden');
                    $('.domicilio').removeClass('hidden');
                    $('.correo').removeClass('hidden');
                break;
                default:
                    $('.fortex').addClass('hidden');
                    $('.abitab').removeClass('hidden');
                    $('.domicilio').removeClass('hidden');
                    $('.correo').removeClass('hidden');
                break;
            }
        }

        function agencias(sucursal,barrio){
            $('#sucursal').val(sucursal);

            switch(sucursal){
                case 1:
                    $('.menuagenciasfortex').removeClass('hidden');
                    $('.menuagenciasabitab').addClass('hidden');
                    $('.menuagenciascorreo').addClass('hidden');
                    $('.menuagenciasdomicilio').addClass('hidden');
                break;
                case 6:
                    $('.menuagenciasfortex').addClass('hidden');
                    $('.menuagenciasabitab').addClass('hidden');
                    $('.menuagenciascorreo').addClass('hidden');
                    $('.menuagenciasdomicilio').removeClass('hidden');
                    $('#continuaragencia').attr('disabled',false);
                    $('#continuaragencia').removeClass('btndesactivado');
                    $('#departamentoe option[value="10"]').remove();
                break;
                case 10:
                    $('.menuagenciasfortex').addClass('hidden');
                    $('.menuagenciasabitab').addClass('hidden');
                    $('.menuagenciascorreo').removeClass('hidden');
                    $('.menuagenciasdomicilio').addClass('hidden');

                    $(".agenciascorreo").each(function() {
                        if ($(this).data('departamento').trim().toUpperCase() == $('#departamento option:selected').text().trim().toUpperCase() && $(this).data('barrio').trim().toUpperCase() == barrio.trim().toUpperCase()) {
                            $( this ).removeClass( "hidden" );
                        } else {
                            $( this ).addClass( "hidden" );
                        }
                    });
                break;
                case 12:
                    $('.menuagenciasfortex').addClass('hidden');
                    $('.menuagenciasabitab').removeClass('hidden');
                    $('.menuagenciascorreo').addClass('hidden');
                    $('.menuagenciasdomicilio').addClass('hidden');

                    $(".agenciasabitab").each(function() {
                        if ($(this).data('departamento').trim().toUpperCase() == $('#departamento option:selected').text().trim().toUpperCase() && $(this).data('barrio').trim().toUpperCase() == barrio.trim().toUpperCase()) {
                            $( this ).removeClass( "hidden" );
                        } else {
                            $( this ).addClass( "hidden" );
                        }
                    });
                break 
            }

        }
    
        /* ------------- */

        function seleccionarPanel(parent, method){
            $(parent + " .panel-blue").css({
                'border-color': 'rgb(50, 186, 124)'
            });

            $(parent + " .panel-heading").css({
                'color': '#fff',
                'background-color': 'rgb(50, 186, 124)'
            });

            $(method).removeClass('hidden', function(){
                $(method).fadeIn('slow');
            });
        }

        function quitarPaneles(parent1, method1, parent2, method2, parent3, method3){
            $(method1).addClass('hidden');
            $(method2).addClass('hidden');
            $(method3).addClass('hidden');

            $(parent1 + " .panel-blue").css({'border-color': 'rgb(255, 255, 255)'});
            $(parent2 + " .panel-blue").css({'border-color': 'rgb(255, 255, 255)'});
            $(parent3 + " .panel-blue").css({'border-color': 'rgb(255, 255, 255)'});

            $(parent1 + " .panel-heading").css({'color': '#000', 'background-color': 'rgb(255, 255, 255)'});
            $(parent2 + " .panel-heading").css({'color': '#000', 'background-color': 'rgb(255, 255, 255)'});
            $(parent3 + " .panel-heading").css({'color': '#000', 'background-color': 'rgb(255, 255, 255)'});

            var styleActiva = 'border: 7px solid rgb(29, 177, 0)',
                styleInactiva = 'border: 2px dashed #DDD',
                style = '';

            style = styleInactiva + ';padding: 0px;margin: 5px;width: 30%;text-align: left;background-color: rgba(0,0,0,0.4);box-shadow: inset 0px 0px 90px rgba(0, 0, 0, .3);';

            $("#cont-panel-pocitos").attr('style', style);
            $("#cont-panel-central").attr('style', style);
            $("#cont-panel-cordon").attr('style', style);
        }

        function marcarFortex(elemento){
            var styleActiva = 'border: 7px solid rgb(29, 177, 0)',
                styleInactiva = 'border: 2px dashed #DDD',
                style = '';

            $("#sucursal").val($(elemento).data("sucursal"));
            $("#agencia").val('');

            switch(elemento){
                case '#cont-panel-cordon > a':
                    style = styleActiva + ';padding: 0px;margin: 5px;width: 30%;text-align: left;background-color: rgba(0,0,0,0.4);box-shadow: inset 0px 0px 90px rgba(0, 0, 0, .3);';
                    $('#cont-panel-cordon').attr('style', style);

                    style = styleInactiva + ';padding: 0px;margin: 5px;width: 30%;text-align: left;background-color: rgba(0,0,0,0.4);box-shadow: inset 0px 0px 90px rgba(0, 0, 0, .3);';
                    $("#cont-panel-pocitos").attr('style', styleInactiva);
                    $("#cont-panel-central").attr('style', styleInactiva);
                    break;
                case '#cont-panel-pocitos > a':
                    style = styleActiva + ';padding: 0px;margin: 5px;width: 30%;text-align: left;background-color: rgba(0,0,0,0.4);box-shadow: inset 0px 0px 90px rgba(0, 0, 0, .3);';
                    $('#cont-panel-pocitos').attr('style', style);

                    style = styleInactiva + ';padding: 0px;margin: 5px;width: 30%;text-align: left;background-color: rgba(0,0,0,0.4);box-shadow: inset 0px 0px 90px rgba(0, 0, 0, .3);';

                    $("#cont-panel-central").attr('style', style);
                    $("#cont-panel-cordon").attr('style', style);
                    break;
                case '#cont-panel-central > a':
                    style = styleActiva + ';padding: 0px;margin: 5px;width: 30%;text-align: left;background-color: rgba(0,0,0,0.4);box-shadow: inset 0px 0px 90px rgba(0, 0, 0, .3);';
                    $('#cont-panel-central').attr('style', style);
                    
                    style = styleInactiva + ';padding: 0px;margin: 5px;width: 30%;text-align: left;background-color: rgba(0,0,0,0.4);box-shadow: inset 0px 0px 90px rgba(0, 0, 0, .3);';

                    $("#cont-panel-pocitos").attr('style', style);
                    $("#cont-panel-cordon").attr('style', style);
                    break;
            }
        }

        // Mostrar Fortex
        $("#btnSucursalesFortex").click(function() {
            quitarPaneles(
                "#btnpickupcorreo", "#method-correo", 
                "#btnEntregaDomicilio", "#method-domicilio",
                "#btnEntregaAbitab", "#method-abitab"
            );
            seleccionarPanel('#btnSucursalesFortex', '#method-fortex');
            $("#sucursal").val('');
            $("#agencia").val('');
        });

        $("#cont-panel-cordon").click(function() {
            marcarFortex("#cont-panel-cordon > a");
        });
        
        $("#cont-panel-pocitos").click(function() {
            marcarFortex("#cont-panel-pocitos > a");
        });
        $("#cont-panel-central").click(function() {
            marcarFortex("#cont-panel-central > a");
        });

        // Mostrar Domicilio
        $("#btnEntregaDomicilio").click(function() {
            quitarPaneles(
                "#btnpickupcorreo", "#method-correo", 
                "#btnSucursalesFortex", "#method-fortex",
                "#btnEntregaAbitab", "#method-abitab"
            );
            seleccionarPanel('#btnEntregaDomicilio', '#method-domicilio');

            $("#sucursal").val($(this).data("sucursal"));
            $("#agencia").val('');
        });

        // Mostrar PickUp
        $("#btnpickupcorreo").click(function() {
            quitarPaneles(
                "#btnpickupcorreo", "#method-correo", 
                "#btnSucursalesFortex", "#method-fortex",
                "#btnEntregaAbitab", "#method-abitab"
            );
            $("#sucursal").val($(this).data("sucursal")),
            $("#agencia").val(''),
            $("#pickupcorreoDialog").dialog({
                modal: true,
                width: "80%",
                height: 500,
                draggable: true,
                resizable: false
            });

            $("#lc_chat_layout").css({
                'z-index': '100'
            });
        });

        $("#agenciascorreo tr.rowagc").click(function() {
            $("#spinner-loading").removeClass('hide-spinner');
            $("body").removeClass('overflow-y-scroll');

            $("#agencia").val($(this).data("agencia")),
            $.ajax({
            	url: Chukupax.basePath + "/usuarios/getAgencia_pickupcorreo/" + $(this).data("agencia"),
            	type: 'GET',
            	dataType: 'json'
            })
            .done(function(data) {
            	if (data.error == "ok") {
                    $("#agenciacorreoSeleccionada").html(data.html)
            	}

            	$("#pickupcorreoDialog").dialog("close"),
            	quitarPaneles(
                    "#btnEntregaDomicilio", "#method-domicilio", 
                    "#btnSucursalesFortex", "#method-fortex",
                    "#btnEntregaAbitab", "#method-abitab"
                ),
                seleccionarPanel('#btnpickupcorreo', '#method-correo')
            })
            .fail(function() {
            })
            .always(function() {
            	$("#spinner-loading").addClass('hide-spinner');
                $("body").addClass('overflow-y-scroll');
            });
        });

        $("div.col-md-12.remover-padding.text-center.method-correo > center > a").click(function() {
            $("#btnpickupcorreo").click();
        });

        $("#agenciascorreo").DataTable({
            oLanguage: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Busque aquí ingresando departamento, barrio o localidad:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior"
                },
                oAria: {
                    sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending: ": Activar para ordenar la columna de manera descendente"
                }
            },
            bPaginate: false,
            aaSorting: [
                [1, "asc"],
                [2, "asc"],
                [3, "asc"]
            ]
        });

        // Mostrar Abitab
        $("#btnEntregaAbitab").click(function() {
            quitarPaneles(
                "#btnpickupcorreo", "#method-correo", 
                "#btnSucursalesFortex", "#method-fortex",
                "#btnEntregaAbitab", "#method-abitab"
            );
            $("#sucursal").val($(this).data("sucursal")),
            $("#agencia").val(''),
            $("#abitabDialog").dialog({
                modal: true,
                width: "80%",
                height: 500,
                draggable: true,
                resizable: false
            });

            $("#lc_chat_layout").css({
                'z-index': '100'
            });
        });

        $("#agenciasabitab tr.rowagc").click(function() {
            $("#spinner-loading").removeClass('hide-spinner');
            $("body").removeClass('overflow-y-scroll');

            $("#agencia").val($(this).data("agencia")),
            $.ajax({
            	url: Chukupax.basePath + "/usuarios/getAgencia_abitab/" + $(this).data("agencia"),
            	type: 'GET',
            	dataType: 'json'
            })
            .done(function(data) {
            	if (data.error == "ok") {
                    $("#agenciaAbitabSeleccionada").html(data.html)
            	}

            	$("#abitabDialog").dialog("close"),
            	quitarPaneles(
                    "#btnEntregaDomicilio", "#method-domicilio", 
                    "#btnSucursalesFortex", "#method-fortex",
                    "#btnpickupcorreo", "#method-correo"
                ),
                seleccionarPanel('#btnEntregaAbitab', '#method-abitab')
            })
            .fail(function() {
            })
            .always(function() {
            	$("#spinner-loading").addClass('hide-spinner');
                $("body").addClass('overflow-y-scroll');
            });
        });

        $("#method-abitab > center > a").click(function() {
            $("#btnEntregaAbitab").click();
        });

        $("#agenciasabitab").DataTable({
            oLanguage: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Busque aquí ingresando departamento, barrio o localidad:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior"
                },
                oAria: {
                    sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending: ": Activar para ordenar la columna de manera descendente"
                }
            },
            bPaginate: false,
            aaSorting: [
                [1, "asc"],
                [2, "asc"],
                [3, "asc"]
            ]
        });

        
        $("#departamentoe").change(function() {
            var o = $(this).val();
            $.ajax({
                url: "/solicitar/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                beforeSend: function(){
                	$("#spinner-loading").removeClass('hide-spinner');
                	$("#spinner-loading").css('position', 'fixed');
                },
                success: function(o) {
                    $("#localidade").html(o)
                	$("#spinner-loading").addClass('hide-spinner');
                	$("#spinner-loading").css('position', 'absolute');
                },
                error: function(o) {
                    $("#localidade").html("")
                },
                type: "POST"
            })
        });
    }

    this.paso3 = function(){
        $("#departamento").change(function() {
            $("#spinner-loading").removeClass('hide-spinner');
            var o = $(this).val();
            $.ajax({
                url: "/usuarios/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                success: function(o) {
                    $("#localidad").html(o)
                    $("#spinner-loading").addClass('hide-spinner');
                },
                error: function(o) {
                    $("#localidad").html("")
                    $("#spinner-loading").addClass('hide-spinner');
                },
                type: "POST"
            })
        })
    }
}

function notificaciones(){
    this.init = function (){
        $("#btn-menu-notificaciones").addClass('px-selected');
        $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged

        $(".deleteNotification").click(function(){
            $("#spinner-loading").removeClass('hide-spinner');
            $.ajax({
                url: '/notificaciones/markNotification',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: $(this).data('id')
                },
            }).done(function(data) {
                switch(data.error){
                    case 0:
                        location.reload();
                    break;
                    default:
                        $("#spinner-loading").addClass('hide-spinner');
                        swal({
                            title: 'Ha ocurrido un error al eliminar la notificaicón',
                            type: "error",
                            text: '[E:'+data.error+'] Comuniquese con un administrador',
                            confirmButtonText: "Ok",
                            closeOnConfirm: true,
                        });
                    break;
                }
            }).fail(function() {
                $("#spinner-loading").addClass('hide-spinner');
                swal({
                    title: 'Ha ocurrido un error al elminar la notificaicón',
                    type: "error",
                    text: 'Comuniquese con un administrador',
                    confirmButtonText: "Ok",
                    closeOnConfirm: true,
                });
            });
        });
    }
}


function paypalprex(){
    this.init = function() {
        var tipo = 'NEGOCIO';

        $('#btn_formulario').click(function(){
            document.body.scrollTop = 0; // Safari.
            document.documentElement.scrollTop = 0; // Los demás navegadores.
        })


        $('#btn_negocio').click(function(){
            $('.empresa').show();
            tipo = 'NEGOCIO';

            $("#btn_persona").css("background-color","white");
            $("#btn_persona").css("color","#AFAFAF");
            $("#btn_persona").css("border-color","#AFAFAF");
            $("#img_persona").attr("src","/assets/prex/img/paypalprex/personanone.png");

            $("#btn_negocio").css("background-color","#3498DB");
            $("#btn_negocio").css("color","white");
            $("#btn_negocio").css("border-color","white");
            $("#img_negocio").attr("src","/assets/prex/img/paypalprex/negociook.png");
        });

        $('#btn_persona').click(function(){
            $('.empresa').hide();
            tipo = 'PERSONA';

            $("#btn_negocio").css("background-color","white");
            $("#btn_negocio").css("color","#AFAFAF");
            $("#btn_negocio").css("border-color","#AFAFAF");
            $("#img_negocio").attr("src","/assets/prex/img/paypalprex/negocionone.png");

            $("#btn_persona").css("background-color","#3498DB");
            $("#btn_persona").css("color","white");
            $("#btn_persona").css("border-color","white");
            $("#img_persona").attr("src","/assets/prex/img/paypalprex/personaok.png");
        });

        /* 
        background-color: white;
                color: #AFAFAF;
                border-color: #AFAFAF;*/

        $('#btn_enviar').click(function(){
            var nombre = $('#input_nombre').val();
            var empresa = $('#input_empresa').val();
            var mail = $('#input_mail').val();
            var telefono = $('#input_telefono').val();

            if ( nombre == '' ||  mail == '' || telefono == '' || (empresa == '' && tipo == 'NEGOCIO') ) {
                
                Swal.fire({
                    title: '',
                    text: "Todos los campos son obligatorios",
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Ok'
                })
                /*
                swal({
                    title: '',
                    type: "error",
                    text: 'Todos los campos son obligatorios',
                    confirmButtonText: "Ok",
                    closeOnConfirm: true,
                });*/
            } else {

                if (caracteresCorreoValido(mail)) {

                    $.ajax( {
                        url: '../index.html?mid=paypalprex&func=ingresarmensaje',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            nombre: nombre,
                            empresa: empresa,
                            mail: mail,
                            telefono: telefono,
                            tipo: tipo
                        },
                    }).done( function( data ) {
                        if (data.error == 0) {
                            $('#formulario_OK').show();
                            $('#formulario_negocio').hide();
                        } else {
                            
                            Swal.fire({
                                title: '',
                                text: "Ocurrio un error al intentar ingresar el formulario.<br>Intente nuevamente por favor.",
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Ok'
                            })

                            /*
                            swal({
                                title: '',
                                type: "error",
                                text: 'Ocurrio un error al intentar ingresar el formulario.Intente nuevamente por favor.',
                                confirmButtonText: "Ok",
                                closeOnConfirm: true,
                            });
                            */
                        }
                    });
            
                } else {

                    Swal.fire({
                                title: '',
                                text: "Formato de correo incorrecto.",
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Ok'
                            })

                    /*
                    swal({
                        title: '',
                        type: "error",
                        text: 'Formato de correo incorrecto.',
                        confirmButtonText: "Ok",
                        closeOnConfirm: true,
                    });*/
                }                
            }

        })
    }

    function caracteresCorreoValido(email){
        //var email = $(email).val();
        var caract = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);

        if (caract.test(email) == false){
            return false;
        }else{
            return true;
        }
    }
}

function paypal(){
    this.init = function() {
        if (Chukupax.logged == 0) {
            $.ajax({   
                type: "post",
                url: Chukupax.basePath + "/webservice/getPreguntasFrecuentesPayPal",                        
                dataType: "json",

                success:function(data){  
                    var preguntasFrecuentes = '';
                    $.each(data, function(index, value) { //Modulo
                        if(value.nombre=="Prex a Prex: traspaso de dinero") {                              
                            preguntasFrecuentes = preguntasFrecuentes + '<a name="faqMoneda" id="a"></a>';
                        }
                        preguntasFrecuentes = preguntasFrecuentes + '<h4><a href="javascript:void(0);" onclick="Faqs($(this));" class="seccionFaqs" target="_self" title="Ver preguntas de sección"><img src="https://prexcard.s3.us-east-1.amazonaws.com/web/assets/icoDesplegar.png" alt="Desplegar" width="40"/> ' + value.nombre + '</a></h4><div class="boxPreguntas" style="display: none;">';

                        $.each(value.item, function(index2, value2) { //Pregunta                                
                            preguntasFrecuentes = preguntasFrecuentes + '<a href="javascript:void(0);" class=pregunta_frecuente onclick="MostrarRespuestas(' + "'" + "p.mostrarResps" + index2 + "'" + ')" >' + value2.nombre + '</a> <p>';
                            $.each(value2.item, function(index3, value3) { //Respuesta
                                preguntasFrecuentes = preguntasFrecuentes + '<p class="mostrarResps' + index2 + '" style="display:none" >' + value3 + '</p>';
                            });                                
                        });
                        preguntasFrecuentes = preguntasFrecuentes + '</div>';
                    });                        
                    $("#getPreguntasFrecuentes").html(preguntasFrecuentes);
                    $("#spinner-loading").addClass('hide-spinner');
                }
            });
			
            let _DOM_monto_quiero = $("#monto_quiero");
            var _commission_to_prex = $("#_comision").val();

            // $.ajax({
            //     url: '/paypal/get_comision',
            //     type: 'POST',
            //     dataType: 'json',
            //     data: {},
            // }).done(function(data) {
            //     _commission_to_prex = data.comision;
            // });

            _DOM_monto_quiero.keyup(function() {
                $(this).check('1234567890.,');
                _calcularMonto(_DOM_monto_quiero);
            });

            $("input[type='radio'][name='metodo']").change(function() {
                if ($(this).val() == 'P') {
                    $("#box-promo").show();
                } else {
                    $("#box-promo").hide();
                }
                _calcularMonto(_DOM_monto_quiero);
            });
            
            $("input[type='radio'][name='moneda']").change(function() {
                _calcularMonto(_DOM_monto_quiero);
            });

            function _calcularMonto(input){
                let value_quiero = input.val(),
                    value_moneda = $("input[type='radio'][name='moneda']:checked").val(),
                    value_metodo = $("input[type='radio'][name='metodo']:checked").val(),
                    value_comision_base = _commission_to_prex,
                    value_iva_base = 0.22,
                    value_comision_base_sin_iva = 8,
                    value_cotizacion_compra = $("#_cotizacion_compra").val(),
                    value_cotizacion_venta = $("#_cotizacion_venta").val(),
                    value_cotizacion = 0,
                    value_porcent = 0,
                    _DOM_description_commission = $(".description_commission"),
                    _DOM_description_commission1= $(".description_commission1");
                    _DOM_alert_box = $("#alert-box");

                if(value_metodo == 'P'){
                    value_comision_base /= 2;
                    value_comision_base_sin_iva = 4;
                }

                $("#monto_comission_content").text("Monto de la comisión USD "+value_comision_base_sin_iva+" + IVA.");

                input.val(input.val().replace(",",".").replace(' ','')); 
                _DOM_alert_box.css({visibility: 'hidden'});

                if (value_moneda == 858) {
                    $(".show-cambio-usd").show();
                    value_cotizacion = value_cotizacion_compra;
                } else if (value_moneda == 840) {
                    $(".show-cambio-usd").hide();
                    value_cotizacion = 1;
                } else {
                    _DOM_alert_box.html('La moneda seleccionada no es correcta.');
                    _DOM_alert_box.css({visibility: 'visible'});	
                }

                if (value_quiero < 20) {
                    _DOM_alert_box.html('El monto mínimo de operación es de USD 20.');
                    _DOM_alert_box.css({visibility: 'visible'});
                }

                if (value_quiero > 2000) {
                    _DOM_alert_box.html('El monto máximo por operación es de USD 2000.');
                    _DOM_alert_box.css({visibility: 'visible'});
                }

                console.log(value_quiero);
                console.log(value_comision_base);
                console.log(value_cotizacion);
                value_porcent = (value_quiero - value_comision_base ) * value_cotizacion;
                if (value_quiero < 20 || value_quiero > 2000) {
                    $("#monto_porcent").val('');
                } else {
                    $("#monto_porcent").val(value_porcent.toFixed(2));
                }
            }
        } else {
            if ($("#sincronizarPP").hasClass('btnActivarSpinner')) {
                $("#sincronizarPP").removeClass('btnActivarSpinner');
            }
            
            $("#aceptar_terminos").click(function(){
                $.ajax({
                    url: '/paypal/aceptarterminos',
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                }).done(function(data) {
                    $("#spinner-loading").addClass('hide-spinner');
                    if(data.error == 0) {
                        document.getElementById("overlay-terminos").style.display  = 'none';
                        document.getElementById("btn-form-terminos").style.display = 'none';
                        document.getElementById("dialogTerminosPP").style.display  = 'none';
                        

                        Swal.fire({
                            title: '¡Perfecto!',
                            text: "Has aceptado correctamente los términos y condiciones.",
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'Continuar'
                        }).then(result => {
                            if (result.value) {
                                tieneTerminos = 1;
                                $("#btnsincronizarPP").click();
                            }
                        })
                    } else {
                        document.getElementById("overlay-terminos").style.display  = 'block';
                        document.getElementById("btn-form-terminos").style.display = 'block';
                        document.getElementById("dialogTerminosPP").style.display  = 'block';
                        Swal.fire(
                            'Error!',
                            'Error al aceptar los terminos y condiicones',
                            'error'
                        )
                    }
                });
            });
            
            $("#showFilters").click(function() {
                $(this).hide()
                $("#hideFilters").show();
                $(".floating-submenu").show();
                $.scrollTo(0, 500);
            }); 

            $("#hideFilters").click(function() {
                $(this).hide();
                $("#showFilters").show();
                $(".floating-submenu").hide();
            });
            
            $("#sincronizarPP").click(function(event) {
                $("#btnsincronizarPP").click();
            });

            if ($("#sync_pp").val() == 1) {
                $("#check_pp_sync").removeClass('hidden');
                $("#sincronizarPP").removeClass('btn-pp');
                $("#vincularCuentaBanco").click(function(event) {
                    $("#addBank").show();
                    $(".alertVincularBank").addClass('animationShow');
                    setTimeout(function(){
                        if($(".alertVincularBank").hasClass('animationShow')){
                            $(".alertVincularBank").removeClass('animationShow');
                        }
                    }, 300);
                });

                $(document).keyup(function(e) {
                    if (e.keyCode == 27) {
                        $("#addBank").hide();
                    }
                });

                $(".vincularBankoverlay").click(function() {
                    $("#addBank").hide();
                });
            }

            var _DOM_formMov = $("#formMov");
            $("#cant_mov").change(function() {
                $("#spinner-loading").removeClass('hide-spinner');
                _DOM_formMov.submit();
            });

            $("#fecdesde").datepicker({
                changeMonth: true,
                changeYear: true,
                defaultDate: "-15d",
                maxDate: "d",
                dateFormat: 'dd/mm/yy'
            });

            $("#fechasta").datepicker({
                changeMonth: true,
                changeYear: true,
                defaultDate: "d",
                maxDate: "d",
                dateFormat: 'dd/mm/yy'
            });

            $(".btnMostrarInfoDestino").click(function(){

                var linea_banco = '';
                if ($(this).data('banco') != 0) {
                    linea_banco = `
                        <br><b>Nombre beneficiario:</b> ${$(this).data('beneficiario')} <br>
                        <br><img src="/prexpal/assets/retiro/img/${$(this).data('banco')}.png" width="100"><br>
                    `;
                }

                var texto_fecha = 'Fecha a pagar',
                    texto_monto = 'Monto a recibir',
                    swal_type   = 'info',
                    estado      = $(this).data('estado');

                switch (estado) {
                    case 'Completado':
                        texto_fecha = 'Fecha de pago',
                        texto_monto = 'Monto recibido',
                        swal_type   = 'success';

                        var swal_html = `
                            <b>${texto_fecha}:</b> ${$(this).data('fechaapagar')}<br><br>
                            <b>${texto_monto}:</b> ${$(this).data('moneda')} ${$(this).data('montorecibir')}<br>
                            ${linea_banco}
                            <br><b>Cuenta destino:</b> ${$(this).data('nrocuenta')}<br>
                        `;
                    break;

                    case 'Ingresado':
                    case 'Aprobado':
                    case 'Enviado':
                    case 'Procesando':
                    case 'Pendiente cumplimiento':
                        texto_fecha = 'Fecha a pagar',
                        texto_monto = 'Monto a recibir',
                        swal_type   = 'info';

                        var swal_html = `
                            <b>${texto_fecha}:</b> ${$(this).data('fechaapagar')}<br><br>
                            <b>${texto_monto}:</b> ${$(this).data('moneda')} ${$(this).data('montorecibir')}<br>
                            ${linea_banco}
                            <br><b>Cuenta destino:</b> ${$(this).data('nrocuenta')} <br>
                        `;
                    break;

                    default:
                        texto_fecha = 'Fecha',
                        texto_monto = 'Monto',
                        swal_type = 'info';

                        var swal_html = `
                            <b>${texto_fecha}:</b> ${$(this).data('fechaestado')}<br><br>
                            <b>${texto_monto}:</b> ${$(this).data('moneda')} ${$(this).data('montorecibir')}<br>
                            ${linea_banco}
                            <br><b>Cuenta destino:</b> ${$(this).data('nrocuenta')}<br>
                        `;
                    break;
                }

                Swal.fire({
                    title: 'Información de Destino',
                    html: swal_html,
                    type: swal_type,
                    confirmButtonText: "Volver",
                    allowOutsideClick: true
                })
            });
            
            $("#ver_info").click(function(){
                Swal.fire({
                    title: '',
                    html: '<div class="col-md-12 video-container"><iframe src="https://www.youtube.com/embed/8hEBdk1vZbU?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="iframe-video"></iframe></div>',
                    animation: false,
                    confirmButtonText: "Cerrar"
                });
            });

            $("#btn-menu-movpp").addClass('px-selected');
            $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        }
    }
    
    this.syncOk = function(){
        window.location.replace('/paypal');
    }
    
    this.soporte = function(){
        $("#btn-menu-soportepp").addClass('px-selected');
        $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
    }

    this.informacion = function(){
        $.ajax({   
            type: "post",
            url: Chukupax.basePath + "/webservice/getPreguntasFrecuentesPayPal",                        
            dataType: "json",

            success:function(data){  
                var preguntasFrecuentes = '';
                $.each(data, function(index, value) { //Modulo
                    if(value.nombre=="Prex a Prex: traspaso de dinero") {                              
                        preguntasFrecuentes = preguntasFrecuentes + '<a name="faqMoneda" id="a"></a>';
                    }
                    preguntasFrecuentes = preguntasFrecuentes + '<h4><a href="javascript:void(0);" onclick="Faqs($(this));" class="seccionFaqs" target="_self" title="Ver preguntas de sección"><img src="https://de2aqb3kqoyo2.cloudfront.net/web/icoDesplegar.png" alt="Desplegar" width="40"/> ' + value.nombre + '</a></h4><div class="boxPreguntas" style="display: none;">';

                    $.each(value.item, function(index2, value2) { //Pregunta                                
                        preguntasFrecuentes = preguntasFrecuentes + '<a href="javascript:void(0);" class=pregunta_frecuente onclick="MostrarRespuestas(' + "'" + "p.mostrarResps" + index2 + "'" + ')" >' + value2.nombre + '</a> <p>';
                                                                                                   //A mostrarRespuestas le paso como parametro, en lugar de una pergunta: el texto motrarResps+ el nro de pregunta
                                                                                                   //Ese es el nombre de la clase que se le asigna al p que se está creando
                        $.each(value2.item, function(index3, value3) { //Respuesta
                            preguntasFrecuentes = preguntasFrecuentes + '<p class="mostrarResps' + index2 + '" style="display:none" >' + value3 + '</p>';
                        });                                
                    });
                    preguntasFrecuentes = preguntasFrecuentes + '</div>';
                });                        
                $("#getPreguntasFrecuentes").html(preguntasFrecuentes);
                $("#spinner-loading").addClass('hide-spinner');
            }
        });

        let _DOM_monto_quiero = $("#monto_quiero");
        var _commission_to_prex = $("#_comision").val();

        $.ajax({
            url: '/paypal/get_comision',
            type: 'POST',
            dataType: 'json',
            data: {},
        }).done(function(data) {
            _commission_to_prex = data.comision;
        });

        _DOM_monto_quiero.keyup(function() {
            $(this).check('1234567890.,');
            _calcularMonto(_DOM_monto_quiero);
        });

        $("input[type='radio'][name='metodo']").change(function() {
            if ($(this).val() == 'P') {
                $("#box-promo").show();
            } else {
                $("#box-promo").hide();
            }
            _calcularMonto(_DOM_monto_quiero);
        });

        $("input[type='radio'][name='moneda']").change(function() {
            _calcularMonto(_DOM_monto_quiero);
        });

        function _calcularMonto(input){
            let value_quiero = input.val(),
                value_moneda = $("input[type='radio'][name='moneda']:checked").val(),
                value_metodo = $("input[type='radio'][name='metodo']:checked").val(),
                value_comision_base = _commission_to_prex,
                value_iva_base = 0.22,
                value_cotizacion_compra = $("#_cotizacion_compra").val(),
                value_cotizacion_venta = $("#_cotizacion_venta").val(),
                value_cotizacion = 0,
                value_porcent = 0,
                _DOM_description_commission = $(".description_commission"),
                _DOM_description_commission1= $(".description_commission1");
                _DOM_alert_box = $("#alert-box");

            input.val(input.val().replace(",",".").replace(' ',''));
            _DOM_alert_box.css({visibility: 'hidden'});

            if (value_moneda == 858) {
                $(".show-cambio-usd").show();
                value_cotizacion = value_cotizacion_venta;
            } else if (value_moneda == 840) {
                $(".show-cambio-usd").hide();
                value_cotizacion = 1;
            } else {
                _DOM_alert_box.html('La moneda seleccionada no es correcta.');
                _DOM_alert_box.css({visibility: 'visible'});	
            }

            if (value_quiero < 20) {
                _DOM_alert_box.html('El monto mínimo de operación es de USD 20.');
                _DOM_alert_box.css({visibility: 'visible'});
            }

            if (value_quiero > 2000) {
                _DOM_alert_box.html('El monto máximo por operación es de USD 2000.');
                _DOM_alert_box.css({visibility: 'visible'});
            }

            value_porcent = (value_quiero - value_comision_base ) * value_cotizacion;
            if (value_quiero < 20 || value_quiero > 2000) {
                $("#monto_porcent").val('');
            } else {
                $("#monto_porcent").val(value_porcent.toFixed(2));
            }
        }
    }

    this.preguntasfrecuentes = function(){
        $("#btn-menu-preguntasfrecuentespp").addClass('px-selected');
        $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        $.ajax({   
            type: "post",
            url: Chukupax.basePath + "/webservice/getPreguntasFrecuentesPayPal",
            dataType: "json",
            success:function(data){  
                var preguntasFrecuentes = '';
                $.each(data, function(index, value) { //Modulo
                    if(value.nombre=="Prex a Prex: traspaso de dinero") {                              
                        preguntasFrecuentes = preguntasFrecuentes + '<a name="faqMoneda" id="a"></a>';
                    }
                    preguntasFrecuentes = preguntasFrecuentes + '<h4><a href="javascript:void(0);" onclick="Faqs($(this));" class="seccionFaqs" target="_self" title="Ver preguntas de sección"><img src="https://de2aqb3kqoyo2.cloudfront.net/web/icoDesplegar.png" alt="Desplegar" width="40"/> ' + value.nombre + '</a></h4><div class="boxPreguntas" style="display: none;">';
                    $.each(value.item, function(index2, value2) { //Pregunta                                
                        preguntasFrecuentes = preguntasFrecuentes + '<a href="javascript:void(0);" class=pregunta_frecuente onclick="MostrarRespuestas(' + "'" + "p.mostrarResps" + index2 + "'" + ')" >' + value2.nombre + '</a> <p>';
                        $.each(value2.item, function(index3, value3) { //Respuesta
                            preguntasFrecuentes = preguntasFrecuentes + '<p class="mostrarResps' + index2 + '" style="display:none" >' + value3 + '</p>';
                        });                                
                    });
                    preguntasFrecuentes = preguntasFrecuentes + '</div>';
                });                        
                $("#getPreguntasFrecuentes").html(preguntasFrecuentes);
                $("#spinner-loading").addClass('hide-spinner');
            }
        });
    }

    this.calculadora = function(){
        $("#btn-submenu-retiropp").click();
        $("#btn-menu-calculadorapp").addClass('px-selected');
        $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged

        var _commission_to_prex = $("#_comision").val();

        $.ajax({
            url: '/paypal/get_comision',
            type: 'POST',
            dataType: 'json',
            data: {},
        }).done(function(data) {
            _commission_to_prex = data.comision;
        });
        
        let _DOM_monto_quiero = $("#monto_quiero");
        _DOM_monto_quiero.keyup(function() {
            $(this).check('1234567890.,');
            _calcularMonto(_DOM_monto_quiero);
        });

        $("input[type='radio'][name='moneda']").change(function() {
            _calcularMonto(_DOM_monto_quiero);
            let _data_moneda = $(this).val();

            if (_data_moneda == 840) {
                $("#tipo_cambio").hide();
            } else {
                $("#tipo_cambio").show();
            }
        });
        var value_porcentaje_usd = 0,
            value_procentaje_uyu = 0;
        
        function _calcularMonto(input){
            var _errores = [0, 0];
            let value_quiero = input.val(),
                value_moneda = $("input[type='radio'][name='moneda']:checked").data('value'),
                value_comision_base = _commission_to_prex,
                value_iva_base = 0.22,
                value_cotizacion_compra = $("#_cotizacion_compra").val(),
                value_cotizacion = 0,
                value_porcent = 0,
                _DOM_description_commission = $("#description_commission"),
                _DOM_alert_box = $("#alert-box"),
                btn_confirmar = $("#btn-confirmar-retiro");

            input.val(input.val().replace(",",".").replace(' ',''));
            _DOM_alert_box.hide();

            if (value_moneda == 858) {
                value_cotizacion = value_cotizacion_compra;
                _errores[0] = 0;
            } else if (value_moneda == 840) {
                value_cotizacion = 1;
                _errores[0] = 0;
            } else {
                _DOM_alert_box.html('La moneda seleccionada no es correcta.');
                _DOM_alert_box.show();
                _errores[0] = 1;
            }

            let _disponible_real = $('#_disponible_real').val();
            if (parseFloat(value_quiero) > parseFloat(_disponible_real)) {
                _DOM_alert_box.html('No tienes ese disponible en PayPal.<br>Recuerda también que el monto máximo por operación es de USD 2000');
                _DOM_alert_box.show();
                _errores[1] = 1;
            } else if (value_quiero > 2000){
                _DOM_alert_box.html('El monto máximo por operación de de USD 2000.');
                _DOM_alert_box.show();
                _errores[1] = 1;
            } else {
                _DOM_alert_box.hide();
                _errores[1] = 0;
            }
            value_porcent_usd = (value_quiero - value_comision_base) * 1;
            value_porcent_uyu = (value_quiero - value_comision_base) * value_cotizacion_compra;

            value_porcentaje_usd = value_porcent_usd;
            value_procentaje_uyu = value_porcent_uyu;
            if (value_quiero < 20) {
                $("#real_import_uyu").html('0.00');
                $("#real_import_usd").html('0.00');
                _DOM_alert_box.html('El monto mínimo de operación de de USD 20.');
                _DOM_alert_box.show();
                _errores[1] = 1;
            } else {
                if (String(value_quiero).match(/[-+]?([0-9]*\.[0-9]+|[0-9]+)/) && parseFloat(value_quiero.replace(",",".").replace(' ','')) > 0) {
                    $("#real_import_uyu").html(value_porcent_uyu.toFixed(2));
                    $("#real_import_usd").html(value_porcent_usd.toFixed(2));
                    $("#a_recibir").val(value_porcent.toFixed(2));
                } else {
                    _errores[1] = 1;
                }
            }
            if (!_errores[0] && !_errores[1]) {
                btn_confirmar.prop('disabled', false);
            } else {
                btn_confirmar.prop('disabled', true);
            }
        }
    }

    this.retiro = () => {
        $("#btn-menu-retiropp").addClass('px-selected');
        $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        
        $("#fecdesde").datepicker({
            changeMonth: true,
            changeYear: true,
            defaultDate: "-15d",
            maxDate: "d",
            dateFormat: 'dd/mm/yy'
        });

        $("#fechasta").datepicker({
            changeMonth: true,
            changeYear: true,
            defaultDate: "-5d",
            maxDate: "d",
            dateFormat: 'dd/mm/yy'
        });
        
        $('#_disponible_real').val($('#_disponible_real').val().replace(',', '.').replace('.', ''));

        var _commission_to_prex = 8 * 1.22;

        $.ajax({
            url: '/paypal/get_comision',
            type: 'POST',
            dataType: 'json',
            data: {},
        }).done(function(data) {
            _commission_to_prex = data.comision;
        });
        
        let _DOM_monto_quiero = $("#monto_quiero");
        _DOM_monto_quiero.keyup(function() {
            $(this).check('1234567890.,');
            _calcularMonto(_DOM_monto_quiero);
        });

        $("input[type='radio'][name='moneda']").change(function() {
            _calcularMonto(_DOM_monto_quiero);
            let _data_moneda = $(this).val();

            if (_data_moneda == 840) {
                $("#tipo_cambio").hide();
            } else {
                $("#tipo_cambio").show();
            }
        });
        var value_porcentaje_usd = 0,
            value_procentaje_uyu = 0;

        function _calcularMonto(input){
            var _errores = [0, 0];
            let value_quiero = input.val(),
                value_moneda = $("input[type='radio'][name='moneda']:checked").data('value'),
                value_comision_base = _commission_to_prex,
                value_cotizacion_compra = $("#_cotizacion_compra").val(),
                value_cotizacion = 0,
                value_porcent = 0,
                _DOM_description_commission = $("#description_commission"),
                _DOM_alert_box = $("#alert-box"),
                btn_confirmar = $("#btn-confirmar-retiro");

            input.val(input.val().replace(",",".").replace(' ',''));
            _DOM_alert_box.hide();

            if (value_moneda == 858) {
                value_cotizacion = value_cotizacion_compra;
                _errores[0] = 0;
            } else if (value_moneda == 840) {
                value_cotizacion = 1;
                _errores[0] = 0;
            } else {
                _DOM_alert_box.html('La moneda seleccionada no es correcta.');
                _DOM_alert_box.show();
                _errores[0] = 1;
            }

            var limite_operacion = ($("#limite_operacion")) ? parseFloat($("#limite_operacion").val()) : 2000;

            let _disponible_real = $('#_disponible_real').val();
            if (parseFloat(value_quiero) > parseFloat(_disponible_real)) {
                _DOM_alert_box.html('No tienes ese disponible en PayPal.<br>Recuerda también que el monto máximo por operación es de USD ' + limite_operacion);
                _DOM_alert_box.show();
                _errores[1] = 1;
            } else if (parseFloat(value_quiero) > limite_operacion) {
                _DOM_alert_box.html('El monto máximo por operación de de USD ' + limite_operacion);
                _DOM_alert_box.show();
                _errores[1] = 1;
            } else {
                _DOM_alert_box.hide();
                _errores[1] = 0;
            }
            value_porcent_usd = (value_quiero - value_comision_base) * 1;
            value_porcent_uyu = (value_quiero - value_comision_base) * value_cotizacion_compra;

            value_porcentaje_usd = value_porcent_usd;
            value_procentaje_uyu = value_porcent_uyu;
            if (value_quiero < 20) {
                $("#real_import_uyu").html('0.00');
                $("#real_import_usd").html('0.00');
                _DOM_alert_box.html('El monto mínimo de operación de de USD 20.');
                _DOM_alert_box.show();
                _errores[1] = 1;
            } else {
                if (String(value_quiero).match(/[-+]?([0-9]*\.[0-9]+|[0-9]+)/) && parseFloat(value_quiero.replace(",",".").replace(' ','')) > 0) {
                    $("#real_import_uyu").html(value_porcent_uyu.toFixed(2));
                    $("#real_import_usd").html(value_porcent_usd.toFixed(2));
                    $("#a_recibir").val(value_porcent.toFixed(2));
                } else {
                    _errores[1] = 1;
                }
            }
                
            if (!_errores[0] && !_errores[1]) {
                btn_confirmar.prop('disabled', false);
            } else {
                btn_confirmar.prop('disabled', true);
            }
        }

        $('#btn-confirmar-retiro').click(function(e) {
            e.preventDefault();
            var moneda_swal = '$',
                moneda_texto = 'pesos',
            valor_mostrar = 0;

            valor_mostrar = value_procentaje_uyu;
            if ($("input[type='radio'][name='moneda']:checked").val() == 840) {
                moneda_swal = 'U$S';
                moneda_texto = 'dólares';
                valor_mostrar = value_porcentaje_usd;
            }

            var textoPrimera = '<br><br><br><b>Por tratarse de tu primer retiro PayPal, los ' + moneda_texto + ' se acreditarán en tu cuenta en cinco días.<br><br>Tus siguientes retiros se acreditarán en el mismo día.</b>';
            if($("#_prim").val() == 0){
                textoPrimera = '';
            }

            var html_swal = `
                <center>
                    Cuenta Prex ${$('#nombre').val()}: ${$("#nro_cuenta").val()}<br>
                    Monto a retirar: U$S ${$("#monto_quiero").val().replace(",", ".").replace(' ', '')}<br>
                    Monto a recibir: ${moneda_swal} ${valor_mostrar.toFixed(2)} (tarifa incluída)
                    <br><b>Fecha a recibir:</b> ${$("#_a_acre").val()}
                    ${textoPrimera}
                </center>
            `;

            Swal.fire({
                title: 'Confirma tu retiro',
                html: html_swal,
                type: 'question',
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: 'Confirmar',
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            })
            .then((result) => {
                if (result.value) {
                    Swal.fire({
                        title: 'Confirmando retiro...',
                        html: 'Espere un momento',
                        type: 'info',
                        showConfirmButton: false
                    });
                    $.ajax({
                        url: Chukupax.basePath + '/paypal/retiro_procesar',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            idUsuario: $("#idU").val(),
                            monto    : $("#monto_quiero").val(),
                            nroCuenta: $("#nro_cuenta").val(),
                            moneda   : $('input[type="radio"][name="moneda"]:checked').val()
                        },
                    })
                    .done(function(data) {
                        if (data.error == 0) {
                            let textSuperaMensual = 'Tu retiro se encuentra pendiente de aprobación por haber alcanzado monto máximo mensual.<br/>Se comunicarán contigo a la brevedad';
                            if (!data.superaMensual) {
                                textSuperaMensual = '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i><br><br>Espere un momento por favor';
                            }
    
                            Swal.fire({
                                title: '\¡Retiro confirmado\!',
                                type: "success",
                                html: textSuperaMensual,
                                showConfirmButton: false
                            });
                            setTimeout(function(){
                                location.replace('/paypal');
                            }, 2000);
                        } else if (data.error == 3) {
                            Swal.fire({
                                title: 'Ha ocurrido un error al retirar saldo',
                                type: "warning",
                                text: data.textoError,
                                confirmButtonText: "Ok",
                                closeOnConfirm: true,
                            });
                        } else {
                            Swal.fire(
                                'Ha ocurrido un error al retirar saldo',
                                data.textoError,
                                "error"
                            );
                        }
                    })
                    .fail(function() {
                        Swal.fire(
                            'Ha ocurrido un error al retirar saldo',
                            'Por favor intente mas tarde',
                            "error"
                        );
                    })
                }
            })
        });
    }
}

function cambiomoneda(){
    this.init = function(){
        if (Chukupax.logged) {
            $("#btn-menu-cambiomoneda").addClass('px-selected');
            $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        }
            
        $("#moneda_cotizacion").change(function(){
            cambiomoneda();
            if ( $(this).val() == 840) {
                $("#imgEquivalente").attr('src', '/assets/prex/img/estadocuenta/px-flag-uy.png');
                $("#imgQuiero").attr('src', '/assets/prex/img/estadocuenta/px-flag-us.png');
                $("#selectEquivalente").val(858);
            } else {
                $("#imgEquivalente").attr('src', '/assets/prex/img/estadocuenta/px-flag-us.png');
                $("#imgQuiero").attr('src', '/assets/prex/img/estadocuenta/px-flag-uy.png');
                $("#selectEquivalente").val(840);
            }
        });

        $(document).ready(function(){
            $('#monto_cotizacion').check('0123456789.,');
        })

        $("#monto_cotizacion" ).keyup(function (){
            cambiomoneda();
        });

        function cambiomoneda(){
            resizeContainer($(window).width());
            if(($("#moneda_cotizacion").val() == 858 || $("#moneda_cotizacion").val() == 840) && $("#monto_cotizacion").val().match(/[-+]?([0-9]*\.[0-9]+|[0-9]+)/) && parseFloat($("#monto_cotizacion").val().replace(",",".").replace(' ','')) > 0){
                var conv_moneda = "$";  
                var pizarra = parseFloat($("#pizarra-venta").html().replace(",",".").replace(' ',''));
                var montoCotiza = (100 * (parseFloat($("#monto_cotizacion").val().replace(",",".").replace(' ','')) * pizarra) / 100).toFixed(2);
				
                $("#monto_cotizacion").val($("#monto_cotizacion").val().replace(".",",").replace(' ',''));
				
                if($("#moneda_cotizacion").val() == 858){
                    conv_moneda = "U$S";
                    var pizarra = parseFloat($("#pizarra-compra").html().replace(",",".").replace(' ',''));
                    montoCotiza = (100 * (parseFloat($("#monto_cotizacion").val().replace(",",".").replace(' ','')) / pizarra)/100).toFixed(2); 
                }
				
                $("#conv_monto").val(montoCotiza);   

                $('#monto_cotizacion').css("border-color", "green");                        
                $('#confirmarCambioBtn').prop('disabled', false);                        
            } else {
                $('#monto_cotizacion').css("border-color", "red");
                $('#confirmarCambioBtn').prop('disabled', true);
            }
            if($("#monto_cotizacion").val() == ''){
                $("#conv_monto").html("--");
            }
        };

        $("#confirmarCambioBtn").click(function() {
            var text = `¿Confirma que quiere ${$("#monto_cotizacion").val()}`;

            if ($("#moneda_cotizacion").val() == 858) {
                if ($("#monto_cotizacion").val() == 1) {
                    text = `${text} peso Uruguayo?`;
                } else {
                    text = `${text} pesos Uruguayos?`;
                }
            } else {
                if ($("#monto_cotizacion").val() == 1) {
                    text = `${text} dólar?`;
                } else {
                    text = `${text} dólares?`;
                }
            }

            Swal.fire({
                title: '',
                html: `<h2 style='font-size: 1.4em;'>${text}</h2>`,
                type: 'question',
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: 'Confirmar',
            }).then(result => {
                if (result.value) {
                    Swal.fire({
                        title: 'Cambiando moneda...',
                        html: 'Espere un momento',
                        type: 'info',
                        showConfirmButton: false
                    });

                    $.ajax({
                        url: Chukupax.basePath + '/cambiomoneda/cambio_moneda',
                        type: 'POST',
                        dataType: 'json',
                        data: { 
                            nroCuenta    : $("#CMnroCuenta").val(),                         
                            moneda       : $("#moneda_cotizacion").val(),
                            monto        : $("#monto_cotizacion").val(),
                            tipoDocumento: $("#CMtipoDocumento").val(),
                            documento    : $("#CMdocumento").val()
                        },
                    })
                    .done(function(data) {
                        if (data.error == 0) {
                            Swal.fire({
                                title: 'Perfecto!',
                                text: 'Se ha realizado correctamente el cambio.',
                                type: 'success',
                                showCancelButton: false,
                                showConfirmButton: false,
                                allowOutsideClick: false
                            }).then(result => {
                                if (result.value) {
                                    window.location.replace(`${Chukupax.basePath}/usuarios/actualizarSaldo`);
                                }
                            });
                            setTimeout(() => {
                                window.location.replace(`${Chukupax.basePath}/usuarios/actualizarSaldo`);
                            }, 2000);
                        } else {
                             Swal.fire({
                                title: '',
                                text: data.textoError,
                                type: 'error',
                                showCancelButton: false,
                                showConfirmButton: false,
                                allowOutsideClick: false
                            });
                        }
                    })
                    .fail(function() {
                        Swal.fire(
                            'Ha ocurrido un error',
                            'Por favor intente mas tarde',
                            "error"
                        );
                    });
                }
            });
        });
    }
}

function p2p(){
    this.init = function(){
        if (Chukupax.logged){
            $("#btn-menu-p2p").addClass('px-selected');
            $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        }

        $("#claveseguridad").click(function(event) {
            if (passwordOculta == 1) {
                passwordOculta = 0;
                clave = $(this).attr('title');
                $(this).html('Tu clave <i class="fa fa-info-circle"></i> : ' + clave);
            } else {
                passwordOculta = 1;
                $(this).html(htmlNormal);
            }
        });

        $("div.cerrar-clave-seguridad").click(function() {
            clave = '';
            $("div.sweet-overlay").fadeOut('slow');
            $("div.modal-password").fadeOut('slow');
        });

        //CONTROLES TECLADO
        window.addEventListener("keydown", keypressed, false);
        $(".pressCaracter").click(function() {
            pressCaracter($(this).data('caracter'));
        });

        $("#pressBorrar, #pressBorrar1").click(function() {
            pressBorrar();
        });

        $("#olvido-clave").click(function() {
            olvidoClaveSeguridad();
        });

        $(".btn-volver-clave").click(function() {
            $("#spinner-loading").removeClass('hide-spinner');
        });

        $("#btnStep1").click(function() {
            $("#tarj").val(tarjeta);
            $("#ingresarTarje").val(0);
            $("#ingresarClave").val(1);
            $("#ingClave").val(0);

            $("div.modal-new-password > div:nth-child(2)").hide();
            $("div.modal-new-password > div:nth-child(3)").show();
        });

        $("#btnBackStep1").click(function() {
            $("#ingresarTarje").val(1);
            $("#ingresarClave").val(0);
            $("#ingClave").val(0);

            $("div.modal-new-password > div:nth-child(3)").hide();
            $("div.modal-new-password > div:nth-child(2)").show();
        });

        $("#btnStep2").click(function() {
            $("#ingresarTarje").val(0);
            $("#ingresarClave").val(0);
            $("#ingClave").val(1);

            $("div.modal-new-password > div:nth-child(3)").hide();
            $("div.modal-new-password > div:nth-child(5)").hide();
            $("div.modal-new-password > div:nth-child(4)").show();
        });

        $("#btnBackStep2").click(function() {
            $("div.modal-new-password > div:nth-child(3)").show();
            $("div.modal-new-password > div:nth-child(5)").show();
            $("div.modal-new-password > div:nth-child(4)").hide();
        });

        $("#btnStep3").click(function() {
            $.ajax({
                url: '/p2p/set_clave_seguridad',
                type: 'POST',
                dataType: 'json',
                data: {
                    IDUsuario: $("#idU").val(),
                    ClaveSeguridad: clave,
                    Tarjeta: tarjeta
                },
            })
            .done(function(data) {
                if (data.error == 0) {
                    $("div.sweet-overlay").fadeOut('slow');
                    $("div.modal-new-password").fadeOut('slow');
                    $("#_tienep").val(1);
                } else {
                    $("#error_set").fadeIn('slow');
                    $("#error_set_text").html(data.textoError);
                    setTimeout(function(){
                        $("#error_set").fadeOut('slow');
                    }, 5000);
                }
            })
            .fail(function() {
                $("#error_set").fadeIn('slow');
                $("#error_set_text").html("No se ha podido crear la clave, consulte.");
                setTimeout(function(){
                    $("#error_set").fadeOut('slow');
                }, 5000);
            })
            .always(function(){
                $("#spinner-loading").addClass('hide-spinner');
            })
        });
        //CONTROLES TECLADO

        if ($("#_tienep").val() == 0) {
            $(".sweet-overlay").show();
            $(".modal-new-password").show();
        } else {
            $("#ingresarClave").val(0);
            $("#ingresarTarje").val(0);
        }

        jQuery(document).ready(function() {
            $('.registration-form fieldset:first-child').fadeIn('slow');
            if ( ! $("input[type=radio][name=tipoEnvio]").is(':checked') ){
                $("#btnPaso1").prop('disabled', true);
                $("#btnPaso1").css("background", "#a8dcff");
            }

            $("#btnPaso1").click(function() {
                setTimeout(function(){
                    $("#dato_receptor").focus();
                }, 600);
            });

            // Control paso 1
            $('input[type=radio][name=tipoEnvio]').change(function(){
                $accion = $(this).prop('selected', true)["0"].defaultValue;
                $('#dato_receptor').val('');

                if ($("#_tienep").val() != 0) {
                    $("#btnPaso1").prop('disabled', false);
                    $("#btnPaso1").css("background", "#2980b9"); 	
                }

                $("#tituloDatos").html("Enviar a " + $accion);
                if ($accion == 'CI') {
                    $accion = "Cédula";
                }
                $("#dato_receptor").attr("placeholder", "Ingrese " + $accion + " del destinatario");
            });

            // Control paso 2
            $("#btnVerificarP2P").prop('disabled', true);
            $("#btnVerificarP2P").css("background", "#a8dcff");

            $('#dato_receptor').check('1234567890');
            $('#monto_p2p').check('1234567890.,');
            $("#monto_p2p").focusout(function(){
                $("#monto_p2p").val($(this).val().replace(",",".").replace(' ',''));
            })

            $("#dato_receptor, #monto_p2p, #moneda_p2p").keyup(function(){
                if ($('#dato_receptor').val() != '' && 
                    $('#monto_p2p').val() != '' && 
                    $("#_tienep").val() != 0){
                    $("#btnVerificarP2P").prop('disabled', false);
                    $("#btnVerificarP2P").css("background", "#2980b9");
                } else {
                    $("#btnVerificarP2P").prop('disabled', true);
                    $("#btnVerificarP2P").css("background", "#a8dcff");
                }
            })

            //PRIMERA PARTE P2P
            $("#btnVerificarP2P").click(function(){
                $("#btnConfirmarP2P").hide();
                $("input[type=checkbox][name=enviarSMS]").prop("checked", false);
                var $TipoDocumento = '',
                    $Cedula = $("#dato_receptor").val(),
                    $Celular = $("#dato_receptor").val(),
                    $NroCuenta = $("#dato_receptor").val(),
                    $Iniciales = '',
                    $Monto = $("#monto_p2p").val(),
                    $Moneda = $("#moneda_p2p").val(),
                    $Mensaje = $("#mensaje_p2p").val(),
                    $EnviarSMS = $("input[type=checkbox][name=enviarSMS]").is(":checked"),
                    $IDCuenta = $("#idc").val();

                var $TipoDocumentoInput = $('input[type=radio][name=tipoEnvio]:checked').val();
                $("#spinner-loading").removeClass('hide-spinner');
                if ($TipoDocumentoInput == "CI") {
                    $TipoDocumento = "CEDULA";
                } else if ($TipoDocumentoInput == "Cuenta") {
                    $TipoDocumento = "CUENTA";
                } else if ($TipoDocumentoInput == "Celular") {
                    $TipoDocumento = "CELULAR";
                }

                $.ajax({
                    url : Chukupax.basePath + "/p2p/inicialesP2P",
                    dataType : "json",
                    data : {  
                        TipoContacto : $TipoDocumento,
                        Cedula: $Cedula,
                        Celular: $Celular,
                        NroCuenta: $NroCuenta,
                        Iniciales: $Iniciales,
                        Monto: $Monto,
                        Moneda: $Moneda,
                        Mensaje: $Mensaje,
                        IDCuenta: $IDCuenta
                    },
                    success : function (data) {
                        $("#spinner-loading").addClass('hide-spinner');
                        if (data.error == 0) {
                            consistenciaP2P();
                        } else {
                            $("#labelMontoTotal").css("display", "none");
                            $("#montototal").css("display", "none");
                            $("#warningComision").css("display", "none");
                            $("#enviarSMS").css("display", "none");
                            $("#iniciales").html("<h2>" + data.textoError + "</h2>");
                            $("#tituloPaso3").css("display", "none");
                        }
                    },
                    error : function (data) {
                        $("#spinner-loading").addClass('hide-spinner');
                        $("#labelMontoTotal").css("display", "none");
                        $("#montototal").css("display", "none");
                        $("#warningComision").css("display", "none");
                        $("#enviarSMS").css("display", "none");
                        $("#iniciales").html("<h2> No se puede realizar el Prex a Prex, intente más tarde. </h2>");
                        $("#tituloPaso3").css("display", "none");
                    },
                    dataType: 'json',
                    type: 'POST'
                });
            });

            //SEGUNDA PARTE P2P
            function consistenciaP2P(){
                var $TipoDocumento = '',
                    $Cedula = $("#dato_receptor").val(),
                    $Celular = $("#dato_receptor").val(),
                    $NroCuenta = $("#dato_receptor").val(),
                    $Iniciales = '',
                    $Monto = $("#monto_p2p").val(),
                    $Moneda = $("#moneda_p2p").val(),
                    $Mensaje = $("#mensaje_p2p").val(),
                    $EnviarSMS = $("input[type=checkbox][name=enviarSMS]").is(":checked"),
                    $IDCuenta = $("#idc").val();

                var $TipoDocumentoInput = $('input[type=radio][name=tipoEnvio]:checked').val();
                $("#spinner-loading").removeClass('hide-spinner');
                if ($TipoDocumentoInput == "CI") {
                    $TipoDocumento = "CEDULA";
                } else if ($TipoDocumentoInput == "Cuenta") {
                    $TipoDocumento = "CUENTA";
                } else if ($TipoDocumentoInput == "Celular") {
                    $TipoDocumento = "CELULAR";
                }

                $.ajax({
                    url : Chukupax.basePath + "/p2p/consistenciaP2P",
                    dataType : "json",
                    data : {  
                        TipoContacto : $TipoDocumento,
                        Cedula: $Cedula,
                        Celular: $Celular,
                        NroCuenta: $NroCuenta,
                        Iniciales: $Iniciales,
                        Monto: $Monto,
                        Moneda: $Moneda,
                        Mensaje: $Mensaje,
                        IDCuenta: $IDCuenta
                    },
                    success : function (data) {
                        $("#spinner-loading").addClass('hide-spinner');
                        if (data.error == 0) {
                            $("#btnConfirmarP2P").show();
                            $("#iniciales").html("<h2>Iniciales del destinatario: " + data.iniciales + "</h2>");
                            $("#tituloPaso3").html("Detalle del movimiento");
                            $("#labelMontoTotal").html("Importe total: ");
                            if ($Moneda == 840) {
                                $("#montototal").html("U$S " + $Monto);
                            } else if ($Moneda == 858) {
                                $("#montototal").html("$ " + $Monto);
                            }

                            $("#labelMontoTotal").css("display", "block");
                            $("#montototal").css("display", "block");
                            $("#warningComision").css("display", "block");
                            $("#enviarSMS").css("display", "block");
                            $("#tituloPaso3").css("display", "block");
                        } else {
                            $("#labelMontoTotal").css("display", "none");
                            $("#montototal").css("display", "none");
                            $("#warningComision").css("display", "none");
                            $("#enviarSMS").css("display", "none");
                            $("#iniciales").html("<h2>" + data.textoError + "</h2>");
                            $("#tituloPaso3").css("display", "none");
                        }
                    },
                    error : function (data) {
                        $("#spinner-loading").addClass('hide-spinner');
                        $("#labelMontoTotal").css("display", "none");
                        $("#montototal").css("display", "none");
                        $("#warningComision").css("display", "none");
                        $("#enviarSMS").css("display", "none");
                        $("#iniciales").html("<h2> No se puede realizar el Prex a Prex, intente más tarde. </h2>");
                        $("#tituloPaso3").css("display", "none");
                    },
                    dataType: 'json',
                    type: 'POST'
                });
            }

            $("#btnConfirmarP2P").click(function(){
                $("#spinner-loading").removeClass('hide-spinner');
                var $TipoDocumento = '',
                    $Cedula = $("#dato_receptor").val(),
                    $Celular = $("#dato_receptor").val(),
                    $NroCuenta = $("#dato_receptor").val(),
                    $Iniciales = '',
                    $Monto = $("#monto_p2p").val(),
                    $Moneda = $("#moneda_p2p").val(),
                    $Mensaje = $("#mensaje_p2p").val(),
                    $EnviarSMS = $("input[type=checkbox][name=enviarSMS]").is(":checked"),
                    $IDCuenta = $("#idc").val(),
                    $TipoDocumentoInput = $('input[type=radio][name=tipoEnvio]:checked').val();

                if ($TipoDocumentoInput == "CI") {
                    $TipoDocumento = "CEDULA";
                } else if ($TipoDocumentoInput == "Cuenta") {
                    $TipoDocumento = "CUENTA";
                } else if ($TipoDocumentoInput == "Celular") {
                    $TipoDocumento = "CELULAR";
                }

                if ($("input[type=checkbox][name=enviarSMS]").is(":checked")) {
                    $EnviarSMS = 1;
                } else {
                    $EnviarSMS = 0;
                }

                setTimeout(function(){ 
                    $("#spinner-loading").addClass('hide-spinner');
                    $('.modal-password').show();
                    $("div.sweet-overlay").show();
                    $("#ingClave").val(1);
                    clave = '';
                    updateKey(clave);

                    $("#btnPagarP2P").click(function(event) {
                        $.ajax({
                            url : Chukupax.basePath + "/p2p/comprobarClaveP2P",
                            dataType : "json",
                            data : {
                                ClaveP2P: clave,
                                idCuenta: $("#idc").val()
                            },
                            success : function (data) {
                                if (data.error == 0) {
                                    $.ajax({
                                        url : Chukupax.basePath + "/p2p/pagarP2P",
                                        dataType : "json",
                                        data : {  
                                            TipoContacto : $TipoDocumento,
                                            Cedula: $Cedula,
                                            Celular: $Celular,
                                            NroCuenta: $NroCuenta,
                                            Iniciales: $Iniciales,
                                            Monto: $Monto,
                                            Moneda: $Moneda,
                                            Mensaje: $Mensaje,
                                            enviarSMS: $EnviarSMS,
                                            IDCuenta: $IDCuenta
                                        },
                                        success : function (data) {
                                            $("div.modal-password.noselect").fadeOut('slow');
                                            $("div.sweet-overlay").fadeOut('slow');
                                            if (data.error == 0) {
                                                $("#iniciales").html("<h2> Prex a Prex realizado exitosamente </h2><br>" + data.textoError);
                                                window.location.replace("/usuarios/actualizarSaldo/" + $("#idc").val());
                                            } else {
                                                $("#iniciales").html("<h2>" + data.textoError + "</h2>");
                                            }
                                            $("#labelMontoTotal").css("display", "none");
                                            $("#montototal").css("display", "none");
                                            $("#warningComision").css("display", "none");
                                            $(".mensaje-recibir-push").css("display", "none");
                                            $("#tituloPaso3").css("display", "none");
                                            $("#btnConfirmarP2P").hide();
                                            $( "#dialog" ).dialog( "close" );
                                            $("#spinner-loading").addClass('hide-spinner');
                                            clave = '';
                                        },
                                        error : function (data) {
                                            $("#spinner-loading").addClass('hide-spinner');
                                            $( "#dialog" ).dialog( "close" );
                                            clave = '';
                                        },
                                        dataType: 'json',
                                        type: 'POST'
                                    });
                                } else {
                                    $("#btnPagarP2P").hide();
                                    clave = '';
                                    intentos++;
                                    setTimeout(function(){
                                        $('.cs-circulos[data-circulo=1]').attr({class: 'cs-circulos cs-error'});
                                        $('.cs-circulos[data-circulo=2]').attr({class: 'cs-circulos cs-error'});
                                        $('.cs-circulos[data-circulo=3]').attr({class: 'cs-circulos cs-error'});
                                        $('.cs-circulos[data-circulo=4]').attr({class: 'cs-circulos cs-error'});
                                        setTimeout(function(){
                                            $('.cs-circulos[data-circulo=1]').attr({class: 'cs-circulos cs-vacio'});
                                            $('.cs-circulos[data-circulo=2]').attr({class: 'cs-circulos cs-vacio'});
                                            $('.cs-circulos[data-circulo=3]').attr({class: 'cs-circulos cs-vacio'});
                                            $('.cs-circulos[data-circulo=4]').attr({class: 'cs-circulos cs-vacio'});
                                        }, 100);
                                    }, 200);
                                    if (intentos == 5) {
                                        $("#spinner-loading").removeClass('hide-spinner');
                                        $.ajax({
                                            url: '/p2p/set_clave_seguridad_default',
                                            type: 'POST',
                                            dataType: 'json',
                                            data: {
                                                IDUsuario: $("#idU").val(),
                                                ClaveSeguridad: clave,
                                                Tarjeta: tarjeta
                                            }
                                        })
                                        .done(function(data) {
                                            if (data.error == 0) {
                                                location.reload();
                                            }
                                        })
                                        .fail(function() {
                                            location.reload();
                                        }) 				
                                    } else {
                                        $("#spinner-loading").addClass('hide-spinner');
                                    }
                                }
                            },
                            error : function (data) {
                                $("#spinner-loading").addClass('hide-spinner');
                            },
                            dataType: 'json',
                            type: 'POST'
                        });
                    });
                    $(".ui-widget-header").addClass("px-bg-first px-nombre");
                }, 1500);
            });

            // next step
            $('.registration-form .btn-next').on('click', function() {
                var parent_fieldset = $(this).parents('fieldset');
                parent_fieldset.fadeOut(400, function() {
                    $(this).next().fadeIn();
                });
            });

            // previous step
            $('.registration-form .btn-previous').on('click', function() {
                $(this).parents('fieldset').fadeOut(400, function() {
                    $(this).prev().fadeIn();
                });
            });
        });
    }
}

function ayuda(){
    this.solicitudSueldos = function(){
        $("#btn-menu-haberesp").addClass('px-selected');
        $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
    }

    this.faqs = function(){
        $("#btn-menu-faq").addClass('px-selected');
        $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        $.ajax({   
            type: "post",
            url: Chukupax.basePath + "/webservice/getPreguntasFrecuentes",                        
            dataType: "json",            
            success:function(data){  
                var preguntasFrecuentes = '';
                $.each(data, function(index, value) { //Modulo
                    if(value.nombre=="Prex a Prex: traspaso de dinero") {                              
                        preguntasFrecuentes = preguntasFrecuentes + '<a name="faqMoneda" id="a"></a>';
                    }
                    preguntasFrecuentes = preguntasFrecuentes + '<h4><a href="javascript:void(0);" onclick="Faqs($(this));" class="seccionFaqs" target="_self" title="Ver preguntas de sección"><img src="https://de2aqb3kqoyo2.cloudfront.net/web/icoDesplegar.png" alt="Desplegar" width="40"/> ' + value.nombre + '</a></h4><div class="boxPreguntas" style="display: none;">';

                    $.each(value.item, function(index2, value2) { //Pregunta                                
                        preguntasFrecuentes = preguntasFrecuentes + '<a href="javascript:void(0);" class=pregunta_frecuente onclick="MostrarRespuestas(' + "'" + "p.mostrarResps" + index2 + "'" + ')" >' + value2.nombre + '</a> <p>';
                        $.each(value2.item, function(index3, value3) { //Respuesta    
                            preguntasFrecuentes = preguntasFrecuentes + '<p class="mostrarResps' + index2 + '" style="display:none" >' + value3 + '</p>';
                        });                                
                    });
                    preguntasFrecuentes = preguntasFrecuentes + '</div>';
                });                        
                $("#getPreguntasFrecuentes").html(preguntasFrecuentes);
                $("#spinner-loading").addClass('hide-spinner');
            }
        });
    }

    this.init = function () {
        if (document.getElementById('fromFB') != null && document.getElementById('fromFB').value == 'true') {
            // crear alerta

            $("#mensajeResultado").html("<i class='fa fa-refresh fa-spin fa-3x fa-fw margin-bottom'></i>");
            $("#mensajeResultado").attr('style','color:black;font-size: 12px;text-align: center;');                                       
            $("#dialogEnviando").dialog({
                modal:true,
                width:450,
            });

            var interval_detect = setInterval(() => {
                if (document.getElementById('fc_widget') != null) {
                    if (window.fcWidget.isLoaded()) {
                        window.fcWidget.open();
                        clearInterval(interval_detect);
                    }
                } else {
                    if (document.getElementById('yendo-user') != null) {
                        document.getElementById('yendo-user').className = '';
                    }

                    if (document.querySelectorAll('#prexbot-chat > div.chat')[0] != undefined) {
                        document.querySelectorAll('#prexbot-chat > div.chat')[0].className = 'hide';
                    }
                    
                    if (document.querySelectorAll('#prexbot-chat > div.input')[0] != undefined) {
                        document.querySelectorAll('#prexbot-chat > div.input')[0].className = 'hide';
                    }
                    
                    var head = document.getElementsByTagName('head')[0],
                        script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = "https://wchat.freshchat.com/js/widget.js";
                    head.appendChild(script);
                    if (document.getElementById('channel') != null && document.getElementById('channel').value != 'false') {
                        var opts = { 
                            plan: "prex-uruguay",
                            status: "Active",
                            topic: document.getElementById('channel').value
                        }
                    } else {
                        var opts = {
                                plan: "prex-uruguay",
                                status: "Active"
                           }
                    }
                    setTimeout(() => {
                        window.fcWidget.init({  
                            token: "18fa5eff-e213-4031-9e74-800833bd3921",
                            host: "https://wchat.freshchat.com",
                            locale: "es-LA",
                            config: {
                                content: {
                                    placeholders: {
                                        search_field: 'Buscar',
                                        reply_field: 'Responde aquí...',
                                        csat_reply: 'Agregue sus comentarios aquí'
                                    },
                                    actions: {
                                        csat_yes: 'Si',
                                        csat_no: 'No',
                                        push_notify_yes: 'Si',
                                        push_notify_no: 'No',
                                        tab_faq: 'Preguntas Frecuentes',
                                        tab_chat: 'Chat',
                                        csat_submit: 'Enviar'
                                    },
                                    headers: {
                                        chat: 'Habla con nosotros',
                                        chat_help: 'Póngase en contacto con nosotros si tiene alguna pregunta',
                                        faq: 'Preguntas frecuentes',
                                        faq_help: 'Navegue por nuestras preguntas frecuentes',
                                        faq_not_available: 'No se encontraron preguntas frecuentes',
                                        faq_search_not_available: 'No se encontraron preguntas frecuentes para {{query}}',
                                        faq_useful: '¿Te resultó útil esta respuesta?',
                                        faq_thankyou: 'Gracias por tus comentarios',
                                        faq_message_us: 'Contáctanos',
                                        push_notification: '¡No te pierdas ninguna respuesta! Permitir notificaciones push?',
                                        csat_question: '¿Nos ocupamos de sus preocupaciones?',
                                        csat_yes_question: '¿Cómo calificaría esta interacción?',
                                        csat_no_question: '¿Cómo podríamos haber ayudado mejor?',
                                        csat_thankyou: 'Gracias por la respuesta',
                                        csat_rate_here: 'Envíe su calificación aquí',
                                        channel_response: {
                                            offline: 'Actualmente no hay agentes disponibles. Por favor, déjenos un mensaje',
                                            online: {
                                                minutes: {
                                                    one: "demora aproximadamente {!time!} minutos en responder",
                                                    more: "demora aproximadamente {!time!} minutos en responder"
                                                },
                                                hours: {
                                                    one: "demora aproximadamente menos de una hora en responder",
                                                    more: "demora aproximadamente {!time!} horas en responder",
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        })                        
                        setTimeout(() => {
                            var interval_detect_one = setInterval(() => {
                                if (window.fcWidget.isLoaded()) {
                                    window.fcWidget.user.setProperties(opts);
                                    window.prexBot.helpers('destroy');
                                    window.fcWidget.open();
                                    clearInterval(interval_detect_one);
                                    $("#dialogEnviando").dialog("close"); 
                                }
                            }, 100);
                        }, 250);
                    }, 3500);
                    
                    clearInterval(interval_detect);
                }
            }, 100);
        }


    //Fechas formulario reclamo de compra -Sofia
    //Cuando cambia uno de los selects de fecha
        $("#fechaCompra-day, #fechaCompra-month, #fechaCompra-year").change(function() {
            var a = $(this).attr("id").split("-"), //Esta parte no es necesaria porque ya sé cuál es el input, pero lo puedo usar para el cambio en carga
            e = a[0];      //Setea a e el elemento cero del input a                      
            if (document.getElementById($(this).attr("id")).options[0].disabled = !0, 0 != document.getElementById(e + "-day").selectedIndex && 0 != document.getElementById(e + "-month").selectedIndex && 0 != document.getElementById(e + "-year").selectedIndex) {
                var t = document.getElementById(e + "-day").value.toString(),
                    i = document.getElementById(e + "-month").value.toString(),
                    n = document.getElementById(e + "-year").value.toString();
                $("#" + e).val((t.length < 2 ? "0" + t : t) + "/" + (i.length < 2 ? "0" + i : i) + "/" + n), $("#" + e).change();
            } else {
                document.getElementById(e).value = "";
            } 
        });//Fin fechas formulario reclamo de compra
        
        //Evento click del boton consultar si la cuenta está activa (forms. 2.3119 y 2.320) -Sofia
        $('#btnConsultarCnta').click(function (){
            if (!Chukupax.ajaxWorking) {
                Chukupax.ajaxWorking = true;
                //alert ("quiere consultar para " + $("#email").val() + " " + $("#ci").val()); //ok
                $.ajax({
                    url : Chukupax.basePath + "/ayuda/cuentaActivaPorCI",
                    dataType : "json",
                    data : {
                        email  : $("#email").val(),
                        ci     : $("#ci").val()
                    },
                    success : function (data) {
                        //En cada if oculto los divs que no corresponden, por si se había realizado otra consulta previamente
                        if (data.error == 0){ 														//Si la tarjeta esta activa
                            $("#divActiva").css({'display' : ''});          //Muestro Activa
                            $("#divNoActiva").css({'display' : 'none'});    //Oculto no activa
                            $("#divIncorrecto").css({'display' : 'none'});  //Oculto Datos incorrectos
                            
                        } else if (data.error == 1){ 											//Si la tarjeta está inactiva
                            $("#divNoActiva").css({'display' : ''});        //Muestro no activa
                            $("#divActiva").css({'display' : 'none'});      //Oculto activa
                            $("#divIncorrecto").css({'display' : 'none'});  //Oculto Datos incorrectos
                            
                        } else if (data.error == 2){ 											//Si no se encuentra cuenta para los datos ingresados
                            $("#divIncorrecto").css({'display' : ''});      //Muestro div Datos incorrectos
                            $("#divActiva").css({'display' : 'none'});     	//Oculto div activa  
                            $("#divNoActiva").css({'display' : 'none'});  	//Oculto no activa 
                        } else {
                            $("#textoResultado").text("Por favor vuelva a intentarlo más tarde"); //Error desconocido
                        } 
                        Chukupax.ajaxWorking = false;
                    },
                    error: function () {
                        Chukupax.ajaxWorking = false;
                    },
                    type : 'POST'
                });
            }
        }); //Fin click del boton consultar si la cuenta está activa
                    
		//Evento click del boton enviar formulario de reclamo de carga -Sofia
        $('#btnEnviarTarInac').click(function(){  
            if (!Chukupax.ajaxWorking) {
                Chukupax.ajaxWorking = true;
                //alert ($("#email").val() + " ," + $("#ci").val()); //ok
                $.ajax({
                    url : Chukupax.basePath + "/ayuda/EnviarMailFreshDesk",
                    dataType : "json",
                    data : {
                        email  : $("#email").val(),
                        asunto : $("#asunto").val(),
                        medio_de_carga: $("#medioCarga").val(),
                        fecha_de_compra: $("#fechaCompra").val(),
                        moneda: $("#moneda").val(),
                        monto: $("#monto").val()
                    },
                    success : function (data) {
                        $("#textoOkEnvio").css({'color' : 'green'});
                        $("#textoOkEnvio").text("Gracias por comunicarte con PREX, nos pondremos en contacto a la brevedad");                                  
                        $("#DivContenido").css({'display' : 'none'});
                        Chukupax.ajaxWorking = false;
                    },
                    error: function () {
                        Chukupax.ajaxWorking = false;
                    },
                    type : 'POST'
                });
            }
        }); //Fin evento clcik del boton btnEnviarTarInac   
    };

    this.solicitudCorporativa = function(){}
  
    this.ayuda_2_3 = function(){            
        $.ajax({   
            type: "post",
            url: Chukupax.basePath + "/webservice/getPreguntasFrecAyuda",                        
            dataType: "json",
            success:function(data){
                var preguntasAyuda = '';
                preguntasAyuda = preguntasAyuda + '<div style="overflow:hidden ">';
                $.each(data, function(index, value) { //Modulo:
                    preguntasAyuda = preguntasAyuda + ' <a href="javascript:void(0);" onclick="MostrarPreguntas(' + "'" + "div.boxPreguntas" + index + "'" + ' , ' + index + '); "id="' + index + '" class="ModulosAyuda"  style="background:#064D94; ; color:#FFF;"  title="Ver preguntas de sección ayuda">' + value.nombre + '</a><div class="boxPreguntas' + index + '" style="display: none; ">';
                    $.each(value.item, function(index2, value2) { //Pregunta:  
                        preguntasAyuda = preguntasAyuda + '<a href="javascript:void(0);" class="pregunta_frecuente" onclick="MostrarRespuestas(' + "'" + "p.mostrarResps" + index2 + "'" + ', ' + index2 + ');" >' + value2.nombre + '</a> <p> ';
                        $.each(value2.item, function(index3, value3) { //Respuesta:
                            preguntasAyuda= preguntasAyuda + '<p class="mostrarResps' + index2 + ' respuesta" style="display:none" >' + value3 + '</p>';
                        });  //Fin recorrido respuestas a la pregunta                             
                    }); //Fin recorrido preguntas del modulo
                    preguntasAyuda = preguntasAyuda + '</div>' //Cierra el div que contiene las preguntas del modulo;
                });  //Fin recorrido de modulos   
                preguntasAyuda + '<p> </div>';
                $("#getPreguntasAyuda").html(preguntasAyuda); //Le paso el contenido al span con ese id   
            }
        });
    };
  
    this.ayuda_2_3_4 = function(){
        $.ajax({   
            type: "post",
            url: Chukupax.basePath + "/webservice/getUnaPregFrecuente",                        
            dataType: "json",
            data: { 
                pregunta: '¿Cómo obtengo mi usuario Banred para cargar mi Prex?'
            },
            success:function(data){     
                var preguntasAyuda = '';
                $.each(data, function(index, value) { //Modulo:
                    $.each(value.item, function(index2, value2) { //Pregunta:  
                        preguntasAyuda = preguntasAyuda + '<h3 >' + value2.nombre + '</h3> <p> ';
                        $.each(value2.item, function(index3, value3) { //Respuesta:
                            preguntasAyuda= preguntasAyuda + '<p>' + value3 + '</p>';
                        });  //Fin recorrido respuestas a la pregunta                             
                    }); //Fin recorrido preguntas del modulo
                });  //Fin recorrido de modulos   
                preguntasAyuda + '</p> </div>';
                $("#getPreguntaAyuda").html(preguntasAyuda); //Le paso el contenido al span con ese id
            }
        });
    };
}

function prexpay_p2p(){ 
    $( document ).ready(function() {
        if ($('#pin-countdown').length) {
            setTimeout(update_countdown, 1000);
        }
    });

    $('body').on("keydown", "input[name*='paymentPIN'], input[name*='paymentCVC']", function(e) {
        if(e.keyCode == 46 || e.keyCode == 8){
            if($(this).attr('tabindex') != 1){
                $(this).val('');
                anteriorTabindex($(this));                
            }            
        }        
    });

    $('body').on("keypress", "input[name*='paymentPIN'], input[name*='paymentCVC']", function(e) {        
        if(e.keyCode != 46 && e.keyCode != 8)
            siguienteTabindex($(this));
    });

    $( document ).ready(function() {
        if ($('#ping-loading-gif').length) {
            pinConfirmation();
        }
        if ($('#loading-change-p2p').length) {
            setTimeout(p2pConfirmation, 5000);
        }
    });
}

function promociones() {
    this.promoPedidosYa = function () {
        $('#generar').click(function() {
            document.getElementById('generar').style.display = 'none';
            document.getElementById('cantidadCodigos').style.display = 'none';
            document.getElementById('copiar').style.display = 'initial';
            $('#imgCodigo').addClass('animatedImg slideInUpImg');
            $('#informacion').addClass('animatedImg slideInUp');
            setInterval(function() {
                document.getElementById('informacionCodigo').style.visibility = 'visible';
            }, 300)
            $.ajax({   
                type: "post",
                url: "/promociones/generarCodigoPedidosYa",
                dataType: "json",
                success:function(data){
                    if (data.error == 1) {
                        document.getElementById('contenido2').style.display = 'none';
                        document.getElementById('contenido').style.display = 'none';
                    } else {
                        document.getElementById('loSiento2').style.display = 'none';
                        document.getElementById('loSiento').style.display = 'none';
                        document.getElementById('codePromo').innerHTML = data.codigo;
                    }
                }
            });            
        });

        $('#copiar').click(function() {
            copyToClipboard("codePromo");
        });

        function copyToClipboard(elementId) {
            var aux = document.createElement("input");
            valueCode = document.getElementById(elementId).innerHTML;
            aux.setAttribute("value", valueCode);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            document.body.removeChild(aux);

            $( "#msgCopie" ).fadeIn( "slow" );
            document.getElementById("ocultarAlCopiar").style.display = 'none';
            setTimeout(function(){
                $( "#msgCopie" ).fadeOut( "slow", function (){
                    document.getElementById("ocultarAlCopiar").style.display = 'flex';
                });
            }, 1000);
        }
    }

    function calculateDateDiff(now, limitDate) {
        if (document.getElementById("horas") && document.getElementById("minutos")) {
            var diferencia = limitDate.getTime() - now.getTime();
            var diffDays = Math.floor(diferencia / 86400000); // days
            var diffHrs = Math.floor((diferencia % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diferencia % 86400000) % 3600000) / 60000); // minutes
            if(diffDays > 0) {
                diffHrs += 24* diffDays;
            }
            var horas = (diffHrs > 9) ? diffHrs : "0" + diffHrs;
            var minutos = (diffMins > 9) ? diffMins : "0" + diffMins;

            document.getElementById("horas").textContent = horas;
            document.getElementById("minutos").textContent = minutos;
        }
    }

    this.uberNostalgia = function() {
        $('#copiar').click(function() {
            copyToClipboard("codePromo");
        });

        function copyToClipboard(elementId) {
            var aux = document.createElement("input");
            valueCode = document.getElementById(elementId).innerHTML;
            aux.setAttribute("value", valueCode);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            document.body.removeChild(aux);

            $( "#msgCopie" ).fadeIn( "slow" );
            document.getElementById("ocultarAlCopiar").style.display = 'none';
            setTimeout(function(){
                $( "#msgCopie" ).fadeOut( "slow", function (){
                    document.getElementById("ocultarAlCopiar").style.display = 'inherit';
                });
            }, 1000);
        }
        var now = new Date();
        var limitDate = new Date(2019,7,24,19,00,00);
        if( now < limitDate) {
            calculateDateDiff(now, limitDate);
            var timer = setInterval( function() {
                now = new Date();
                if ( now < limitDate) {
                    calculateDateDiff(now, limitDate);
                }
                else {
                    clearInterval(timer);
                    location.reload();
                }
            }, 60000) 
        }
    }

    this.promoUber = function() {
        $('#copiar').click(function() {
            copyToClipboard("codePromo");
        });

        function copyToClipboard(elementId) {
            var aux = document.createElement("input");
            valueCode = document.getElementById(elementId).innerHTML;
            aux.setAttribute("value", valueCode);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            document.body.removeChild(aux);

            $( "#msgCopie" ).fadeIn( "slow" );
            document.getElementById("ocultarAlCopiar").style.display = 'none';
            setTimeout(function(){
                $( "#msgCopie" ).fadeOut( "slow", function (){
                    document.getElementById("ocultarAlCopiar").style.display = 'inherit';
                });
            }, 1000);
        }
    }

}

function pinConfirmation(){
    if (!Chukupax.ajaxWorking) {
        Chukupax.ajaxWorking = true;
        $.post(
            Chukupax.basePath + "/webservice/accountUpdatePIN", {usuario: $("#userID").val()},
            function (data) {
                Chukupax.ajaxWorking = false;
                if (data.error == "ok") {
                    if(data.PINstatus == 4){
                        $(location).attr('href', $("#urlVerifPIN").attr("href"));
                    }
                } else {
                    if(data.textoError != "")
                        alert(data.textoError);
                    $(location).attr('href', $("#urlVerifPIN").attr("href"));
                }
            },
            'json'
        );
    }
    setTimeout(pinConfirmation, 5000);
}

function p2pConfirmation(){
    if (!Chukupax.ajaxWorking) {
        Chukupax.ajaxWorking = true;
        $.post(
            Chukupax.basePath + "/webservice/accountUpdateP2P", {state: $("#p2pCurrState").val(), id: $("#IdP2PLOADING").val(), token: $("#TokenP2PLOADING").val()},
            function (data) {
                Chukupax.ajaxWorking = false;
                if (data.error == "ok") {
                    if(data.newstate == "ok"){
                        $(location).attr('href', $("#urlVerifP2P").attr("href"));
                    }
                }
            },
            'json'
        );
    }
    setTimeout(p2pConfirmation, 5000);
}

function mapa(){
    this.init = function(){
        if (Chukupax.logged){
            $("#btn-menu-mapa").addClass('px-selected');
            $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        }
    };
}

function prextamo_paravos(){
    this.init = function(){
        if ($('#logged').val() == 0) {
            $.ajax({   
                type: "post",
                url: Chukupax.basePath + "/webservice/getPreguntasFrecuentesPrextamo",                        
                dataType: "json",
                success:function(data){  
                    var preguntasFrecuentes = '';
                    $.each(data, function(index, value) { //Modulo
                        if(value.nombre=="Prex a Prex: traspaso de dinero") {                              
                            preguntasFrecuentes = preguntasFrecuentes + '<a name="faqMoneda" id="a"></a>';
                        }
                        preguntasFrecuentes = preguntasFrecuentes + '<h4><a href="javascript:void(0);" onclick="Faqs($(this));" class="seccionFaqs" target="_self" title="Ver preguntas de sección"><img src="https://de2aqb3kqoyo2.cloudfront.net/web/icoDesplegar.png" alt="Desplegar" width="40"/> ' + value.nombre + '</a></h4><div class="boxPreguntas" style="display: none;">';
                        $.each(value.item, function(index2, value2) { 
                            preguntasFrecuentes = preguntasFrecuentes + '<p class="pregunta_frecuente">' + value2.item[index+1] + '</p>';
                        });
                        preguntasFrecuentes = preguntasFrecuentes + '</div>';
                    });                        
                    $("#getPreguntasFrecuentes").html(preguntasFrecuentes); 
                }
            });
        } else {
            $('#btn-menu-prextamo').addClass('px-selected');
            $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        }
    };
}


function uber(){
    this.init = function() {

    }
}

function promoamigo(){
    this.init = function() {
        console.log('promoamigo');

        $('.textotyc').hide();
    }

    $('.tyc').click(function(){
        if ($('.textotyc').hasClass('show')) {
            $('.textotyc').removeClass('show');
            $('.textotyc').hide();
        } else {
            $('.textotyc').addClass('show');
            $('.textotyc').show();
        }
    });
        
}

function prextamo(){

        // variables para slides.
        var varprev = 3;
        var varnext = 2;
    this.init = function() {
        $('.btn_consultar').click(function(){
            
            if( $('#chk_politica').prop('checked') == false) {
                Swal.fire(
                  '',
                  "<span style='{fuenteblack};'>Se debe aceptar la politica de privacidad para consultar su disponible</span>",
                  'warning'
                )
            } else {
                $('.formulario_buscando').css('display','flex');
                $('.formulario').css('display','none');

                var nombrecompleto = $('#inp_nombre').val();
                nombrecompleto = nombrecompleto.split(" ");
                var nombre = nombrecompleto[0];
                var apellido = nombrecompleto[1];

                var sexo = $('#inp_sexo option:selected').val();
                var ci = $('#inp_ci').val();
                var celular = '09' + $('#inp_celular').val();

                var dia = $('#FechaNacDia option:selected').val();
                var mes = $('#FechaNacMes option:selected').val();
                var anio = $('#FechaNacAnio option:selected').val();

                var fechanacimiento_guion = anio + "-" + mes + "-" + dia;
                var fechanacimiento = anio + "-" + mes + "-" + dia;

                if (nombre == '' || apellido == '' || ci == undefined || celular == '') {
                    $('.formulario_buscando').css('display','none');
                    $('.formulario').css('display','flex');

                    Swal.fire(
                      '',
                      "<span style='{fuenteblack};'>Todos los datos deben ser ingresados</span>",
                      'warning'
                    )
                } else {

                    if (celular.length > 9 || celular.length < 9) {
                        $('.formulario_buscando').css('display','none');
                        $('.formulario').css('display','flex');
                        Swal.fire(
                          '',
                          "<span style='{fuenteblack};'>El celular debe tener 9 dígitos</span>",
                          'warning'
                        )
                    } else if (ci.length > 8 || ci.length < 8) {
                        $('.formulario_buscando').css('display','none');
                        $('.formulario').css('display','flex');
                        Swal.fire(
                          '',
                          "<span style='{fuenteblack};'>La ci debe tener 8 dígitos</span>",
                          'warning'
                        )
                    } else {
                        $.ajax( {
                        url: '../index.html?mid=prextamo&func=obtenerusuario',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            nombre: nombre,
                            apellido: apellido,
                            sexo: sexo,
                            ci: ci,
                            celular: celular,
                            fecha: fechanacimiento_guion,
                            reenvio: '0',
                        },
                    } ).done( function( data ) { 
                        var idTabla = data.idTabla;
                        $('.formulario_buscando').css('display','none');
                        $('.formulario').css('display','flex');

                            switch(data.error){ 
                                case 0:
                                        var codigosms = "<div style='display:flex;flex-direction: column;flex-basis: auto;padding-left: 5%;padding-right: 5%;'>" +
                                        "<h1 style='{fuenteblack};font-size: 2.5vh;text-align: center;line-height: 3vh;padding: 5%;color:black;'>¡Solo un paso más!</h1><br>"+
                                        "<h1 style='{fuenteblack};font-size: 2.5vh;text-align: center;line-height: 3vh;color:black;'>Enviamos un código de 6 dígitos a tu celular, por favor ingresalo a continuación:<br></h1>" +
                                        "<div style='margin-top: 10px'><p><span id='mensaje_codigo'>Enviando código, si no lo recibiste, puedes solicitar uno nuevo en <strong></strong></span></p></div>" +
                                        "<a nohref id='sms_reenvio' type='button' role='button' tabindex='0' class='SwalBtn2 customSwalBtn' disabled='true' color='grey'>" + "No llego mi código " + "</a></div>" + 
                                        "<div style='margin-top: 30px'><h1 style='{fuenteblack};font-size: 2.3vh;text-align: center;line-height: 2.4vh;font-weight: 700;color:black;'>Código SMS:</h1></<div>";

                                        let timerInterval;
                                        let tiempo = 30000;

                                        Swal.fire({
                                        title: '',
                                        footer: "",
                                        html: codigosms,
                                        input: 'text',
                                        inputAttributes: {
                                        autocapitalize: 'on'
                                        },
                                        showCancelButton: false,
                                        confirmButtonText: 'CONTINUAR', 
                                        showLoaderOnConfirm: true,

                                        //showCancelButton: true,
                                        //cancelButtonText: "<a href='#' id='btn_reenvio' style='{fuenteblack};'>No llego mi código</a>",
                                        //reverseButtons: true,

                                        width: 450,
                                        /*timer: 3000,
                                        /* CODIGO TIEMPO */
                                        onBeforeOpen: () => {
                                            const content = Swal.getContent()
                                            const $ = content.querySelector.bind(content)

                                            const sms_reenvio = $('#sms_reenvio')

                                            sms_reenvio.addEventListener('click', () => {
                                                if (tiempo <= 0) {
                                                    tiempo = tiempo + 30000;
                                                    reenvio(nombre,apellido,sexo,ci,celular,fechanacimiento_guion);
                                                }
                                            })

                                            timerInterval = setInterval(() => {
                                                if (tiempo > 0) {
                                                    tiempo = tiempo - 100;
                                                }
                                              Swal.getContent().querySelector('strong')
                                                .textContent = (tiempo / 1000)
                                                  .toFixed(0)
                                            }, 100)
                                          },
                                          onClose: () => {
                                            clearInterval(timerInterval)
                                          },
                                        
                                        /// CODIGO MENSAJE
                                        preConfirm: (codigo) => {

                                        $.ajax( {
                                            url: '../index.html?mid=prextamo&func=confirmarcodigo',
                                            type: 'POST',
                                            dataType: 'json',
                                            data: {
                                                codigo: codigo,
                                                ci: ci,
                                                idTabla: idTabla
                                            },
                                        } ).done( function( data ) {
                                            if (data.error == 1) {
                                                Swal.fire(
                                                  '',
                                                  'El codigo no es correcto o ya expiro',
                                                  'warning'
                                                )
                                            } else {
                                                $('.formulario_buscando').css('display','flex');
                                                $('.formulario').css('display','none');
                                                $.ajax( {
                                                    url: '../index.html?mid=prextamo&func=consultardisponible',
                                                    type: 'POST',
                                                    dataType: 'json',
                                                    data: {
                                                        nombre: nombre,
                                                        apellido: apellido,
                                                        sexo: sexo,
                                                        ci: ci,
                                                        celular: celular,
                                                        fecha: fechanacimiento_guion,
                                                        idTabla: idTabla
                                                    },
                                                } ).done( function( data ) { 
                                                    $('.formulario_buscando').css('display','none');
                                                    $('.formulario').css('display','flex');

                                                    if (data.error != null) { 

                                                        var disponible = formatNumber(data.disponible);

                                                        switch (data.error){
                                                            case 0:
                                                            window.history.pushState("", "", '/prextamo?id=ok/cprexok');
                                                                var cliente_disponible = "<div style='display:flex;flex-direction: column;flex-basis: auto;padding-left: 5%;padding-right: 5%;'><img src='/assets/prex/img/prextamo/new/cel.png' class='center' style='padding: 5%;'><br>" +
                                                                "<h1 style='font-size: 3vh;text-align: center;line-height: 3vh;color:black;'>" + nombre + ", tienes disponible Prextamo <br>por <span style='{fuenteblack};'>$"+ disponible + " hasta en "+ data.cuotas + " cuotas de $"+ data.precioCuotas +".</span></h1><br>"+
                                                                "<h1 style='{fuente};font-size: 2.8vh;text-align: center;line-height: 3vh;color:black;'>¡Ingresá a la APP y solicitalo ahora!</h1>" +
                                                                "<div class='col-md-12'>" + 
                                                                "<div class='col-md-5 col-md-offset-1'><a target='_blank' href='https://play.google.com/store/apps/details?id=air.Prex&hl=es_419'><img src='/assets/prex/img/prextamo/new/gplay.png' class='center' style='padding-top: 5%;width:80%;'></a></div>" + 
                                                                "<div class='col-md-5'><a target='_blank' href='https://itunes.apple.com/uy/app/prex-card/id927400689?mt=8'><img src='/assets/prex/img/prextamo/new/apple.png' class='center' style='padding-top: 5%;width:80%;'></a></div></div><br>"+
                                                                "</div>";
                                                                swal.fire({
                                                                    type: '',
                                                                    html: cliente_disponible,
                                                                    width: 600,
                                                                });
                                                            break;
                                                            case 1:
                                                            window.history.pushState("", "", '/prextamo?id=ok?sprexok');
                                                                var nocliente_disponible = "<div style='display:flex;flex-direction: column;flex-basis: auto;padding-left: 5%;padding-right: 5%;'><img src='/assets/prex/img/prextamo/new/cel.png' class='center' style='padding: 5%;'><br>" +
                                                                "<h1 style='{fuente};font-size: 3vh;text-align: center;line-height: 3vh;color:black;'>" + nombre + ", tienes disponible Prextamo <br>por <span style='{fuente};'>$"+ disponible + " hasta en "+ data.cuotas + " cuotas de $"+ data.precioCuotas +".</span></h1><br>"+
                                                                "<h1 style='{fuente};font-size: 2.8vh;text-align: center;line-height: 3vh;color:black;'>¡Solicitá ahora tu Prex desde la App!</h1>" +
                                                                "<div class='col-md-12'>" + 
                                                                "<div class='col-md-5 col-md-offset-1'><a target='_blank' href='https://play.google.com/store/apps/details?id=air.Prex&hl=es_419'><img src='/assets/prex/img/prextamo/new/gplay.png' class='center' style='padding-top: 5%;width:80%;'></a></div>" + 
                                                                "<div class='col-md-5'><a target='_blank' href='https://itunes.apple.com/uy/app/prex-card/id927400689?mt=8'><img src='/assets/prex/img/prextamo/new/apple.png' class='center' style='padding-top: 5%;width:80%;'></a></div></div><br>"+
                                                                "<h1 style='{fuente};font-size: 2.8vh;text-align: center;line-height: 3vh;color:black;'> Luego de la primer carga te quedará <br> habilitada la opción de Prextamo </h1></div>";
                                                                swal.fire({
                                                                    type: '',
                                                                    html: nocliente_disponible,
                                                                    width: 600,
                                                                });
                                                            break;
                                                            case 2:
                                                            window.history.pushState("", "", '/prextamo?id=ok/sp');
                                                                var inhabilitado = "<div style='display:flex;flex-direction: column;flex-basis: auto;padding-left: 5%;padding-right: 5%;'><img src='/assets/prex/img/prextamo/new/reloj.png' class='center' style='padding: 5%;'><br>" +
                                                                "<h1 style='{fuente};font-size: 2.5vh;text-align: center;line-height: 3vh;color:black;'>" + nombre + ", en estos momento no tenemos Prextamo disponible para ti :(</h1><br>"+
                                                                "<h1 style='{fuente};font-size: 2.3vh;text-align: center;line-height: 3vh;color:black;'>A medida que utilices "+ 
                                                                "tu PREX esperamos poder tener Prextamo para ti pronto</h1><br></div>";
                                                                swal.fire({
                                                                    type: '',
                                                                    html: inhabilitado,
                                                                    width: 600,
                                                                });
                                                            break;
                                                            case 6:
                                                            window.history.pushState("", "", '/prextamo?id=ok/sp');
                                                                var inhabilitado = "<div style='display:flex;flex-direction: column;flex-basis: auto;padding-left: 5%;padding-right: 5%;'><img src='/assets/prex/img/prextamo/new/reloj.png' class='center' style='padding: 5%;'><br>" +
                                                                "<h1 style='{fuente}font-size: 2.5vh;text-align: center;line-height: 3vh;'>" + nombre + ", en estos momento no tenemos Prextamo disponible para ti :(</h1><br>"+
                                                                "<h1 style='{fuente};font-size: 2.3vh;text-align: center;line-height: 3vh;'>Puedes solicitar tu PREX y a medida que la utilices "+ 
                                                                "esperamos poder tener Prextamo para ti pronto</h1>" +
                                                                "<div class='col-md-12'>" +
                                                                "<h1 style='{fuente};font-size: 2.5vh;text-align: center;line-height: 3vh;'>¡Solicitala ahora desde la APP!</h1><br>"+ 
                                                                "<div class='col-md-5 col-md-offset-1'><a target='_blank' href='https://play.google.com/store/apps/details?id=air.Prex&hl=es_419'><img src='/assets/prex/img/prextamo/new/gplay.png' class='center' style='padding-top: 5%;width:80%;'></a></div>" + 
                                                                "<div class='col-md-5'><a target='_blank' href='https://itunes.apple.com/uy/app/prex-card/id927400689?mt=8'><img src='/assets/prex/img/prextamo/new/apple.png' class='center' style='padding-top: 5%;width:80%;'></a></div></div><br></div>";
                                                                swal.fire({
                                                                    type: '',
                                                                    html: inhabilitado,
                                                                    width: 600,
                                                                });
                                                            break;
                                                            case 3:
                                                            case 4:
                                                                Swal.fire(
                                                              'Atencion',
                                                              "<h1 style='{fuenteblack};'>Error de conexion, intente mas tarde</h1>",
                                                              'warning'
                                                            )
                                                            break;
                                                            case 5:
                                                                Swal.fire(
                                                                  '',
                                                                  "<div style='display:flex;flex-direction: column;flex-basis: auto;'><img src='/assets/prex/img/prextamo/new/cel.png' class='center' style='padding: 5%;'><br>"+
                                                                  "<h1 style='font-size: 2.5vh;text-align: center;line-height: 3vh;{fuenteblack};color:black;'>"+ nombre + ", verifica tu prextamo disponible en la App</h1>",
                                                                  ''
                                                                )
                                                            break;
                                                        }
                                                    } else {
                                                        Swal.fire(
                                                          'Atencion',
                                                          "<h1 style='{fuenteblack};'>Error de conexion, intente mas tarde</h1>",
                                                          'warning'
                                                        )
                                                    }
                                                });
                                            }
                                        });
                                      },
                                      allowOutsideClick: () => !Swal.isLoading()
                                    });
                                break;
                                case 1:
                                    Swal.fire(
                                      '',
                                      "<span style='{fuente};'>Este celular ya fue usado para consultar otra cedula</span>",
                                      'warning'
                                    )
                                break;
                                case 2:
                                    Swal.fire(
                                      '',
                                      "<span style='{fuente};'>Ocurrio un error, intentelo mas tarde</span>",
                                      'warning'
                                    )
                                break;
                                case 3:
                                    Swal.fire(
                                      '',
                                      "<span style='{fuente};'>Superaste el limite de consultas, vuelve a intentar mas tarde</span>",
                                      'warning'
                                    )
                                break;
                            }

                    });
                }// fin else control CI

                }// fin else

            } // fin verificar chk_politica    

        }) // fin btn_consultar

    }; // fin funcion

    function reenvio(nombre,apellido,sexo,ci,celular,fecha){ 
        $.ajax( {
            url: '../index.html?mid=prextamo&func=obtenerusuario',
            type: 'POST',
            dataType: 'json',
            data: {
                nombre: nombre,
                apellido: apellido,
                sexo: sexo,
                ci: ci,
                celular: celular,
                fecha: fecha,
                reenvio: '1',
            },
        }).done( function( data ) {
            switch (data.error){
                case 2:
                    Swal.fire(
                      '',
                      "<span style='{fuente};'>Ocurrio un error, intentelo mas tarde</span>",
                      'warning'
                    )
                break;
                case 3:
                    Swal.fire(
                      '',
                      "<span style='{fuente};'>Superaste el limite de consultas, vuelve a intentar mas tarde</span>",
                      'warning'
                    )
                break;
            }
        })
    }

        $(".carousel").swipe({

            swipe: function(event, direction, distance, duration, fingerCount, fingerData) {

                if (direction == 'left') $(this).carousel('next');
                if (direction == 'right') $(this).carousel('prev');

            },
            allowPageScroll:"vertical"

        });

    function formatNumber(num) {
        if (!num || num == 'NaN') return '-';
        if (num == 'Infinity') return '&#x221e;';
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num);// + ',' + cents);
    }

}// fin prextamo


function cargados() {
    this.saldo = function () {

    $("#creditel1").click(function(){
        $("#dialogSeguridad1").dialog({
            modal:true,
            buttons: {
                "Confirmar": function() {
                $.ajax({
                    url : Chukupax.basePath + "/creditel/vincularActualizarBDD",
                    dataType : "json",
                    data : {
                        tarjetaCreditel: $("#ultimosCuatroCreditel1").val(),
                        tipoConsulta: 'ajax'
                    },
                    beforeSend : function(){
                        $("#dialogCuotas").dialog({});
                        $(".ui-dialog-titlebar").hide();
                      },
                      success : function (data) {
                        if(data.error == 0){
                          $("#tarjetaCreditel").val($("#ultimosCuatroCreditel1").val());
                          $("#dialogSeguridad1").dialog( "close" );
                          location.reload();
                          $("#dialogCuotas").dialog();
                        }else{
                          $("#errorSeguridadCreditel1").html(data.textoError);
                          $("#codErrorSeguridadCreditel1").html('Error: ' + data.error);
                          $("#errorSeguridadCreditel1").attr('style', 'width: 89%;color: #a94442;background-color: #f2dede;border-color: #ebccd1;text-align: center;padding: 10px');
                          $("#ayudaSeguridadCreditel1").html('<a href="/ayuda/contacto/subject/No%20puedo%20asociar%20mi%20tarjeta%20Creditel" title="No puedo asociar mi tarjeta Creditel" target="_blank">Solicitar ayuda</a>');
                          $("#dialogCuotas").dialog( "close" );
                          $("#errorSeguridadCreditel").fadeIn("slow");
                          setTimeout(function(){
                            $("#errorSeguridadCreditel1").fadeOut("slow");
                          }, 3000);
                        }
                      },
                      error : function () {
                            // $.ajax({
                                      // url : Chukupax.basePath + "/webservice/statusServidoresCreditel",
                                      // dataType : "json",
                                      // data :{
                                      // 	codError: 1999,
                                      // 	textoError: "Error de conexión con Creditel."
                                      // },
                                    //   type : 'POST'
                                    // });
                            $("#dialogCuotas").dialog( "close" );
                            $("#dialogErrorSVCreditel").dialog({
                                                                    modal:true,
                                                                    buttons: {
                                                                      "Cerrar": function() {
                                                                        $(this).dialog( "close" );
                                                                        $("#listado_creditos").hide();
                                                                                                            $("#btnNuevasCuotas").css('display', 'none');
                                                                        $("#btn-cargar").prop('disabled', true);
                                                                                                            $("#btn-cargar").css("background", "#a8dcff");
                                                                                                            $("#creditel").prop('checked', false);
                                                                      }
                                                                    }
                                                                  });
                      },
                      type : 'POST'
                    });
                  },
                  "Cancelar": function() {
                                            $("#mostrarIFcreditel").fadeOut("slow");
                    $("#listado_creditos").hide();
                    $("#btn-cargar").prop('disabled', true);
                                                    $("#btn-cargar").css("background", "#a8dcff");
                    $(this).dialog( "close" );
                  }
                }
            });
  	});


    var $form = $("#formSolicitud");
    $form.validationEngine();
    $("#btn-cargar").prop('disabled', true);
    $("#btn-cargar").css("background", "#a8dcff"); 

    if (!Chukupax.logged || $("#terceros").val() == "terceros"){
      $("#btn-verificar").show();
        // $("#btn-cargar").prop('disabled', true); 
        // $("#btn-cargar").css("background", "#a8dcff");
    }
	  //CREDITEL            
    consultarCuotas = function(){
    	if ( Math.round(parseFloat($("#monto").val())) > 0) {
	    	$("#btnNuevasCuotas").css('display', 'block');
	      $("#dialogCuotas").dialog({
	        modal:true
	      });
	      $(".ui-dialog-titlebar").hide(); 
	      $.ajax({
	        url : Chukupax.basePath + "/creditel/recargaConsulta",
	        dataType : "json",
	        data : {
	          importe: $("#monto").val(),
	          moneda: $("#moneda").val()
	        },
	        beforeSend : function(){
	          $("#dialogCuotas").dialog({
	            modal:true
	          });
	          $(".ui-dialog-titlebar").hide();
	        },
	        success : function (data) {
	        	$("#dialogCuotas").dialog( "close" );
	         	if(data.error == 0 || data.error == 99990000){//Si vienen el error 99990000 es porque no tiene saldo suficiente en creditel para el monto ingresado
		          if(data.error == 99990000){
						    $("#btn-cargar").prop('disabled', true);
						    $("#btn-cargar").css("background", "#a8dcff");
			          $("#errorCuotasCreditel").html(data.textoError);
			       		$("#ErrorCodeCreditel").html('Error: ' + data.error);
			          $("#dialogCuotas").dialog( "close" );
			          if ( Math.round(parseFloat($("#monto").val())) > 0) {
			          	$("#monto").val(Math.round(parseFloat(data.importe)));
			          }else{
			          	$("#monto").val(1);
			          }
			          
			          $("#dialogErrorCuotas").dialog({
		              modal:true,
		              buttons: {
		               	"Cerrar": function() {                                            
		              		$(this).dialog( "close" );
		                }
		              }
		            });
		            $(".ui-dialog-titlebar").hide();
		            $("#errorCuotasCreditel").fadeIn("slow");
		          }

		          if (data.importe < 0) {
		          	$("#dialogImporteMenor").dialog({
		              modal:true,
		              buttons: {
		               	"Cerrar": function() {                                            
		              		$(this).dialog( "close" );
		                }
		              }
		            });

		            $("#btn-cargar").prop('disabled', true);
					    	$("#btn-cargar").css("background", "#a8dcff");
					    	$("#btnNuevasCuotas").css('display', 'none');
					    	$("#creditel").prop("checked", false);
		          }else{
		          	if($("#moneda").val() == 840){
				          var moneda_mostrar = 'U$S';
				        }else{
				          var moneda_mostrar = '$';
				        }
			          var importeCreditel = parseFloat(data.importe).toFixed(2);
			        	$html_cuotas = '<div class="credito_importe">Importe: ' + moneda_mostrar + ' ' + parseFloat(data.importe).toFixed(2) + '</div>';

			          $.each(data.listaCuotas, function( index, value ) {
			            if (data.listaCuotas[index].plazo == 1) {
			              var cuotas = 'cuota';	
			            }else{
			              var cuotas = 'cuotas';
			            }

			            $html_cuotas += '<div class="una_opcion">';
			            $html_cuotas += '<input type="radio" value="' + data.listaCuotas[index].plazo + '" name="plazo" data-tipo="H" class="medioSel" style="margin:0;" onclick="activaBtnCargar()"/>';
			            $html_cuotas += '<span class="cuotas"><span class="titulo"> Pagalo en ' + data.listaCuotas[index].plazo + ' ' + cuotas + ' de  </span>';
			            $html_cuotas += '$ ' + parseFloat(data.listaCuotas[index].valor_cuota).toFixed(2) + ' - ';
			          	$html_cuotas += '</span>';
			          	$html_cuotas += '<span class="cuotas" style="font-size: 10px!important;"><span class="titulo">(PTF : </span>$ ';
			            $html_cuotas += parseFloat(data.listaCuotas[index].total).toFixed(2);
			            $html_cuotas += ')</span>';
			          	$html_cuotas += '</div>';
			        	});
			          $("#listado_creditos").html($html_cuotas);                   
			          $("#listado_creditos").fadeIn("slow");
								$("#dialogCuotas").dialog( "close" );  

			        	$('input[type=radio][name=plazo]').change(function(){
									if ($(this).is(':checked')) {
										$("#btn-cargar").prop('disabled', false);
							    	$("#btn-cargar").css("background", "#3498db");
									}else{
										$("#btn-cargar").prop('disabled', true);
							    	$("#btn-cargar").css("background", "#a8dcff");
									}
								})
		          }                                                  
		        }else{
					    $("#btn-cargar").prop('disabled', true);
					    $("#btn-cargar").css("background", "#a8dcff");
							$("#errorCuotasCreditel").html(data.textoError.replace("?", "íni"));
							$("#ErrorCodeCreditel").html('Error: ' + data.error);
							$("#dialogCuotas").dialog( "close" );
							$("#dialogErrorCuotas").dialog({
		            modal:true,
		            buttons: {
		              "Cerrar": function() {
			              $("#listado_creditos").hide();
			              $(this).dialog( "close" );
			              $("#btnNuevasCuotas").css('display', 'none');
			              $("#btn-cargar").prop('disabled', true);
	    							$("#btn-cargar").css("background", "#a8dcff");
		              }
		            }
		        	});
			        // $(".ui-dialog-titlebar").hide();
			        $("#errorCuotasCreditel").fadeIn("slow");
		        }
		      },
          error : function () {
          	$("#dialogCuotas").dialog( "close" );
          	$.ajax({
              url : Chukupax.basePath + "/webservice/statusServidoresCreditel",
              dataType : "json",
              data :{
              	codError: 1999,
              	textoError: "Error de conexión con Creditel."
              },
              type : 'POST'
            });
          	$("#dialogErrorSVCreditel").dialog({
			        modal:true,
			        buttons: {
			          "Cerrar": function() {
			            $(this).dialog( "close" );
			            $("#listado_creditos").hide();
									$("#btnNuevasCuotas").css('display', 'none');
			            $("#btn-cargar").prop('disabled', true);
									$("#btn-cargar").css("background", "#a8dcff");
									$("#creditel").prop('checked', false);
			          }
			        }
			      });
          },
          type : 'POST'
	    	});
    	}else{
    		 $("#dialogImporteMayor").dialog({
          modal:true,
          buttons: {
            "Cerrar": function() {
              $(this).dialog( "close" );
              $("#listado_creditos").hide();
							$("#btnNuevasCuotas").css('display', 'none');
              $("#btn-cargar").prop('disabled', true);
							$("#btn-cargar").css("background", "#a8dcff");
							$("#creditel").prop('checked', false);
            }
          }
        });
    	}
  	}

  	$("#btnNuevasCuotas").click(function(){
  		consultarCuotas();
  	});
            
  	$('input[type=radio][name=IDmetodos]').change(function() {
      if (this.value == 77) { //77 es CREDITEL
      	$("#btn-cargar").prop('disabled', true);
    		$("#btn-cargar").css("background", "#a8dcff");
				$("#mostrarIFcreditel").fadeIn("slow");
	  		$(".CargasNoCreditel").css("display", "none");
	  		$("#advertenciaComisionNOCREDITEL").css("display", "none");
	  		// $('input[type=text][name=monto]').change(function(){ //Cuando sale del input #monto vuelvo a consultar las cuotas
    	// 		$('input[type=radio][name=IDmetodos]').change(function(){
    	// 			$(this).prop('selected', false)
    	// 		})
    	// 		consultarCuotas();
    	// 	});
        if($("#tarjetaCreditel").val() == 0){ //Si la cuenta no está vinculada muestro el dialog para que ingrese los últimos cuatro de su tarjeta creditel
          $("#dialogSeguridad").dialog({
            modal:true,
            buttons: {
              "Confirmar": function() {
                $.ajax({
                  url : Chukupax.basePath + "/creditel/vincular",
                  dataType : "json",
                  data : {
                    tarjetaCreditel: $("#ultimosCuatroCreditel").val(),
                    tipoConsulta: 'ajax'
                  },
                  beforeSend : function(){
                    $("#dialogCuotas").dialog({});
                    $(".ui-dialog-titlebar").hide();
                  },
                  success : function (data) {
                    if(data.error == 0){
                      $("#tarjetaCreditel").val($("#ultimosCuatroCreditel").val());
                      $("#dialogSeguridad").dialog( "close" );
                      $("#dialogCuotas").dialog( "close" );
                      consultarCuotas();                                  
                    }else{
                      // $("#errorSeguridadCreditel").html('Error: ' + data.error + ' - ' + data.textoError);
                      $("#errorSeguridadCreditel").html(data.textoError);
                      $("#codErrorSeguridadCreditel").html('Error: ' + data.error);
                      $("#errorSeguridadCreditel").attr('style', 'width: 89%;color: #a94442;background-color: #f2dede;border-color: #ebccd1;text-align: center;padding: 10px');
                      $("#ayudaSeguridadCreditel").html('<a href="/ayuda/contacto/subject/No%20puedo%20asociar%20mi%20tarjeta%20Creditel" title="No puedo asociar mi tarjeta Creditel" target="_blank">Solicitar ayuda</a>');
                      $("#dialogCuotas").dialog( "close" );
                      $("#errorSeguridadCreditel").fadeIn("slow");
                    }
                  },
                  error : function () {
                  	$.ajax({
		                  url : Chukupax.basePath + "/webservice/statusServidoresCreditel",
		                  dataType : "json",
		                  data :{
		                  	codError: 1999,
		                  	textoError: "Error de conexión con Creditel."
		                  },
		                  type : 'POST'
		                });
                  	$("#dialogCuotas").dialog( "close" );
                  	$("#dialogErrorSVCreditel").dialog({
							        modal:true,
							        buttons: {
							          "Cerrar": function() {
							            $(this).dialog( "close" );
							            $("#listado_creditos").hide();
													$("#btnNuevasCuotas").css('display', 'none');
							            $("#btn-cargar").prop('disabled', true);
													$("#btn-cargar").css("background", "#a8dcff");
													$("#creditel").prop('checked', false);
							          }
							        }
							      });
                  },
                  type : 'POST'
                });
              },
              "Cancelar": function() {
      					$("#mostrarIFcreditel").fadeOut("slow");
                $("#listado_creditos").hide();
                $("#btn-cargar").prop('disabled', true);
    						$("#btn-cargar").css("background", "#a8dcff");
                $(this).dialog( "close" );
              }
            }
          });
          $(".ui-dialog-titlebar").hide();//Si ya está vinculada 
        }else{
          consultarCuotas();
        }
      }else{
      	$("#mostrarIFcreditel").fadeOut("slow");
        $("#btnNuevasCuotas").css('display', 'none');
        $("#monto").css('width', '96%');
        $("#listado_creditos").fadeOut("slow");
      }
    });

    $('input[type=text][name=monto]').keyup(function(){ //Cuando sale del input #monto vuelvo a consultar las cuotas
			if ($("input:radio[name=IDmetodos]:checked").val() == 77) {
				$("#btnNuevasCuotas").css('display', 'block');
				$("#advertenciaComisionNOCREDITEL").css("display", "none");
				$("#advertenciaComisionNOCREDITEL").hide();
			}else if ($("input:radio[name=IDmetodos]:checked").val() == '') {
				$("#btnNuevasCuotas").css('display', 'none');
				$("#advertenciaComisionNOCREDITEL").css("display", "none");
				$("#advertenciaComisionNOCREDITEL").hide();
			}else{
				$("#btnNuevasCuotas").css('display', 'none');
			}
		});
     
    $('input[type=radio][name=IDmetodos]').change(function() {
      if (this.value == 777) { //777 es el grupo BANCOS
      	$("#btnNuevasCuotas").css('display', 'none');
        $("#divBancos").fadeIn("slow");
        $("#bancos").fadeOut("slow");
      }else if (this.value == 77){
        $("#divBancos").fadeOut("slow");
        $("#bancos").fadeIn("slow");
      }
    });// FIN CREDITEL
                
    $("#documento, input[name='tipoDocumento']").change(function () {
      $("#IDcuentas").val("");
      $("#advertenciaDocumento").hide();
      $(".custom-iniciales-carga").hide();
      $(".custom-iniciales-carga span").html("");
      $("#btn-verificar").show();
      $("#btn-cargar").prop('disabled', true);
      $("#btn-cargar").css("background", "#a8dcff");
    });

    $('#monto,#moneda').keyup(function () {
    		$("#listado_creditos").css('display', 'none');
    		$("#creditel").prop('checked', false);
    		$("#btnNuevasCuotas").css('display', 'none');
    		$("#advertenciaComisionNOCREDITEL").css('display', 'none');
    })

    function comprobarMonto(){
    	if ($("#moneda").val() == 840){
        $("#montoComision").html(window.ComisionUSD);
        $("#montoComisionLow").html(window.ComisionUSDLow);
      }else{
        $("#montoComision").html(window.Comision);
        $("#montoComisionLow").html(window.ComisionLow);
      }

    	$('#monto,#moneda').keyup(function () {
    		$("#listado_creditos").css('display', 'none');
    		if ($("input:radio[name=IDmetodos]:checked").val() == '') {
    			$("#advertenciaMontoMaximoBanred").css("display", "none");
    		}

    		if (!$("#creditel").is(":checked")) {
    			
			  			if (($("#monto").val() < 50 && $("#moneda").val() == 840) || ($("#monto").val() < 1500 && $("#moneda").val() == 858)) {
			  				$("#advertenciaComisionNOCREDITEL").fadeIn("slow");
			  			}else{
			  				$("#advertenciaComisionNOCREDITEL").fadeOut("slow");
			  			}

			  			if (	(($("#monto").val() > 500 && $("#moneda").val() == 840) || 
			  						($("#monto").val() > 10000 && $("#moneda").val() == 858)) && 
			  						(
			  							$("#bbva").is(":checked")
			  						)
			  					){
						        $("#advertenciaMontoMaximo").fadeIn("slow");
				      }else{
				        $("#advertenciaMontoMaximo").fadeOut("slow");
				      }

				      if (
				      		(($("#monto").val() >= 5000 && $("#moneda").val() == 840) || 
				      		($("#monto").val() >= 142000 && $("#moneda").val() == 858)) && $("#banred").is(":checked")){
				        $("#advertenciaMontoMaximoBanred").fadeIn("slow");
				      }else{
				        $("#advertenciaMontoMaximoBanred").fadeOut("slow");
				      }
				  // }else{
				  // 	$("#advertenciaMontoMaximoBanred").css("display", "none");		
				  // }
		    }else{
		      $("#advertenciaMontoMaximoBanred").css("display", "none");	
		    }
      })

      // $('#monto,#moneda').keyup(function () {
  			if (($("#monto").val() < 50 && $("#moneda").val() == 840) || ($("#monto").val() < 1500 && $("#moneda").val() == 858) && $("input:radio[name=IDmetodos]:checked").val() != 77) {
  				$("#advertenciaComisionNOCREDITEL").fadeIn("slow");
  			}else{
  				$("#advertenciaComisionNOCREDITEL").fadeOut("slow");
  			}

  			if (	(($("#monto").val() > 500 && $("#moneda").val() == 840) || 
  						($("#monto").val() > 10000 && $("#moneda").val() == 858)) && 
  						(	
  							$("#bbva").is(":checked")
  						) && !$("#creditel").is(":checked")
  					){
			        $("#advertenciaMontoMaximo").fadeIn("slow");
	      }else{
	        $("#advertenciaMontoMaximo").fadeOut("slow");
	      }

	      if (
	      		(($("#monto").val() >= 5000 && $("#moneda").val() == 840) || 
	      		($("#monto").val() >= 142000 && $("#moneda").val() == 858)) && $("#banred").is(":checked") && $("input:radio[name=IDmetodos]:checked").val() != 77 ){
	        $("#advertenciaMontoMaximoBanred").fadeIn("slow");
	      }else{
	        $("#advertenciaMontoMaximoBanred").fadeOut("slow");
	      }
      // })
    }

    $("#banred").change(function(){ // bind a function to the change event
      if( $(this).is(":checked") ){ // check if the radio is checked
      	comprobarMonto();
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db");
      	$("#advertenciaMontoMaximoBanred").fadeOut("slow");
      }else{
      	$("#advertenciaMontoMaximoBanred").fadeOut("slow");
      }
    });



		$("#banred").change (function(){
    	if( $(this).is(":checked") ){
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db"); 
				// $("#advertenciaMontoMaximo").fadeOut("slow");
			}
		});

		var hsbc = "no";
	  $("#HSBC").change(function(){ // bind a function to the change event
      if( $(this).is(":checked") ){ // check if the radio is checked
      	comprobarMonto();
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db");
      	if (hsbc != 'yes') {
          hsbc= "yes";
        	document.getElementById("banco").innerHTML = "HSBC";
          $("#dialogBanred").dialog({
            modal:true
        	});
		  	}
		  	$("#advertenciaMontoMaximo").fadeOut("slow");
			}
		});

		$("#creditel1").change(function(){
			if ($(this).is(":checked")) {
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db");
        $(this).prop("checked", false);
			}
		})

		$("#santander").change (function(){
                    if( $(this).is(":checked") ){
                        $("#btn-cargar").prop('disabled', false);
                        $("#btn-cargar").css("background", "#3498db");

                        $("#advertenciaMontoMaximoBanred").fadeOut("slow");
                        comprobarMonto();
                            if (($("#monto").val() >500 && $("#moneda").val() == 840) || ($("#monto").val() > 10000 && $("#moneda").val() == 858)){
                                $("#advertenciaMontoMaximo").fadeIn("slow");
                            }else{
                                $("#advertenciaMontoMaximo").fadeOut("slow");
                            }
			}
		});

		$("#bbva").change (function(){
			if( $(this).is(":checked") ){ 
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db");

      	$("#advertenciaMontoMaximoBanred").fadeOut("slow");
			  comprobarMonto();
				if (($("#monto").val() >500 && $("#moneda").val() == 840) || ($("#monto").val() > 10000 && $("#moneda").val() == 858)){
					$("#advertenciaMontoMaximo").fadeIn("slow");
				}else{
					$("#advertenciaMontoMaximo").fadeOut("slow");
				}
			}
		});

    $("#brou").change (function(){
	  	if( $(this).is(":checked") ){ 
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db");

      	$("#advertenciaMontoMaximoBanred").fadeOut("slow");
	  		comprobarMonto();
			  if (($("#monto").val() >500 && $("#moneda").val() == 840) || ($("#monto").val() > 10000 && $("#moneda").val() == 858)){
					$("#advertenciaMontoMaximo").fadeIn("slow");
				}else{
					$("#advertenciaMontoMaximo").fadeOut("slow");
				}
			}
		});

		var itau = "no";
	  $("#itau").change(function(){ // bind a function to the change event
      if( $(this).is(":checked") ){ // check if the radio is checked
      	comprobarMonto();
      	if (itau != 'yes') {
          itau= "yes";
          document.getElementById("banco").innerHTML = "ITAU";
          $("#dialogBanred").dialog({
            modal:true
         	});
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db");
        }
				$("#advertenciaMontoMaximo").fadeOut("slow");
      }
    });

		var scotiabank = "no";
		$("#scotiabank").change(function(){ // bind a function to the change event
			if( $(this).is(":checked") ){ // check if the radio is checked
				comprobarMonto();
				if (scotiabank != 'yes') {
					scotiabank= "yes";
					document.getElementById("banco").innerHTML = "SCOTIABANK";
					$("#dialogBanred").dialog({
						modal:true
					});
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db");
				}
				$("#advertenciaMontoMaximo").fadeOut("slow");
			}
		});

		var citi = "no";
		$("#citi").change(function(){ // bind a function to the change event
			if( $(this).is(":checked") ){ // check if the radio is checked
				comprobarMonto();
				if (citi != 'yes') {
					citi= "yes";
					document.getElementById("banco").innerHTML = "CITIBANK";
					$("#dialogBanred").dialog({
						modal:true
					});
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db");
				}
				$("#advertenciaMontoMaximo").fadeOut("slow");
			}
		});

    var bandes = "no";
    $("#bandes").change(function(){ // bind a function to the change event
      if( $(this).is(":checked") ){ // check if the radio is checked
      	comprobarMonto();
      	if (bandes != 'yes') {
         	bandes= "yes";
         	document.getElementById("banco").innerHTML = "BANDES";
         	$("#dialogBanred").dialog({
            modal:true
        	});
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db");
      	}
      	$("#advertenciaMontoMaximo").fadeOut("slow");
      }
    });

	  $("#paganza").change (function(){
	  	if( $(this).is(":checked") ){ 
        $("#btn-cargar").prop('disabled', false);
      	$("#btn-cargar").css("background", "#3498db");

      	$("#advertenciaMontoMaximoBanred").fadeOut("slow");
				$("#advertenciaMontoMaximo").fadeOut("slow");
			}
		});
                
    $("#btn-verificar").click(function () {
      var enableSubmit = true;
        if($('input[name="tipoDocumento"]:checked').val()){
          $("#logoff-doc").validationEngine("hide");
        }else{
          enableSubmit = false;
          $("#logoff-doc").validationEngine("showPrompt", "Seleccioná un tipo de documento.");
        }
                    
        if($('#documento').val()){
          $("#documento").validationEngine("hide");
        }else if(enableSubmit){
        	enableSubmit = false;
          $("#documento").validationEngine("showPrompt", "Ingrese el identificador del destinatario");
        }

        if($('#documento').val() && enableSubmit && !$("#IDcuentas").val()){
          if (!Chukupax.ajaxWorking) {
            Chukupax.ajaxWorking = true;
            enableSubmit = false;
                            
            $("#spinner-buscando").show();
            $("#advertenciaDocumento").hide();
            $(".custom-iniciales-carga").hide();
            $(".custom-iniciales-carga span").html("");

            $.ajax({
              url : Chukupax.basePath + "/carga/verificar_doc",
              dataType : "json",
              data : {  
                tipoDocumento : $('input[name="tipoDocumento"]:checked').val(),
                documento : $("#documento").val()
              },
              success : function (data) {
                if (data.error == "ok" && data.iniciales && data.cuenta) {
                  $("#IDcuentas").val(data.cuenta);
                  $(".custom-iniciales-carga span").html(data.iniciales);
                  $(".custom-iniciales-carga").show();
                  $("#btn-verificar").hide();
                  $("#btn-cargar").prop('disabled', false);
                	$("#btn-cargar").css("background", "#3498db");
                }else if(data.error != "ok" && data.textoError) {
                  $("#advertenciaDocumento").show();
                  $("#advertenciaDocumento").html(data.textoError);
                }else{
                  $("#advertenciaDocumento").show();
                  $("#advertenciaDocumento").html("Documento Inválido");
                }

              Chukupax.ajaxWorking = false;
              $("#spinner-buscando").hide();
            },
            error : function (data) {
              $("#advertenciaDocumento").show();
              $("#advertenciaDocumento").html("Documento Inválido");
              Chukupax.ajaxWorking = false;
              $("#spinner-buscando").hide();
            },
            dataType: 'json',
            type: 'POST'
          });
        }
      }
                    
      if(!enableSubmit){
        $("#btn-verificar").show();
        $("#btn-cargar").prop('disabled', true);
        $("#btn-cargar").css("background", "#a8dcff");
      }
    });
                
    $("#btn-cargar").click(function () {
    	var enableSubmit = true;
      if($('input[name="IDmetodos"]:checked').val()){
        $("#col-2-metodos").validationEngine("hide");
        // $("#dialogVerificandoDatos").dialog({}); 
        $(".ui-dialog-titlebar").hide();
      }else{
        enableSubmit = false;
        $("#col-2-metodos").validationEngine("showPrompt", "Seleccioná de donde vas a cargar.");
        $("#dialogVerificandoDatos").dialog( "close" );
      }
	    if(enableSubmit){
	      $('#formSolicitud').submit();
	    }
  	});
};

	this.envio_dinero = function () {
            $(document).ready(function()  {
                if($("#all-Envio-Container").innerWidth() <= 480)
                    $("#selectAccountIndetif-gral img").attr("src",
                        $("#selectAccountIndetif-gral img").attr("src").replace(".png", "-m.jpg"));
                
                var motivoMaxChars = 50;
                $("#remitenteMotivo-counter").append(
                        "Te restan <strong>"+  motivoMaxChars + 
                        "</strong> caracteres para indicar el motivo.");
                $("#remitenteMotivo").keyup(function(){
                    var remaining = motivoMaxChars -  $(this).val().length;
                    if($(this).val().length > motivoMaxChars){
                        $(this).val($(this).val().substr(0, motivoMaxChars));
                        remaining = 0;
                    }
                    
                    $("#remitenteMotivo-counter").html("Te restan <strong>"+  remaining + "</strong> caracteres para indicar el motivo.");
                    if(remaining <= 10)
                    {
                        $("#remitenteMotivo-counter").css("color","red");
                    }
                    else
                    {
                        $("#remitenteMotivo-counter").css("color","#797979");
                    }
                });
                    
            });
                $('#btnIngresarGiro').click(function (){                    
                    $("#divIngresarGiro").dialog({
                        width: 350,
                        show: "scale",
                        hide: "scale",
                        resizable: "false",
                        position: "center",
                        modal: "true"
                    });
                });
                
                $('#registroPrex-enviar-dinero, #registroPrex-enviar-dinero-input').click(function (){ 
                    $('#nombreDestinoLogin').val($('#nombreDestino').val());
                    $('#contactoDestinoLogin').val($('#contactoDestino').val());
                    $('#formPaymentLogin').submit();
                }); 
                
                $('#btnEditarEnvioDestinatario').click(function (){
                    $("#resumen-recipiente-envio").hide(200,
                        function(){
                            $("#formulario-recipiente-envio").show();
                            if($("#doc-type").val() == "cel")
                                $('#btnSelectAccountCel-ini').click();
                            if($("#doc-type").val() == "email")
                                $('#btnSelectAccountEmail-ini').click();
                            if($("#doc-type").val() == "ci")
                                $('#btnSelectAccountCI-ini').click();
                            if($("#divDatosRemitenteEnvio").length > 0)
                                $("#divDatosRemitenteEnvio").hide();
                            if($("#divEnvioLogin").length > 0)
                                $("#divEnvioLogin").hide();
                            if($("#remitente-envio-select").length > 0)
                                $("#remitente-envio-select").hide();
                            if($("#btnConfirmarIniciales").length > 0)
                                $("#btnConfirmarIniciales").hide();
                            
                            $("#submit-gral-data").show();
                            $("#btnContinuar").val("Continuar");
                        });
                });
                
                $('#btnIngresarUserEnvio').click(function (){
                    $('#divDatosRemitenteEnvio').hide();
                    $('#submit-gral-data').hide();
                    $('#divEnvioLogin').show();
                    $('#btnIngresarUserEnvio').css("background-color","#ccc");
                    $('#btnFormularioUserEnvio').css("background-color","#0863BF");
                });
                
                $('#btnFormularioUserEnvio').click(function (){
                    $('#divEnvioLogin').hide();
                    $('#divDatosRemitenteEnvio').show();
                    $('#submit-gral-data').show();
                    $('#btnIngresarUserEnvio').css("background-color","#0863BF");
                    $('#btnFormularioUserEnvio').css("background-color","#ccc");
                });
                
                $('#btnSelectAccountCel-ini, #btnSelectAccountEmail-ini, #btnSelectAccountCI-ini, ' +
                   '#btnSelectAccount1-icon, #btnSelectAccount2-icon, #btnSelectAccount3-icon').click(function (){
                    var clickedId = $(this).attr("id");
                    var clickedClass = $(this).attr("class");
                    $("#selectAccountIndetif-gral").hide(200,
                        function(){
                            var parts = clickedId.split("-");
                            var name = parts[0];
                            var type = parts[1];
                            
                            $("#selectAccountIndetif-select").show();
                            
                            $("#doc-type").val(name);
                            if(type === "ini"){
                                if(name === "btnSelectAccountEmail"){
                                    $("#doc").attr("type","email");
                                    clickedClass = clickedId;
                                }
                                else{
                                    $("#doc").attr("type","number");
                                    clickedClass = clickedId;
                                }
                            }
                            
                            var partsC = clickedClass.split("-");
                            var nameC = partsC[0];
                            var typeC = partsC[1];

                            if(type !== "ini" && nameC === "btnSelectAccountEmail"){
                                $("#doc").attr("type","email");
                            }
                            else{
                                $("#doc").attr("type","number");
                            }
                            
                            var inputHeight = $("#doc").innerHeight() + 17;
                            $("#doc-icons-container").css("height",inputHeight+"px");
                            $("#doc-icons-container img").css("height",(inputHeight * 3)+"px");
                            $("#doc-icons-container img").css("top","0");
                            if(typeC !== "icon"){
                                var calcWidthDocInput = Math.floor(
                                    $("#cont_doc").innerWidth() - 
                                    $("#doc-icons-container img").innerWidth() - 
                                    0.05 * $("#cont_doc").innerWidth()
                                );
                                $("#doc").css("width",calcWidthDocInput + "px");
                            }
                            
                            if(nameC === "btnSelectAccountCel"){
                                $("#doc-type").val("cel");
                                $("#btnSelectAccount1-icon").attr("class","btnSelectAccountCel-icon");
                                $("#btnSelectAccount2-icon").attr("class","btnSelectAccountEmail-icon");
                                $("#btnSelectAccount3-icon").attr("class","btnSelectAccountCI-icon");
                                $("#doc").attr("type","number");
                                $("#doc").attr("placeholder","09XXXXXXX");
                                $("#doc-icons-container img").css("top",(inputHeight * -2)+"px");
                            }
                            if(nameC === "btnSelectAccountEmail"){
                                $("#doc-type").val("email");
                                $("#btnSelectAccount1-icon").attr("class","btnSelectAccountEmail-icon");
                                $("#btnSelectAccount2-icon").attr("class","btnSelectAccountCel-icon");
                                $("#btnSelectAccount3-icon").attr("class","btnSelectAccountCI-icon");
                                $("#doc").attr("type","email");
                                $("#doc").attr("placeholder","email@enviar.com");
                                $("#doc-icons-container img").css("top",(inputHeight * -1)+"px");
                            }
                            if(nameC === "btnSelectAccountCI"){
                                $("#doc-type").val("ci");
                                $("#btnSelectAccount1-icon").attr("class","btnSelectAccountCI-icon");
                                $("#btnSelectAccount2-icon").attr("class","btnSelectAccountCel-icon");
                                $("#btnSelectAccount3-icon").attr("class","btnSelectAccountEmail-icon");
                                $("#doc").attr("type","number");
                                $("#doc").attr("placeholder","CI sin puntos ni guiones");
                                $("#doc-icons-container img").css("top","0");
                            }
                            
                            $("#doc").val($("#doc").attr("value"));
                            $("#doc").focus();
                            $("#doc-icons-buttons-container").css("width",$("#doc-icons-container img").css("width"));
                                
                        });
                });
                
                $('[name="IDmetodos"], #monto, #moneda').change(function () {
                    $("#advertenciaComision-p2p").hide();
                    $("#advertenciaComision").hide();
                    //alert($('[name="IDmetodos"]').val());
                    if ($("#monto").val() && $("#monto").val() && 
                        $('input[name="IDmetodos"]:checked').length){
                        if($(this).val() == "999"){
                            $("#advertenciaComision-p2p").show();
                            if ($("#moneda").val() == 840){
                                $("#montoComision-p2p").html("U$S 0.49");
                            }
                            else{
                                $("#montoComision-p2p").html("$9");
                            }
                        }
                        else{
                            if (($("#monto").val() < 50 && $("#moneda").val() == 840) ||
                                ($("#monto").val() < 1500 && $("#moneda").val() == 858)){
                                    $("#advertenciaComision").show();
                                    if ($("#moneda").val() == 840){
                                        $("#montoComision").html(window.ComisionUSD);
                                        $("#montoComisionLow").html(window.ComisionUSDLow);
                                    }
                                    else{
                                        $("#montoComision").html(window.Comision);
                                        $("#montoComisionLow").html(window.ComisionLow);
                                    }

                                    return false;
                            }
                        }
                    }
		});
                
                $("#remitenteMail").data("ok", false).change(function () {
                    
			$("#remitenteMail").validationEngine("hide").removeClass("incorrecto").removeClass("verificado").data("ok", false);
			$.post(
				Chukupax.basePath + "/solicitud/checkEmail", {
					email: $("#remitenteMail").val()
				}, function (data) {
					if (data.error && data.error == "ok") {
						$("#remitenteMail").removeClass("incorrecto").addClass("verificado").data("ok", true);
					} else {
						$("#remitenteMail").removeClass("verificado").addClass("incorrecto").data("ok", false);
						if (data.error != "fail 4")$("#remitenteMail").validationEngine("showPrompt", "El email no es correcto");
					}
				}, 'json');
		});
            
                $("#divMultiplesCuentasDestino").dialog({
                    width: 350,
                    show: "scale",
                    hide: "scale",
                    resizable: "false",
                    position: "center",
                    modal: "true"
                });                
                $("input[name=multiplesCuentas]:radio").change(function () {
                    $("input[name=multiplesCuentasDestino][value=" + $("input[name=multiplesCuentas]:checked").val() + "]").prop('checked', true);
                });
            
            
		$("#formSolicitud").validationEngine();
		$(document)
			.delegate("#btnCheckCI", "click", function () {
				if (!Chukupax.ajaxWorking && $("#formSolicitud").validationEngine("validate")) {
					Chukupax.ajaxWorking = true;
					$("#btnCheckCI").validationEngine("showPrompt", "Espere...");
					$.post(
						    Chukupax.basePath + "/usuarios/getCuentaByCI",
						{doc: $("#doc").val()},
						function (data) {
							Chukupax.ajaxWorking = false;
							if (data.error == "ok") {
								$("#nroCuenta").val(data.nroCuenta);
								$("#btnCheckCI").validationEngine("hide");
								$("#cont_doc").slideUp(500, function () {
									$("#cont_carga").slideDown();
								});
							} else if (data.msg && data.msg != "") {
								$("#btnCheckCI").validationEngine("showPrompt", data.msg);
							} else {
								$("#btnCheckCI").validationEngine("showPrompt", "Intente más tarde por favor");
							}
						},
						'json'
					);

				}
			})
			.delegate("#btnContinuar", "click", function () {

                            // add addressee validation
                            if($("#doc").val().length == 0){
                                if($("#doc-type").val() == "cel" || $("#doc-type").val() == '') $('#btnSelectAccountCel-ini').click();
                                if($("#doc-type").val() == "email") $('#btnSelectAccountEmail-ini').click();
                                if($("#doc-type").val() == "ci") $('#btnSelectAccountCI-ini').click();
                                // force validation
                                $('#doc').blur();
                                $('#doc').blur();

                                return;
                            }

                            if (!Chukupax.ajaxWorking && $("#formSolicitud").validationEngine("validate")) {
                                    Chukupax.ajaxWorking = true;
                                    $("#btnContinuar").validationEngine("showPrompt", "Espere...");
                                    $("#formSolicitud").submit();
                            }
			});
	};
}

function contactless(){
    this.init = function(){
        let scrollWeb = $('#scrollWeb').val();
        let scrollMobile = $('#scrollMobile').val();

        if(scrollWeb == '1') {
            $('html, body').animate({
                scrollTop: $("div.toScroll").offset().top - 50
            }, 1500);
        }
        else if (scrollMobile == '1') {
            $('html, body').animate({
                scrollTop: $("div.toScroll").offset().top
            }, 1500); 
        }

        let scrollWebSolicitar = $('#scrollWebSolicitar').val();
        let scrollMobileSolicitar = $('#scrollMobileSolicitar').val();

        if(scrollWebSolicitar == '1') {
            $('html, body').animate({
                scrollTop: $("div.toScrollSolicitar").offset().top
            }, 1000);
        }
        else if (scrollMobileSolicitar == '1') {
            $('html, body').animate({
                scrollTop: $("div.toScrollSolicitar").offset().top
            }, 1000); 
        }
    }
}

function carga() {
	this.ok = function (){
		if (Chukupax.logged) {
			setTimeout(function(){
				window.location.href = '/usuarios/cuentav2/'+$("#idc").val();
			});
		}
    }
    
    this.saldo = () => {
		const informacion = {
			modoCarga: 'me',
			dato: '',
			tipo: '',
			datoVerficiado: false,
			habilitarCarga: true,
			metodo: 0,
			metodoNombre: '',
			moneda: 858,
            monto: 0,
            iniciales: '',
            actualStep: 0,
			placeholder: {
				ci: 'Ingresa número de CI sin puntos ni guiones',
				cel: 'Ingresa número de celular',
				email: 'Ingresa el email'
			},
			permitidos: {
				monedas: [840, 858],
				metodos: [2, 3, 4, 13, 1301 ,77, 1304, 1303, 1305],
				tiposContacto: ['ci', 'cel', 'email']
			},
			creditel: {
				imagenTarjeta: 'https://de2aqb3kqoyo2.cloudfront.net/web/tarjetaCompletaCreditel.png',
				ultimosCuatro: '',
				disponible: 0,
				plazo: 1,
			},
			cotizacionUsd: {
				venta: 0,
				compra: 0
			},
			limites: {
				maximos: {
					2: {
						840: 3000,
						858: 80000
					},
					3: {
						840: 500,
						858: 15000
					},
					4: {
						840: 500,
						858: 10000
					},
					13: {
						840: 300,
						858: 10000
                    },
                    1301: {
						840: 500,
						858: 15000
					},
                    1303: {
						840: 500,
						858: 15000
					},
                    1304: {
						840: 500,
						858: 15000
					},
					77: {
						840: 0,
						858: 0
					}
				}
			},
			limiteTexto: (metodo, moneda) => {
				return `El monto máximo por carga con ${informacion.metodoNombre} es de ${(moneda == 840 ? 'U$S' : '$')} ${informacion.limites.maximos[metodo][moneda]} por transacción.`
			}
		};

		const helpers = {
			opciones: {
				ci: false,
				cel: false,
				email: false
			},

			modificarClase: (metodo, selector, clase) => {
				if (metodo == 'ADD') {
					if (!$(selector).hasClass(clase)) {
						$(selector).addClass(clase);
					}
				} else if (metodo == 'REMOVE') {
					if ($(selector).hasClass(clase)) {
						$(selector).removeClass(clase);
					}
				}
			},

			activarElementos: (active, type = 'ok') => {
				if (type == 'ok') {
					if (active) {
						helpers.modificarClase('REMOVE', '.imagenVerificado', 'hidden');
						helpers.modificarClase('REMOVE', '.containerVerificado', 'hidden');
						helpers.modificarClase('ADD', '.inputDestinatario', 'ok');
					} else {
						helpers.modificarClase('REMOVE', '.inputDestinatario', 'ok');
						helpers.modificarClase('ADD', '.imagenVerificado', 'hidden');
						helpers.modificarClase('ADD', '.containerVerificado', 'hidden');
					}
				} else {
					if (active) {
						helpers.modificarClase('REMOVE', '.imagenError', 'hidden');
						helpers.modificarClase('REMOVE', '.containerError', 'hidden');
						helpers.modificarClase('ADD', '.inputDestinatario', 'fail');
					} else {
						helpers.modificarClase('REMOVE', '.inputDestinatario', 'fail');
						helpers.modificarClase('ADD', '.imagenError', 'hidden');
						helpers.modificarClase('ADD', '.containerError', 'hidden');
					}
				}
			},

			cambiarInfoDestinatario: dato => {
				$(".destinatario").html(dato);
            },
            
            cambiarInfoDestinatarioMobile: dato => {
				$(".destinatario-mobile").html(dato);
            },
            
			formatearNumero: () => {
				switch(informacion.tipo) {
					case 'ci':
						const ci = informacion.dato;

						const ciSinVerificador = ci.slice(0, -1);
						const ciVerificador    = ci.slice(-1);
						
						let ciFormateada = `-${ciVerificador}`;

						const puntosDetectados = Math.ceil(ciSinVerificador.length / 3);
						const ciDivisor = -3;
						
						for (let index = 0; index < puntosDetectados; index++) {
							if (index == 0) {
								ciFormateada = ciSinVerificador.slice(-3) + ciFormateada;
							} else {
								ciFormateada = ciSinVerificador.slice(ciDivisor * (index + 1), ciDivisor * index) + '.' + ciFormateada;
							}
						}

						return ciFormateada;

					case 'cel':
						const celular = informacion.dato;

						let celFormateado = '';
						const celDivisor = -3;
						if (celular.length == 9) {
							for (let index = 0; index < 3; index++) {
								if (index == 0) {
									celFormateado = celular.slice(celDivisor) + ' ';
								} else {
									celFormateado = celular.slice(celDivisor * (index + 1), celDivisor * index) + ' ' + celFormateado;
								}
							}
						}

						return celFormateado;
				}
			},

			cambiarOpcion: (opt, desmarcar = 0) => {
                
				const tipos = Object.keys(helpers.opciones);
				tipos.map(o => {
                    helpers.modificarClase('REMOVE', `.${o}`, 'activo');

                    helpers.opciones[o] = false;
				});

				$(".inputDestinatario").val('');
				if (desmarcar == 1) {
                    informacion.tipo = 'ci';
                    
					$("#tipoDocumento").val('ci');

					helpers.modificarClase('ADD', 'button.verificar', 'hidden');
					helpers.modificarClase('ADD', 'button.siguiente-0', 'hidden');
					helpers.modificarClase('REMOVE', '.containerCi', 'hidden');
					helpers.modificarClase('ADD', '.containerCelular', 'hidden');
					helpers.modificarClase('ADD', '.containerEmail', 'hidden');
				} else {
					helpers.opciones[opt] = true;
					
					Object.values(helpers.opciones).map((o, i) => {
						if (o) {
							informacion.tipo = tipos[i];
                            helpers.modificarClase('REMOVE', '.containerInput' + tipos[i], 'hidden');
                            helpers.modificarClase('ADD', '.containerInput' + tipos[i], 'active');
						} else {
                            helpers.modificarClase('ADD', '.containerInput' + tipos[i], 'hidden');
                            helpers.modificarClase('REMOVE', '.containerInput' + tipos[i], 'active');
                            helpers.modificarClase('ADD', '.containerInput' + tipos[i], 'hidden');
                            helpers.modificarClase('REMOVE', '.containerInput' + tipos[i], 'active');
                        }
					});
					
					$("#tipoDocumento").val(informacion.tipo);

					helpers.modificarClase('ADD', `.${opt}`, 'activo');
					helpers.modificarClase('REMOVE', 'button.verificar', 'hidden');
                    helpers.modificarClase('ADD', 'button.siguiente-0', 'hidden');
                    if ($("div.wrapper").width() > 991) {
                        helpers.modificarClase('REMOVE', '.containerInput', 'hidden');     
                        helpers.modificarClase('ADD', '.containerInput', 'active');     
                    }               
				}

				helpers.modificarClase('ADD', 'button.verificar', 'deshabilitado');

				helpers.cambiarInfoDestinatario('Tipo de destinatario');

				helpers.activarElementos(false, 'error');
				helpers.activarElementos(false, 'ok');

				$(".inputDestinatario").attr('placeholder', informacion.placeholder[informacion.tipo]);
			},

			cambiarPaso: (from, to) => {
                window.scrollTo(0, 0);
                $(".paso.correcto").unbind();
                
                informacion.actualStep = to;
				helpers.modificarClase('ADD', `.carga-paso-${from}`, 'hidden');
				helpers.modificarClase('REMOVE', `.carga-paso-${to}`, 'hidden');
				
				helpers.modificarClase('ADD', `.paso-${to}`, 'activo');
                helpers.modificarClase('REMOVE', `.paso-${from}`, 'activo');
                if ($("div.wrapper").width() < 992) {
                    helpers.modificarClase('ADD', `.paso-${from}`, 'hidden');
                    helpers.modificarClase('REMOVE', `.paso-${to}`, 'hidden');
                    switch (to) {
                        case 0:
                            $('div.progress-bar').css({'width': '25%'});
                            break
                        case 1:
                            $('div.progress-bar').css({'width': '50%'});
                            break
                        case 2:
                            $('div.progress-bar').css({'width': '75%'});
                            break    
                        case 3:
                            $('div.progress-bar').css({'width': '90%'});
                            break
                    }
                }
                
				if (from < to) {
                    helpers.modificarClase('REMOVE', `.pasoCumplido-${from}`, 'hidden');
                    helpers.modificarClase('ADD', `.pasoNoCumplido-${from}`, 'hidden');
                    helpers.modificarClase('ADD', `.paso-${from}`, 'correcto');
				} else {
                    helpers.modificarClase('ADD', `.pasoCumplido-${to}`, 'hidden');
                    helpers.modificarClase('REMOVE', `.pasoNoCumplido-${to}`, 'hidden');
                    helpers.modificarClase('REMOVE', `.paso-${to}`, 'correcto');
                }
                
                $(".paso.correcto").click(function() {
                    helpers.cambiarPaso(informacion.actualStep, $(this).data('to'));
                });
			},

			verificar: () => {
                
				helpers.modificarClase('REMOVE', '.containerCargando', 'hidden');
				helpers.modificarClase('ADD', '.containerVerificar', 'hidden');
				$('.inputDestinatario').attr('disabled', 'disabled');
                
				$.ajax({
					url: "/carga/verificar_doc",
					dataType: "json",
					data: {  
						tipoDocumento: informacion.tipo,
                        documento: informacion.dato,
                        token: $("#receiverToken").val()
					},
					success: function(data) {
						if (data['error'] == 'ok' && data.iniciales && data.cuenta) {
                            informacion.datoVerficiado = true;
                            informacion.iniciales = data.iniciales;
							$("#IDcuentas").val(data.cuenta);
							$(".iniciales").html(data.iniciales);

							let extraInfoDestinatario = '';
							let extraInfoDestinatarioMobile = '';
                            switch (informacion.tipo) {
                                case 'ci':
                                    extraInfoDestinatario = '<br>CI ' + helpers.formatearNumero();
                                    extraInfoDestinatarioMobile = helpers.formatearNumero();
                                    break;

                                case 'cel':
                                    extraInfoDestinatario = '<br>Celular ' + helpers.formatearNumero();
                                    extraInfoDestinatarioMobile = helpers.formatearNumero();
                                    break;

                                case 'email':
                                    extraInfoDestinatario = '<br>Email ' + informacion.dato;
                                    extraInfoDestinatarioMobile = informacion.dato;
                                    break;
                            }
                            data.iniciales = '<br>' + data.iniciales;
                            data.inicialesMobile = data.iniciales.split("<br>")[1];
                            
                            helpers.cambiarInfoDestinatario('Destinatario ' + data.iniciales + extraInfoDestinatario);
                            helpers.cambiarInfoDestinatarioMobile(data.inicialesMobile + " " +extraInfoDestinatarioMobile)

							helpers.activarElementos(true, 'ok');
							helpers.activarElementos(false, 'error');

							helpers.modificarClase('ADD', 'button.verificar', 'hidden');
                            helpers.modificarClase('REMOVE', 'button.siguiente-0', 'hidden');         

						} else if (data.error != 'ok' && data.textoError) {
							$('.errorG').html(data.textoError);
                            
							helpers.activarElementos(false, 'ok');
							helpers.activarElementos(true, 'error');
						} else {
							$('.errorG').html('Este usuario no existe. Corrobora el número e intenta de nuevo');
                            
							helpers.activarElementos(false, 'ok');
							helpers.activarElementos(true, 'error');
						}

						helpers.modificarClase('ADD', '.containerCargando', 'hidden');
						helpers.modificarClase('REMOVE', '.containerVerificar', 'hidden');

						$('.inputDestinatario').removeAttr('disabled');
					},
					error: function(data) {
						$('.errorG').html('Este usuario no existe. Corrobora el número e intenta de nuevo');
                            
						helpers.activarElementos(false, 'ok');
						helpers.activarElementos(true, 'error');

						helpers.modificarClase('ADD', '.containerCargando', 'hidden');
						helpers.modificarClase('REMOVE', '.containerVerificar', 'hidden');

						$('.inputDestinatario').removeAttr('disabled');
					},
					type: 'POST'
				});
			},
			
			mostrarAlertaMonto: (texto) => {
				$("div.alerta > p > span").html(texto);

				if ($("div.alerta").hasClass('hidden')) {
					helpers.modificarClase('REMOVE', 'div.alerta', 'hidden');

					let timeOut = setTimeout(() => {
						helpers.modificarClase('ADD', 'div.alerta', 'hidden');

						clearTimeout(timeOut);
					}, 10000);
				}
			},
			
			comprobarMonto: (moneda, monto) => {
				informacion.habilitarCarga = true;
                
				informacion.moneda = Number(moneda);
				informacion.monto  = Number(monto);
                if(informacion.moneda == 858 && informacion.monto < 1500 && informacion.monto != 0) {
                    $("#textoAlerta").text("Se sumarán $ 69 de comisión porque la carga es inferior a $ 1.500");
                    helpers.modificarClase('REMOVE', 'div.alerta', 'hidden');
                } else if (informacion.moneda == 840 && informacion.monto < 50 && informacion.monto != 0){
                    $("#textoAlerta").text("Se sumarán U$S 2,5 de comisión porque la carga es inferior a U$S 50");
                    helpers.modificarClase('REMOVE', 'div.alerta', 'hidden');
                } else {
                    helpers.modificarClase('ADD', 'div.alerta', 'hidden');
                }

				$("#moneda").val(informacion.moneda);
                $("#monto").val(informacion.monto);
                
                $("p.montoCargar-mobile").html((informacion.moneda == 840) ? 'U$S' : '$' + " " + informacion.monto);
				
				if (isNaN(informacion.monto) || informacion.monto < 1) {
					informacion.habilitarCarga = false;

					helpers.modificarClase('ADD', '.siguiente-2', 'deshabilitado');

					return;
				}

				if (!informacion.permitidos.monedas.includes(informacion.moneda)) {
					informacion.habilitarCarga = false;
				}

				if (!informacion.permitidos.metodos.includes(informacion.metodo)) {
					informacion.habilitarCarga = false;
				}

				if (!informacion.permitidos.tiposContacto.includes(informacion.tipo)) {
					informacion.habilitarCarga = false;
				}

				if (informacion.monto > informacion.limites.maximos[informacion.metodo][informacion.moneda]) {
					informacion.habilitarCarga = false;
				}

				if (informacion.habilitarCarga) {
                    helpers.modificarClase('REMOVE', '.siguiente-2', 'deshabilitado');
                    if (informacion.metodo == 13 || informacion.metodo == 1303) helpers.modificarClase('ADD', 'div.avisoBanredCarga', 'hidden')
                    else if (informacion.metodo == 1301 || informacion.metodo == 1304) helpers.modificarClase('ADD', 'div.avisoSistarbancCarga', 'hidden')
                    else if (informacion.metodo == 2) helpers.modificarClase('ADD', 'div.avisoBrouCarga', 'hidden')
                    else if (informacion.metodo == 3) helpers.modificarClase('ADD', 'div.avisoSantanderCarga', 'hidden')
                    else if (informacion.metodo == 4) helpers.modificarClase('ADD', 'div.avisoBbvaCarga', 'hidden');
				} else {
                    helpers.modificarClase('ADD', '.siguiente-2', 'deshabilitado');
                    if (informacion.metodo == 13 || informacion.metodo == 1303) helpers.modificarClase('REMOVE', 'div.avisoBanredCarga', 'hidden')
                    else if (informacion.metodo == 1301 || informacion.metodo == 1304) helpers.modificarClase('REMOVE', 'div.avisoSistarbancCarga', 'hidden')
                    else if (informacion.metodo == 2) helpers.modificarClase('REMOVE', 'div.avisoBrouCarga', 'hidden')
                    else if (informacion.metodo == 3) helpers.modificarClase('REMOVE', 'div.avisoSantanderCarga', 'hidden')
                    else if (informacion.metodo == 4) helpers.modificarClase('REMOVE', 'div.avisoBbvaCarga', 'hidden');
				}
			},

			verificarCarga: () => {
				if (isNaN(informacion.monto) || informacion.monto < 1) {
					return false;
				}

				if (!informacion.permitidos.monedas.includes(informacion.moneda)) {
					return false;
				}

				if (!informacion.permitidos.metodos.includes(informacion.metodo)) {
					return false;
				}

				if (!informacion.permitidos.tiposContacto.includes(informacion.tipo)) {
					return false;
				}

				if (informacion.monto > informacion.limites.maximos[informacion.metodo][informacion.moneda]) {
					Swal.fire(
						'Aviso',
						informacion.limiteTexto(informacion.metodo, informacion.moneda),
						'warning'
					);

					return false;
				}

				if (!informacion.habilitarCarga) {
					return false;
				}
				
				return true;
			},

			cambiarMedioPago: (_this, desmarcar = 0) => {
				helpers.modificarClase('REMOVE', '.pago-medio.seleccionado', 'seleccionado');

				if (desmarcar == 0) {
					informacion.metodo       = $(_this).data('metodo');
					informacion.metodoNombre = $(_this).data('nombre').toUpperCase();

                    if ($("div.wrapper").width() > 991) {
                        $(".siguiente-2").html(informacion.metodo != 77 ? 'cargar' : 'siguiente');
                    }
					helpers.modificarClase('ADD', _this, 'seleccionado');
					helpers.modificarClase('REMOVE', '.siguiente-1', 'deshabilitado');
					
					if (informacion.metodo == 77) {
						if ($("#ultimosCuatroCreditel").val().length == 4) {
							informacion.creditel.ultimosCuatro = $("#ultimosCuatroCreditel").val();
						} else {
							helpers.consultarTarjetaCreditel();
						}
					}
				} else {
					informacion.metodo       = 0;
					informacion.metodoNombre = '';

					helpers.modificarClase('ADD', '.siguiente-1', 'deshabilitado');
				}

				$("#IDmetodos").val(informacion.metodo);
				$("#nombreMetodo").html(informacion.metodoNombre);
				$("p.metodoPago-mobile").html(informacion.metodoNombre);
                $('.metodo-de-pago').html('Método de pago<br>' + informacion.metodoNombre);

				helpers.modificarClase((informacion.metodo == 13 || informacion.metodo == 1303) ? 'REMOVE' : 'ADD', 'div.avisoBanred', 'hidden');
                helpers.modificarClase((informacion.metodo == 1301 || informacion.metodo == 1304) ? 'REMOVE' : 'ADD', 'div.avisoSistarbanc', 'hidden');
				helpers.modificarClase((informacion.metodo == 3) ? 'REMOVE' : 'ADD', 'div.avisoSantander', 'hidden');
				helpers.modificarClase((informacion.metodo == 4) ? 'REMOVE' : 'ADD', 'div.avisoBbva', 'hidden');
			},

			actualizarCotizacion: () => {
				$.ajax({
					url: '/carga/cotizacion_usd',
                    dataType: 'json',
                    data: {
                        token: $("#cotizacionToken").val()
                    },
					type: "POST",
					success: cotizacion => {
						if (cotizacion.error == 0) {
							informacion.cotizacionUsd.venta  = cotizacion.venta;
							informacion.cotizacionUsd.compra = cotizacion.compra;
						}
					}
				});
			},

			consultarTarjetaCreditel: () => {
					Swal.fire({
						html: `
							<img width="80%" src="${informacion.creditel.imagenTarjeta}">
							<br><br>Por seguridad debe ingresar los últimos cuatro dígitos de su tarjeta creditel.
						`,
						input: 'number',
						inputPlaceholder: 'XXXX',
						showCancelButton: true,
						cancelButtonText: 'Cancelar',
						confirmButtonText: 'Confirmar',
						showLoaderOnConfirm: true,
						preConfirm: (numeroTarjeta) => {
							return $.ajax({
								url: '/creditel/vincularActualizarBDD',
								dataType: 'json',
								data: {
									tarjetaCreditel: numeroTarjeta,
									tipoConsulta: 'ajax'
								},
								success: data => {
                                    console.log(data);
									if (data.error == 0) {
										informacion.creditel.ultimosCuatro = numeroTarjeta;
										$("#ultimosCuatroCreditel").val(informacion.creditel.ultimosCuatro);

										return data;
									} else {
										Swal.showValidationMessage((data.textoError != undefined) ? data.textoError : 'Ha ocurrido un error, consulte');
									}
								},
								type: 'POST'
							});
						},
						allowOutsideClick: () => !Swal.isLoading()
				}).then(result => {
					if (result.value) {
						helpers.consultarDisponibleCreditel();
					} else {
						helpers.cambiarMedioPago(null, 1);
					}
				});
			},

			consultarCuotasCarga: (monto, moneda) => {
					Swal.fire({
						type: 'info',
						title: 'Consultando cuotas...',
						showConfirmButton: false
					});

					$.ajax({
						url: "/creditel/recargaConsulta",
						dataType: "json",
						data: {
							importe: monto,
							moneda: moneda
						},
						success: data => {
							if ([0, 99990000].includes(data.error)) {
								if (data.error == 99990000) {
										Swal.fire({
											title: 'Error',
											type: 'warning',
											text: 'No tienes suficiente saldo disponible en tu tarjeta CREDITEL',
											allowOutsideClick: false
										})
										.then(res => {
											if (res.value) {
												// CERRO
											} else {
												// CERRO
											}
										});
										// $("#btn-cargar").prop('disabled', true);
										// $("#btn-cargar").css("background", "#a8dcff");
										// $("#errorCuotasCreditel").html(data.textoError);
										// $("#ErrorCodeCreditel").html('Error: ' + data.error);
										// $("#dialogCuotas").dialog( "close" );
										// if (Math.round(parseFloat(monto)) > 0) {
										//     $("#monto").val(Math.round(parseFloat(data.importe)));
										// } else {
										//     $("#monto").val(1);
										// }
				
										// $("#dialogErrorCuotas").dialog({
										//     modal:true,
										//     buttons: {
										//         "Cerrar": function() {                                            
										//             $(this).dialog( "close" );
										//         }
										//     }
										// });
										// $(".ui-dialog-titlebar").hide();
										// $("#errorCuotasCreditel").fadeIn("slow");
								} else {
									if (data.importe < 0) {
										// $("#dialogImporteMenor").dialog({
										//     modal:true,
										//     buttons: {
										//         "Cerrar": function() {                                            
										//             $(this).dialog( "close" );
										//         }
										//     }
										// });

										// $("#btn-cargar").prop('disabled', true);
										// $("#btn-cargar").css("background", "#a8dcff");
										// $("#btnNuevasCuotas").css('display', 'none');
										// $("#creditel").prop("checked", false);
									} else {
										$(".cuota-monto").html(`${(moneda == 840) ? 'U$S' : '$'} ${parseFloat(data.importe).toFixed(2)}`);
															
										const generateLineaCuota = (plazo, valorCuota, total) => {
											return `
												<div class='col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1 cuota-opcion' data-image='cuota-opcion-${plazo}' data-plazo='${plazo}' data-valor='${valorCuota}' data-total='${total}'>
													${plazo} cuota${(plazo != 1) ? 's' : '' } de $ ${parseFloat(valorCuota).toFixed(2)}
													<img class='cuota-imagen cuota-opcion-${plazo} hidden' src='/assets/prex/img/carga/icon_ok.svg'> 
												</div>
											`;
										}
															
										let domCuotas = '';
										data.listaCuotas.map(cuota => {
											domCuotas += generateLineaCuota(cuota.plazo, cuota.valor_cuota, cuota.total);
										});
										
										$(".carga-cuotas-listado").html(domCuotas);

										helpers.eventoCantidadCuotas();

										helpers.modificarClase('ADD', '.carga-paso-2', 'hidden');
										helpers.modificarClase('REMOVE', '.carga-paso-cuotas', 'hidden');

										Swal.close();
									}                                                  
								}
							} else {
								// $.ajax({
								//     url: Chukupax.basePath + "/webservice/statusServidoresCreditel",
								//     dataType: "json",
								//     data: {
								//         codError: data.error,
								//         textoError: data.textoError
								//     },
								//     type: 'POST'
								// });
								// $("#btn-cargar").prop('disabled', true);
								// $("#btn-cargar").css("background", "#a8dcff");
								// $("#errorCuotasCreditel").html(data.textoError.replace("?", "�ni"));
								// $("#ErrorCodeCreditel").html('Error: ' + data.error);
								// $("#dialogCuotas").dialog( "close" );
								// $("#dialogErrorCuotas").dialog({
								//     modal:true,
								//     buttons: {
								//         "Cerrar": function() {
								//             $("#listado_creditos").hide();
								//             $(this).dialog( "close" );
								//             $("#btnNuevasCuotas").css('display', 'none');
								//             $("#btn-cargar").prop('disabled', true);
								//             $("#btn-cargar").css("background", "#a8dcff");
								//         }
								//     }
								// });
								// $(".ui-dialog-titlebar").hide();
								// $("#errorCuotasCreditel").fadeIn("slow");
							}
						},
						error: () => {
							// $("#dialogCuotas").dialog( "close" );
							// $.ajax({
							//     url : Chukupax.basePath + "/webservice/statusServidoresCreditel",
							//     dataType : "json",
							//     data :{
							//         codError: 1999,
							//         textoError: "Error de conexi�n con Creditel."
							//     },
							//     type : 'POST'
							// });
							// $("#dialogErrorSVCreditel").dialog({
							//     modal:true,
							//     buttons: {
							//         "Cerrar": function() {
							//             $(this).dialog( "close" );
							//             $("#listado_creditos").hide();
							//             $("#btnNuevasCuotas").css('display', 'none');
							//             $("#btn-cargar").prop('disabled', true);
							//             $("#btn-cargar").css("background", "#a8dcff");
							//             $("#creditel").prop('checked', false);
							//         }
							//     }
							// });
						},
						type: 'POST'
				});
			},

			consultarDisponibleCreditel: () => {
				Swal.fire({
					title: 'Consultando disponible...',
					type: 'info',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false
				});

               $.ajax({
                    url: '/creditel/getDisponibleTarjeta',
                    dataType: 'json',
                    type: "POST",
                    data: {
                        ci : $('#documento').val()
                    },
                    success: disponible => {

                        console.log(disponible); 
                        Swal.close();
                        if (disponible.error == 0) {
                            informacion.creditel.disponible = Number(disponible.disponible);
                            informacion.limites.maximos[77][858] = informacion.creditel.disponible;
                            informacion.limites.maximos[77][840] = Number.parseFloat(Number(informacion.creditel.disponible / informacion.cotizacionUsd.venta).toFixed(2));

                            helpers.cambiarPaso(1, 2);

                            Swal.close();
                        } else {
                            Swal.fire({
                                title: 'Ha ocurrido un error',
                                html: (disponible.textoError != undefined) ? disponible.textoError : 'Ha ocurrido un error, intente mas tarde',
                                type: 'error',
                                showCancelButton: false,
                                showConfirmButton: true
                            })
                            .then(result => {
                                helpers.cambiarMedioPago(null, 1);
                            });
                        }
                    },
                    error: err => {
                        Swal.fire({
                            title: 'Ha ocurrido un error',
                            html: 'Ha ocurrido un error, intente mas tarde',
                            type: 'error',
                            showCancelButton: false,
                            showConfirmButton: true
                        })
                        .then(result => {
                            helpers.cambiarMedioPago(null, 1);
                        });
                    }
                });

/*
				$.ajax({
					url: '/creditel/getDisponibleTarjeta',
					dataType: 'json',
					type: "POST",
					success: disponible => {

                        Swal.close();
						if (disponible.error == 0) {
							informacion.creditel.disponible = Number(disponible.disponible);
							informacion.limites.maximos[77][858] = informacion.creditel.disponible;
							informacion.limites.maximos[77][840] = Number.parseFloat(Number(informacion.creditel.disponible / informacion.cotizacionUsd.venta).toFixed(2));

							helpers.cambiarPaso(1, 2);

							Swal.close();
						} else {
							Swal.fire({
								title: 'Ha ocurrido un error',
								html: (disponible.textoError != undefined) ? disponible.textoError : 'Ha ocurrido un error, intente mas tarde',
								type: 'error',
								showCancelButton: false,
								showConfirmButton: true
							})
							.then(result => {
								helpers.cambiarMedioPago(null, 1);
							});
						}
					},
					error: err => {
						Swal.fire({
							title: 'Ha ocurrido un error',
							html: 'Ha ocurrido un error, intente mas tarde',
							type: 'error',
							showCancelButton: false,
							showConfirmButton: true
						})
						.then(result => {
							helpers.cambiarMedioPago(null, 1);
						});
					}
				});*/
			},

			eventoCantidadCuotas: () => {
				$(".cuota-opcion").click(function() {
					informacion.creditel.plazo = $(this).data('plazo');

					$("#plazo").val(informacion.creditel.plazo);

					helpers.modificarClase('REMOVE', '.cuota-opcion.marcada', 'marcada');

					Object.values($("img.cuota-imagen")).map(e => {
						helpers.modificarClase('ADD', e, 'hidden');
					});

					const image = 'img.' + $(this).data('image');
					helpers.modificarClase('REMOVE', image, 'hidden');

					helpers.modificarClase('ADD', this, 'marcada');
					helpers.modificarClase('REMOVE', 'button.siguiente-cuota', 'deshabilitado');
				});
			},

			cambiarOpcionCarga: (_this) => {
				helpers.modificarClase('REMOVE', '.tabChanger.activo', 'activo');
				helpers.modificarClase('ADD', _this, 'activo');
                
				informacion.modoCarga = $(_this).data('mode');
                const modoCarga = informacion.modoCarga;
                
				$(`img.${modoCarga}TabImage`).attr('src', '/assets/prex/img/carga/icon_tarjActive.svg');
				$((modoCarga == 'me' ? 'img.otherTabImage' : 'img.meTabImage')).attr('src', '/assets/prex/img/carga/icon_tarjinactive.svg');

				helpers.modificarClase('ADD', '.carga-paso-2', 'hidden');

				$("#IDcuentas").val($('#IDcuentasBackup').val());
				if (modoCarga == 'me') {
                    helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-md-6');
                    helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-xs-6');
                    helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-md-4');
                    helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-xs-4');
                    $(".pasoNoCumplido-1").html("1");
                    $(".pasoNoCumplido-2").html("2");
                    helpers.modificarClase('REMOVE', '.containerCuentas', 'hidden');
                    $('div.pasos div.paso-1').addClass('auxpaso1');
                    $("p.destinatario-mobile").html('');
                    // $('div.nombre-paso > p').html('');
                    informacion.dato = $('#documento').val();
                    informacion.iniciales = $('#iniciales').val();
                    informacion.tipo = 'ci';

					const cantidadPasos = 4;
					for (let i = 0; i < cantidadPasos; i++) {
						if (!$(`div.pasos div.paso-${i}`).hasClass('col-md-6')) {
							$(`div.pasos div.paso-${i}`).removeClass('col-md-4');

							if (!$(`div.pasos div.paso-${i}`).hasClass('col-md-6')) {
								$(`div.pasos div.paso-${i}`).addClass('col-md-6');
							}
						}

						if (!$(`div.pasos div.paso-${i}`).hasClass('col-xs-6')) {
							$(`div.pasos div.paso-${i}`).removeClass('col-xs-4');

							if (!$(`div.pasos div.paso-${i}`).hasClass('col-xs-6')) {
								$(`div.pasos div.paso-${i}`).addClass('col-xs-6');
							}
						}
					}

					helpers.modificarClase('ADD', '.paso-0', 'hidden');

					if ($(".paso-2").hasClass('activo')) {
						helpers.cambiarPaso(2, 1);
                    }
                    
                    if ($(".paso-3").hasClass('activo')) {
						helpers.cambiarPaso(3, 2);
						helpers.cambiarPaso(2, 1);
					}

					if ($(".paso-0").hasClass('activo')) {
						helpers.cambiarPaso(0, 1);
					}

					helpers.modificarClase('ADD', '.anterior-0', 'hidden');

					helpers.cambiarOpcion(null, 1);
				} else {
					helpers.modificarClase('ADD', '.containerCuentas', 'hidden');
                    helpers.modificarClase('ADD', 'div.containerInputci', 'hidden');
                    helpers.modificarClase('ADD', 'div.containerInputcel', 'hidden');
                    helpers.modificarClase('ADD', 'div.containerInputemail', 'hidden');
                    helpers.modificarClase('ADD', 'div.containerInput', 'hidden');
                    helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-md-6');
                    helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-xs-6');
                    helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-md-4');
                    helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-xs-4');
                    $('div.pasos div.paso-1').removeClass('auxpaso1');
                    $("p.destinatario-mobile").html('');
                    $(".pasoNoCumplido-1").html("2");
                    $(".pasoNoCumplido-2").html("3");

					const cantidadPasos = 4;
					for (let i = 0; i < cantidadPasos; i++) {
						if ($(`div.pasos div.paso-${i}`).hasClass('col-md-6')) {
							$(`div.pasos div.paso-${i}`).removeClass('col-md-6');

							if (!$(`div.pasos div.paso-${i}`).hasClass('col-md-4')) {
								$(`div.pasos div.paso-${i}`).addClass('col-md-4');
							}
						}

						if ($(`div.pasos div.paso-${i}`).hasClass('col-xs-6')) {
							$(`div.pasos div.paso-${i}`).removeClass('col-xs-6');

							if (!$(`div.pasos div.paso-${i}`).hasClass('col-xs-4')) {
								$(`div.pasos div.paso-${i}`).addClass('col-xs-4');
							}
						}
					}

					helpers.modificarClase('ADD', '.carga-paso-cuotas', 'hidden');
					helpers.modificarClase('ADD', 'button.siguiente-cuota', 'deshabilitado');

                    helpers.modificarClase('REMOVE', '.paso-0', 'hidden');
					helpers.modificarClase('REMOVE', '.anterior-0', 'hidden');

                    if ($(".paso-3").hasClass('activo')) {
						helpers.cambiarPaso(3, 2);
						helpers.cambiarPaso(2, 1);
						helpers.cambiarPaso(1, 0);
                    }
                    
					if ($(".paso-2").hasClass('activo')) {
						helpers.cambiarPaso(2, 1);
						helpers.cambiarPaso(1, 0);
                    }

					if ($(".paso-1").hasClass('activo')) {
						helpers.cambiarPaso(1, 0);
					}
				}
			}
		};

		const modulo = {
			common: () => {
				// SE CLICKEA UNA OPCION A CARGAR
				$('div.metodo, div.tituloMetodo').click(function() {
					helpers.cambiarOpcion($(this).data('option'));
				});

				// SE ESCRIBE EL DATO DEL DESTINATARIO
				$('.inputDestinatario').keydown(function() {
                    helpers.modificarClase((this.value.length >= 5) ? 'REMOVE' : 'ADD', 'button.verificar', 'deshabilitado');
                    if (this.value.length >= 5) {
                        helpers.modificarClase('REMOVE', 'button.verificar', 'hidden');
                        helpers.modificarClase('ADD', 'button.siguiente-0', 'hidden');
                        helpers.activarElementos(false, 'ok');
                    }
                });


                $(".inputDestinatario").keypress( function() {
                    if (this.value.length >= 5) {
                        helpers.modificarClase('REMOVE', 'button.verificar', 'hidden');
                        helpers.modificarClase('ADD', 'button.siguiente-0', 'hidden');
                        helpers.activarElementos(false, 'ok');
                    }
                });

                // $(".inputDestinatario").change( function() {
                //     debugger
                // helpers.modificarClase((this.value.length >= 5) ? 'REMOVE' : 'ADD', 'button.verificar', 'deshabilitado');
                // if (this.value.length >= 5) {
                //     helpers.modificarClase('REMOVE', 'button.verificar', 'hidden');
                //     helpers.modificarClase('ADD', 'button.siguiente-0', 'hidden');
                //     helpers.activarElementos(false, 'ok');
                // }
                // });

				$('button.deshabilitado').click(function(e) {
					e.preventDefault();
                });

				// SE CLICKEA EL BOTON VERIFICAR
				$('button.verificar').click(function(e) {
					e.preventDefault();

					informacion.dato = $('div.active > div > .inputDestinatario')[0].value;
					if (informacion.tipo != '' && informacion.dato.length >= 5) {
                        helpers.verificar();
                    }
                }); 
						
				$('.siguiente-0').click(function() {
					helpers.cambiarPaso(0, 1);
				});
						
				$('.siguiente-1').click(function() {
					if (informacion.metodo != 0) {
						  if (informacion.metodo != 77) {
                            if(informacion.metodo == 13 && informacion.metodoNombre == 'ITAU'){
                                window.open('/cargaritau');
                            }else{
                                helpers.cambiarPaso(1, 2);
                            }
                            // Swal.fire({
                            //     title: '',          
                            //     html: 'Esta opción se encuentra momentáneamente deshabilitada, escribinos a cargas@prexcard.com indicando desde qué banco quieres cargar y te ayudaremos a realizar tu carga.',
                            //     type: 'error',                                         
                            //     showCancelButton: false,           
                            //     showConfirmButton: true
                            // });
                            
                        }else{
                            helpers.consultarDisponibleCreditel();
                        }
					}
				});

				$('.siguiente-2').click(function() {
                    if(!$('.siguiente-2').hasClass('deshabilitado')){
                        if ($("div.wrapper").width() > 991) {
                            if (helpers.verificarCarga()) {
                                if (informacion.metodo != 77) {
                                    $("#documento").val(
                                        informacion.dato
                                    );
                                    informacion.IDmetodos = $("#IDmetodos").val();
                                    informacion.IDcuentas = $("#IDcuentas").val();
                                    $.ajax({
                                        type: "POST",
                                        url: "/carga/controlCargaOnline",
                                        dataType: 'json',
                                        data: {
                                            moneda: informacion.moneda,
                                            monto: informacion.monto,
                                            IDmetodos: informacion.IDmetodos,
                                            IDcuentas: informacion.IDcuentas
                                        },
                                        success: function (data) {
                                            if (data.error == 0) {
                                                $("#formCarga").submit(); 
                                            } else if(data.error == 14){
                                                location.replace('/cargaritau');
                                            }else
                                                {
                                                Swal.fire(
                                                    'Aviso',
                                                    data.textoError,
                                                    'warning'
                                                );
                                            }
                                        },
                                    });
                                } else {
                                    helpers.consultarCuotasCarga(informacion.monto, informacion.moneda);
                                }
                            }
                        } else {
                            helpers.cambiarPaso(2, 3);
                            $("span.info.infoDocumento").html(informacion.tipo + " " +informacion.dato);
                            $("span.info.infoIniciales").html(informacion.iniciales);
                            $("span.info.infoBanco").html(informacion.metodoNombre);
                            $("span.info.infoMonto").html(((informacion.moneda == 858) ? "$" : "U$S") + informacion.monto);
                        }
                    }
                });

                $('.siguiente-3').click(function() {
                    if (helpers.verificarCarga()) {
                        if (informacion.metodo != 77) {
                            $("#documento").val(
                                informacion.dato
                            );
                            informacion.IDmetodos = $("#IDmetodos").val();
                            informacion.IDcuentas = $("#IDcuentas").val();
                            $.ajax({
                                type: "POST",
                                url: "/carga/controlCargaOnline",
                                dataType: 'json',
                                data: {
                                    moneda: informacion.moneda,
                                    monto: informacion.monto,
                                    IDmetodos: informacion.IDmetodos,
                                    IDcuentas: informacion.IDcuentas
                                },
                                success: function (data) {
                                    if (data.error == 0) {
                                        $("#formCarga").submit(); 
                                    } else {
                                        Swal.fire(
                                            'Aviso',
                                            data.textoError,
                                            'warning'
                                        );
                                    }
                                },
                            });
                        } else {
                            helpers.consultarCuotasCarga(informacion.monto, informacion.moneda);
                        }
                    }
				});

				$('.anterior-0').click(function() {
					helpers.cambiarPaso(1, 0);
				});
						
				$('.anterior-1').click(function() {
					helpers.cambiarPaso(2, 1);
                });
                
                $('.anterior-2').click(function() {
					helpers.cambiarPaso(3, 2);
				});

				$('.pago-medio').click(function() {
					helpers.cambiarMedioPago(this);
				});
						
				$("#monedaCarga, #montoCarga").change(function() {
					helpers.comprobarMonto(
						$("#monedaCarga").val(), 
						$("#montoCarga").val()
					);
                });

				$("#montoCarga").keyup(function() {
					helpers.comprobarMonto(
						$("#monedaCarga").val(), 
						$("#montoCarga").val()
					);
                });
			},

			logged: () => {
                helpers.modificarClase('ADD', '#btn-menu-carga', 'px-selected');
                $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged

                helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-md-6');
                helpers.modificarClase('REMOVE', 'div.colSiguienteMetodo', 'col-xs-6');
                helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-md-4');
                helpers.modificarClase('ADD', 'div.colSiguienteMetodo', 'col-xs-4');

                helpers.actualizarCotizacion();
                
                helpers.cambiarPaso(0, 1);
                helpers.modificarClase('ADD', 'div.row.paso-0', 'hidden');

				informacion.dato = $('#documento').val();
				informacion.iniciales = $('#iniciales').val();
                informacion.tipo = 'ci';
                
                $(".pasoNoCumplido-1").html("1");
                $(".pasoNoCumplido-2").html("2");

				$(".tabChanger").click(function() {
					helpers.cambiarOpcionCarga(this);
				});

				$("button.anterior-cuota").click(function() {
					helpers.modificarClase('REMOVE', '.carga-paso-2', 'hidden');
					helpers.modificarClase('ADD', '.carga-paso-cuotas', 'hidden');
					helpers.modificarClase('ADD', 'button.siguiente-cuota', 'deshabilitado');
				});

				$("button.siguiente-cuota").click(function() {
					$("#formCarga").submit();
				});

				$("#IDcuentasMultiple").change(function() {
					$("#IDcuentas").val($(this).val());
				});

				modulo.common();
			},

			logout: () => modulo.common()
		}
        
		if (Chukupax.logged == 1) {
			modulo.logged();
		} else {
			modulo.logout();
		}
	};

// 	this.saldo = function () {    
//         var datoverificado = false;

//         if (Chukupax.logged) {
//             $("#btn-menu-carga").addClass('px-selected');
//         }

// 		$("#creditel1").click(function(){
//   		    $("#dialogSeguridad1").dialog({
//                 modal:true,
//                 buttons: {
//                     "Confirmar": function() {
//                         $.ajax({
//                             url : Chukupax.basePath + "/creditel/vincularActualizarBDD",
//                             dataType : "json",
//                             data : {
//                                 tarjetaCreditel: $("#ultimosCuatroCreditel1").val(),
//                                 tipoConsulta: 'ajax'
//                             },
//                             beforeSend : function(){
//                                 $("#dialogCuotas").dialog({});
//                                 $(".ui-dialog-titlebar").hide();
//                             },
//                             success : function (data) {
//                                 if(data.error == 0){
//                                     $("#tarjetaCreditel").val($("#ultimosCuatroCreditel1").val());
//                                     $("#dialogSeguridad1").dialog( "close" );
//                                     location.reload();
//                                     $("#dialogCuotas").dialog();
//                                 }else{
//                                     $("#errorSeguridadCreditel1").html(data.textoError);
//                                     $("#codErrorSeguridadCreditel1").html('Error: ' + data.error);
//                                     $("#errorSeguridadCreditel1").attr('style', 'width: 89%;color: #a94442;background-color: #f2dede;border-color: #ebccd1;text-align: center;padding: 10px');
//                                     $("#ayudaSeguridadCreditel1").html('<a href="/ayuda/contacto/subject/No%20puedo%20asociar%20mi%20tarjeta%20Creditel" title="No puedo asociar mi tarjeta Creditel" target="_blank">Solicitar ayuda</a>');
//                                     $("#dialogCuotas").dialog( "close" );
//                                     $("#errorSeguridadCreditel").fadeIn("slow");
//                                     setTimeout(function(){
//                                         $("#errorSeguridadCreditel1").fadeOut("slow");
//                                     }, 3000);
//                                 }
//                             },
//                             error : function () {
//                                 $.ajax({
//                                     url : Chukupax.basePath + "/webservice/statusServidoresCreditel",
//                                     dataType : "json",
//                                     data :{
//                                         codError: 1999,
//                                         textoError: "Error de conexión con Creditel."
//                                     },
//                                     type : 'POST'
//                                 });
//                                 $("#dialogCuotas").dialog( "close" );
//                                 $("#dialogErrorSVCreditel").dialog({
//                                     modal:true,
//                                     buttons: {
//                                         "Cerrar": function() {
//                                             $(this).dialog( "close" );
//                                             $("#listado_creditos").hide();
//                                             $("#btnNuevasCuotas").css('display', 'none');
//                                             $("#btn-cargar").prop('disabled', true);
//                                             $("#btn-cargar").css("background", "#a8dcff");
//                                             $("#creditel").prop('checked', false);
//                                         }
//                                     }
//                                 });
//                             },
//                             type : 'POST'
//                         });
//                     },
//                     "Cancelar": function() {
//                         $("#mostrarIFcreditel").fadeOut("slow");
//                         $("#listado_creditos").hide();
//                         $("#btn-cargar").prop('disabled', true);
//                         $("#btn-cargar").css("background", "#a8dcff");
//                         $(this).dialog( "close" );
//                     }
//                 }
//             });
//         });

//         var $form = $("#formSolicitud");    
//         $form.validationEngine();
//         $("#btn-cargar").prop('disabled', true);
//         $("#btn-cargar").css("background", "#a8dcff"); 

//         if (!Chukupax.logged || $("#terceros").val() == "terceros"){
//             $("#btn-verificar").show();
//         }
//             //CREDITEL            
//         consultarCuotas = function(){
//             if ( Math.round(parseFloat($("#monto").val())) > 0) {
//                 $("#btnNuevasCuotas").css('display', 'block');
//                 $("#dialogCuotas").dialog({
//                     modal:true
//                 });
//                 $(".ui-dialog-titlebar").hide(); 
//                 $.ajax({
//                     url : Chukupax.basePath + "/creditel/recargaConsulta",
//                     dataType : "json",
//                     data : {
//                         importe: $("#monto").val(),
//                         moneda: $("#moneda").val()
//                     },
//                     beforeSend : function(){
//                         $("#dialogCuotas").dialog({
//                             modal:true
//                         });
//                         $(".ui-dialog-titlebar").hide();
//                     },
//                     success : function (data) {
//                         $("#dialogCuotas").dialog( "close" );
//                         if(data.error == 0 || data.error == 99990000){//Si vienen el error 99990000 es porque no tiene saldo suficiente en creditel para el monto ingresado
//                             if(data.error == 99990000){
//                                 $("#btn-cargar").prop('disabled', true);
//                                 $("#btn-cargar").css("background", "#a8dcff");
//                                 $("#errorCuotasCreditel").html(data.textoError);
//                                 $("#ErrorCodeCreditel").html('Error: ' + data.error);
//                                 $("#dialogCuotas").dialog( "close" );
//                                 if ( Math.round(parseFloat($("#monto").val())) > 0) {
//                                     $("#monto").val(Math.round(parseFloat(data.importe)));
//                                 }else{
//                                     $("#monto").val(1);
//                                 }
                    
//                                 $("#dialogErrorCuotas").dialog({
//                                     modal:true,
//                                     buttons: {
//                                         "Cerrar": function() {                                            
//                                             $(this).dialog( "close" );
//                                         }
//                                     }
//                                 });
//                                 $(".ui-dialog-titlebar").hide();
//                                 $("#errorCuotasCreditel").fadeIn("slow");
//                             }
                            
//                             if (data.importe < 0) {
//                                 $("#dialogImporteMenor").dialog({
//                                 modal:true,
//                                     buttons: {
//                                         "Cerrar": function() {                                            
//                                             $(this).dialog( "close" );
//                                         }
//                                     }
//                                 });

//                                 $("#btn-cargar").prop('disabled', true);
//                                 $("#btn-cargar").css("background", "#a8dcff");
//                                 $("#btnNuevasCuotas").css('display', 'none');
//                                 $("#creditel").prop("checked", false);
//                             }else{
//                                 if($("#moneda").val() == 840){
//                                     var moneda_mostrar = 'U$S';
//                                 }else{
//                                     var moneda_mostrar = '$';
//                                 }
//                                 var importeCreditel = parseFloat(data.importe).toFixed(2);
//                                 $html_cuotas = '<div class="credito_importe">Importe: ' + moneda_mostrar + ' ' + parseFloat(data.importe).toFixed(2) + '</div>';

//                                 $.each(data.listaCuotas, function( index, value ) {
//                                     if (data.listaCuotas[index].plazo == 1) {
//                                         var cuotas = 'cuota';	
//                                     }else{
//                                         var cuotas = 'cuotas';
//                                     }

//                                     $html_cuotas += '<div class="una_opcion">';
//                                     $html_cuotas += '<input type="radio" value="' + data.listaCuotas[index].plazo + '" name="plazo" data-tipo="H" class="medioSel" style="margin:0;" onclick="activaBtnCargar()"/>';
//                                     $html_cuotas += '<span class="cuotas"><span class="titulo"> Pagalo en ' + data.listaCuotas[index].plazo + ' ' + cuotas + ' de  </span>';
//                                     $html_cuotas += '$ ' + parseFloat(data.listaCuotas[index].valor_cuota).toFixed(2) + ' - ';
//                                     $html_cuotas += '</span>';
//                     $html_cuotas += '<span class="cuotas" style="font-size: 10px!important;"><span class="titulo">(PTF : </span>$ ';
//                                     $html_cuotas += parseFloat(data.listaCuotas[index].total).toFixed(2);
//                                     $html_cuotas += ')</span>';
//                                     $html_cuotas += '</div>';
//                                 });
//                                 $("#listado_creditos").html($html_cuotas);                   
//                                 $("#listado_creditos").fadeIn("slow");
//                                 $("#dialogCuotas").dialog( "close" );  

//                                 $('input[type=radio][name=plazo]').change(function(){
//                                     if ($(this).is(':checked')) {
//                                         $("#btn-cargar").prop('disabled', false);
//                                         $("#btn-cargar").css("background", "#3498db");
//                                     }else{
//                                         $("#btn-cargar").prop('disabled', true);
//                                         $("#btn-cargar").css("background", "#a8dcff");
//                                     }
//                                 })
//                             }                                                  
//                         }else{
//                             $.ajax({
//                                 url : Chukupax.basePath + "/webservice/statusServidoresCreditel",
//                                 dataType : "json",
//                                 data :{
//                                     codError: data.error,
//                                     textoError: data.textoError
//                                 },
//                                 type : 'POST'
//                             });
//                             $("#btn-cargar").prop('disabled', true);
//                             $("#btn-cargar").css("background", "#a8dcff");
//                             $("#errorCuotasCreditel").html(data.textoError.replace("?", "íni"));
//                             $("#ErrorCodeCreditel").html('Error: ' + data.error);
//                             $("#dialogCuotas").dialog( "close" );
//                             $("#dialogErrorCuotas").dialog({
//                                 modal:true,
//                                 buttons: {
//                                     "Cerrar": function() {
//                                         $("#listado_creditos").hide();
//                                         $(this).dialog( "close" );
//                                         $("#btnNuevasCuotas").css('display', 'none');
//                                         $("#btn-cargar").prop('disabled', true);
//                                         $("#btn-cargar").css("background", "#a8dcff");
//                                     }
//                                 }
//                             });
//                 // $(".ui-dialog-titlebar").hide();
//                 $("#errorCuotasCreditel").fadeIn("slow");
//                         }
//                     },
//                     error : function () {
//                         $("#dialogCuotas").dialog( "close" );
//                         $.ajax({
//                             url : Chukupax.basePath + "/webservice/statusServidoresCreditel",
//                             dataType : "json",
//                             data :{
//                                 codError: 1999,
//                                 textoError: "Error de conexión con Creditel."
//                             },
//                             type : 'POST'
//                         });
//                         $("#dialogErrorSVCreditel").dialog({
//                             modal:true,
//                             buttons: {
//                                 "Cerrar": function() {
//                                     $(this).dialog( "close" );
//                                     $("#listado_creditos").hide();
//                                     $("#btnNuevasCuotas").css('display', 'none');
//                                     $("#btn-cargar").prop('disabled', true);
//                                     $("#btn-cargar").css("background", "#a8dcff");
//                                     $("#creditel").prop('checked', false);
//                                 }
//                 }
//                         });
//                     },
//                     type : 'POST'
//                 });
//             }else{
//                 $("#dialogImporteMayor").dialog({
//                     modal:true,
//                     buttons: {
//                         "Cerrar": function() {
//                             $(this).dialog( "close" );
//                             $("#listado_creditos").hide();
//                             $("#btnNuevasCuotas").css('display', 'none');
//                             $("#btn-cargar").prop('disabled', true);
//                             $("#btn-cargar").css("background", "#a8dcff");
//                             $("#creditel").prop('checked', false);
//                         }
//                     }
//                 });
//             }
//         }

//         $("#btnNuevasCuotas").click(function(){
//   		    consultarCuotas();
//         });
            
//         $('input[type=radio][name=IDmetodos]').change(function() {
//             if (this.value == 77) { //77 es CREDITEL
//                 $("#btn-cargar").prop('disabled', true);
//                 $("#btn-cargar").css("background", "#a8dcff");
//                 $("#mostrarIFcreditel").fadeIn("slow");
//                 $(".CargasNoCreditel").css("display", "none");
//                 $("#advertenciaComisionNOCREDITEL").css("display", "none");
                
//                 if($("#tarjetaCreditel").val() == 0){ //Si la cuenta no está vinculada muestro el dialog para que ingrese los últimos cuatro de su tarjeta creditel
//                     $("#dialogSeguridad").dialog({
//                         modal:true,
//                         buttons: {
//                             "Confirmar": function() {
//                                 $.ajax({
//                                     url : Chukupax.basePath + "/creditel/vincular",
//                                     dataType : "json",
//                                     data : {
//                                         tarjetaCreditel: $("#ultimosCuatroCreditel").val(),
//                                         tipoConsulta: 'ajax'
//                                     },
//                                     beforeSend : function(){
//                                         $("#dialogCuotas").dialog({});
//                                         $(".ui-dialog-titlebar").hide();
//                                     },
//                                     success : function (data) {
//                                         if(data.error == 0){
//                                             $("#tarjetaCreditel").val($("#ultimosCuatroCreditel").val());
//                                             $("#dialogSeguridad").dialog( "close" );
//                                             $("#dialogCuotas").dialog( "close" );
//                                             consultarCuotas();                                  
//                                         }else{
//                                             $.ajax({
//                                                 url : Chukupax.basePath + "/webservice/statusServidoresCreditel",
//                                                 dataType : "json",
//                                                 data :{
//                                                     codError: data.error,
//                                                     textoError: data.textoError
//                                                 },
//                                                 type : 'POST'
//                                             });
//                                             // $("#errorSeguridadCreditel").html('Error: ' + data.error + ' - ' + data.textoError);
//                                             $("#errorSeguridadCreditel").html(data.textoError);
//                                             $("#codErrorSeguridadCreditel").html('Error: ' + data.error);
//                                             $("#errorSeguridadCreditel").attr('style', 'width: 89%;color: #a94442;background-color: #f2dede;border-color: #ebccd1;text-align: center;padding: 10px');
//                                             $("#ayudaSeguridadCreditel").html('<a href="/ayuda/contacto/subject/No%20puedo%20asociar%20mi%20tarjeta%20Creditel" title="No puedo asociar mi tarjeta Creditel" target="_blank">Solicitar ayuda</a>');
//                                             $("#dialogCuotas").dialog( "close" );
//                                             $("#errorSeguridadCreditel").fadeIn("slow");
//                                         }
//                                     },
//                                     error : function () {
//                                         $.ajax({
//                                             url : Chukupax.basePath + "/webservice/statusServidoresCreditel",
//                                             dataType : "json",
//                                             data :{
//                                                 codError: 1999,
//                                                 textoError: "Error de conexión con Creditel."
//                                             },
//                                             type : 'POST'
//                                         });
//                                         $("#dialogCuotas").dialog( "close" );
//                                         $("#dialogErrorSVCreditel").dialog({
//                                             modal:true,
//                                             buttons: {
//                                                 "Cerrar": function() {
//                                                     $(this).dialog( "close" );
//                                                     $("#listado_creditos").hide();
//                                                     $("#btnNuevasCuotas").css('display', 'none');
//                                                     $("#btn-cargar").prop('disabled', true);
//                                                     $("#btn-cargar").css("background", "#a8dcff");
//                                                     $("#creditel").prop('checked', false);
//                                                 }
//                                             }
//                                         });
//                                     },
//                                     type : 'POST'
//                                 });
//                             },
//                             "Cancelar": function() {
//                                 $("#mostrarIFcreditel").fadeOut("slow");
//                                 $("#listado_creditos").hide();
//                                 $("#btn-cargar").prop('disabled', true);
//                                 $("#btn-cargar").css("background", "#a8dcff");
//                                 $(this).dialog( "close" );
//                             }
//                         }
//                     });
//                     $(".ui-dialog-titlebar").hide();//Si ya está vinculada 
//                 }else{
//                     consultarCuotas();
//                 }
//             }else{
//                 $("#mostrarIFcreditel").fadeOut("slow");
//                 $("#btnNuevasCuotas").css('display', 'none');
//                 $("#monto").css('width', '96%');
//                 $("#listado_creditos").fadeOut("slow");
//             }
//         });

//         $('input[type=text][name=monto]').change(function(){ //Cuando sale del input #monto vuelvo a consultar las cuotas
//             if ($("input:radio[name=IDmetodos]:checked").val() == 77) {
//                 $("#btnNuevasCuotas").css('display', 'block');
//                 $("#advertenciaComisionNOCREDITEL").css("display", "none");
//                 $("#advertenciaComisionNOCREDITEL").hide();
//             }else if ($("input:radio[name=IDmetodos]:checked").val() == '') {
//                 $("#btnNuevasCuotas").css('display', 'none');
//                 $("#advertenciaComisionNOCREDITEL").css("display", "none");
//                 $("#advertenciaComisionNOCREDITEL").hide();
//             }else{
//                 $("#btnNuevasCuotas").css('display', 'none');
//             }
// 	    });
     
//         $('input[type=radio][name=IDmetodos]').change(function() {
//             if (this.value == 777) { //777 es el grupo BANCOS
//                 $("#btnNuevasCuotas").css('display', 'none');
//                 $("#divBancos").fadeIn("slow");
//                 $("#bancos").fadeOut("slow");
//             }else if (this.value == 77){
//                 $("#divBancos").fadeOut("slow");
//                 $("#bancos").fadeIn("slow");
//             }
//         });// FIN CREDITEL
                
//         $("#documento, input[name='tipoDocumento']").change(function () {
//             $("#IDcuentas").val("");
//             $("#advertenciaDocumento").hide();
//             $(".custom-iniciales-carga").hide();
//             $(".custom-iniciales-carga span").html("");
//             $("#btn-verificar").show();
//             $("#btn-cargar").prop('disabled', true);
//             $("#btn-cargar").css("background", "#a8dcff");
//         });

//         $('#monto,#moneda').change(function () {
//             $("#listado_creditos").css('display', 'none');
//             $("#creditel").prop('checked', false);
//             $("#btnNuevasCuotas").css('display', 'none');
//             $("#advertenciaComisionNOCREDITEL").css('display', 'none');
//         })

//         function comprobarMonto(){
//             if ($("#moneda").val() == 840){
//                 $("#montoComision").html(window.ComisionUSD);
//                 $("#montoComisionLow").html(window.ComisionUSDLow);
//             }else{
//                 $("#montoComision").html(window.Comision);
//                 $("#montoComisionLow").html(window.ComisionLow);
//             }
                
//             $('#monto,#moneda').keyup(function () {
//                 $("#listado_creditos").css('display', 'none');
//                 if ($("input:radio[name=IDmetodos]:checked").val() == '') {
//                     $("#advertenciaMontoMaximoBanred").css("display", "none");
//     		}

//     		if (!$("#creditel").is(":checked")) {
//                     if (($("#monto").val() < 50 && $("#moneda").val() == 840) || ($("#monto").val() < 1500 && $("#moneda").val() == 858)) {
//                         $("#advertenciaComisionNOCREDITEL").show();
//                     }else{
//                         $("#advertenciaComisionNOCREDITEL").hide();
//                     }

//                     if ((($("#monto").val() > 500 && $("#moneda").val() == 840) || 
//                         ($("#monto").val() > 10000 && $("#moneda").val() == 858)) && 
//                         ($("#bbva").is(":checked"))){
//                         $("#advertenciaMontoMaximo").fadeIn("slow");
//                     }else{
//                         $("#advertenciaMontoMaximo").fadeOut("slow");
//                     }

//                     if ((($("#monto").val() >= 5000 && $("#moneda").val() == 840) || 
//                         ($("#monto").val() >= 142000 && $("#moneda").val() == 858)) && ($("#banred").is(":checked") || $("#brou").is(":checked") || $("#santander").is(":checked") )){
//                         $("#advertenciaMontoMaximoBanred").fadeIn("slow");
//                     }else{
//                         $("#advertenciaMontoMaximoBanred").fadeOut("slow");
//                     }
//                     // }else{
//                     // 	$("#advertenciaMontoMaximoBanred").css("display", "none");		
//                     // }
//                 }else{
//                     $("#advertenciaMontoMaximoBanred").css("display", "none");	
//                 }
//             })

//             // $('#monto,#moneda').keyup(function () {
//             if (($("#monto").val() < 50 && $("#moneda").val() == 840) || ($("#monto").val() < 1500 && $("#moneda").val() == 858) && $("input:radio[name=IDmetodos]:checked").val() != 77) {
//                 $("#advertenciaComisionNOCREDITEL").show();
//             }else{
//                 $("#advertenciaComisionNOCREDITEL").hide();
//             }

//             if ((($("#monto").val() > 500 && $("#moneda").val() == 840) || 
//                 ($("#monto").val() > 10000 && $("#moneda").val() == 858)) && 
//                 ($("#bbva").is(":checked")) && !$("#creditel").is(":checked")){
//                 $("#advertenciaMontoMaximo").fadeIn("slow");
//             }else{
//                 $("#advertenciaMontoMaximo").fadeOut("slow");
//             }

//             if ((($("#monto").val() >= 5000 && $("#moneda").val() == 840) || ($("#monto").val() >= 142000 && $("#moneda").val() == 858)) && $("#banred").is(":checked") && $("input:radio[name=IDmetodos]:checked").val() != 77 ){
// 	        $("#advertenciaMontoMaximoBanred").fadeIn("slow");
//             }else{
// 	        $("#advertenciaMontoMaximoBanred").fadeOut("slow");
//             }
//             // })
//         }

//         $("#banred").change(function(){ // bind a function to the change event
//             if( $(this).is(":checked") ){ // check if the radio is checked
//                 comprobarMonto();
//                 $("#btn-cargar").prop('disabled', false);
//                 $("#btn-cargar").css("background", "#3498db");
//                 $("#advertenciaMontoMaximoBanred").fadeOut("slow");
//             }else{
//                 $("#advertenciaMontoMaximoBanred").fadeOut("slow");
//             }
//         });

//         $("#banred").change (function(){
//             if( $(this).is(":checked") ){
//                 $("#btn-cargar").prop('disabled', false);
//                 $("#btn-cargar").css("background", "#3498db"); 
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
                    
//                 if((moneda == 840 && monto > 300) || (moneda == 858 && monto > 10000)){
//                     Swal.fire(
//                         'Aviso',
//                         'El monto máximo por carga con Banred es de U$S 300 o $ 10.000. Se pueden realizar hasta 3 cargas por día',
//                         'warning'
//                     )
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
//             }
//         });

//         var hsbc = "no";
//         $("#HSBC").change(function(){ // bind a function to the change event
//             if( $(this).is(":checked") ){ // check if the radio is checked
//                 comprobarMonto();
//                 $("#btn-cargar").prop('disabled', false);
//                 $("#btn-cargar").css("background", "#3498db");
//                 if (hsbc != 'yes') {
//                     hsbc= "yes";
//                     document.getElementById("banco").innerHTML = "HSBC";
//                     $("#dialogBanred").dialog({
//                         modal:true
//                     });
//                 }
//                 $("#advertenciaMontoMaximo").fadeOut("slow");
                
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
                    
//                 if((moneda == 840 && monto > 300) || (moneda == 858 && monto > 10000)){
//                     swal({
//                         title: 'Aviso',
//                         type: 'warning',
//                         text: 'El monto máximo por carga con Banred es de U$S 300 o $ 10.000. Se pueden realizar hasta 3 cargas por día'
//                     })
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
                
//             }
//         });

//         $("#creditel1").change(function(){
//             if ($(this).is(":checked")) {
//                 $("#btn-cargar").prop('disabled', false);
//                 $("#btn-cargar").css("background", "#3498db");
//                 $(this).prop("checked", false);
//             }
//         })

//         $("#santander").change (function(){
//             if( $(this).is(":checked") ){ 
//                 $("#btn-cargar").prop('disabled', false);
//                 $("#btn-cargar").css("background", "#3498db");
//                 $("#advertenciaMontoMaximoBanred").fadeOut("slow");
//                 comprobarMonto();
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();    
//                 if((moneda == 840 && monto > 500) || (moneda == 858 && monto > 15000)){
//                     swal({
//                         title: 'Aviso',
//                         type: 'warning',
//                         text: 'El monto máximo por carga con Santander es de U$S 500 o $ 15.000'
//                     })
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
//             }
//         });

//         $("#bbva").change (function(){
//             if( $(this).is(":checked") ){ 
//                 $("#btn-cargar").prop('disabled', false);
//                 $("#btn-cargar").css("background", "#3498db");        
//                 $("#advertenciaMontoMaximoBanred").fadeOut("slow");
//                 comprobarMonto();
//                 if (($("#monto").val() >500 && $("#moneda").val() == 840) || ($("#monto").val() > 10000 && $("#moneda").val() == 858)){
//                     $("#advertenciaMontoMaximo").fadeIn("slow");
//                 }else{
//                     $("#advertenciaMontoMaximo").fadeOut("slow");
//                 }
//             }
//         });

//         $("#brou").change (function(){
//             if( $(this).is(":checked") ){ 
//                 $("#btn-cargar").prop('disabled', false);
//                 $("#btn-cargar").css("background", "#3498db");
//                 $("#advertenciaMontoMaximoBanred").fadeOut("slow");
//                 comprobarMonto();
//                 //  if (($("#monto").val() >500 && $("#moneda").val() == 840) || ($("#monto").val() > 10000 && $("#moneda").val() == 858)){
//                 // 	$("#advertenciaMontoMaximo").fadeIn("slow");
//                 // }else{
//                 // 	$("#advertenciaMontoMaximo").fadeOut("slow");
//                 // }
//             }
//         });
        
//         $("#moneda").change(function(){
//             if($("#itau").is(':checked') ||
//                $("#bandes").is(':checked') ||
//                $("#citi").is(':checked') ||
//                $("#scotiabank").is(':checked') ||
//                $("#banred").is(':checked') ||
//                $("#HSBC").is(':checked')) {
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
//                 if((moneda == 840 && monto > 300) || (moneda == 858 && monto > 10000)){
//                     Swal.fire({
//                         title: 'Aviso',
//                         type: 'warning',
//                         text: 'El monto máximo por carga con Banred es de U$S 300 o $ 10.000. Se pueden realizar hasta 3 cargas por día'
//                     })
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
//             } else if($("#santander").is(':checked')){
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
//                 if((moneda == 840 && monto > 500) || (moneda == 858 && monto > 15000)){
//                     Swal.fire({
//                         title: 'Aviso',
//                         type: 'warning',
//                         text: 'El monto máximo por carga con Santander es de U$S 500 o $ 15.000'
//                     })
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
//             }
//         });
        
//         $("#monto").change(function(){
//             if($("#itau").is(':checked') ||
//                $("#bandes").is(':checked') ||
//                $("#citi").is(':checked') ||
//                $("#scotiabank").is(':checked') ||
//                $("#banred").is(':checked') ||
//                $("#HSBC").is(':checked')) {
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
//                 if((moneda == 840 && monto > 300) || (moneda == 858 && monto > 10000)){
//                     Swal.fire({
//                         title: 'Aviso',
//                         type: 'warning',
//                         text: 'El monto máximo por carga con Banred es de U$S 300 o $ 10.000. Se pueden realizar hasta 3 cargas por día'
//                     })
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
//             } else if($("#santander").is(':checked')){
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
//                 if((moneda == 840 && monto > 500) || (moneda == 858 && monto > 15000)){
//                     Swal.fire({
//                         title: 'Aviso',
//                         type: 'warning',
//                         text: 'El monto máximo por carga con Santander es de U$S 500 o $ 15.000'
//                     })
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
//             }
//         });

//         var itau = "no";
//         $("#itau").change(function(){ // bind a function to the change event
//             if( $(this).is(":checked") ){ // check if the radio is checked
//                 comprobarMonto();
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
                    
//                 if((moneda == 840 && monto > 300) || (moneda == 858 && monto > 10000)){
//                     Swal.fire(
//                         'Aviso',
//                         'El monto máximo por carga con Banred es de U$S 300 o $ 10.000. Se pueden realizar hasta 3 cargas por día',
//                         'warning'
//                     )
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
                    
                    
// //                if (itau != 'yes') {
// //                    itau= "yes";
// //                    document.getElementById("banco").innerHTML = "ITAU";
// //                    $("#dialogBanred").dialog({
// //                        modal:true
// //                    });
// //                    $("#btn-cargar").prop('disabled', false);
// //                    $("#btn-cargar").css("background", "#3498db");
// //                }
// //                $("#advertenciaMontoMaximo").fadeOut("slow");
//             }
//         });

//         var scotiabank = "no";
//         $("#scotiabank").change(function(){ // bind a function to the change event
//             if( $(this).is(":checked") ){ // check if the radio is checked
//                 comprobarMonto();
//                 if (scotiabank != 'yes') {
//                     scotiabank= "yes";
//                     document.getElementById("banco").innerHTML = "SCOTIABANK";
//                     $("#dialogBanred").dialog({
//                         modal:true
//                     });
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
//                 $("#advertenciaMontoMaximo").fadeOut("slow");
                
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
                    
//                 if((moneda == 840 && monto > 300) || (moneda == 858 && monto > 10000)){
//                     swal({
//                         title: 'Aviso',
//                         type: 'warning',
//                         text: 'El monto máximo por carga con Banred es de U$S 300 o $ 10.000. Se pueden realizar hasta 3 cargas por día'
//                     })
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
                
//             }
//         });

//         var citi = "no";
//         $("#citi").change(function(){ // bind a function to the change event
//             if( $(this).is(":checked") ){ // check if the radio is checked
//                 comprobarMonto();
//                 if (citi != 'yes') {
//                     citi= "yes";
//                     document.getElementById("banco").innerHTML = "CITIBANK";
//                     $("#dialogBanred").dialog({
//                         modal:true
//                     });
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
//                 $("#advertenciaMontoMaximo").fadeOut("slow");
                
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
                    
//                 if((moneda == 840 && monto > 300) || (moneda == 858 && monto > 10000)){
//                     swal({
//                         title: 'Aviso',
//                         type: 'warning',
//                         text: 'El monto máximo por carga con Banred es de U$S 300 o $ 10.000. Se pueden realizar hasta 3 cargas por día'
//                     })
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
                
//             }
//         });

//         var bandes = "no";
//         $("#bandes").change(function(){ // bind a function to the change event
//             if( $(this).is(":checked") ){ // check if the radio is checked
//                 comprobarMonto();
//                 if (bandes != 'yes') {
//                     bandes= "yes";
//                     document.getElementById("banco").innerHTML = "BANDES";
//                     $("#dialogBanred").dialog({
//                         modal:true  
//                     });
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
//                 $("#advertenciaMontoMaximo").fadeOut("slow");
                
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
                    
//                 if((moneda == 840 && monto > 300) || (moneda == 858 && monto > 10000)){
//                     swal({
//                         title: 'Aviso',
//                         type: 'warning',
//                         text: 'El monto máximo por carga con Banred es de U$S 300 o $ 10.000. Se pueden realizar hasta 3 cargas por día'
//                     })
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
                
//             }
//         });

//         $("#paganza").change (function(){
//             if( $(this).is(":checked") ){ 
//                 $("#btn-cargar").prop('disabled', false);
//                 $("#btn-cargar").css("background", "#3498db");
//                 $("#advertenciaMontoMaximoBanred").fadeOut("slow");
//                 $("#advertenciaMontoMaximo").fadeOut("slow");
//             }
//         });
                
//         $("#btn-verificar").click(function () {
//             var enableSubmit = true;
//             if($('input[name="tipoDocumento"]:checked').val()){
//                 $("#logoff-doc").validationEngine("hide");
//             }else{
//                 enableSubmit = false;
//                 $("#logoff-doc").validationEngine("showPrompt", "Seleccioná un tipo de documento.");
//             }
                    
//             if($('#documento').val()){
//                 $("#documento").validationEngine("hide");
//             }else if(enableSubmit){
//         	enableSubmit = false;
//                 $("#documento").validationEngine("showPrompt", "Ingrese el identificador del destinatario");
//             }

//             if($('#documento').val() && enableSubmit && !$("#IDcuentas").val()){
//                 if (!Chukupax.ajaxWorking) {
//                     Chukupax.ajaxWorking = true;
//                     enableSubmit = false;
                    
//                     $("#spinner-buscando").show();
//                     $("#advertenciaDocumento").hide();
//                     $(".custom-iniciales-carga").hide();
//                     $(".custom-iniciales-carga span").html("");
                        
//                     $.ajax({
//                         url : Chukupax.basePath + "/carga/verificar_doc",
//                         dataType : "json",
//                         data : {  
//                             tipoDocumento : $('input[name="tipoDocumento"]:checked').val(),
//                             documento : $("#documento").val()
//                         },
//                         success : function (data) {
//                             if (data.error == "ok" && data.iniciales && data.cuenta) {
//                                 $("#IDcuentas").val(data.cuenta);
//                                 $(".custom-iniciales-carga span").html(data.iniciales);
//                                 $(".custom-iniciales-carga").show();
//                                 $("#btn-verificar").hide();
//                                 $("#btn-cargar").prop('disabled', false);
//                                 $("#btn-cargar").css("background", "#3498db");
//                                 datoverificado = true;
//                             }else if(data.error != "ok" && data.textoError) {
//                                 $("#advertenciaDocumento").show();
//                                 $("#advertenciaDocumento").html(data.textoError);
//                                 datoverificado = false;
//                             }else{
//                                 $("#advertenciaDocumento").show();
//                                 $("#advertenciaDocumento").html("Documento Inválido");
//                                 datoverificado = false;
//                             }
                                
//                             Chukupax.ajaxWorking = false;
//                             $("#spinner-buscando").hide();
//                         },
//                         error : function (data) {
//                             $("#advertenciaDocumento").show();
//                             $("#advertenciaDocumento").html("Documento Inválido");
//                             Chukupax.ajaxWorking = false;
//                             $("#spinner-buscando").hide();
//                         },
//                         dataType: 'json',
//                         type: 'POST'
//                     });
//                 }
//             }
            
//             if(!enableSubmit){
//                 $("#btn-verificar").show();
//                 $("#btn-cargar").prop('disabled', true);
//                 $("#btn-cargar").css("background", "#a8dcff");
//             }
//         });
                
//         $("#btn-cargar").click(function () {
//             if($("#itau").is(':checked') ||
//                $("#bandes").is(':checked') ||
//                $("#citi").is(':checked') ||
//                $("#scotiabank").is(':checked') ||
//                $("#banred").is(':checked') ||
//                $("#HSBC").is(':checked')) {
//                 let monto = $("#monto").val(),
//                     moneda = $("#moneda").val();
//                 if((moneda == 840 && monto > 300) || (moneda == 858 && monto > 10000)){
//                     event.preventDefault();
//                     swal({
//                         title: 'Aviso',
//                         type: 'warning',
//                         text: 'El monto máximo por carga con Banred es de U$S 300 o $ 10.000. Se pueden realizar hasta 3 cargas por día'
//                     })
//                     $("#btn-cargar").prop('disabled', true);
//                     $("#btn-cargar").css("background", "#a8dcff");
//                     $(this).prop('checked', false);
//                     e.preventDefault();
//                     return false;
//                 } else if($("#santander").is(':checked')){
//                     let monto = $("#monto").val(),
//                         moneda = $("#moneda").val();
//                     if((moneda == 840 && monto > 500) || (moneda == 858 && monto > 15000)){
//                         swal({
//                             title: 'Aviso',
//                             type: 'warning',
//                             text: 'El monto máximo por carga con Santander es de U$S 500 o $ 15.000'
//                         })
//                         $("#btn-cargar").prop('disabled', true);
//                         $("#btn-cargar").css("background", "#a8dcff");
//                         $(this).prop('checked', false);
//                         e.preventDefault();
//                         return false;
//                     } else {
//                         $("#btn-cargar").prop('disabled', false);
//                         $("#btn-cargar").css("background", "#3498db");
//                     }
//                 } else {
//                     $("#btn-cargar").prop('disabled', false);
//                     $("#btn-cargar").css("background", "#3498db");
//                 }
//             }
//             var enableSubmit = true;
//             if($('input[name="IDmetodos"]:checked').val()){
//                 $("#col-2-metodos").validationEngine("hide");
//                 // $("#dialogVerificandoDatos").dialog({}); 
//                 $(".ui-dialog-titlebar").hide();
//             }else{
//                 enableSubmit = false;
//                 $("#col-2-metodos").validationEngine("showPrompt", "Seleccioná de donde vas a cargar.");
//                 $("#dialogVerificandoDatos").dialog( "close" );
//             }
//     	    if(enableSubmit){
//                 //  	if (!datoverificado) {
//                 //  		swal({
//                 // 	title: 'Error',
//                 // 	text: 'Se debe verificar a quien se cargará dinero.',
//                 // 	type: "error"
//                 // });
//                 //  	}else{
//                 $('#formSolicitud').submit();
//                 // }
// 	    }
//   	    });
//     };

	this.envio_dinero = function () {
    $(document).ready(function()  {
      if($("#all-Envio-Container").innerWidth() <= 480)
        $("#selectAccountIndetif-gral img").attr("src", $("#selectAccountIndetif-gral img").attr("src").replace(".png", "-m.jpg"));
      	var motivoMaxChars = 50;
      	$("#remitenteMotivo-counter").append( "Te restan <strong>"+  motivoMaxChars +  "</strong> caracteres para indicar el motivo.");
      	$("#remitenteMotivo").keyup(function(){
	        var remaining = motivoMaxChars -  $(this).val().length;
	        if($(this).val().length > motivoMaxChars){
	          $(this).val($(this).val().substr(0, motivoMaxChars));
	          remaining = 0;
	        }
	          
	        $("#remitenteMotivo-counter").html("Te restan <strong>"+  remaining + "</strong> caracteres para indicar el motivo.");
	        if(remaining <= 10){
	          $("#remitenteMotivo-counter").css("color","red");
	        }else{
	          $("#remitenteMotivo-counter").css("color","#797979");
	        }
      	});     
    });

    $('#btnIngresarGiro').click(function (){                    
      $("#divIngresarGiro").dialog({
        width: 350,
        show: "scale",
        hide: "scale",
        resizable: "false",
        position: "center",
        modal: "true"
      });
  	});
                
    $('#registroPrex-enviar-dinero, #registroPrex-enviar-dinero-input').click(function (){ 
      $('#nombreDestinoLogin').val($('#nombreDestino').val());
      $('#contactoDestinoLogin').val($('#contactoDestino').val());
      $('#formPaymentLogin').submit();
    }); 
                
    $('#btnEditarEnvioDestinatario').click(function (){
      $("#resumen-recipiente-envio").hide(200, function(){
        $("#formulario-recipiente-envio").show();
        if($("#doc-type").val() == "cel")
          $('#btnSelectAccountCel-ini').click();
        if($("#doc-type").val() == "email")
        $('#btnSelectAccountEmail-ini').click();
      	if($("#doc-type").val() == "ci")
          $('#btnSelectAccountCI-ini').click();
        if($("#divDatosRemitenteEnvio").length > 0)
          $("#divDatosRemitenteEnvio").hide();
        if($("#divEnvioLogin").length > 0)
          $("#divEnvioLogin").hide();
        if($("#remitente-envio-select").length > 0)
          $("#remitente-envio-select").hide();
        if($("#btnConfirmarIniciales").length > 0)
          $("#btnConfirmarIniciales").hide();
        
        $("#submit-gral-data").show();
        $("#btnContinuar").val("Continuar");
      });
    });
                
    $('#btnIngresarUserEnvio').click(function (){
      $('#divDatosRemitenteEnvio').hide();
      $('#submit-gral-data').hide();
      $('#divEnvioLogin').show();
      $('#btnIngresarUserEnvio').css("background-color","#ccc");
      $('#btnFormularioUserEnvio').css("background-color","#0863BF");
    });
                
    $('#btnFormularioUserEnvio').click(function (){
      $('#divEnvioLogin').hide();
      $('#divDatosRemitenteEnvio').show();
      $('#submit-gral-data').show();
      $('#btnIngresarUserEnvio').css("background-color","#0863BF");
      $('#btnFormularioUserEnvio').css("background-color","#ccc");
    });
                
    $('#btnSelectAccountCel-ini, #btnSelectAccountEmail-ini, #btnSelectAccountCI-ini, ' + '#btnSelectAccount1-icon, #btnSelectAccount2-icon, #btnSelectAccount3-icon').click(function (){
      var clickedId = $(this).attr("id");
      var clickedClass = $(this).attr("class");
      $("#selectAccountIndetif-gral").hide(200, function(){
        var parts = clickedId.split("-");
        var name = parts[0];
        var type = parts[1];
        
        $("#selectAccountIndetif-select").show();
        
        $("#doc-type").val(name);
        if(type === "ini"){
          if(name === "btnSelectAccountEmail"){
            $("#doc").attr("type","email");
            clickedClass = clickedId;
          }else{
            $("#doc").attr("type","number");
            clickedClass = clickedId;
          }
        }
        
        var partsC = clickedClass.split("-");
        var nameC = partsC[0];
        var typeC = partsC[1];

        if(type !== "ini" && nameC === "btnSelectAccountEmail"){
          $("#doc").attr("type","email");
        }else{
          $("#doc").attr("type","number");
        }
        
        var inputHeight = $("#doc").innerHeight() + 17;
        $("#doc-icons-container").css("height",inputHeight+"px");
        $("#doc-icons-container img").css("height",(inputHeight * 3)+"px");
        $("#doc-icons-container img").css("top","0");
        if(typeC !== "icon"){
          var calcWidthDocInput = Math.floor(
            $("#cont_doc").innerWidth() - 
            $("#doc-icons-container img").innerWidth() - 
            0.05 * $("#cont_doc").innerWidth()
          );
      		$("#doc").css("width",calcWidthDocInput + "px");
        }
        
        if(nameC === "btnSelectAccountCel"){
          $("#doc-type").val("cel");
          $("#btnSelectAccount1-icon").attr("class","btnSelectAccountCel-icon");
          $("#btnSelectAccount2-icon").attr("class","btnSelectAccountEmail-icon");
          $("#btnSelectAccount3-icon").attr("class","btnSelectAccountCI-icon");
          $("#doc").attr("type","number");
          $("#doc").attr("placeholder","09XXXXXXX");
          $("#doc-icons-container img").css("top",(inputHeight * -2)+"px");
        }

        if(nameC === "btnSelectAccountEmail"){
          $("#doc-type").val("email");
          $("#btnSelectAccount1-icon").attr("class","btnSelectAccountEmail-icon");
          $("#btnSelectAccount2-icon").attr("class","btnSelectAccountCel-icon");
          $("#btnSelectAccount3-icon").attr("class","btnSelectAccountCI-icon");
          $("#doc").attr("type","email");
          $("#doc").attr("placeholder","email@enviar.com");
          $("#doc-icons-container img").css("top",(inputHeight * -1)+"px");
        }

        if(nameC === "btnSelectAccountCI"){
          $("#doc-type").val("ci");
          $("#btnSelectAccount1-icon").attr("class","btnSelectAccountCI-icon");
          $("#btnSelectAccount2-icon").attr("class","btnSelectAccountCel-icon");
          $("#btnSelectAccount3-icon").attr("class","btnSelectAccountEmail-icon");
          $("#doc").attr("type","number");
          $("#doc").attr("placeholder","CI sin puntos ni guiones");
          $("#doc-icons-container img").css("top","0");
        }
        
        $("#doc").val($("#doc").attr("value"));
        $("#doc").focus();
        $("#doc-icons-buttons-container").css("width",$("#doc-icons-container img").css("width"));
      });
    });
    
    $('[name="IDmetodos"], #monto, #moneda').change(function () {
      $("#advertenciaComision-p2p").hide();
      $("#advertenciaComision").hide();
      //alert($('[name="IDmetodos"]').val());
      if ($("#monto").val() && $("#monto").val() && $('input[name="IDmetodos"]:checked').length){
        if($(this).val() == "999"){
          $("#advertenciaComision-p2p").show();
          if ($("#moneda").val() == 840){
            $("#montoComision-p2p").html("U$S 0.49");
          }else{
            $("#montoComision-p2p").html("$9");
          }
        }else{
          if (($("#monto").val() < 50 && $("#moneda").val() == 840) || ($("#monto").val() < 1500 && $("#moneda").val() == 858)){
            $("#advertenciaComision").show();
            if ($("#moneda").val() == 840){
              $("#montoComision").html(window.ComisionUSD);
              $("#montoComisionLow").html(window.ComisionUSDLow);
            }else{
              $("#montoComision").html(window.Comision);
              $("#montoComisionLow").html(window.ComisionLow);
            }
						return false;
          }
        }
      }
		});

		$("#remitenteMail").data("ok", false).change(function () {
    	$("#remitenteMail").validationEngine("hide").removeClass("incorrecto").removeClass("verificado").data("ok", false);
			$.post(
				Chukupax.basePath + "/solicitud/checkEmail", {
				email: $("#remitenteMail").val()
			}, function (data) {
				if (data.error && data.error == "ok") {
					$("#remitenteMail").removeClass("incorrecto").addClass("verificado").data("ok", true);
				} else {
					$("#remitenteMail").removeClass("verificado").addClass("incorrecto").data("ok", false);
					if (data.error != "fail 4")$("#remitenteMail").validationEngine("showPrompt", "El email no es correcto");
				}
			}, 'json');
		});
            
    $("#divMultiplesCuentasDestino").dialog({
      width: 350,
      show: "scale",
      hide: "scale",
      resizable: "false",
      position: "center",
      modal: "true"
    });                
    $("input[name=multiplesCuentas]:radio").change(function () {
      $("input[name=multiplesCuentasDestino][value=" + $("input[name=multiplesCuentas]:checked").val() + "]").prop('checked', true);
    });
            
            
		$("#formSolicitud").validationEngine();
		$(document).delegate("#btnCheckCI", "click", function () {
			if (!Chukupax.ajaxWorking && $("#formSolicitud").validationEngine("validate")) {
				Chukupax.ajaxWorking = true;
				$("#btnCheckCI").validationEngine("showPrompt", "Espere...");
				$.post(
					Chukupax.basePath + "/usuarios/getCuentaByCI",
					{doc: $("#doc").val()},
					function (data) {
						Chukupax.ajaxWorking = false;
						if (data.error == "ok") {
							$("#nroCuenta").val(data.nroCuenta);
							$("#btnCheckCI").validationEngine("hide");
							$("#cont_doc").slideUp(500, function () {
								$("#cont_carga").slideDown();
							});
						} else if (data.msg && data.msg != "") {
							$("#btnCheckCI").validationEngine("showPrompt", data.msg);
						} else {
							$("#btnCheckCI").validationEngine("showPrompt", "Intente más tarde por favor");
						}
					},
					'json'
				);
			}
		}).delegate("#btnContinuar", "click", function () {
    	if($("#doc").val().length == 0){
        if($("#doc-type").val() == "cel" || $("#doc-type").val() == '') $('#btnSelectAccountCel-ini').click();
        if($("#doc-type").val() == "email") $('#btnSelectAccountEmail-ini').click();
        if($("#doc-type").val() == "ci") $('#btnSelectAccountCI-ini').click();
        $('#doc').blur();
        $('#doc').blur();

        return;
      }

      if (!Chukupax.ajaxWorking && $("#formSolicitud").validationEngine("validate")) {
		    Chukupax.ajaxWorking = true;
		    $("#btnContinuar").validationEngine("showPrompt", "Espere...");
		    $("#formSolicitud").submit();
      }
		});
	};
}

function login() {
	this.init = function () {
	};
	this.reset = function () {
		var $form = $("#formSolicitud");
		$form.validationEngine();
		$("#btnContinuar").click(function () {
			if (!Chukupax.ajaxWorking) {
				Chukupax.ajaxWorking = true;
				if ($form.validationEngine('validate')) {
					$("#btnContinuar").validationEngine("showPrompt", "Espere por favor...");
					$.ajax(
						Chukupax.basePath + "/login/_doReset", {
							data: $("#formSolicitud").serialize(),
							success: function (data) {
								if (data.error == "ok") {
									$("#btnContinuar").validationEngine("hideAll");
									$("#formulario").slideUp();
									$("#formulario_ok").slideDown();
									Chukupax.ajaxWorking = false;
								} else if (data.error != "ok" && data.msg) {
									$("#btnContinuar").validationEngine("showPrompt", data.msg);
									Chukupax.ajaxWorking = false;
								} else {
									$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
									Chukupax.ajaxWorking = false;
								}
							},
							error: function () {
								$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
								Chukupax.ajaxWorking = false;
							},
							dataType: 'json',
							type: 'POST'
						});
				} else Chukupax.ajaxWorking = false;
			}
		})
	}
	this.resetear = function () {
		var $form = $("#formSolicitud");
		$form.validationEngine();
		$("#btnContinuar").click(function () {
				if (!Chukupax.ajaxWorking) {
					Chukupax.ajaxWorking = true;
					if ($form.validationEngine('validate')) {
						$("#btnContinuar").validationEngine("showPrompt", "Espere por favor...");
						$.ajax(	
							Chukupax.basePath + "/login/_doResetear", {
								data: $("#formSolicitud").serialize(),
								success: function (data) {
									if (data.error == "ok") {
										$("#btnContinuar").validationEngine("hideAll");
										$("#formulario").slideUp();
										$("#formulario_ok").slideDown();
										Chukupax.ajaxWorking = false;
									} else if (data.error != "ok" && data.msg) {
										//Cuando ocurre un error, se mostrara el Captcha.
										$("#reCaptcha").css('display', 'inline');
										$("#error_Cap").text("Seleccione la casilla *: ");
										$("#btnContinuar").validationEngine("showPrompt", data.msg);
										Chukupax.ajaxWorking = false;
									} else {
										$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
										Chukupax.ajaxWorking = false;
									}
								},
								error: function () {
									$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
									Chukupax.ajaxWorking = false;
								},
								dataType: 'json',
								type: 'POST'
							});
					} else Chukupax.ajaxWorking = false;
				}
		})
	};
	this.recuperar = function () {
		var $form = $("#formSolicitud");
		$form.validationEngine();
		$("#btnContinuar").click(function () {
			if (!Chukupax.ajaxWorking) {
				Chukupax.ajaxWorking = true;
				if ($form.validationEngine('validate')) {
					$("#btnContinuar").validationEngine("showPrompt", "Espere por favor...");
					$.ajax(
						Chukupax.basePath + "/login/_doRecuperar", {
							data: $("#formSolicitud").serialize(),
							success: function (data) {
								if (data.error == "ok") {
									$("#btnContinuar").validationEngine("hideAll");
									$("#formulario").slideUp();
									$("#formulario_ok").slideDown();
									Chukupax.ajaxWorking = false;
								} else if (data.error != "ok" && data.msg) {
									$("#btnContinuar").validationEngine("showPrompt", data.msg);
									Chukupax.ajaxWorking = false;
								} else {
									$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
									Chukupax.ajaxWorking = false;
								}
							},
							error: function () {
								$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
								Chukupax.ajaxWorking = false;
							},
							dataType: 'json',
							type: 'POST'
						});
				} else Chukupax.ajaxWorking = false;
			}
		})
	}
}
function eliminarPaisViaje(idpais){    
    $(".pais" + idpais).remove();    
}

function beneficios() {
    this.init = function () {
    }
    this.beneficios = function () {
        $("#listadoUruguayPass").slideUp();
        $("#vermasListadoUruguayPass").click(
            function(){
                $("#listadoUruguayPass").toggle('blind', {}, 500);
                $("#vermasListadoUruguayPass").toggle('blind', {}, 200);  
            }
        );

        changePictures(); 
        $(window).on('resize', () => {
            changePictures();
        });

        function changePictures() {
            if (screen.width >= 426) {
                $('#img_KINKO').attr('src','https://prexcard.s3.us-east-1.amazonaws.com/web/beneficios/2020/slides/prex_kinko20b.jpg');
            } else {
                $('#img_KINKO').attr('src','https://prexcard.s3.us-east-1.amazonaws.com/web/beneficios/2020/slides/prex_kinko20_mob.jpg');
            }
        }
         
        $('.header-fixed .header-sticky').addClass('header-fixed-shrink'); 
    }
} 

function usuarios() {
    this.init = function () {}
    
    this.actualizarDistribucion = () => {
        localStorage.setItem('sucursal', $('#sucursal').val());
        localStorage.setItem('nagencia', $('#nagencia').val());

        $(".panel-clickeable").click(function() {
            if (($(this).data('sucursal') == 10 || $(this).data('sucursal') == 12) || !$(this).hasClass('selected')) {
                
                if ($(this).data('sucursal') == 6) {
                    $("#btnContinuar").css({'display': 'inline-block'});
                    if (!$("#entregaDomicilio").is(":visible")) {
                        $("#entregaDomicilio").toggle();
                    }
                } else {
                    $("#btnContinuar").css({'display': 'none'});
                    if ($("#entregaDomicilio").is(":visible")) {
                        $("#entregaDomicilio").toggle();
                    }
                }

                switch ($(this).data('sucursal')) {
                    case 10: // CORREO
                        $("#pickupcorreoDialog").dialog({
                            modal: !0,
                            width: "80%",
                            height: '700'	
                        });
                    break;

                    case 12: // ABITAB
                        $("#abitabDialog").dialog({
                            modal: !0,
                            width: "80%",
                            height: '700'	
                        });
                    break;

                    case 1: // FORTEX CASA CENTRAL
                        $("#agenciaSeleccionada").html($("#entregaCiudadVieja").html());
                        $("#sucursal").val($(this).data('sucursal'));
                        $("#nagencia").val(0);

                        $(".panel-clickeable.selected").removeClass('selected');
                        $(this).addClass('selected');

                        doMostrarConfirmacion();
                    break;

                    case 2: // FORTEX POCITOS
                        $("#agenciaSeleccionada").html($("#entregaPocitos").html());
                        $("#sucursal").val($(this).data('sucursal'));
                        $("#nagencia").val(0);

                        $(".panel-clickeable.selected").removeClass('selected');
                        $(this).addClass('selected');

                        doMostrarConfirmacion();
                    break;

                    case 3: // FORTEX CORDON
                        $("#agenciaSeleccionada").html($("#entregaCordon").html());
                        $("#sucursal").val($(this).data('sucursal'));
                        $("#nagencia").val(0);

                        $(".panel-clickeable.selected").removeClass('selected');
                        $(this).addClass('selected');

                        doMostrarConfirmacion();
                    break;

                    case 6: // Envio a domicilio
                        $("#sucursal").val($(this).data('sucursal'));
                        $("#nagencia").val(0);

                        $(".panel-clickeable.selected").removeClass('selected');
                        $(this).addClass('selected');
                    break;
                }
            }
        });

        $("#departamentoe").change(function () {
            var dep = $(this).val().toUpperCase(),
                selectDep = $(this).attr('id'),
                localidad = selectDep.replace("departamento", "");

            if (localidad == "e") {
                localidad = "localidade";
            } else {
                localidad += "localidad";
            }
            
            dep = remove_accent(dep);
            $.ajax({
                url: Chukupax.basePath + "/usuarios/getCiudades",
                dataType: "json",
                data: {
                    departamento: dep
                },
                success: function (data) {
                    $(`#${localidad}`).html(data);
                },
                error: function (data) {
                    $(`#${localidad}`).html('');
                },
                type: 'POST'
            });
        });

        $("#agenciascorreo tr.rowagc").click(function() {
            $("#pickupcorreoDialog").dialog("close");
            let agencia = $(this).data("agencia");
            $.get(
                Chukupax.basePath + "/usuarios/getAgencia_pickupcorreo/" + $(this).data("agencia"), 
                {}, 
                function(o) {
                    "ok" == o.error && $("#agenciaSeleccionada").html(o.html)
                    $(".panel-clickeable.selected").removeClass('selected');
                    $(".panel-clickeable[data-sucursal='10']").addClass('selected');
                    $("#nagencia").val(agencia);
                    $("#sucursal").val(10);
                    doMostrarConfirmacion();
                }, 
                "json"
            );
        });

        $("#pickupcorreoDialog").on('dialogclose', function(e) {
            setTimeout(() => {
                if ($("#sucursal").val() != 10) {
                    $(`.panel-clickeable[data-sucursal='${$('#sucursal').val()}']`).addClass('selected');
                }
            }, 500);
        });

        $("#agenciasabitab tr.rowagc").click(function() {
            $("#abitabDialog").dialog("close")
            let agencia = $(this).data("agencia");

            $.get(
                Chukupax.basePath + "/usuarios/getAgencia_abitab/" + $(this).data("agencia"), 
                {}, 
                function(o) {
                    "ok" == o.error && $("#agenciaSeleccionada").html(o.html)
                    $(".panel-clickeable.selected").removeClass('selected');
                    $(".panel-clickeable[data-sucursal='12']").addClass('selected');
                    $("#nagencia").val(agencia);
                    $("#sucursal").val(12);

                    doMostrarConfirmacion();
                }, 
                "json"
            );
        });

        $("#abitabDialog").on('dialogclose', function(e) {
            setTimeout(() => {
                if ($("#sucursal").val() != 12) {
                    $(`.panel-clickeable[data-sucursal='${$('#sucursal').val()}']`).addClass('selected');
                }
            }, 500);
        });

        $("#agenciascorreo, #agenciasabitab").DataTable({
            oLanguage: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Busque aquí ingresando departamento, barrio o localidad:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior"
                },
                oAria: {
                    sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending: ": Activar para ordenar la columna de manera descendente"
                }
            },
            bPaginate: !1,
            aaSorting: [
                [1, "asc"],
                [2, "asc"],
                [3, "asc"]
            ]
        });

        $("#btnConfirmarIdem").click(function(e) {
            e.preventDefault();

            Swal.fire({
                title: '¿Confimas el lugar de envio?',
                width: '60%',
                html: `
                    <div class="col-md-12">
                        ${$("#distribucionIntacta").html()}
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                reverseButtons: true
            }).then(res => {
                if (res.value) {
                    doActualizarDistribucion();
                } else {
                    $("#sucursal").val(localStorage.getItem('sucursal'));
                    $("#nagencia").val(localStorage.getItem('nagencia'));
                }
            });
        });

        $("#btnContinuar").click(function(e) {
            e.preventDefault();

            doMostrarConfirmacion();
        });

        $("#btnCambiarDistribucion, #btnVolverAIdentica").click(function(e) {
            e.preventDefault();

            $("#contentIdentico").toggle();
            $("#nuevaDistribucion").toggle();
        });
        
        function doMostrarConfirmacion() {
            let html = '';
            if ($("#sucursal").val() != 6) {
                html = $("#agenciaSeleccionada").html()
            } else {
                html = `
                    <h4>Envio a domicilio</h4>

                    <span>Departamento: ${$("#departamentoe option:selected").text()}</span><br>
                    <span ${($("#localidade").val().trim()     == '') ? 'd-none' : ''}>Localidad: ${$("#localidade").val()}</span><br>
                    <span ${($("#callee").val().trim()        == '') ? 'd-none' : ''}>Calle: ${$("#callee").val()}</span><br>
                    <span ${($("#nrope").val().trim()          == '') ? 'd-none' : ''}>Nro de puerta o Manzana: ${$("#nrope").val()}</span><br>
                    <span ${($("#aptoe").val().trim()          == '') ? 'd-none' : ''}>Apto o Solar: ${$("#aptoe").val()}</span><br>
                    <span ${($("#esquinae").val().trim()       == '') ? 'd-none' : ''}>Esquina: ${$("#esquinae").val()}</span><br><br>
                    <span ${($("#notasDomicilio").val().trim() == '') ? 'd-none' : ''}>Nota: ${$("#notasDomicilio").val()}</span>
                `;
            }

            Swal.fire({
                title: '¿Confimas el nuevo lugar de envío?',
                width: '60%',
                html: `
                    <div class="col-md-12">
                        ${html}
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                reverseButtons: true
            }).then(res => {
                if (res.value) {
                    doActualizarDistribucion();
                } else {
                    $("#sucursal").val(localStorage.getItem('sucursal'));
                    $("#nagencia").val(localStorage.getItem('nagencia'));
                }
            });
        }

        function doActualizarDistribucion() {
            Swal.fire({
                type: 'info',
                title: 'Actualizando la nueva distribución',
                html: 'Por favor espere...',
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                width: '50%'
            });

            var data = {
                sucursal:       $("#sucursal").val(),
                nagencia:       $("#nagencia").val(),
                token:          $("#token").val(),
                departamentoe:  $("#departamentoe").val(),
                localidade:     $("#localidade").val(),
                callee:         $("#callee").val(),
                nrope:          $("#nrope").val(),
                aptoe:          $("#aptoe").val(),
                esquinae:       $("#esquinae").val(),
                notasDomicilio: $("#notasDomicilio").val(),
            }

            $.ajax({
                type: 'POST',
                data: data,
                url: '/usuarios/_doActualizarDistribucion',
                success: function (d) {
                    if (d.error == 0) {
                        Swal.fire({
                            type: 'success',
                            title: d.textoError,
                            html: 'Recargando...',
                            showCancelButton: false,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        });

                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        Swal.fire(
                            'Oh!',
                            d.textoError,
                            'error'
                        );
                    }
                },
                error: function () {
                    Swal.fire(
                        'Oh!',
                        'Ha ocurrido un error, intente mas tarde',
                        'error'
                    );
                }
            });
        }
    }

	this.afiliaciones = function(){
		if (Chukupax.logged){
    		$("#btn-menu-afiliaciones").addClass('px-selected');
            $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        }

    	$("#confirmarPagos").click(function(event) {

            Swal.fire({
                title: 'Confirmar',
                html: `
                    <h3> Si das click en el botón Cobrar en Prex, automáticamente BPS nos enviará todos tus pagos y lo acreditaremos en tu Prex. <br>¡Te notificaremos cada vez que recibas un pago!</h3>
                `,
                type: 'question',
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: 'Cobrar en Prex'
            }).then(result => {
                if (result.value) {
                    Swal.fire({
                        title: 'Cargando...',
                        html: 'Espere un momento',
                        type: 'info',
                        showConfirmButton: false
                    });

                    $.ajax({
                        url: Chukupax.basePath + '/usuarios/fonasaregistro',
                        type: 'POST',
                        dataType: 'json',
                        data: {                                   
                            user: "DH2298ZH"
                        },
                    })
                    .done(function(data) {
                        if (data.error == 0) {
                            Swal.fire({
                                title: 'Perfecto',
                                html: `Su registro se ha completado correctamente.`,
                                type: 'success',
                                showConfirmButton: false
                            });

                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        } else {
                            Swal.fire(
                                'Error',
                                result.value.textoError,
                                'error'
                            );
                        }
                    })
                    .fail(function() {
                        Swal.fire(
                            'Ha ocurrido un error',
                            'Por favor intente mas tarde',
                            "error"
                        );
                    });
                }
            });
		});  
        
    }

    this.viaje = function(){
    	if (Chukupax.logged){
			$("#btn-menu-viaje").addClass('px-selected');
            $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        }

        $("#viajePais").change(function() {
            pais = $( "#viajePais option:selected" ).text();
            idpais = $( "#viajePais option:selected" ).val();
            if(idpais != ''){
                $("#paisesSeleccionados").append(
                    '<div class="divUnPaisSeleccionado pais' + idpais + '" onclick="eliminarPaisViaje(\'' + idpais + '\')">' + pais + 
                        '<div class="divUnPaisSeleccionadoCerrar">x</div>' +                    
                    '</div>' + 
                    '<input type="hidden" class="pais' + idpais + '" name="viajePaises[]" value=' + idpais + '>'
                );                   
            }                       
        });

        $("#viajeDesde").datepicker({
			changeMonth: true,
			changeYear: true,
			minDate: "d",
			dateFormat: 'dd/mm/yy'
		});

		$("#viajeHasta").datepicker({
			changeMonth: true,
			changeYear: true,
			defaultDate: "+15d",
			minDate: "d",
			dateFormat: 'dd/mm/yy'
		});

		$("#viajeDesde").change(function() {
			let d_selected = $(this).val(),
				sum_d = d_selected.split('/'),
				d = new Date().toJSON().slice(0,10).replace(/-/g,'/'),
				a_d = d.split('/'),
				min_d_f = sum_d[0] - a_d[2];
				min_d = '+'+min_d_f+'d';


			$("#viajeHasta").datepicker("destroy");
			$("#viajeHasta").datepicker({
				changeMonth: true,
				changeYear: true,
				// maxDate: "d",
				defaultDate: "+15d",
				minDate: min_d,
				dateFormat: 'dd/mm/yy'
			});
				

		});
    }

    this.viajeok = function(){
    	if (Chukupax.logged){
    	   $("#btn-menu-viaje").addClass('px-selected');
           $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        }
    }

    this.cambiarpass = function () {
    	$("#btn-menu-camcontra").addClass('px-selected');
        $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        var $form = $("#formSolicitud");
		$form.validationEngine();
		$("#btnContinuar").click(function () {
			if (!Chukupax.ajaxWorking) {
				Chukupax.ajaxWorking = true;
				if ($form.validationEngine('validate')) {
					$("#btnContinuar").validationEngine("showPrompt", "Espere por favor...");
					$.ajax(Chukupax.basePath + "/usuarios/_doCambiarpass", {
						data: $("#formSolicitud").serialize(),
						success: function (data) {
							if (data.error == "ok") {
								$("#btnContinuar").validationEngine("hideAll");
								$("#formulario").slideUp();
								$("#formulario_ok").slideDown();

								setTimeout(function(){
									window.location.replace('/login/logout');
								}, 3000);

								Chukupax.ajaxWorking = false;
							} else if (data.error != "ok" && data.msg) {
								$("#btnContinuar").validationEngine("showPrompt", data.msg);
								Chukupax.ajaxWorking = false;
							} else {
								$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
								Chukupax.ajaxWorking = false;
							}
						},
						error: function () {
							$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
							Chukupax.ajaxWorking = false;
						},
						dataType: 'json',
						type: 'POST'
					});
				} else Chukupax.ajaxWorking = false;
			}
		})
	}

	this.cambiarmail = function () {
    	$("#btn-menu-camemail").addClass('px-selected');
        $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged

		$("#claveseguridad").click(function(event) {
			if (passwordOculta == 1) {
				passwordOculta = 0;
				clave = $(this).attr('title');
				$(this).html('Tu clave <i class="fa fa-info-circle"></i> : ' + clave);
			}else{
				passwordOculta = 1;
				$(this).html(htmlNormal);
			}
		});

		$("div.cerrar-clave-seguridad").click(function() {
			clave = '';
			$("div.sweet-overlay").fadeOut('slow');
			$("div.modal-password").fadeOut('slow');
		});

		//CONTROLES TECLADO
		window.addEventListener("keydown", keypressed, false);

		$(".pressCaracter").click(function() {
			pressCaracter($(this).data('caracter'));
		});

		$("#pressBorrar, #pressBorrar1").click(function() {
			pressBorrar();
		});

		$("#olvido-clave").click(function() {
			olvidoClaveSeguridad();
		});

		$(".btn-volver-clave").click(function() {
			$("#spinner-loading").removeClass('hide-spinner');
		});

		$("#btnStep1").click(function() {
			$("#tarj").val(tarjeta);
			$("#ingresarTarje").val(0);
			$("#ingresarClave").val(1);
			$("#ingClave").val(0);

			$("div.modal-new-password > div:nth-child(2)").hide();
			$("div.modal-new-password > div:nth-child(3)").show();
		});


		$("#btnBackStep1").click(function() {
			$("#ingresarTarje").val(1);
			$("#ingresarClave").val(0);
			$("#ingClave").val(0);

			$("div.modal-new-password > div:nth-child(3)").hide();
			$("div.modal-new-password > div:nth-child(2)").show();
		});

		$("#btnStep2").click(function() {
			$("#ingresarTarje").val(0);
			$("#ingresarClave").val(0);
			$("#ingClave").val(1);

			$("div.modal-new-password > div:nth-child(3)").hide();
			$("div.modal-new-password > div:nth-child(5)").hide();
			$("div.modal-new-password > div:nth-child(4)").show();
		});

		$("#btnBackStep2").click(function() {
			$("div.modal-new-password > div:nth-child(3)").show();
			$("div.modal-new-password > div:nth-child(5)").show();
			$("div.modal-new-password > div:nth-child(4)").hide();
		});

		$("#btnStep3").click(function() {
			$.ajax({
				url: '/p2p/set_clave_seguridad',
				type: 'POST',
				dataType: 'json',
				data: {
					IDUsuario: $("#idU").val(),
					ClaveSeguridad: clave,
					Tarjeta: tarjeta
				},
			})
			.done(function(data) {
				if (data.error == 0) {
					$("div.sweet-overlay").fadeOut('slow');
					$("div.modal-new-password").fadeOut('slow');
					$("#_tienep").val(1);
				}else{
					$("#error_set").fadeIn('slow');
					$("#error_set_text").html(data.textoError);
					setTimeout(function(){
						$("#error_set").fadeOut('slow');
					}, 5000);
				}
			})
			.fail(function() {
				$("#error_set").fadeIn('slow');
				$("#error_set_text").html("No se ha podido crear la clave, consulte.");
				setTimeout(function(){
					$("#error_set").fadeOut('slow');
				}, 5000);
			})
			.always(function(){
				$("#spinner-loading").addClass('hide-spinner');
			})
		});
		//CONTROLES TECLADO

		if ($("#_tienep").val() == 0) {
			$(".sweet-overlay").show();
			$(".modal-new-password").show();
		}else{
			$("#ingresarClave").val(0);
			$("#ingresarTarje").val(0);
		}


		/**
		 * 
		 */

		var $form = $("#formSolicitud");
		$form.validationEngine();

	 	$("#email").data("ok", !1).change(function() {
            $("#email").validationEngine("hide").removeClass("incorrecto").removeClass("verificado").data("ok", !1), $.post(Chukupax.basePath + "/usuarios/checkEmail", {
                email: $("#email").val()
            }, function(o) {
                o.error && "ok" == o.error ? $("#email").removeClass("incorrecto").addClass("verificado").data("ok", !0) : ($("#email").removeClass("verificado").addClass("incorrecto").data("ok", !1), "fail 4" == o.error ? $("#email").validationEngine("showPrompt", "El email ya se encuentra registrado") : $("#email").validationEngine("showPrompt", "El email no es correcto"))
            }, "json")
        }),

	  	$("#email2").change(function(){
            if (!Chukupax.emailChange){
                Chukupax.emailChange = true;
                $( "#email" ).change();
            }
        })

	  	//Si el email2 es igual al email1 le coloca la class verificado sino remueve la class verificado.
	  	$("#formSolicitud").validationEngine().bind("jqv.field.result", function (event, field, errorFound, prompText) {
			if (field.attr("id") != "email") {
				if (errorFound) field.removeClass("verificado").addClass("incorrecto").data("ok", false);
				else
					field.removeClass("incorrecto").addClass("verificado").data("ok", true);
			}
		});

		$("#btnContinuar").click(function () {
			setTimeout(function(){ 

            	$("#spinner-loading").addClass('hide-spinner');
            	$('.modal-password').show();
                $("div.sweet-overlay").show();
                $("#ingClave").val(1);
                clave = '';
                updateKey(clave);

                $("#btnCambiarMail").click(function(event) {
					$.ajax({
						url : Chukupax.basePath + "/p2p/comprobarClaveP2P",
						dataType : "json",
						data : {
							ClaveP2P: clave,
							idCuenta: $("#idc").val()
						},
		            	success : function (data) {
	            			if (data.error == 0) {
								if (!Chukupax.ajaxWorking) {
									Chukupax.ajaxWorking = true;
									if ($form.validationEngine('validate')) {
										$("#btnContinuar").validationEngine("showPrompt", "Espere por favor...");
										$.ajax(Chukupax.basePath + "/usuarios/_doCambiarmail", {
											data: $("#formSolicitud").serialize(),
											success: function (data) {
												if (data.error == "ok") {
													$("#btnContinuar").validationEngine("hideAll");
													$("#formulario").slideUp();
													$("#formulario_ok").slideDown();

													setTimeout(function(){
														window.location.replace('/login/logout');
													}, 3000);
													Chukupax.ajaxWorking = false;
												} else if (data.error != "ok" && data.msg) {
													$("#btnContinuar").validationEngine("showPrompt", data.msg);
													Chukupax.ajaxWorking = false;
												} else {
													$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
													Chukupax.ajaxWorking = false;
												}
											},
											error: function () {
												$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
												Chukupax.ajaxWorking = false;
											},
											dataType: 'json',
											type: 'POST'
										});
									} else Chukupax.ajaxWorking = false;
								}
							}else{
		            			$("#btnPagarP2P").hide();
	            				clave = '';
		            			intentos++;
		            			setTimeout(function(){
		            				$('.cs-circulos[data-circulo=1]').attr({class: 'cs-circulos cs-error'});
									$('.cs-circulos[data-circulo=2]').attr({class: 'cs-circulos cs-error'});
									$('.cs-circulos[data-circulo=3]').attr({class: 'cs-circulos cs-error'});
									$('.cs-circulos[data-circulo=4]').attr({class: 'cs-circulos cs-error'});
									setTimeout(function(){
										$('.cs-circulos[data-circulo=1]').attr({class: 'cs-circulos cs-vacio'});
										$('.cs-circulos[data-circulo=2]').attr({class: 'cs-circulos cs-vacio'});
										$('.cs-circulos[data-circulo=3]').attr({class: 'cs-circulos cs-vacio'});
										$('.cs-circulos[data-circulo=4]').attr({class: 'cs-circulos cs-vacio'});
									}, 100);
								}, 200);

		            			if (intentos == 5) {
		            				$("#spinner-loading").removeClass('hide-spinner');
		            				$.ajax({
	            						url: '/p2p/set_clave_seguridad_default',
		            					type: 'POST',
		            					dataType: 'json',
		            					data: {
		            						IDUsuario: $("#idU").val(),
											ClaveSeguridad: clave,
											Tarjeta: tarjeta
										}
		            				})
		            				.done(function(data) {
		            					if (data.error == 0) {
		            						location.reload();
		            					}
		            				})
		            				.fail(function() {
		            					location.reload();
		            				})		            				
		            			}else{
		            				$("#spinner-loading").addClass('hide-spinner');
		            			}
		            		}
			          	},
			          	error : function (data) {
        					$("#spinner-loading").addClass('hide-spinner');
			          	},
			          	dataType: 'json',
			          	type: 'POST'
	        		});
            	});
				$(".ui-widget-header").addClass("px-bg-first px-nombre");
			}, 150);
		})
               

	}

	this.cambiarmail_confirmacion = function () {
		
	 var $form = $("#formSolicitud");
		$form.validationEngine();
		$("#btnContinuar").click(function () {
			if (!Chukupax.ajaxWorking) {
				Chukupax.ajaxWorking = true;
				if ($form.validationEngine('validate')) {
					$("#btnContinuar").validationEngine("showPrompt", "Espere por favor...");
					$.ajax(
						Chukupax.basePath + "/usuarios/_doConfirmarmail", {
							data: $("#formSolicitud").serialize(),
							success: function (data) {
								if (data.error == "ok") {
									$("#btnContinuar").validationEngine("hideAll");
									$("#formulario").slideUp();
									$("#formulario_ok").slideDown();
									Chukupax.ajaxWorking = false;
								} else if (data.error != "ok" && data.msg) {
									$("#btnContinuar").validationEngine("showPrompt", data.msg);
									Chukupax.ajaxWorking = false;
								} else {
									$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
									Chukupax.ajaxWorking = false;
								}
							},
							error: function () {
								$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
								Chukupax.ajaxWorking = false;
							},
							dataType: 'json',
							type: 'POST'
						});
				} else Chukupax.ajaxWorking = false;
			}
		})
	}
        
	this.editar = function () {
		$("#btn-menu-datos").addClass('px-selected');
        $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
		$('.cropme').simpleCropper();

        $("#addCuentaBankRetiro").click(function() {
            $("#vincularCuentaBanco").click();
        });

        if ($('#img_vieja').val() != '') {
            $('.cropme').css('background-image', 'none');
        }

        $(".eliminar-cuenta").click(function(event) {
            var idUsuario = $(this).data('idu'),
                id = $(this).data('id'),
                moneda = $(this).data('moneda');

            Swal.fire({
                title: '¿Desea eliminar la cuenta?',
                type: "warning",
                html: 'Al presionar eliminar, dejarás de tener la cuenta<br><b><img width="100" src="/prexpal/assets/retiro/img/' + $(this).data('banco') + '.png">  ' + $(this).data('cuenta') + '</b><br>vinculada a su usuario.',
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
                showCancelButton: true
            }).then(result => {
                if (result.value) {
                    $("#spinner-loading").removeClass('hide-spinner');
                    $.ajax({
                        url: '/prexpal/process/desvincularBanco',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            idUsuario: idUsuario,
                            id: id,
                            moneda: moneda
                        },
                    }).done(function(data) {
                        switch(data.error){
                            case 0:
                                Swal.fire({
                                    title: ' \¡Cuenta desvinculada\! ',
                                    type: "success",
                                    html: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i><br><br>Espere un momento por favor',
                                    showConfirmButton: false
                                });
                                $("#addBank").hide();
                                location.reload();
                            break;
                            case 3:
                                Swal.fire({
                                    title: 'Cuenta no vinculada',
                                    type: "warning",
                                    html: 'Esta cuenta no se encuentra vinculada a este usuario.',
                                    confirmButtonText: "Ok",
                                });
                            break;
                            default:
                                Swal.fire({
                                    title: 'Ha ocurrido un error al desvincular la cuenta',
                                    type: "error",
                                    html: '[E:'+data.error+'] Comuniquese con un administrador',
                                    confirmButtonText: "Ok",
                                });
                            break;
                        }
                    }).fail(function() {
                        Swal.fire({
                            title: 'Ha ocurrido un error al vincular la cuenta',
                            type: "error",
                            html: 'Comuniquese con un administrador',
                            confirmButtonText: "Ok",
                        });
                    }).always(function() {
                        $("#spinner-loading").addClass('hide-spinner');
                    });
                } else {
                    $("#spinner-loading").addClass('hide-spinner');
                }
            });
        });

		var $form = $("#formSolicitud");
			$form.validationEngine();
		var a = $("#sucur").val();
		if(a=='1'){$("#sucursal").val(1), $("#entregaCiudadVieja").slideDown()}
      	if(a=='2'){$("#sucursal").val(2), $("#entregaPocitos").slideDown()}
		if(a=='3'){$("#sucursal").val(3), $("#entregaCordon").slideDown()}
		if(a=='6'){$("#sucursal").val(6), $("#entregaDomicilio").slideDown()}
		if(a=='10'){$("#sucursal").val(10), $("#entregapickupcorreo").slideDown(), $.get(Chukupax.basePath + "/usuarios/getAgencia_pickupcorreo/" + $("#nagencia").val(), {}, function(o) {
                "ok" == o.error && $("#agenciacorreoSeleccionada").html(o.html)
            }, "json"), l = !0}               

		var tipoDoc = $("#tipodocumento").val();

		if(tipoDoc != "CI") {
			$("#formSolicitud > div.no-relative > div:nth-child(2) > div:nth-child(1) > div:nth-child(6) > label:nth-child(2) > div > span").css("display", "none");
            $("#telefono").css("padding-left", "2%");
            $("#telefono").css("width", "100%");

	        $("#telefono").blur(function() {
	        	var o = $("#telefono").val();
	        	7 != $("#telefono").val().length || isNaN(o) ? ($("#telefono").removeClass("verificado").addClass("incorrecto"), "" != $("#telefono").val() ? $("#telefono").validationEngine("showPrompt", "Debe ingresar los últimos 7 dígitos de su número de celular") : $("#telefono").validationEngine("showPrompt", "*Este campo es obligatorio")) : ($("#telefono").removeClass("incorrecto"), $(".telefonoformError").remove(), $("#telefono").addClass("verificado"))
			});
		}else{
		 	$("#label09").css("display", "inline"); 
	        $("#telefono").css("padding-left", "16%");
	        $("#telefono").css("width", "81%");

	        $("#telefono").blur(function() {
	        	var o = $("#telefono").val();
	        	7 != $("#telefono").val().length || isNaN(o) ? ($("#telefono").removeClass("verificado").addClass("incorrecto"), "" != $("#telefono").val() ? $("#telefono").validationEngine("showPrompt", "Debe ingresar los últimos 7 dígitos de su número de celular") : $("#telefono").validationEngine("showPrompt", "*Este campo es obligatorio")) : ($("#telefono").removeClass("incorrecto"), $(".telefonoformError").remove(), $("#telefono").addClass("verificado"))
			});
		}

		$("#sucur").change(function() {
			var o = $(this).val();

			if(o=='1'){
				$("#sucursal").val(1), 
				$("#entregaPocitos").slideUp(),
				$("#entregaCordon").slideUp(),
				$("#entregaDomicilio").slideUp(),
				$("#entregapickupcorreo").slideUp(),
				$("#entregaCiudadVieja").slideDown()
			}

			if(o=='2'){
				$("#sucursal").val(2), 
				$("#entregaCiudadVieja").slideUp(),
				$("#entregaCordon").slideUp(),
				$("#entregaDomicilio").slideUp(),
				$("#entregapickupcorreo").slideUp(),
				$("#entregaPocitos").slideDown()
			}

			if(o=='3'){
				$("#sucursal").val(3),
				$("#entregaCiudadVieja").slideUp(),
				$("#entregaPocitos").slideUp(),
				$("#entregaDomicilio").slideUp(),
				$("#entregapickupcorreo").slideUp(),
				$("#entregaCordon").slideDown()
			}

			if(o=='6'){
				$("#sucursal").val(6),
				$("#entregaPocitos").slideUp(),
				$("#entregaCordon").slideUp(),
				$("#entregaCiudadVieja").slideUp(),
				$("#entregapickupcorreo").slideUp(),
				$("#entregaDomicilio").slideDown()
			
			}

			if (o == '10'){
				$("#sucursal").val(10), 
				$("#entregaPocitos").slideUp(),
				$("#entregaCordon").slideUp(),
				$("#entregaCiudadVieja").slideUp(),
				$("#entregaDomicilio").slideUp(),
				$("#entregapickupcorreo").slideDown(),
				$("#pickupcorreoDialog").dialog({
	                modal: !0,
	                width: "80%",
	                height: '300'
            	})
			}
	  	}),

		$("#editarAgenciacorreo").click(function(o) {
            o.preventDefault(), $("#pickupcorreoDialog").dialog({
                modal: !0,
                width: "80%",
                height: '300'	
            })
        }),

        $("#agenciascorreo tr.rowagc").click(function() {         
            $("#nagencia").val($(this).data("agencia")), $("#pickupcorreoDialog").dialog("close"), $.get(Chukupax.basePath + "/usuarios/getAgencia_pickupcorreo/" + $(this).data("agencia"), {}, function(o) {
                "ok" == o.error && $("#agenciacorreoSeleccionada").html(o.html)
            }, "json"), l = !0
        });
  
        $("#agenciascorreo").DataTable({
            oLanguage: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Busque aquí ingresando departamento, barrio o localidad:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior"
                },
                oAria: {
                    sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending: ": Activar para ordenar la columna de manera descendente"
                }
            },
            bPaginate: !1,
            aaSorting: [
                [1, "asc"],
                [2, "asc"],
                [3, "asc"]
            ]
        }),
   
	    $("#pais").change(function() {
	    	$("#spinner-loading").removeClass('hide-spinner');
            var o = $(this).val();
            $.ajax({
                url: "/usuarios/getDepartamentos",
                dataType: "json",
                data: {
                    IDpais: o
                },
                success: function(o) {
                    $("#departamento").html(o)
                    var a = $("#departamento").val();
                    $.ajax({
                        url: "/usuarios/getCiudades",
                        dataType: "json",
                        data: {
                        	departamento: a
                    	},
                    	success: function(a) {
                        	$("#localidad").html(a)
                        	$("#spinner-loading").addClass('hide-spinner');
                    	},
                    	error: function(a) {
                        	$("#localidad").html("")
                        	$("#spinner-loading").addClass('hide-spinner');
                    	},
                    	type: "POST"
                	})
                },
                error: function(a) {
                    $("#departamento").html("")
                    $("#spinner-loading").addClass('hide-spinner');
                },
                type: "POST"
            })
        }),

    	$("#departamentoe").change(function() {
    		$("#spinner-loading").removeClass('hide-spinner');
            var o = $(this).val();
            $.ajax({
                url: "/registro/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                success: function(o) {
                    $("#localidade").html(o)
                    $("#spinner-loading").addClass('hide-spinner');
                },
                error: function(o) {
                    $("#localidade").html("")
                    $("#spinner-loading").addClass('hide-spinner');
                },
                type: "POST"
            })
        }),

		$("#departamento").change(function() {
			$("#spinner-loading").removeClass('hide-spinner');
            var o = $(this).val();
            $.ajax({
                url: "/usuarios/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                success: function(o) {
                    $("#localidad").html(o)
                    $("#spinner-loading").addClass('hide-spinner');
                },
                error: function(o) {
                    $("#localidad").html("")
                    $("#spinner-loading").addClass('hide-spinner');
                },
                type: "POST"
            })
        }), 
                
		$("#btnContinuar").click(function () {
			// $("#spinner-loading").removeClass('hide-spinner');
			if (!Chukupax.ajaxWorking) {
				Chukupax.ajaxWorking = true;
				if (!$form.validationEngine('validate')) {
					Chukupax.ajaxWorking = false;
				} else {
					$.ajax(Chukupax.basePath + "/usuarios/_doEditar", {
						data: $("#formSolicitud").serialize(),
						success: function (data) {
							if (data.error != "ok") {
								if (data.field) {
									Swal.fire({
		                                title: data.error,
		                                type: "error",
		                                confirmButtonText: "Ok",
                                        closeOnConfirm: true,
                                        showCancelButton: false
		                            });
								} else {
									Swal.fire({
		                                title: "Por favor intente más tarde.",
		                                type: "error",
		                                confirmButtonText: "Ok",
                                        closeOnConfirm: true,
                                        showCancelButton: false
		                            });
								}
								Chukupax.ajaxWorking = false;
							} else {
								Swal.fire({
	                                title: "Sus datos fueron actualizados.",
	                                type: "success",
	                                confirmButtonText: "Ok",
                                    closeOnConfirm: false,
                                    showCancelButton: false
	                            }).then(result => {
                                    location.reload();
                                });
							}
							$("#spinner-loading").addClass('hide-spinner');
						},
						error: function () {
							$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
							Chukupax.ajaxWorking = false;
							$("#spinner-loading").addClass('hide-spinner');
						},
						dataType: 'json',
						type: 'POST'
					});
				}
			}
		});
	}
	
	this.actualizardatos = function () {
		var $form = $("#formSolicitud");
		$form.validationEngine();
		var a = $("#sucur").val();
		if(a=='1'){$("#sucursal").val(1), $("#entregaCiudadVieja").slideDown()}
      	if(a=='2'){$("#sucursal").val(2), $("#entregaPocitos").slideDown()}
		if(a=='3'){$("#sucursal").val(3), $("#entregaCordon").slideDown()}
		if(a=='6'){$("#sucursal").val(6), $("#entregaDomicilio").slideDown()}
		if(a=='10'){$("#sucursal").val(10), $("#entregapickupcorreo").slideDown(), $.get(Chukupax.basePath + "/usuarios/getAgencia_pickupcorreo/" + $("#nagencia").val(), {}, function(o) {
                "ok" == o.error && $("#agenciacorreoSeleccionada").html(o.html)
            }, "json"), l = !0}


		var tipoDoc = $("#tipodocumento").val();

		if(tipoDoc != "CI") {
			
			document.getElementById('label09').style.display = 'none';

					$("#label09").css("display", "none");
                    $("#telefono").css("padding-left", "2%");
                    $("#telefono").css("width", "100%");

                    $("#telefono").blur(function() {
		        	var o = $("#telefono").val();
		        	7 > $("#telefono").val().length || isNaN(o) ? ($("#telefono").removeClass("verificado").addClass("incorrecto"), "" != $("#telefono").val() ? $("#telefono").validationEngine("showPrompt", "Ingrese un número correcto") : $("#telefono").validationEngine("showPrompt", "*Este campo es obligatorio")) : ($("#telefono").removeClass("incorrecto"), $(".telefonoformError").remove(), $("#telefono").addClass("verificado"))
				})
			
		}else{
			
				 	$("#label09").css("display", "inline"); 
                    $("#telefono").css("padding-left", "16%");
                    $("#telefono").css("width", "81%");

                    $("#telefono").blur(function() {
		        	var o = $("#telefono").val();
		        	7 != $("#telefono").val().length || isNaN(o) ? ($("#telefono").removeClass("verificado").addClass("incorrecto"), "" != $("#telefono").val() ? $("#telefono").validationEngine("showPrompt", "Debe ingresar los últimos 7 dígitos de su número de celular") : $("#telefono").validationEngine("showPrompt", "*Este campo es obligatorio")) : ($("#telefono").removeClass("incorrecto"), $(".telefonoformError").remove(), $("#telefono").addClass("verificado"))
				})


		}

		$("#sucur").change(function() {
			var o = $(this).val();

			if(o=='1'){
				$("#sucursal").val(1), 
				$("#entregaPocitos").slideUp(),
				$("#entregaCordon").slideUp(),
				$("#entregaDomicilio").slideUp(),
				$("#entregapickupcorreo").slideUp(),
				$("#entregaCiudadVieja").slideDown()
			}

			if(o=='2'){
				$("#sucursal").val(2), 
				$("#entregaCiudadVieja").slideUp(),
				$("#entregaCordon").slideUp(),
				$("#entregaDomicilio").slideUp(),
				$("#entregapickupcorreo").slideUp(),
				$("#entregaPocitos").slideDown()

			}

			if(o=='3'){
				$("#sucursal").val(3),
				$("#entregaCiudadVieja").slideUp(),
				$("#entregaPocitos").slideUp(),
				$("#entregaDomicilio").slideUp(),
				$("#entregapickupcorreo").slideUp(),
				$("#entregaCordon").slideDown()
			}

			if(o=='6'){
				$("#sucursal").val(6),
				$("#entregaPocitos").slideUp(),
				$("#entregaCordon").slideUp(),
				$("#entregaCiudadVieja").slideUp(),
				$("#entregapickupcorreo").slideUp(),
				$("#entregaDomicilio").slideDown()
			
			}

			if (o == '10'){
				$("#sucursal").val(10), 
				$("#entregaPocitos").slideUp(),
				$("#entregaCordon").slideUp(),
				$("#entregaCiudadVieja").slideUp(),
				$("#entregaDomicilio").slideUp(),
				$("#entregapickupcorreo").slideDown(),
				$("#pickupcorreoDialog").dialog({
                modal: !0,
                width: "80%"
            })

			}

		  }),

		$("#editarAgenciacorreo").click(function(o) {
            o.preventDefault(), $("#pickupcorreoDialog").dialog({
                modal: !0,
                width: "80%",
                height: 650
            });

            $("body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable").css({
                'z-index': 999999
            });
        
        }),

        $("#agenciascorreo tr.rowagc").click(function() {
            $("#nagencia").val($(this).data("agencia")), $("#pickupcorreoDialog").dialog("close"), $.get(Chukupax.basePath + "/usuarios/getAgencia_pickupcorreo/" + $(this).data("agencia"), {}, function(o) {
                "ok" == o.error && $("#agenciacorreoSeleccionada").html(o.html)
            }, "json"), l = !0
        });

        $("#agenciascorreo").DataTable({
            oLanguage: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Busque aquí ingresando departamento, barrio o localidad:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior"
                },
                oAria: {
                    sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending: ": Activar para ordenar la columna de manera descendente"
                }
            },
            bPaginate: !1,
            aaSorting: [
                [1, "asc"],
                [2, "asc"],
                [3, "asc"]
            ]
        }),
   
		    $("#pais").change(function() {
            var o = $(this).val();
            $.ajax({
                url: "/usuarios/getDepartamentos",
                dataType: "json",
                data: {
                    IDpais: o
                },
                success: function(o) {
                    $("#departamento").html(o)
                        var a = $("#departamento").val();
                        $.ajax({
                        url: "/usuarios/getCiudades",
                        dataType: "json",
                        data: {
                            departamento: a
                        },
                        success: function(a) {
                            $("#localidad").html(a)
                        },
                        error: function(a) {
                            $("#localidad").html("")
                        },
                        type: "POST"
                    })
                },
                error: function(a) {
                    $("#departamento").html("")
                },
                type: "POST"
            })
        }),

        	$("#departamentoe").change(function() {
            var o = $(this).val();
            $.ajax({
                url: "/usuarios/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                success: function(o) {
                    $("#localidade").html(o)
                },
                error: function(o) {
                    $("#localidade").html("")
                },
                type: "POST"
            })
        }),

			$("#departamento").change(function() {
            var o = $(this).val();
            $.ajax({
                url: "/usuarios/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                success: function(o) {
                    $("#localidad").html(o)
                },
                error: function(o) {
                    $("#localidad").html("")
                },
                type: "POST"
            })
        }), 
                
		$("#btnContinuar").click(function () {
			if (!Chukupax.ajaxWorking) {
				Chukupax.ajaxWorking = true;
				if (!$form.validationEngine('validate')) {
					Chukupax.ajaxWorking = false;
				} else {
					$("#btnContinuar").validationEngine("showPrompt", "Guardando...");
					$.ajax(
						Chukupax.basePath + "/usuarios/_doACtualizar?token=" + $("#token").val(),
						{
							data: $("#formSolicitud").serialize(),
							success: function (data) {
								if (data.error != "ok") {
									if (data.field) {
										$("#" + data.field).validationEngine("showPrompt", data.error);
										$("#btnContinuar").validationEngine("showPrompt", data.error);
									} else {
										$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
									}
									Chukupax.ajaxWorking = false;
								} else {
                                    $("#btnContinuar").validationEngine("showPrompt", "Sus datos fueron actualizados.");
                                    window.location.reload();
								}
							},
							error: function () {
								$("#btnContinuar").validationEngine("showPrompt", "Por favor intente más tarde.");
								Chukupax.ajaxWorking = false;
							},
							dataType: 'json',
							type: 'POST'
						});
				}
			}
		})
	}
	
	this.checkRange = function () {
		if (Chukupax.fecdesde && Chukupax.fechasta) {
			numbers = Chukupax.fecdesde.match(/\d+/g);
			fecdesde = new Date(numbers[2], numbers[1] - 1, numbers[0]);
			numbers = Chukupax.fechasta.match(/\d+/g);
			fechasta = new Date(numbers[2], numbers[1] - 1, numbers[0]);
			return (fecdesde < fechasta);
		}
    }
    
	this.cuentav2 = function () {

        var pWidth = 1;

        if ($(window).width() < 1080) {
            pWidth = 0;
            $('#formMovs').hide();
        }

        if (Chukupax.logged) {
            $("#btn-menu-movmimientos").addClass('px-selected');
            $('.px-selected').parent('li').addClass('li-px-selected'); // Cambiar color menu logged
        }
            
        $(".btn-info-movimiento").click(function() {
            let data = {
                Estado:       '',
                EstadoModal:  '',
                Fecha:        '',
                Descripcion:  '',
                Origen:       '',
                Importe:      '',
                ColorImporte: '',
                Saldo:        ''
            }

            data.Estado       = $(this).data('estado');
            data.EstadoModal  = (data.Estado == 'Pendiente') ? 'warning' : 'success';
            data.Fecha        = $(this).data('fecha');
            data.Descripcion  = $(this).data('descripcion');
            data.Origen       = $(this).data('origen');
            data.Importe      = $(this).data('importe');
            data.ColorImporte = $(this).data('colorimporte');

            let html_modal = `<h3> ${data.Descripcion} </h3>
                <div class="col-md-12 col-xs-12 px-valign px-block-mobile no-padding">
                    <div class="col-md-6 col-xs-12 ${data.ColorImporte} div-importe-grande">
                        <label class="font-size-15"> Importe </label><br>
                        ${data.Importe}
                    </div>
                    <div class="col-md-6 col-xs-12 col-derecha-origen-saldo">
                        <p> <b>Origen:</b> ${data.Origen} </p><br>
                        <!-- <p> <b>Saldo:</b> ${data.Saldo} </p> -->
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="col-md-12">
                        <div class="col-md-6 col-xs-12 padding-10"> <b>Estado:</b> ${data.Estado} </div>
                        <div class="col-md-6 col-xs-12 left-in-desktop"> <b>Fecha:</b> ${data.Fecha} </div>
                    </div>
                </div>`;

            Swal.fire({
                title: '',
                type: data.EstadoModal,
                html: html_modal,
                allowOutsideClick: true,
                confirmButtonText: 'Volver'
            });
        });

        $("#btnExportExcel").click(function() {
            window.location.replace("/usuarios/exportar_excel?op=" + $("#op").val() + "&fecDesde=" + $("#fecdesde").val() + "&fecHasta=" + $("#fechasta").val());
        });

        $("#showFilters").click(function(event) {
            $(this).fadeOut('slow');
            $("#hideFilters").fadeIn('slow');
            $(".floating-submenu").fadeIn('slow');
            $.scrollTo(0, 500);
        }); 

        $("#hideFilters").click(function(event) {
            $(this).fadeOut('slow');
            $("#showFilters").fadeIn('slow');
            $(".floating-submenu").fadeOut('slow');
        });
        
        //ACORDION LISTADO DETALLES TRACKING
        function close_accordion_section() {
            $('.accordion .accordion-section-title').removeClass('active');
            $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
            $('#iconDetalle').removeClass("fa fa-chevron-up").addClass("fa fa-chevron-down");
        }
        
        $('.accordion-section-title').click(function(e) {
            var currentAttrValue = $(this).attr('href');

            if($(e.target).is('.active')) {
                close_accordion_section();
            } else {
                close_accordion_section();
                $(this).addClass('active');
                $('.accordion ' + currentAttrValue).slideDown(300).addClass('open');
                $('#iconDetalle').removeClass("fa fa-chevron-down").addClass("fa fa-chevron-up");
            }
            e.preventDefault();
        });                
        
        $("#btnClear").click(function () {
            $("#fecdesde,#fechasta").val("");
            $("#op").val(10).change();
        });
        
        $("#op").change(function () {
            if ($(this).val() != 0) {
                $("#formMovs").submit();
            }
        });
        
        Chukupax.fecdesde = $("#fecdesde").val();
        Chukupax.fechasta = $("#fechasta").val();
        $("#fecdesde").datepicker({
            changeMonth: true,
            changeYear: true,
            defaultDate: "-15d",
            maxDate: "d",
            dateFormat: 'dd/mm/yy'
        });
        
        $("#fechasta").datepicker({
            changeMonth: true,
            changeYear: true,
            defaultDate: "-5d",
            maxDate: "d",
            dateFormat: 'dd/mm/yy'
        });
        
        $("#btnFiltrar").click(function () {
            $("#fecdesde,#fechasta").removeClass("fail");
            Chukupax.fechasta = $("#fechasta").val();
            Chukupax.fecdesde = $("#fecdesde").val();
            if (Chukupax.modulo.checkRange()) {
                $("#formMovs").submit();
            } else if ($("#fecdesde").val() != "" && $("#fechasta").val() != "") {
                $("#fecdesde,#fechasta").addClass("fail");
            }
        });


        $('.imgfiltros').click(function(){
            if (pWidth) {
                $('#formMovs').hide();
                pWidth = 0;
            }else {
                $('#formMovs').show();
                pWidth = 1;
            }
        })

	}
        
	this.cuentasv2 = function () { 
                
            $(".opcion").change(function () {
                var op = $(this).val(),
                        bdid = $(this).data("bdid");
                if (op != 0) {
                        location.href = Chukupax.basePath + "/usuarios/cuentav2/" + bdid + "/?op=" + op;
                }
            });
    }
    
    this.spi = function (){
    	if (Chukupax.logged)
            $("#btn-menu-spi").addClass('px-selected');

        $('.px-selected').parent('li').addClass('li-px-selected');
    }
    
    this.generarPIN = () => {
        if (Chukupax.logged) {
            $("#btn-menu-generarpin").addClass('px-selected');
        }

        var data = { 
            lastSix: '',
            pin: '',
        };

        const regenerateNumbers = (string, index, value) => {
            const numbers = string.split('');
            numbers[index] = value;

            return numbers.join('');
        }

        // Comprobaciones ultimos 6 digitos
        $('body').on("keydown", "input[name*='numberCard']", function(e) {
            if (e.keyCode == 46 || e.keyCode == 8) {
                if (data.lastSix.length > 0) {
                    data.lastSix = data.lastSix.slice(0, data.lastSix.length - 1);
                }
                if ($(this).attr('tabindex') != 1) {
                    $(this).val('');
                    anteriorTabindex($(this));
                }
                checkOkCard();
            }
        });
    
        $('body').on("keypress", "input[name*='numberCard']", function(e) {
            if (e.keyCode != 46 && e.keyCode != 8) {
                if (data.lastSix.length < 6) {
                    data.lastSix += String.fromCharCode(e.keyCode);
                }
                siguienteTabindex($(this));

                data.lastSix = regenerateNumbers(data.lastSix, $(this)[0].tabIndex - 1, String.fromCharCode(e.keyCode));
                
                checkOkCard();
            }
        });

        function checkOkCard() {
            if (data.lastSix.length == 6) {
                if (!isNaN(data.lastSix)) {
                    $('#okCard').prop('disabled', false);
                } else {
                    $('#okCard').prop('disabled', true);
                    showInternalError('Los ultimos 6 numeros debe ser numericos')
                }
            } else {
                $('#okCard').prop('disabled', true);
            }
        }

        $("#okCard").click(function() {
            $("#lastSix").html(`Ultimos 6 digitos de tarjeta <b>${data.lastSix}</b>`);
            $("#pinFirst").toggle();
            $("#pinSecond").toggle();
        });
        // Comprobaciones ultimos 6 digitos

        // Comprobaciones PIN
        $('body').on("keydown", "input[name*='pin']", function(e) {
            if (e.keyCode == 46 || e.keyCode == 8) {
                if (data.pin.length > 0) {
                    data.pin = data.pin.slice(0, data.pin.length - 1);
                }
                if ($(this).attr('tabindex') != 1) {
                    $(this).val('');
                    anteriorTabindex($(this));
                }
                checkPin();
            }
        });
    
        $('body').on("keypress", "input[name*='pin']", function(e) {
            if (e.keyCode != 46 && e.keyCode != 8) {
                if (data.pin.length < 4) {
                    data.pin += String.fromCharCode(e.keyCode);
                }
                siguienteTabindex($(this));

                data.pin = regenerateNumbers(data.pin, Number($(this)[0].name.replace('pin_', '')) - 1, String.fromCharCode(e.keyCode));

                checkPin();
            }
        });

        function checkPin() {
            if (data.pin.length == 4) {
                if (!isNaN(data.pin)) {
                    $('#setPin').prop('disabled', false);
                } else {
                    $('#setPin').prop('disabled', true);
                    showInternalError('El PIN debe ser numerico');
                }
            } else {
                $('#setPin').prop('disabled', true);
            }
        }

        $("#back").click(function() {
            data.lastSix = '';
            $("input[name*='numberCard']").val('');

            $("#pinFirst").toggle();
            $("#pinSecond").toggle();
        })
        // Comprobaciones PIN

        $("#setPin").click(function() {
            Swal.fire({
                title: 'Confirmar',
                html: `
                    ¿Confirmas el cambio de PIN?
                `,
                type: 'question',
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: 'Confirmar'
            }).then(result => {
                if (result.value) {
                    Swal.fire({
                        title: 'Asignando PIN...',
                        html: 'Espere un momento',
                        type: 'info',
                        showConfirmButton: false
                    });

                    $.ajax({
                        url: Chukupax.basePath + '/usuarios/setNewPin',
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                    })
                    .done(function(data) {
                        if (data.error == 0) {
                            Swal.fire(
                                'Perfecto',
                                `${data.textoError}`,
                                'success'
                            );
                            setTimeout(() => {
                                window.location.replace('/');
                            }, 1000);
                        } else {
                            Swal.fire(
                                'Error',
                                `[${data.error}] ${data.textoError}`,
                                'error'
                            );
                        }
                    })
                    .fail(function() {
                        Swal.fire(
                            'Ha ocurrido un error',
                            'Por favor intente mas tarde',
                            "error"
                        );
                    });
                }
            });
        });

        function showInternalError(text) {
            $("#descriptionError").text(text);

            setTimeout(() => {
                $("#descriptionError").text('');
            }, 2500);
        }
    }

    this.info = function () {
        $('.px-selected').parent('li').addClass('li-px-selected');
    }
}

function html() {
	this.init = function () {
	}
}

function calculateAge(birthday) { // birthday is a date
	var ageDifMs = Date.now() - birthday.getTime();
	var ageDate = new Date(ageDifMs);
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function registro(){
	var colorRojo  = '#cc0000';
    var colorVerde = '#00cc00';
    this.init = function(){}
    	$("#tipoDocumento").change(function () {
			$("#documento").removeClass("incorrecto").removeClass("verificado").data("ok", false).val("");
		});
		$("#documento").data("ok", false).change(function () {
			$("#documento").validationEngine("showPrompt", "Espere por favor...").removeClass("incorrecto").removeClass("verificado").data("ok", false);
			if ($("#tipoDocumento").val() == "CI") {

				$.ajax({
					type: "POST",
					url: Chukupax.basePath + "/registro/checkDocumento",
					data: {
						documento: $.trim($("#documento").val()), 
						id: $.trim($("#IDUsuario").val())
					},
					success: function (data) {
						if (data.error && data.error == "ok") {
							$("#documento").removeClass("incorrecto").addClass("verificado").data("ok", true);
                            $("#documento").validationEngine("hideAll");
						} else {
							$("#documento").removeClass("verificado").addClass("incorrecto").data("ok", false);
							if (data.error == "fail 1")
								$("#documento").validationEngine("showPrompt", "Ingrese su CI sin puntos ni guiones");
							else if (data.error == "fail 2")
								$("#documento").validationEngine("showPrompt", "El documento no es correcto");
							else if (data.error == "fail 3")
								$("#documento").validationEngine("showPrompt", "El documento ya se encuentra registrado");
							else if (data.error == "fail cardpro")
								$("#documento").validationEngine("showPrompt", "El documento no puede ser registrado. Consulte.");
							else
								$("#documento").validationEngine("showPrompt", "Intente más tarde");
						}
					},
					dataType: 'json',
					async: false
				});
			} else {
				$.ajax({
					type: "POST",
					url: Chukupax.basePath + "/registro/checkDocumento",
					data: {
						documento: $.trim($("#documento").val()), 
						id: $.trim($("#IDUsuario").val())
					},
					success: function (data) {
						if (data.error && data.error == "ok") {
							$("#documento").removeClass("incorrecto").addClass("verificado").data("ok", true);
                            $("#documento").validationEngine("hideAll");
						} else {
							$("#documento").removeClass("verificado").addClass("incorrecto").data("ok", false);
							if (data.error == "fail 1")
								$("#documento").validationEngine("showPrompt", "Ingrese su documento");
							else if (data.error == "fail 2")
								$("#documento").validationEngine("showPrompt", "El documento ya se encuentra registrado");
							else if (data.error == "fail cardpro")
								$("#documento").validationEngine("showPrompt", "El documento no puede ser registrado. Consulte.");
						}
					},
					dataType: 'json',
					async: false
				});

			}
		});

		$("#departamento").change(function() {
            var o = $(this).val();
            $.ajax({
                url: "/registro/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                success: function(o) {
                    $("#localidad").html(o)
                },
                error: function(o) {
                    $("#localidad").html("")
                },
                type: "POST"
            })
        }), 

         //Manejo de fechas con 3 selects y modificación de input -Sofía
            $("#fechaNacimiento-day, #fechaNacimiento-month, #fechaNacimiento-year").bind("change focusout", function() {
                document.getElementById($(this).attr('id')).options[0].disabled =true;
                checkNacimiento();
                }); 
            //---FIN EVENTO "CAMBIO DE FECHA"---//

        	$("#departamentoe").change(function() {
            var o = $(this).val();
            $.ajax({
                url: "/registro/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                success: function(o) {
                    $("#localidade").html(o)
                },
                error: function(o) {
                    $("#localidade").html("")
                },
                type: "POST"
            })
        }),

        $("#pais").change(function() {
            var o = $(this).val();
            $.ajax({
                url: "/registro/getDepartamentos",
                dataType: "json",
                data: {
                    IDpais: o
                },
                success: function(o) {
                    $("#departamento").html(o)
                        var a = $("#departamento").val();
                        $.ajax({
                        url: "/registro/getCiudades",
                        dataType: "json",
                        data: {
                            departamento: a
                        },
                        success: function(a) {
                            $("#localidad").html(a)
                        },
                        error: function(a) {
                            $("#localidad").html("")
                        },
                        type: "POST"
                    })
                },
                error: function(a) {
                    $("#departamento").html("")
                },
                type: "POST"
            })
        }),



    this.editar = function(){  
		$('#btnGuardar').click(function() {
            var formData = new FormData();            
            jQuery.each(jQuery('#cifile')[0].files, function(i, file) {
                formData.append('cifile', file);
            });
            
            jQuery.each(jQuery('#cifile2')[0].files, function(i, file) {
                formData.append('cifile2', file);
            });  	

           
            formData.append('IDUsuario', $("#IDUsuario").val());
            formData.append('nombre1', $("#nombre1").val());
            formData.append('nombre2', $('#nombre2').val());
            formData.append('apellido1', $('#apellido1').val());
            formData.append('apellido2', $('#apellido2').val());
            formData.append('tipoDocumento', $('#tipoDocumento').val());
            formData.append('documento', $('#documento').val());
            formData.append('fechaNacimiento', $('#fechaNacimiento').val());
            formData.append('nacionalidad', $('#nacionalidad').val());
            formData.append('ciudad', $('#localidad').val());
            formData.append('telefono', $('#telefono').val());
            formData.append('ocupacionCod', $('#OcupacionCod').val());
            formData.append('IDpais', $('#pais').val());
            formData.append('departamento', $('#departamento').val());
            formData.append('calle', $('#calle').val());
            formData.append('nrop', $('#nrop').val());
            formData.append('apto', $('#apto').val());
            formData.append('esquina', $('#esquina').val());
            formData.append('callee', $('#callee').val());
            formData.append('nrope', $('#nrope').val());
            formData.append('aptoe', $('#aptoe').val());
            formData.append('esquinae', $('#esquinae').val());
            formData.append('notasDomicilio', $('#notasDomicilio').val());
            formData.append('departamentoe', $('#departamentoe').val());
            formData.append('ciudade', $('#localidade').val());
            formData.append('email', $('#email').val());
            formData.append('password', $('#password').val());
                        
            $("#guardarDialog").dialog({
                modal:true,
                width:450,
                buttons: {
                    "Confirmar": function() {
                         $.ajax({
                               url : Chukupax.basePath + "/registro/actualizarDatos?token=" + $("#token").val(),
                               dataType : "json",
                               data : formData,
                               contentType : false,
                               processData : false,
                               cache: false,
                               mimeType: "multipart/form-data",
                                   beforeSend : function () {
                    $("#guardarDialog").dialog("close");               	
                    $("#dialogGuardando").dialog({
                        modal:true,
                        width:450
                    });
                    $(".ui-dialog-titlebar").hide();
                    //
                },
                               success : function () {
                                 $("#dialogGuardando").dialog("close");
                                 window.location.reload();
                               },
                               error : function () {
                                 $("#dialogGuardando").dialog("close");
                                 window.location.reload();
                               },
                               type : 'POST'
                           });
                     },
                     "Cancelar": function() {
                         $(this).dialog( "close" );
                     }
                }
             });
        });
		
		
		$('#cifile_preview').click(function(e) {
            $('#cifile').click(e.handler);
        }); 
        $('#contenedorCI_cifile').click(function(e) {
            $('#cifile').click(e.handler);
        }); 
        $('#contenedorCI_cifile').click(function(e) {
            $('#cifile').click(e.handler);
        });    
        $("#cifile").change(function (e) {
          	input = e.target;
            if (input.files && input.files[0]) {                        
                var ext = $("#cifile").val().split('.').pop().toLowerCase();                        
                if($.inArray(ext, ['doc','docx','pdf']) == -1) {
                    var reader = new FileReader();                                                    
                    reader.onload = function (e) {
                        $('#cifile_preview').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                } else {
                    $('#cifile_preview').attr('src', Chukupax.basePath + '/imagenes/fondoSucursalSeleccionada.png');
                } 
                
            }
        });

        $('#contenedorCI_cifile2').click(function(e) {
            $('#cifile2').click(e.handler);
        });
        $("#cifile2").change(function (e) {
            input = e.target;
            if (input.files && input.files[0]) {
                var ext = $("#cifile2").val().split('.').pop().toLowerCase();                        
                if($.inArray(ext, ['doc','docx','pdf']) == -1) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('#cifile2_preview').attr('src', e.target.result);
                    };
                    reader.readAsDataURL(input.files[0]);
                } else {
                    $('#cifile2_preview').attr('src', Chukupax.basePath + '/imagenes/fondoSucursalSeleccionada.png');
                }
                
            }
        });
		
    }

	
	
	
          var validarEdad = function(){
                //Si la fecha de nacimiento está vacía
                if($("#fechaNacimiento").val() == ""){
                    return false;
                } else {
                    var birthday = $("#fechaNacimiento").val();
                    birthday = birthday.split("/");
                    birthday = birthday[1] + "/" + birthday[0] + "/" + birthday[2];
                    var age = calculateAge(new Date(birthday));                    
                    if (age < 12){ //Si la fecha de nac. es de un menor de 12 años, siempre es incorrecto
                        return false;
                    } else if (age < 14){ //Si la fecha de nac. es de un menor de 14 (y mayor de 12)..
                        if($("#sexo").val() == 'F'){ //y es mujer 
                            return true;
                        } else { //Si es hombre
                            return false;
                        }
                    } else { //Si no es menor de 14
                        return true;
                    }
                }            
            }  

		function checkNacimiento(){            
                if(document.getElementById("fechaNacimiento-day").selectedIndex!=0 &&
                    document.getElementById("fechaNacimiento-month").selectedIndex!=0 &&
                    document.getElementById("fechaNacimiento-year").selectedIndex!=0)   
                {//Si dia mes y año no son vacíos
                    //Guardo los valores seleccionados en variables
                    var dia = document.getElementById("fechaNacimiento-day").value.toString();
                    var mes = document.getElementById("fechaNacimiento-month").value.toString();
                    var anio = document.getElementById("fechaNacimiento-year").value.toString();
                    //En caso de que dia o mes tengan 1 solo caracter, le agrega un 0 delante,
                    //Si no, solo el valor de la variable
                    $("#fechaNacimiento").val(
                    (dia.length < 2 ? "0" + dia : dia) + "/" + 
                    (mes.length < 2 ? "0" + mes : mes) + "/" + anio);
                    if (validarFecha('fechaNacimiento')){//Si es una fecha valida
                        if(validarEdad())//y cumple la edad requerida según el sexo seleccionado
                        {
                            $("#fechaNacimiento-day").css("border-color", colorVerde);
                            $("#fechaNacimiento-month").css("border-color", colorVerde);
                            $("#fechaNacimiento-year").css("border-color", colorVerde);
                            $("#fechaNacimiento-year")
                                .validationEngine("hide");
                            fechaNacimiento=true;
                        }
                        else {//Si no cumple la edad requerida                                                       
                            $("#fechaNacimiento-year")
                                .validationEngine("showPrompt", "No cumple con la edad mínima requerida");
                            $("#fechaNacimiento-day").css("border-color", colorRojo);
                            $("#fechaNacimiento-month").css("border-color", colorRojo)
                            $("#fechaNacimiento-year").css("border-color", colorRojo);
                            fechaNacimiento=false;
                        }
                   }
                   else { //Si validarFecha devuelve false (la fecha no es correcta)
                        $("#fechaNacimiento-day").css("border-color", colorRojo);
                        $("#fechaNacimiento-month").css("border-color", colorRojo);
                        $("#fechaNacimiento-year").css("border-color", colorRojo);
                        fechaNacimiento=false;
                   }
                }   
                else { //Si alguno de los elementos no esta seleccionado vacia el input
                    $("#fechaNacimiento").value="";
                    fechaNacimiento=false;
                }
            }
            //Función que chequea si una fecha es correcta  
            function validarFecha(output_id){
            var dia = $('#' + output_id + "-day").val();
            var mes = $('#' + output_id + "-month").val();
            var anio = $('#' + output_id + "-year").val();
            //Si es febrero lógica para años bisiestos y menores a 30 días
            if (mes == 2) { //Si mes=febrero..
                if ((anio % 4 == 0) && ((anio % 100 != 0) || (anio % 400 == 0))) {
                    //el año es bisiesto..
                    if (dia >= 30){//y el día es mayor o igual a 30
                        $('#' + output_id + "-year")
                            .validationEngine("showPrompt", "Fecha inválida");
                        return false;
                    }
                }
                else {//Si el año no es bisiesto y el día es mayor o igual a 29, fecha incorrecta
                    if (dia >= 29){
                        $('#' + output_id + "-year")
                            .validationEngine("showPrompt", "Fecha inválida");
                        return false;
                    }                        
                }
            }
            //Si selecciona el día 31 y el mes es uno de estos..
            //La fecha es incorrecta
            if(dia==31){
                if ((mes == 4) || (mes == 6) || (mes == 9) ||(mes == 11))  {
                    $('#' + output_id + "-year")
                        .validationEngine("showPrompt", "Fecha inválida");
                    return false;
                }
            }
            //Si el mes no es febrero y el día no es 31, la fecha siempre es correcta
            $('#' + output_id + "-year")
                .validationEngine("hide");
            return true;
            }
            
    function completarFDRegistro(){
        $("#lc_chat_name").val($("#_nombre1").val() +" "+ $("#_apellido1").val());
        $("#lc_chat_email").val($("#_email").val());
        $("#lc_chat_phone").val($("#_documento").val());

        if ($("#lc_chat_phone").val() == '' ) {
            $("#lc_chat_phone").focus();
        }

        if ($("#lc_chat_email").val() == '' ) {
            $("#lc_chat_email").focus();
        }
        
        if ($("#lc_chat_name").val() == ' ' ) {
            $("#lc_chat_name").focus();
        }
    }

    if (Chukupax.mid != 'registro.correcto') {
        $(document).ready(function() {
            setTimeout(function(){
                $("#lc_chat_layout").click(function(){
                    completarFDRegistro();
                });
            }, 1000);
        });
    }

    this.paso1u = function(){
        $(document).ready(function() {
            $(".openFD").click(function(event) {
                var chat = $(".lc-header-bg");
                if (chat['0'] == undefined) {
                    var url = '/ayuda/2.1',
                    win = window.open(url, '_blank');
                    win.focus();
                } else {
                    completarFDRegistro();
                    if($("#lc_chat_layout").attr("class") != 'lc-prechat lc-support-widget lc-expanded'){
                        $(".lc-header-bg").click();
                    }
                }
            });

            setTimeout(function(){
                $("#lc_chat_layout").click(function(){
                    completarFDRegistro();
                });
            }, 1000);
        });
    }

    this.paso1e = function(){
        $(document).ready(function() {
            $(".openFD").click(function(event) {
                var chat = $(".lc-header-bg");
                if (chat['0'] == undefined) {
                    var url = '/ayuda/2.1',
                        win = window.open(url, '_blank');
                        win.focus();
                } else {
                    completarFDRegistro();
                    if($("#lc_chat_layout").attr("class") != 'lc-prechat lc-support-widget lc-expanded'){
                        $(".lc-header-bg").click();
                    }
                }
            });

            setTimeout(function(){
                $("#lc_chat_layout").click(function(){
                    completarFDRegistro();
                });
            }, 1000);
        });
    }

    this.paso2 = function(){
        $(document).ready(function() {
            setTimeout(function(){
                $("#lc_chat_layout").click(function(){
                    completarFDRegistro();
                });
            }, 1000);
        });
    }

    this.paso3 = function(){
        $("#departamento").change(function() {
            $("#spinner-loading").removeClass('hide-spinner');
            var o = $(this).val();
            $.ajax({
                url: "/usuarios/getCiudades",
                dataType: "json",
                data: {
                    departamento: o
                },
                success: function(o) {
                    $("#localidad").html(o)
                    $("#spinner-loading").addClass('hide-spinner');
                },
                error: function(o) {
                    $("#localidad").html("")
                    $("#spinner-loading").addClass('hide-spinner');
                },
                type: "POST"
            })
        })
    }

    
}
function remove_accent(str) {var map={'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Æ':'AE','Ç':'C','È':'E','É':'E','Ê':'E','Ë':'E','Ì':'I','Í':'I','Î':'I','Ï':'I','Ð':'D','Ñ':'N','Ò':'O','Ó':'O','Ô':'O','Õ':'O','Ö':'O','Ø':'O','Ù':'U','Ú':'U','Û':'U','Ü':'U','Ý':'Y','ß':'s','à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','æ':'ae','ç':'c','è':'e','é':'e','ê':'e','ë':'e','ì':'i','í':'i','î':'i','ï':'i','ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ø':'o','ù':'u','ú':'u','û':'u','ü':'u','ý':'y','ÿ':'y','Ā':'A','ā':'a','Ă':'A','ă':'a','Ą':'A','ą':'a','Ć':'C','ć':'c','Ĉ':'C','ĉ':'c','Ċ':'C','ċ':'c','Č':'C','č':'c','Ď':'D','ď':'d','Đ':'D','đ':'d','Ē':'E','ē':'e','Ĕ':'E','ĕ':'e','Ė':'E','ė':'e','Ę':'E','ę':'e','Ě':'E','ě':'e','Ĝ':'G','ĝ':'g','Ğ':'G','ğ':'g','Ġ':'G','ġ':'g','Ģ':'G','ģ':'g','Ĥ':'H','ĥ':'h','Ħ':'H','ħ':'h','Ĩ':'I','ĩ':'i','Ī':'I','ī':'i','Ĭ':'I','ĭ':'i','Į':'I','į':'i','İ':'I','ı':'i','Ĳ':'IJ','ĳ':'ij','Ĵ':'J','ĵ':'j','Ķ':'K','ķ':'k','Ĺ':'L','ĺ':'l','Ļ':'L','ļ':'l','Ľ':'L','ľ':'l','Ŀ':'L','ŀ':'l','Ł':'L','ł':'l','Ń':'N','ń':'n','Ņ':'N','ņ':'n','Ň':'N','ň':'n','ŉ':'n','Ō':'O','ō':'o','Ŏ':'O','ŏ':'o','Ő':'O','ő':'o','Œ':'OE','œ':'oe','Ŕ':'R','ŕ':'r','Ŗ':'R','ŗ':'r','Ř':'R','ř':'r','Ś':'S','ś':'s','Ŝ':'S','ŝ':'s','Ş':'S','ş':'s','Š':'S','š':'s','Ţ':'T','ţ':'t','Ť':'T','ť':'t','Ŧ':'T','ŧ':'t','Ũ':'U','ũ':'u','Ū':'U','ū':'u','Ŭ':'U','ŭ':'u','Ů':'U','ů':'u','Ű':'U','ű':'u','Ų':'U','ų':'u','Ŵ':'W','ŵ':'w','Ŷ':'Y','ŷ':'y','Ÿ':'Y','Ź':'Z','ź':'z','Ż':'Z','ż':'z','Ž':'Z','ž':'z','ſ':'s','ƒ':'f','Ơ':'O','ơ':'o','Ư':'U','ư':'u','Ǎ':'A','ǎ':'a','Ǐ':'I','ǐ':'i','Ǒ':'O','ǒ':'o','Ǔ':'U','ǔ':'u','Ǖ':'U','ǖ':'u','Ǘ':'U','ǘ':'u','Ǚ':'U','ǚ':'u','Ǜ':'U','ǜ':'u','Ǻ':'A','ǻ':'a','Ǽ':'AE','ǽ':'ae','Ǿ':'O','ǿ':'o'};var res='';for (var i=0;i<str.length;i++){c=str.charAt(i);res+=map[c]||c;}return res;}
        
function solicitud(){
	this.init = function(){}
        
        /**********************************/
        /*****   SOLICITUD/CUENTA   *******/
        /**********************************/
        this.cuenta = function(){
           // alert("alert");
            var email        = false;
            var confirmEmail = false;
            var password     = false;
            
            var colorRojo  = '#cc0000';
            var colorVerde = '#00cc00';
            
            $("#country").bind("focusout change", function() {
                $(".selectDropdown").css("border", "1px solid " + colorVerde);
            });   
            
            $("#email").bind("keyup focusout", function() {
                if($("#email").val().length > 7){
                    $.ajax({
                        url : Chukupax.basePath + "/solicitud/getEmail",
                        dataType : "json",
                        data : {  
                             token : $("#token").val(),
                             email : $("#email").val()
                        },
                        success : function (data) {
                            if(data.error == 'El email no parece ser correcto.'){
                                email = false;
                                $("#email").css("border-color", colorRojo);
                                                                     
                            } else {
                                email = true;
                                $("#email").css("border-color", colorVerde);                                
                            }
                        },
                        error : function () {
                            email = false;
                            $("#email").css("border-color", colorRojo);
                        },
                        type : 'POST'
                    });
                } else {
                    email = false;
                    $("#email").css("border-color", colorRojo);
                } 
                checkCuenta();
            });
            
            $("#confirmEmail").bind("keyup focusout", function() {
                if($("#confirmEmail").val() == $("#email").val()){
                    $("#confirmEmail").css("border-color", colorVerde);
                    confirmEmail = true;
                } else {
                    $("#confirmEmail").css("border-color", colorRojo);
                    confirmEmail = false;
                }
                checkCuenta();
            });
            
            $("#password").bind("keyup focusout", function() {
                if($("#password").val().length > 5){
                    password = true;
                    $("#password").css("border-color", colorVerde);
                } else {
                    password = false;
                    $("#password").css("border-color", colorRojo);
                } 
                checkCuenta();
            });
            
            /* FUNCION PRIVADA QUE CHEQUEA LA SOLICITUD */ 
            var checkCuenta = function(){
                if(email && confirmEmail && password){
                    $('#_eventId_personal').prop('disabled', false);
                } else {
                    $('#_eventId_personal').prop('disabled', true);
                }
            }
            
            $('#_eventId_personal').click(function() {
                $("#guardandoDialog").dialog({
                    modal:true,
                    width:450
                });  
                $.ajax({
                    url : Chukupax.basePath + "/solicitud/guardarCuenta",
                    dataType : "json",
                    data : {  
                         token : $("#token").val(),
                         email : $("#email").val(),
                         confirmEmail : $("#email").val(),
                         password : $("#password").val(),
                         country : $("#country").val()
                    },
                    success : function (data) {
                        if(data.titulo == 'Guardado exitoso'){
                            if(data.notificacion == 'Login ok'){
                                $("#guardandoDialog").dialog('close');
                                window.location.replace(Chukupax.basePath + "/solicitud/opciones");
                            } else if(data.notificacion == 'Usuario creado'){
                                $("#guardandoDialog").dialog('close');
                                window.location.replace(Chukupax.basePath + "/solicitud/crear");
                            }
                        } else {
                            $("#titulo").css('color', colorRojo);
                        }
                        $("#titulo").html(data.titulo);
                        $("#notificacion").html(data.notificacion);
                    },
                    error : function (data) {
                        $("#titulo").css('color', colorRojo);
                        $("#titulo").html(data.titulo);
                        $("#notificacion").html(data.notificacion);
                    },
                    type : 'POST'
                });
            });
        }
        /**********************************/
        /*****   FIN SOLICITUD/CUENTA   ***/
        /**********************************/
        
        /**********************************/
        /*****   SOLICITUD/CREAR   ********/
        /**********************************/
        this.crear = function(){
            var colorRojo  = '#cc0000';
            var colorVerde = '#00cc00';
            
            var email           = true;
            var password        = true;
            var nombre1         = false;
            var apellido1       = false;            
            var documento       = false;
            var fechaNacimiento = false;
            var telefono        = false;
            var direccion       = false;
            var terminosUso     = false;
                        
            $("#nombre1").bind("keyup focusout", function() {
                if($("#nombre1").val().length > 2){
                    nombre1 = true;
                    $("#nombre1").css("border-color", colorVerde);                    
                } else {
                    nombre1 = false;
                    $("#nombre1").css("border-color", colorRojo);
                }
                checkSolicitud();
            });
            
            $("#nombre2").bind("keyup focusout", function() {
                $("#nombre2").css("border-color", colorVerde);             
            });
            
            $("#apellido1").bind("keyup focusout", function() {
                if($("#apellido1").val().length > 2){
                    apellido1 = true;
                    $("#apellido1").css("border-color", colorVerde);
                } else {
                    apellido1 = false;
                    $("#apellido1").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            $("#apellido2").bind("keyup focusout", function() {
                $("#apellido2").css("border-color", colorVerde);
            });
            
            $("#email").bind("keyup focusout", function() {
                if($("#email").val().length > 7){
                    $.ajax({
                        url : Chukupax.basePath + "/solicitud/getEmail",
                        dataType : "json",
                        data : {  
                             token : $("#token").val(),
                             email : $("#email").val()
                        },
                        success : function (data) {
                            if(data.error == 'ok'){
                                email = true;
                                $("#email").css("border-color", colorVerde);                                     
                            } else {
                                email = false;
                                //$("#email").validationEngine("showPrompt", data.error);
                                $("#email").css("border-color", colorRojo);
                            }
                        },
                        error : function () {
                            email = false;
                            $("#email").css("border-color", colorRojo);
                        },
                        type : 'POST'
                    });
                } else {
                    email = false;
                    $("#email").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            $("#password").bind("keyup focusout", function() {
                if($("#password").val().length > 5){
                    password = true;
                    $("#password").css("border-color", colorVerde);
                } else {
                    password = false;
                    $("#password").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            
            $("#tipoDocumento").bind("focusout change", function() {
                checkDocumento();
                checkSolicitud();
            });
            
            $("#documento").bind("keyup focusout", function() {
                checkDocumento();
                checkSolicitud();
            });
            
            $("#fechaNacimiento").datepicker({
                changeMonth: true,
                changeYear: true,
                defaultDate: "-18y",
                minDate: "-120y",
                maxDate: "-12y",
                yearRange: "-120:+12",
                dateFormat: 'dd/mm/yy'
            }).change(function(){
                checkNacimiento();
                checkSolicitud();
            });
            
            $("#fechaNacimiento").bind("keyup focusout", function() {
                checkNacimiento();
                checkSolicitud();
            });    
            $("#sexo").bind("change focusout", function(){
                $("#sexo").css("border-color", colorVerde);
                checkNacimiento();
                checkSolicitud();
            });    
            
            $("#telefono").bind("keyup focusout", function() {
                if($("#telefono").val().length > 7){
                    telefono = true;
                    $("#telefono").css("border-color", colorVerde);
                } else {
                    telefono = false;
                    $("#telefono").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            $("#direccion").bind("keyup focusout", function() {
                if($("#direccion").val().length > 5){
                    direccion = true;
                    $("#direccion").css("border-color", colorVerde);
                } else {
                    direccion = false;
                    $("#direccion").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
                        
            $("#IDpais").bind("change focusout", function() {
                //$("#labelNacionalidad").css("border-color", colorVerde);
                $("#IDpais").css("border-color", colorVerde);   
                checkSolicitud();
            });
            
            $("#departamento").bind("change focusout", function() {
                //$("#labelNacionalidad").css("border-color", colorVerde);
                $("#departamento").css("border-color", colorVerde);   
                checkSolicitud();
            });
            
            $("#terminosUso").bind("click", function() {
                if($("#terminosUso").is(':checked')) { 
                    $("#terminosUso").css("border-color", colorVerde);
                    terminosUso = true;
                } else {
                    $("#terminosUso").css("border-color", colorRojo);  
                    terminosUso = false;
                }
                checkSolicitud();
            }); 
            
            /* FUNCION PRIVADA QUE CHEQUEA LA SOLICITUD */ 
            var checkSolicitud = function(){
                if(nombre1 && apellido1 && email && password && documento && fechaNacimiento && telefono && direccion && terminosUso){
                    $('#btnGuardar').prop('disabled', false);
                    $("#btnGuardar").css("color", "#FFF");
                } else {
                    $('#btnGuardar').prop('disabled', true);
                }
            }
            /* FIN FUNCION PRIVADA QUE CHEQUEA LA SOLICITUD */
               
            /* FUNCION PRIVADA QUE CHEQUEA LA FECHA DE NACIMIENTO */  
            var checkNacimiento = function(){
                if($("#fechaNacimiento").val() == ""){
                    fechaNacimiento = false;
                    $("#fechaNacimiento").css("border-color", colorRojo);
                } else {
                    var birthday = $("#fechaNacimiento").val();
                    birthday = birthday.split("/");
                    birthday = birthday[1] + "/" + birthday[0] + "/" + birthday[2];
                    var age = calculateAge(new Date(birthday));                    
                    if (age < 12){
                        fechaNacimiento = false;
                        $("#fechaNacimiento").css("border-color", colorRojo);
                    } else if (age < 14){
                        if($("#sexo").val() == 'F'){
                            fechaNacimiento = true;
                            $("#fechaNacimiento").css("border-color", colorVerde);
                        } else {
                            fechaNacimiento = false;
                            $("#fechaNacimiento").css("border-color", colorRojo);
                        }
                    } else {
                        fechaNacimiento = true;
                        $("#fechaNacimiento").css("border-color", colorVerde);
                    }
                }            
            }            
            /* FIN FUNCION PRIVADA QUE CHEQUEA LA FECHA DE NACIMIENTO */            
                        
            /* FUNCION PRIVADA QUE CHEQUEA EL DOCUMENTO */
            var checkDocumento = function(){
                if($("#tipoDocumento").val() == 'CI'){                    
                    $("#documento").val(function(i, v) {
                        return v.replace(/\./g,"");
                    });
                    $("#documento").val(function(i, v) {
                        return v.replace(/\-/g,"");
                    });                    
                    
                    if(($("#documento").val().length >= 8) && ($.isNumeric($("#documento").val()))){
                        var total = $("#documento").val().substr(0,1) * 2 +
                                    $("#documento").val().substr(1,1) * 9 +
                                    $("#documento").val().substr(2,1) * 8 +
                                    $("#documento").val().substr(3,1) * 7 +
                                    $("#documento").val().substr(4,1) * 6 +
                                    $("#documento").val().substr(5,1) * 3 +
                                    $("#documento").val().substr(6,1) * 4 +
                                    $("#documento").val().substr(7,1) * 1;
                        if((total%10) == 0) {
                            documento = true;                            
                            $.ajax({
                                url : Chukupax.basePath + "/solicitud/getDocumento",
                                dataType : "json",
                                data : {  
                                     token : $("#token").val(),
                                     documento : $("#documento").val()
                                },
                                success : function (data) {
                                    if(data.error == 'ok'){
                                        documento = true;
                                        $("#documento").css("border-color", colorVerde);
                                        $("#tipoDocumento").css("border-color", colorVerde);                                        
                                    } else {
                                        documento = false;
                                        // $("#documento").validationEngine("showPrompt", data.error);
                                        $("#documento").css("border-color", colorRojo);
                                        $("#tipoDocumento").css("border-color", colorRojo);
                                    }
                                },
                                error : function () {
                                    documento = false;
                                    $("#documento").css("border-color", colorRojo);
                                    $("#tipoDocumento").css("border-color", colorRojo);
                                },
                                type : 'POST'
                            });
                        } else {
                            documento = false;
                            $("#documento").css("border-color", colorRojo);
                            $("#tipoDocumento").css("border-color", colorRojo);
                        }
                    } else {
                        documento = false;
                        $("#documento").css("border-color", colorRojo);
                        $("#tipoDocumento").css("border-color", colorRojo);
                    }
                } else {
                    if($("#documento").val().length > 2){
                        $.ajax({
                            url : Chukupax.basePath + "/solicitud/getDocumento",
                            dataType : "json",
                            data : {  
                                 token : $("#token").val(),
                                 documento : $("#documento").val()
                            },
                            success : function (data) {
                                if(data.error == 'ok'){
                                    documento = true;
                                    $("#documento").css("border-color", colorVerde);
                                    $("#tipoDocumento").css("border-color", colorVerde);                                        
                                } else {
                                    documento = false;
                                    $("#documento").validationEngine("showPrompt", data.error);
                                    $("#documento").css("border-color", colorRojo);
                                    $("#tipoDocumento").css("border-color", colorRojo);
                                }
                            },
                            error : function () {
                                documento = false;
                                $("#documento").css("border-color", colorRojo);
                                $("#tipoDocumento").css("border-color", colorRojo);
                            },
                            type : 'POST'
                        });
                    } else {
                        documento = false;
                        $("#documento").css("border-color", colorRojo);
                        $("#tipoDocumento").css("border-color", colorRojo);
                    }
                }
            }
            /* FIN FUNCION PRIVADA QUE CHEQUEA EL DOCUMENTO */
            
            
           $('#btnGuardar').click(function() {
                $("#guardandoDialog").dialog({
                    modal:true,
                    width:450
                });
               
                $.ajax({
                    url : Chukupax.basePath + "/solicitud/guardarCrear",
                    dataType : "json",
                    data : {  
                         token : $("#token").val(),
                         idSolicitudCuenta : $("#idSolicitudCuenta").val(),
                         email : $("#email").val(),
                         password : $("#password").val(),                         
                         nombre1 : $("#nombre1").val(),
                         nombre2 : $("#nombre2").val(),
                         apellido1 : $("#apellido1").val(),
                         apellido2 : $("#apellido2").val(),
                         tipoDocumento : $("#tipoDocumento").val(),
                         documento : $("#documento").val(),
                         fechaNacimiento : $("#fechaNacimiento").val(),
                         sexo : $("#sexo").val(),
                         telefono : $("#telefono").val(),
                         nacionalidad : $("#IDpais").val(),
                         direccion : $("#direccion").val(),
                         departamento : $("#departamento").val(),
                         terminosUso : $("#terminosUso").val()
                    },
                    success : function (data) {
                        if(data.titulo == 'Guardado exitoso'){
                            $("#titulo").css('color', colorVerde);
                            $("#email").val('');
                            $("#password").val('');
                            $("#nombre1").val('');
                            $("#nombre2").val('');
                            $("#apellido1").val('');
                            $("#apellido2").val('');
                            $("#documento").val('');
                            $("#fechaNacimiento").val('');
                            $("#telefono").val('');
                            $("#direccion").val('');
                            window.location.replace(Chukupax.basePath + "/solicitud/opciones");
                        } else {
                            $("#titulo").css('color', colorRojo);
                        }
                        $("#titulo").html(data.titulo);
                        $("#notificacion").html(data.notificacion);
                        
                    },
                    error : function (data) {
                        $("#titulo").css('color', colorRojo);
                        $("#titulo").html(data.titulo);
                        $("#notificacion").html(data.notificacion);
                    },
                    type : 'POST'
                });
            }); 
        }
        /**********************************/
        /*****   FIN SOLICITUD/CREAR   ****/
        /**********************************/     
    
    
        /**********************************/
        /*****   SOLICITUD/DATOSTITULAR   */
        /**********************************/
        this.datostitular = function(){
            var colorRojo  = '#cc0000';
            var colorVerde = '#00cc00';
            
            var email           = false;
            var password        = false;
            var nombre1         = false;
            var apellido1       = false;            
            var documento       = false;
            var fechaNacimiento = false;
            var telefono        = false;
            var direccion       = false;
            var terminosUso     = false;
                        
            $("#nombre1").bind("keyup focusout", function() {
                if($("#nombre1").val().length > 1){
                    nombre1 = true;
                    $("#nombre1").css("border-color", colorVerde);                    
                } else {
                    nombre1 = false;
                    $("#nombre1").css("border-color", colorRojo);
                }
                checkSolicitud();
            });
            
            $("#nombre2").bind("keyup focusout", function() {
                $("#nombre2").css("border-color", colorVerde);             
            });
            
            $("#apellido1").bind("keyup focusout", function() {
                if($("#apellido1").val().length > 1){
                    apellido1 = true;
                    $("#apellido1").css("border-color", colorVerde);
                } else {
                    apellido1 = false;
                    $("#apellido1").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            $("#apellido2").bind("keyup focusout", function() {
                $("#apellido2").css("border-color", colorVerde);
            });
            
            /* NO SE CHECKEA EXISTENCIA EN BD PORQUE SI EXISTE SE LO VINCULA AL MENOR*/
            $("#email").bind("keyup focusout", function() {
                if($("#email").val().length > 7){
                    email = true;
                    $("#email").css("border-color", colorVerde);
                } else {
                    email = false;
                    $("#email").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            $("#password").bind("keyup focusout", function() {
                if($("#password").val().length > 5){
                    password = true;
                    $("#password").css("border-color", colorVerde);
                } else {
                    password = false;
                    $("#password").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            
            $("#tipoDocumento").bind("focusout change", function() {
                checkDocumento();
                checkSolicitud();
            });
            
            $("#documento").bind("keyup focusout", function() {
                checkDocumento();
                checkSolicitud();
            });
            
            $("#fechaNacimiento").datepicker({
                changeMonth: true,
                changeYear: true,
                defaultDate: "-18y",
                minDate: "-120y",
                maxDate: "-18y",
                yearRange: "-120:+18",
                dateFormat: 'dd/mm/yy'
            }).change(function(){
                checkNacimiento();
                checkSolicitud();
            });
            
            $("#fechaNacimiento").bind("keyup focusout", function() {
                checkNacimiento();
                checkSolicitud();
            });    
            $("#sexo").bind("change focusout", function(){
                $("#sexo").css("border-color", colorVerde);
                checkSolicitud();
            });    
            
            $("#telefono").bind("keyup focusout", function() {
                if($("#telefono").val().length > 7){
                    telefono = true;
                    $("#telefono").css("border-color", colorVerde);
                } else {
                    telefono = false;
                    $("#telefono").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            $("#direccion").bind("keyup focusout", function() {
                if($("#direccion").val().length > 5){
                    direccion = true;
                    $("#direccion").css("border-color", colorVerde);
                } else {
                    direccion = false;
                    $("#direccion").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
                        
            $("#IDpais").bind("change focusout", function() {
                //$("#labelNacionalidad").css("border-color", colorVerde);
                $("#IDpais").css("border-color", colorVerde);   
                checkSolicitud();
            });
            
            $("#departamento").bind("change focusout", function() {
                //$("#labelNacionalidad").css("border-color", colorVerde);
                $("#departamento").css("border-color", colorVerde);   
                checkSolicitud();
            });
            
            $("#terminosUso").bind("click", function() {
                if($("#terminosUso").is(':checked')) { 
                    $("#terminosUso").css("border-color", colorVerde);
                    terminosUso = true;
                } else {
                    $("#terminosUso").css("border-color", colorRojo);  
                    terminosUso = false;
                }
                checkSolicitud();
            }); 
            
            /* FUNCION PRIVADA QUE CHEQUEA LA SOLICITUD */ 
            var checkSolicitud = function(){
                if(nombre1 && apellido1 && email && password && documento && fechaNacimiento && telefono && direccion && terminosUso){
                    $('#btnGuardar').prop('disabled', false);
                    $("#btnGuardar").css("color", "#FFF");
                } else {
                    $('#btnGuardar').prop('disabled', true);
                }
            }
            /* FIN FUNCION PRIVADA QUE CHEQUEA LA SOLICITUD */
               
            /* FUNCION PRIVADA QUE CHEQUEA LA FECHA DE NACIMIENTO */  
            var checkNacimiento = function(){
                if($("#fechaNacimiento").val() == ""){
                    fechaNacimiento = false;
                    $("#fechaNacimiento").css("border-color", colorRojo);
                } else {
                    var birthday = $("#fechaNacimiento").val();
                    birthday = birthday.split("/");
                    birthday = birthday[1] + "/" + birthday[0] + "/" + birthday[2];
                    var age = calculateAge(new Date(birthday));                    
                    if (age < 18){
                        fechaNacimiento = false;
                        $("#fechaNacimiento").css("border-color", colorRojo);
                    } else {
                        fechaNacimiento = true;
                        $("#fechaNacimiento").css("border-color", colorVerde);
                    }
                }            
            }            
            /* FIN FUNCION PRIVADA QUE CHEQUEA LA FECHA DE NACIMIENTO */            
                        
            /* FUNCION PRIVADA QUE CHEQUEA EL DOCUMENTO */
            // No se checkea existencia en BD porque si existe se lo vincula al menor
            var checkDocumento = function(){
                if($("#tipoDocumento").val() == 'CI'){                    
                    $("#documento").val(function(i, v) {
                        return v.replace(/\./g,"");
                    });
                    $("#documento").val(function(i, v) {
                        return v.replace(/\-/g,"");
                    });                    
                    
                    if(($("#documento").val().length >= 8) && ($.isNumeric($("#documento").val()))){
                        var total = $("#documento").val().substr(0,1) * 2 +
                                    $("#documento").val().substr(1,1) * 9 +
                                    $("#documento").val().substr(2,1) * 8 +
                                    $("#documento").val().substr(3,1) * 7 +
                                    $("#documento").val().substr(4,1) * 6 +
                                    $("#documento").val().substr(5,1) * 3 +
                                    $("#documento").val().substr(6,1) * 4 +
                                    $("#documento").val().substr(7,1) * 1;
                        if((total%10) == 0) {
                            documento = true;
                            $("#documento").css("border-color", colorVerde);
                            $("#tipoDocumento").css("border-color", colorVerde);
                        } else {
                            documento = false;
                            $("#documento").css("border-color", colorRojo);
                            $("#tipoDocumento").css("border-color", colorRojo);
                        }
                    } else {
                        documento = false;
                        $("#documento").css("border-color", colorRojo);
                        $("#tipoDocumento").css("border-color", colorRojo);
                    }
                } else {
                    if($("#documento").val().length > 2){
                        documento = true;
                        $("#documento").css("border-color", colorVerde);
                        $("#tipoDocumento").css("border-color", colorVerde);
                    } else {
                        documento = false;
                        $("#documento").css("border-color", colorRojo);
                        $("#tipoDocumento").css("border-color", colorRojo);
                    }
                }
            }
            /* FIN FUNCION PRIVADA QUE CHEQUEA EL DOCUMENTO */
            
            
           $('#btnGuardar').click(function() {
                $("#guardandoDialog").dialog({
                    modal:true,
                    width:450,
                    buttons: {
                        "Ok": function() {
                            $("#guardandoDialog").dialog('close');
                            window.location.replace(Chukupax.basePath + "/solicitud/opciones");
                        }
                    }
                });                
               
                $.ajax({
                    url : Chukupax.basePath + "/solicitud/guardarTitular",
                    dataType : "json",
                    data : {  
                         token : $("#token").val(),
                         email : $("#email").val(),
                         password : $("#password").val(),                         
                         nombre1 : $("#nombre1").val(),
                         nombre2 : $("#nombre2").val(),
                         apellido1 : $("#apellido1").val(),
                         apellido2 : $("#apellido2").val(),
                         tipoDocumento : $("#tipoDocumento").val(),
                         documento : $("#documento").val(),
                         fechaNacimiento : $("#fechaNacimiento").val(),
                         sexo : $("#sexo").val(),
                         telefono : $("#telefono").val(),
                         nacionalidad : $("#IDpais").val(),
                         direccion : $("#direccion").val(),
                         departamento : $("#departamento").val(),
                         terminosUso : $("#terminosUso").val()
                    },
                    success : function (data) {
                        if(data.titulo == 'Guardado exitoso'){
                            $("#titulo").css('color', colorVerde);
                            $("#email").val('');
                            $("#password").val('');
                            $("#nombre1").val('');
                            $("#nombre2").val('');
                            $("#apellido1").val('');
                            $("#apellido2").val('');
                            $("#documento").val('');
                            $("#fechaNacimiento").val('');
                            $("#telefono").val('');
                            $("#direccion").val('');
                        } else {
                            $("#titulo").css('color', colorRojo);
                        }
                        $("#titulo").html(data.titulo);
                        $("#notificacion").html(data.notificacion);
                        
                    },
                    error : function (data) {
                        $("#titulo").css('color', colorRojo);
                        $("#titulo").html(data.titulo);
                        $("#notificacion").html(data.notificacion);
                    },
                    type : 'POST'
                });
            }); 
        }
        /**********************************/
        /*  FIN SOLICITUD/DATOSTITULAR   **/
        /**********************************/    
    
    
        /**********************************/
        /*****   SOLICITUD/DATOSMENOR   ***/
        /**********************************/
        this.datosmenor = function(){
            var colorRojo  = '#cc0000';
            var colorVerde = '#00cc00';
            
            var email           = false;
            var password        = false;
            var nombre1         = false;
            var apellido1       = false;            
            var documento       = false;
            var fechaNacimiento = false;
            var telefono        = false;
            var direccion       = false;
            var terminosUso     = false;
                        
            $("#nombre1").bind("keyup focusout", function() {
                if($("#nombre1").val().length > 1){
                    nombre1 = true;
                    $("#nombre1").css("border-color", colorVerde);                    
                } else {
                    nombre1 = false;
                    $("#nombre1").css("border-color", colorRojo);
                }
                checkSolicitud();
            });
            
            $("#nombre2").bind("keyup focusout", function() {
                $("#nombre2").css("border-color", colorVerde);             
            });
            
            $("#apellido1").bind("keyup focusout", function() {
                if($("#apellido1").val().length > 1){
                    apellido1 = true;
                    $("#apellido1").css("border-color", colorVerde);
                } else {
                    apellido1 = false;
                    $("#apellido1").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            $("#apellido2").bind("keyup focusout", function() {
                $("#apellido2").css("border-color", colorVerde);
            });
            
            $("#email").bind("keyup focusout", function() {
                if($("#email").val().length > 7){
                    $.ajax({
                        url : Chukupax.basePath + "/solicitud/getEmail",
                        dataType : "json",
                        data : {  
                             token : $("#token").val(),
                             email : $("#email").val()
                        },
                        success : function (data) {
                            if(data.error == 'ok'){
                                email = true;
                                $("#email").css("border-color", colorVerde);                                     
                            } else {
                                email = false;
                                //$("#email").validationEngine("showPrompt", data.error);
                                $("#email").css("border-color", colorRojo);
                            }
                        },
                        error : function () {
                            email = false;
                            $("#email").css("border-color", colorRojo);
                        },
                        type : 'POST'
                    });
                } else {
                    email = false;
                    $("#email").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            $("#password").bind("keyup focusout", function() {
                if($("#password").val().length > 5){
                    password = true;
                    $("#password").css("border-color", colorVerde);
                } else {
                    password = false;
                    $("#password").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            
            $("#tipoDocumento").bind("focusout change", function() {
                checkDocumento();
                checkSolicitud();
            });
            
            $("#documento").bind("keyup focusout", function() {
                checkDocumento();
                checkSolicitud();
            });
            
            $("#fechaNacimiento").datepicker({
                changeMonth: true,
                changeYear: true,
                defaultDate: "-17y",
                minDate: "-18y",
                maxDate: "-12y",
                yearRange: "-18:+12",
                dateFormat: 'dd/mm/yy'
            }).change(function(){
                checkNacimiento();
                checkSolicitud();
            });
            
            $("#fechaNacimiento").bind("keyup focusout", function() {
                checkNacimiento();
                checkSolicitud();
            });    
            $("#sexo").bind("change focusout", function(){
                $("#sexo").css("border-color", colorVerde);
                checkNacimiento();
                checkSolicitud();
            });    
            
            $("#telefono").bind("keyup focusout", function() {
                if($("#telefono").val().length > 7){
                    telefono = true;
                    $("#telefono").css("border-color", colorVerde);
                } else {
                    telefono = false;
                    $("#telefono").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
            
            $("#direccion").bind("keyup focusout", function() {
                if($("#direccion").val().length > 5){
                    direccion = true;
                    $("#direccion").css("border-color", colorVerde);
                } else {
                    direccion = false;
                    $("#direccion").css("border-color", colorRojo);
                } 
                checkSolicitud();
            });
                        
            $("#IDpais").bind("change focusout", function() {
                //$("#labelNacionalidad").css("border-color", colorVerde);
                $("#IDpais").css("border-color", colorVerde);   
                checkSolicitud();
            });
            
            $("#departamento").bind("change focusout", function() {
                //$("#labelNacionalidad").css("border-color", colorVerde);
                $("#departamento").css("border-color", colorVerde);   
                checkSolicitud();
            });
            
            $("#terminosUso").bind("click", function() {
                if($("#terminosUso").is(':checked')) { 
                    $("#terminosUso").css("border-color", colorVerde);
                    terminosUso = true;
                } else {
                    $("#terminosUso").css("border-color", colorRojo);  
                    terminosUso = false;
                }
                checkSolicitud();
            }); 
            
            /* FUNCION PRIVADA QUE CHEQUEA LA SOLICITUD */ 
            var checkSolicitud = function(){
                if(nombre1 && apellido1 && email && password && documento && fechaNacimiento && telefono && direccion && terminosUso){
                    $('#btnGuardar').prop('disabled', false);
                    $("#btnGuardar").css("color", "#FFF");
                } else {
                    $('#btnGuardar').prop('disabled', true);
                }
            }
            /* FIN FUNCION PRIVADA QUE CHEQUEA LA SOLICITUD */
               
            /* FUNCION PRIVADA QUE CHEQUEA LA FECHA DE NACIMIENTO */  
            var checkNacimiento = function(){
                if($("#fechaNacimiento").val() == ""){
                    fechaNacimiento = false;
                    $("#fechaNacimiento").css("border-color", colorRojo);
                } else {
                    var birthday = $("#fechaNacimiento").val();
                    birthday = birthday.split("/");
                    birthday = birthday[1] + "/" + birthday[0] + "/" + birthday[2];
                    var age = calculateAge(new Date(birthday));                    
                    if (age < 12){
                        fechaNacimiento = false;
                        $("#fechaNacimiento").css("border-color", colorRojo);
                    } else if (age < 14){
                        if($("#sexo").val() == 'F'){
                            fechaNacimiento = true;
                            $("#fechaNacimiento").css("border-color", colorVerde);
                        } else {
                            fechaNacimiento = false;
                            $("#fechaNacimiento").css("border-color", colorRojo);
                        }
                    } else {
                        fechaNacimiento = true;
                        $("#fechaNacimiento").css("border-color", colorVerde);
                    }
                }            
            }            
            /* FIN FUNCION PRIVADA QUE CHEQUEA LA FECHA DE NACIMIENTO */            
                        
            /* FUNCION PRIVADA QUE CHEQUEA EL DOCUMENTO */
            var checkDocumento = function(){
                if($("#tipoDocumento").val() == 'CI'){                    
                    $("#documento").val(function(i, v) {
                        return v.replace(/\./g,"");
                    });
                    $("#documento").val(function(i, v) {
                        return v.replace(/\-/g,"");
                    });                    
                    
                    if(($("#documento").val().length >= 8) && ($.isNumeric($("#documento").val()))){
                        var total = $("#documento").val().substr(0,1) * 2 +
                                    $("#documento").val().substr(1,1) * 9 +
                                    $("#documento").val().substr(2,1) * 8 +
                                    $("#documento").val().substr(3,1) * 7 +
                                    $("#documento").val().substr(4,1) * 6 +
                                    $("#documento").val().substr(5,1) * 3 +
                                    $("#documento").val().substr(6,1) * 4 +
                                    $("#documento").val().substr(7,1) * 1;
                        if((total%10) == 0) {
                            documento = true;                            
                            $.ajax({
                                url : Chukupax.basePath + "/solicitud/getDocumento",
                                dataType : "json",
                                data : {  
                                     token : $("#token").val(),
                                     documento : $("#documento").val()
                                },
                                success : function (data) {
                                    if(data.error == 'ok'){
                                        documento = true;
                                        $("#documento").css("border-color", colorVerde);
                                        $("#tipoDocumento").css("border-color", colorVerde);                                        
                                    } else {
                                        documento = false;
                                        $("#documento").validationEngine("showPrompt", data.error);
                                        $("#documento").css("border-color", colorRojo);
                                        $("#tipoDocumento").css("border-color", colorRojo);
                                    }
                                },
                                error : function () {
                                    documento = false;
                                    $("#documento").css("border-color", colorRojo);
                                    $("#tipoDocumento").css("border-color", colorRojo);
                                },
                                type : 'POST'
                            });
                        } else {
                            documento = false;
                            $("#documento").css("border-color", colorRojo);
                            $("#tipoDocumento").css("border-color", colorRojo);
                        }
                    } else {
                        documento = false;
                        $("#documento").css("border-color", colorRojo);
                        $("#tipoDocumento").css("border-color", colorRojo);
                    }
                } else {
                    if($("#documento").val().length > 2){
                        $.ajax({
                            url : Chukupax.basePath + "/solicitud/getDocumento",
                            dataType : "json",
                            data : {  
                                 token : $("#token").val(),
                                 documento : $("#documento").val()
                            },
                            success : function (data) {
                                if(data.error == 'ok'){
                                    documento = true;
                                    $("#documento").css("border-color", colorVerde);
                                    $("#tipoDocumento").css("border-color", colorVerde);                                        
                                } else {
                                    documento = false;
                                    $("#documento").validationEngine("showPrompt", data.error);
                                    $("#documento").css("border-color", colorRojo);
                                    $("#tipoDocumento").css("border-color", colorRojo);
                                }
                            },
                            error : function () {
                                documento = false;
                                $("#documento").css("border-color", colorRojo);
                                $("#tipoDocumento").css("border-color", colorRojo);
                            },
                            type : 'POST'
                        });
                    } else {
                        documento = false;
                        $("#documento").css("border-color", colorRojo);
                        $("#tipoDocumento").css("border-color", colorRojo);
                    }
                }
            }
            /* FIN FUNCION PRIVADA QUE CHEQUEA EL DOCUMENTO */
            
            
           $('#btnGuardar').click(function() {
                $("#guardandoDialog").dialog({
                    modal:true,
                    width:450
                });
                
               
                $.ajax({
                    url : Chukupax.basePath + "/solicitud/guardarMenor",
                    dataType : "json",
                    data : {
                         token : $("#token").val(),
                         email : $("#email").val(),
                         password : $("#password").val(),                         
                         nombre1 : $("#nombre1").val(),
                         nombre2 : $("#nombre2").val(),
                         apellido1 : $("#apellido1").val(),
                         apellido2 : $("#apellido2").val(),
                         tipoDocumento : $("#tipoDocumento").val(),
                         documento : $("#documento").val(),
                         fechaNacimiento : $("#fechaNacimiento").val(),
                         sexo : $("#sexo").val(),
                         telefono : $("#telefono").val(),
                         nacionalidad : $("#IDpais").val(),
                         direccion : $("#direccion").val(),
                         departamento : $("#departamento").val(),
                         terminosUso : $("#terminosUso").val()
                    },
                    success : function (data) {
                        if(data.titulo == 'Guardado exitoso'){
                            $("#titulo").css('color', colorVerde);
                            $("#email").val('');
                            $("#password").val('');
                            $("#nombre1").val('');
                            $("#nombre2").val('');
                            $("#apellido1").val('');
                            $("#apellido2").val('');
                            $("#documento").val('');
                            $("#fechaNacimiento").val('');
                            $("#telefono").val('');
                            $("#direccion").val('');
                        } else {
                            $("#titulo").css('color', colorRojo);
                        }
                        $("#titulo").html(data.titulo);
                        $("#notificacion").html(data.notificacion);
                        
                    },
                    error : function (data) {
                        $("#titulo").css('color', colorRojo);
                        $("#titulo").html(data.titulo);
                        $("#notificacion").html(data.notificacion);
                    },
                    type : 'POST'
                });
            }); 
        }
        /**********************************/
        /*****   FIN SOLICITUD/DATOSMENOR */
        /**********************************/
    
    
    
    
    
    
    
        /**********************************/
        /*****   SOLICITUD/OPCIONES   *****/
        /**********************************/
        //SUCURSAL 1 FORTEX CASA CENTRAL
        //SUCURSAL 2 FORTEX POCITOS
        //SUCURSAL 3 FORTEX CORDON
        //SUCURSAL 5 REDPAGOS
        //SUCURSAL 6 ENVIO A DOMICILIO
        this.opciones = function(){ 
            var colorRojo  = '#cc0000';
            var colorVerde = '#00cc00';
            
            var cifile1      = false;
            var cifile2      = false;
            var calle        = false;
            var nrop         = false;
            var departamento = false;
            var localidad    = false;
            var nagencia     = false;
                        
            $("#btnFortex").click(function (e) {
                e.preventDefault();
                $("#envioRedPagos").slideUp();                         
                $("#envioDomicilio").slideUp();
                $("#envioFortex").slideDown();
                $("#ci_carga").slideDown();
                $("#contenedorGuardar").slideDown();
                
                $("#btnFortex").prop('disabled', true);
                $("#btnDomicilio").prop('disabled', false);
                $("#btnRedPagos").prop('disabled', false);
                
                $("#btnFortexCiudadVieja").prop('disabled', false);
                $("#btnFortexPocitos").prop('disabled', false);
                $("#btnFortexCordon").prop('disabled', false);
                
                checkOpcion();
            });
            
            $("#btnDomicilio").click(function (e) {
                e.preventDefault(); 
                $("#envioRedPagos").slideUp();                         
                $("#envioDomicilio").slideDown();
                $("#envioFortex").slideUp();
                $("#ci_carga").slideDown();
                $("#contenedorGuardar").slideDown();
                
                $("#btnFortex").prop('disabled', false);
                $("#btnDomicilio").prop('disabled', true);
                $("#btnRedPagos").prop('disabled', false);
                
                $("#sucursal").val(6); 
                checkOpcion();
            });
            
            $("#btnRedPagos").click(function (e) {
                e.preventDefault(); 
                
                $("#envioRedPagos").slideDown();                         
                $("#envioDomicilio").slideUp();
                $("#envioFortex").slideUp();
                $("#ci_carga").slideDown();
                $("#contenedorGuardar").slideDown();
                $("#RedPagosDialog").dialog({
                    modal:true,
                    width:'80%'
                });
                $("#cont_frame_redpagos").slideDown();
                
                $("#btnFortex").prop('disabled', false);
                $("#btnDomicilio").prop('disabled', false);
                $("#btnRedPagos").prop('disabled', true);
                
                $("#sucursal").val(5); 
                checkOpcion();
            });
            
            $("#editarAgencia").click(function (e) {
                e.preventDefault(); 
                $("#RedPagosDialog").dialog({
                    modal:true,
                    width:'80%'
                });
            });    
            
            /* SUCURSAL FORTEX */
            $("#btnFortexCiudadVieja").click(function (e) {                
                e.preventDefault();                
                $("#sucursal").val(1);
                
                $("#btnFortexCiudadVieja").prop('disabled', true);
                $("#btnFortexPocitos").prop('disabled', false);
                $("#btnFortexCordon").prop('disabled', false);
                
                checkOpcion();
            });
            
            $("#btnFortexPocitos").click(function (e) {
                e.preventDefault();                
                $("#sucursal").val(2);
                
                $("#btnFortexCiudadVieja").prop('disabled', false);
                $("#btnFortexPocitos").prop('disabled', true);
                $("#btnFortexCordon").prop('disabled', false);
                
                checkOpcion();
            });
            
            $("#btnFortexCordon").click(function (e) {
                e.preventDefault();                
                $("#sucursal").val(3);
                
                $("#btnFortexCiudadVieja").prop('disabled', false);
                $("#btnFortexPocitos").prop('disabled', false);
                $("#btnFortexCordon").prop('disabled', true);
                
                checkOpcion();
            });
            
            /* ENVIO A DOMICILIO */
            $("#calle").bind("keyup focusout", function() {
                if($("#calle").val().length > 1){
                    calle = true;
                    $("#calle").css("border-color", colorVerde);
                } else {
                    calle = false;
                    $("#calle").css("border-color", colorRojo);
                } 
                checkOpcion();
            });
            $("#nrop").bind("keyup focusout", function() {
                if($("#nrop").val().length > 0){
                    nrop = true;
                    $("#nrop").css("border-color", colorVerde);
                } else {
                    nrop = false;
                    $("#nrop").css("border-color", colorRojo);
                } 
                checkOpcion();
            }); 
            $("#apto").bind("keyup focusout", function() {
                $("#apto").css("border-color", colorVerde);
            });
            $("#esquina").bind("keyup focusout", function() {
                $("#esquina").css("border-color", colorVerde);
            });
            $("#departamento").bind("change focusout", function() {
                $("#departamento").css("border-color", colorVerde);   
                departamento = true; checkOpcion();
            });
            $("#localidad").bind("change focusout", function() {
                $("#localidad").css("border-color", colorVerde);   
                localidad = true; checkOpcion();
            });
            
            /* RED PAGOS */
            $("#agencias tr.rowag").click(function () {
                $("#nagencia").val($(this).data("agencia"));
                $("#RedPagosDialog").dialog("close");
                $.get(
                    Chukupax.basePath + "/solicitud/getAgencia_redpagos/" + $(this).data("agencia"),
                    {},
                    function (data) {
                        if (data.error == "ok")
                            $("#agenciaSeleccionada").html(data.html);
                    },
                    'json'
                );            
                nagencia = true; checkOpcion();
            });
            
            /* FUNCION PRIVADA QUE CHEQUEA EL RELLENADO DE LOS CAMPOS */ 
            var checkOpcion = function(){
                //SUCURSAL FORTEX
                if($("#sucursal").val() == 1 || $("#sucursal").val() == 2 || $("#sucursal").val() == 3){
                    //Si es sucursal fortex chequeamos que se hayan subido las CI
                    if(cifile1 && cifile2){
                        $('#btnGuardar').prop('disabled', false);
                        $("#btnGuardar").css("color", "#FFF");
                    } else {
                        $('#btnGuardar').prop('disabled', true);
                    }
                } else if($("#sucursal").val() == 5){
                    //Si la sucursal es redpagos chequeamos que se hayan subido las CI y haya elegido una subagencia
                    if(cifile1 && cifile2 && nagencia){
                        $('#btnGuardar').prop('disabled', false);
                        $("#btnGuardar").css("color", "#FFF");
                    } else {
                        $('#btnGuardar').prop('disabled', true);
                    }
                } else if($("#sucursal").val() == 6){
                    //Si eligio envio a domicilio chequeamos que se hayan subido las CI e informacion de envio
                    if(cifile1 && cifile2 && calle && nrop && departamento && localidad){
                        $('#btnGuardar').prop('disabled', false);
                        $("#btnGuardar").css("color", "#FFF");
                    } else {
                        $('#btnGuardar').prop('disabled', true);
                    }
                } else {
                    $('#btnGuardar').prop('disabled', true);
                }
            }
                        
            $("#departamento").change(function () {
                var dep = $(this).val().toUpperCase();
                dep = remove_accent(dep);
                $.ajax({
                    url : Chukupax.basePath + "/solicitud/getCiudades",
                    dataType : "json",
                    data : {
                        departamento : dep
                    },
                    success : function (data) {
                        $("#localidad").html(data);
                    },
                    error : function (data) {
                        $("#localidad").html('');
                    },
                    type : 'POST'
                });
            });
            
            $("#agencias").DataTable({
                    "oLanguage": {
                            "sProcessing": "Procesando...",
                            "sLengthMenu": "Mostrar _MENU_ registros",
                            "sZeroRecords": "No se encontraron resultados",
                            "sEmptyTable": "Ningún dato disponible en esta tabla",
                            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix": "",
                            "sSearch": "Busque por nombre, departamento, localidad o calle:",
                            "sUrl": "",
                            "sInfoThousands": ",",
                            "sLoadingRecords": "Cargando...",
                            "oPaginate": {
                                    "sFirst": "Primero",
                                    "sLast": "Último",
                                    "sNext": "Siguiente",
                                    "sPrevious": "Anterior"
                            },
                            "oAria": {
                                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                            }
                    },
                    "bPaginate": false,
                    "aaSorting": [[1, 'asc'], [2, 'asc'], [3, 'asc']]
            });
            
            $('#contenedorCI_cifile').click(function(e) {
                $('#cifile').click(e.handler);
            });    
            $("#cifile").change(function (e) {
                input = e.target;
                if (input.files && input.files[0]) {                        
                    var ext = $("#cifile").val().split('.').pop().toLowerCase();                        
                    if($.inArray(ext, ['doc','docx','pdf']) == -1) {
                        var reader = new FileReader();                                                    
                        reader.onload = function (e) {
                            $('#cifile_preview').attr('src', e.target.result);
                        };
                        reader.readAsDataURL(input.files[0]);
                    } else {
                        $('#cifile_preview').attr('src', Chukupax.basePath + '/imagenes/fondoSucursalSeleccionada.png');
                    } 
                    $('#contenedorCI_cifile').attr("class", "contenedorCI contenedorCIOK");
                    cifile1 = true; checkOpcion();
                }
            });

            $('#contenedorCI_cifile2').click(function(e) {
                $('#cifile2').click(e.handler);
            });
            $("#cifile2").change(function (e) {
                input = e.target;
                if (input.files && input.files[0]) {
                    var ext = $("#cifile2").val().split('.').pop().toLowerCase();                        
                    if($.inArray(ext, ['doc','docx','pdf']) == -1) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $('#cifile2_preview').attr('src', e.target.result);
                        };
                        reader.readAsDataURL(input.files[0]);
                    } else {
                        $('#cifile2_preview').attr('src', Chukupax.basePath + '/imagenes/fondoSucursalSeleccionada.png');
                    }
                    $('#contenedorCI_cifile2').attr("class", "contenedorCI contenedorCIOK");
                    cifile2 = true; checkOpcion();
                }
            });
            
            $('#btnGuardar').click(function() {
                var formData = new FormData();

                jQuery.each(jQuery('#cifile')[0].files, function(i, file) {
                    formData.append('cifile', file);
                });

                jQuery.each(jQuery('#cifile2')[0].files, function(i, file) {
                    formData.append('cifile2', file);
                });

                formData.append('token', $('#token').val());
                formData.append('idu', $('#idu').val());
                formData.append('sucursal', $('#sucursal').val());
                formData.append('nagencia', $('#nagencia').val());
                formData.append('departamento', $('#departamento').val());
                formData.append('localidad', $('#localidad').val());
                formData.append('calle', $('#calle').val());
                formData.append('nrop', $('#nrop').val());
                formData.append('apto', $('#apto').val());
                formData.append('esquina', $('#esquina').val());
                formData.append('notasDomicilio', $('#notasDomicilio').val());
                
                $("#guardarDialog").dialog({
                   modal:true,
                   width:450
                });
                 
                 $.ajax({
                    url : Chukupax.basePath + "/solicitud/guardarOpciones",
                    dataType : "json",
                    data : formData,
                    contentType : false,
                    processData : false,
                    cache: false,
                    mimeType: "multipart/form-data",
                    success : function (data) {
                         if(data.titulo == 'Guardado exitoso'){
                             $("#titulo").css('color', colorVerde);
                         } else {
                             $("#titulo").css('color', colorRojo);
                         }
                         $("#titulo").html(data.titulo);
                         $("#notificacion").html(data.notificacion);
                     },
                     error : function (data) {
                         $("#titulo").css('color', colorRojo);
                         $("#titulo").html(data.titulo);
                         $("#notificacion").html(data.notificacion);
                     },
                    type : 'POST'
                });
            });
            
            
            
            
            
        }
        
        
        $("#departamento").change(function () {
            var departamento = $(this).val().toUpperCase().replace(' ', '');
            departamento = departamento.replace(' ', '');
            departamento = remove_accent(departamento);
            
            $("option[class^='ciudad']").hide();
            $(".ciudad" + departamento).show();
            $("option[class^='ciudad']").attr('selected', false);
            $(".ciudad" + departamento).parent().removeAttr('selected').find(".ciudad" + departamento + ":first").attr('selected', 'selected');

            $("#" + $(this).attr("id") + "e").val($(this).val());
            $("option[class^='entrega_ciudad']").hide();
            $(".entrega_ciudad" + departamento).show();
            $("option[class^='entrega_ciudad']").attr('selected', false);
            $(".entrega_ciudad" + departamento).parent().removeAttr('selected').find(".entrega_ciudad" + departamento + ":first").attr('selected', 'selected');
        });
        
        
        $("#localidad").change(function () {
            $("#" + $(this).attr("id") + "e").val($(this).val());
            
        });
        
        
        $("#titular_departamento").change(function () {
            var departamento = $(this).val().toUpperCase().replace(' ', '');
            departamento = departamento.replace(' ', '');
            departamento = remove_accent(departamento);            
            $("option[class^='titular_ciudad']").hide();
            $(".titular_ciudad" + departamento).show();
            $("option[class^='titular_ciudad']").attr('selected', false);
            $(".titular_ciudad" + departamento).parent().removeAttr('selected').find(".titular_ciudad" + departamento + ":first").attr('selected', 'selected');

            $("#" + $(this).attr("id") + "e").val($(this).val());
        });
        
        
        $("#departamentoe").change(function () {
            var departamento = $(this).val().toUpperCase().replace(' ', '');
            departamento = departamento.replace(' ', '');
            departamento = remove_accent(departamento);
            
            $("option[class^='entrega_ciudad']").hide();
            $(".entrega_ciudad" + departamento).show();
            $("option[class^='entrega_ciudad']").attr('selected', false);
            $(".entrega_ciudad" + departamento).parent().removeAttr('selected').find(".entrega_ciudad" + departamento + ":first").attr('selected', 'selected');

        });
        
	this.showTitular = function () {
		$(".adicional").slideDown();
		$("#datos_titulo").html("Datos del menor");
		//hacemos obligatorios los campos
		$("#formSolicitud").validationEngine('detach');
		$("#titular_aceptoPoliticas,#titular_nombre,#titular_apellido,#titular_departamento,#titular_localidad,#titular_telefono,#titular_ocupacion,#titular_direccion,#titular_fechaNacimiento").attr("data-validation-engine", "validate[required]");
		$("#titular_documento,#titular_zip").attr("data-validation-engine", "validate[required,custom[integer]]");

		$("#formSolicitud").validationEngine('attach');
		$("#adicional").prop("checked",true);
                
                /* CAMBIOS RICHARD */
                $("#tituloSolicitud").text('Paso 1 de 2: Solicitar tarjeta a menor');
                $("#mensajeTituloSolicitud").html('Completá los datos a continuación para solicitar una Prex a un menor.<br/><small>Para más información te recomendamos visitar la sección de <a href="'+Chukupax.basePath+'/#frsaqs" target="_blank">preguntas frecuentes</a></small>');
         
                $("#textoAccesoSolicitud").html('Mail y contraseña del menor');
                $("#btnRegistroMenores").attr('class','btnGris');    
                $("#btnRegistroMenores").attr('value','En solicitud de menor');  
                $("#btnRegistroMayores").attr('class','btnAmarillo');
                $("#btnRegistroMayores").attr('value','Ir a solicitud para mayores');
                
                $("#textoPoliticas").html(
                   'He leído y acepto los <a href="'+Chukupax.basePath+'/html/terminosCondiciones" target="_blank">Términos y condiciones</a> y <a href="'+Chukupax.basePath+'/html/cartillaUso" target="_blank">Cartilla de uso</a>.' +
                   ' La emisión de una tarjeta para un menor se rige íntegramente por los Términos y Condiciones para emisión de tarjetas prepagas firmadas por el Titular del contrato. Autorizo la emisión de una tarjeta a la persona indicada.' 
                );
                
                $("#textoCI").html('<b>Documento del menor</b>');
                $("#ciTitular").show();
                
                $("#mensajeRetiro").html('¿Dónde quieres retirar la Prex del menor?');
                //$('#agencias').dataTable().fnFilter($("#titular_departamento").val());
                
                $("#divTitularQuieroPrex").show();
	}
	this.hideTitular = function () {
		$(".adicional").slideUp();
		$("#datos_titulo").html("Datos personales");
		$("#formSolicitud").validationEngine('detach');
		$("#titular_aceptoPoliticas,#titular_nombre,#titular_apellido,#titular_departamento,#titular_localidad,#titular_documento,#titular_telefono,#titular_ocupacion,#titular_zip,#titular_direccion,#titular_fechaNacimiento").attr("data-validation-engine", "");
		$("#formSolicitud").validationEngine('attach');
		$("#adicional").prop("checked",false);
                
                /* CAMBIOS RICHARD */
                $("#tituloSolicitud").text('Paso 1 de 2: Solicitá tu tarjeta');
                $("#mensajeTituloSolicitud").html('Completá los datos a continuación para solicitar tu PREX.<br/>Para más información te recomendamos visitar la sección de <a href="'+Chukupax.basePath+'/#fraqs" target="_blank">preguntas frecuentes</a></small>');
                $("#textoAccesoSolicitud").html('Ingresá tu usuario y contraseña para acceder a tu estado de cuenta y cargar tu saldo.');
                             
                $("#btnRegistroMenores").attr('class','btnAmarillo');    
                $("#btnRegistroMenores").attr('value','Ir a solicitud de menor');  
                $("#btnRegistroMayores").attr('class','btnGris');
                $("#btnRegistroMayores").attr('value','En solicitud de mayor');
                
                $("#textoPoliticas").html(
                   'He leído y acepto los <a href="'+Chukupax.basePath+'/html/terminosCondiciones" target="_self">Términos y condiciones</a> y <a href="'+Chukupax.basePath+'/html/cartillaUso" target="_blank">Cartilla de uso</a>'
                );
        
                $("#textoCI").html('<b>Documento</b>');
                $("#ciTitular").hide();
                
                $("#mensajeRetiro").html('Dónde quieres retirar la Prex');
                //$('#agencias').dataTable().fnFilter($("#departamento").val());
                
                $("#divTitularQuieroPrex").hide();
	}
	this.tarjeta = function () {
            $('.px-selected').parent('li').addClass('li-px-selected');
            $("#departamento, #titular_departamento, #departamentoe").change(function () {
                var dep = $(this).val().toUpperCase();
                var selectDep = $(this).attr('id');
                var localidad = selectDep.replace("departamento", "");
                if(localidad == "e")
                    localidad = "localidade";
                else
                    localidad += "localidad";
                
                dep = remove_accent(dep);
                $.ajax({
                    url : Chukupax.basePath + "/solicitud/getCiudades",
                    dataType : "json",
                    data : {
                        departamento : dep
                    },
                    success : function (data) {
                        $("#" + localidad).html(data);
                    },
                    error : function (data) {
                        $("#" + localidad).html('');
                    },
                    type : 'POST'
                });
            });
            
                var menor = '';   
                var url =  window.location.toString().match(/^https:\/\/[^/]+/) + Chukupax.basePath + '/solicitud/tarjeta/menor';
                var url2 =  window.location.toString().match(/^https:\/\/[^/]+/) + Chukupax.basePath + '/sitio/solicitud/tarjeta/menor';
                
                if(window.location == url ||
                    window.location == url2    )
                    menor = 't';
                
                var paisSelect = "Uruguay";
                var url_argentina =  
                        window.location.toString().match(/^https:\/\/[^/]+/) + 
                        Chukupax.basePath + '/solicitud/tarjeta/' + paisSelect;
                
                if(window.location ==  url_argentina){
                    var paisSelect = "Argentina";
                    $(".seccionInterna").css(
                        "background-image",
                        'url("https://de2aqb3kqoyo2.cloudfront.net/web/summer-ad-2015.jpg")');
                    $(".seccionInterna").css("background-size","25% auto");
                    $(".seccionInterna").css("background-position","right top");
                    $(".seccionInterna").css("background-repeat","no-repeat");
                    
                    $("option[class^='dep']").hide();
                    $(".dep" + paisSelect).show();
                    $("option[class^='dep']").attr('selected', false);
                    $(".dep" + paisSelect).parent().removeAttr('selected').find(".dep" + paisSelect + ":first").attr('selected', 'selected');
                    $("#IDpais").attr('selected', false);
                    $("#IDpais").removeAttr('selected').find("option[value='032']").attr('selected', 'selected');
                }
                else{
                    $("option[class^='dep']").hide();
                    $(".dep" + paisSelect).show();
                    $("option[class^='dep']").attr('selected', false);
                    $(".dep" + paisSelect).parent().removeAttr('selected').find(".dep" + paisSelect + ":first").attr('selected', 'selected');
                    $("#IDpais").attr('selected', false);
                    $("#IDpais").removeAttr('selected').find("option[value='858']").attr('selected', 'selected');
                }
                
                var cambiosMenores = function cambiosMenosres(){
                    Chukupax.esMenor = true;
                    Chukupax.modulo.showTitular();
                }
                
                if(menor == "t"){
                    Chukupax.esMenor = true;
                    Chukupax.modulo.showTitular();
                    $("#btnEntregaDomicilio").hide();
                    $("#entregaDomicilio").hide();
                } else {
                    $("#btnEntregaDomicilio").show();                    
                    Chukupax.modulo.hideTitular();                   
                    Chukupax.esMenor = false;
                }                
            
                $("#btnRegistroMenores").click(function(){
                    Chukupax.esMenor = true;
                    Chukupax.modulo.showTitular();
                    $("#btnEntregaDomicilio").hide();
                });
                
                $("#btnRegistroMayores").click(function(){
                    Chukupax.esMenor = false;
                    Chukupax.modulo.hideTitular();
                    $("#btnEntregaDomicilio").show();
                    
                    var birthday = $("#fechaNacimiento").val();
                    birthday = birthday.split("/");
                    birthday = birthday[1] + "/" + birthday[0] + "/" + birthday[2];
                    var age = calculateAge(new Date(birthday));
                    if (age < 18) {
                        $("#fechaNacimiento")
                            .removeClass("verificado")
                            .addClass("incorrecto")
                            .validationEngine("showPrompt", "El solicitante debe ser mayor de 18 años");                                 
                    }
                });               
                
                $("#titular_IDpais,#titular_localidad,#titular_calle,#titular_nro,#titular_apto,#titular_esquina,#titular_zip").change(function () {
                    //$("#" + $(this).attr("id").slice(8,50)).val($(this).val());
                    //$("#" + $(this).attr("id").slice(8,50) + "e").val($(this).val());
		});
                
		$("#IDpais,#calle,#nro,#apto,#esquina,#zip").change(function () {
                    var paisSelect = "Uruguay";
                    switch($(this).val()) {
                        case "032":
                            paisSelect = "Argentina";
                            break;
                        case "076":
                            paisSelect = "Brasil";
                            break;
                        case "600":
                            paisSelect = "Paraguay";
                            break;
                        case "862":
                            paisSelect = "Venezuela";
                            break;
                        case "858":
                            paisSelect = "Uruguay";
                            break;
                    }
                    $("option[class^='dep']").hide();
                    $(".dep" + paisSelect).show();
                    $("option[class^='dep']").attr('selected', false);
                    $(".dep" + paisSelect).parent().removeAttr('selected').find(".dep" + paisSelect + ":first").attr('selected', 'selected');

                    $("#" + $(this).attr("id") + "e").val($(this).val());
		});
                
		$("#titular_fechaNacimiento").datepicker({
			changeMonth: true,
			changeYear: true,
			defaultDate: "-18y",
			minDate: "-120y",
			maxDate: "-18y",
			yearRange: "-120:+18",
			dateFormat: 'dd/mm/yy'
		}).change(function () {
			var birthday = $("#titular_fechaNacimiento").val();
			birthday = birthday.split("/");
			birthday = birthday[1] + "/" + birthday[0] + "/" + birthday[2];
			var age = calculateAge(new Date(birthday)); 
			if (age < 18){   
				$("#fn").validationEngine("showPrompt", "El tutor debe ser mayor de 18 años"), $("#titular_fechaNacimiento-day,#titular_fechaNacimiento-month,#titular_fechaNacimiento-year").removeClass("verificado").addClass("incorrecto");
					}
			else{
				$("#fn").validationEngine("hide"), $("#titular_fechaNacimiento-day,#titular_fechaNacimiento-month,#titular_fechaNacimiento-year").removeClass("incorrecto").addClass("verificado"); 
				}
		});   
                
                $("#sexo").change(function(){
                    if(Chukupax.esMenor){
                        var birthday = $("#fechaNacimiento").val();
			birthday = birthday.split("/");
			birthday = birthday[1] + "/" + birthday[0] + "/" + birthday[2];
			var age = calculateAge(new Date(birthday));
			if (age < 14 && $("#sexo").val() == 'M') {
				$("#fechaNacimiento")
					.removeClass("verificado")
					.addClass("incorrecto")
					.validationEngine("showPrompt", "El solicitante debe ser mayor de 14 años");
                                        //Chukupax.modulo.hideTitular();
                                        //Chukupax.esMenor = false;                                        
                        } else if (age < 12 && $("#sexo").val() == 'F'){  
                                $("#fechaNacimiento")
                                        .removeClass("verificado")
                                        .addClass("incorrecto")
                                        .validationEngine("showPrompt", "El solicitante debe ser mayor de 12 años");
                                        //Chukupax.modulo.hideTitular();
                                        //Chukupax.esMenor = false;
			} else {
                            $("#fechaNacimiento")
					.removeClass("incorrecto")
					.addClass("verificado")
					.validationEngine("hide");
                        }
                    }
                });
                
                $("#email2").change(function(){
                    if (!Chukupax.emailChange){
                        Chukupax.emailChange = true;
                        $( "#email" ).change();
                    }
                });
                                
		$("#fechaNacimiento").datepicker({
			changeMonth: true,
			changeYear: true,
			defaultDate: "-14y",
			minDate: ($("#solicitaadicional").val() == 1) ? "-18y" : "-120y",
			maxDate: "-12y",
			yearRange: "-120:+10",
			dateFormat: 'dd/mm/yy'
		}).change(function () {
			var birthday = $("#fechaNacimiento").val();
			birthday = birthday.split("/");
			birthday = birthday[1] + "/" + birthday[0] + "/" + birthday[2];
			var age = calculateAge(new Date(birthday));
			if (age < 14 && $("#sexo").val() == 'M') {
				$(this)
					.removeClass("verificado")
					.addClass("incorrecto")
					.validationEngine("showPrompt", "El solicitante debe ser mayor de 14 años");
                                        //Chukupax.modulo.hideTitular();
                                        //Chukupax.esMenor = false;                                        
                        } else if (age < 12 && $("#sexo").val() == 'F'){  
                                $(this)
                                        .removeClass("verificado")
                                        .addClass("incorrecto")
                                        .validationEngine("showPrompt", "El solicitante debe ser mayor de 12 años");
                                        //Chukupax.modulo.hideTitular();
                                        //Chukupax.esMenor = false;
			} else {
				$(this)
					.removeClass("incorrecto")
					.addClass("verificado")
					.validationEngine("hide");
				if (age < 18) {
					Chukupax.esMenor = true;
					Chukupax.modulo.showTitular();
				} else {
                                        Chukupax.esMenor = false;
					Chukupax.modulo.hideTitular();
				}
			}
		});


		var fields = {
                        titular_departamento: "departamento",
			titular_localidad: "localidad",
			titular_zip: "zip",
			titular_direccion: "direccion",
			titular_IDpaisr: "pais",
			titular_telefono: "telefono"
		}
		for (vi in fields) {
			$("#" + vi).data("tfield", fields[vi]).change(function () {
				$("#" + $(this).data("tfield")).val($(this).val()).blur();
			})
		}
		if ($("#solicitaadicional").val() == 1) {
			Chukupax.modulo.showTitular();
		}
		$("#formSolicitud").validationEngine().bind("jqv.field.result", function (event, field, errorFound, prompText) {
			if (field.attr("id") != "documento" && field.attr("id") != "email" && field.attr("id") != "importe") {
				if (errorFound) field.removeClass("verificado").addClass("incorrecto").data("ok", false);
				else
					field.removeClass("incorrecto").addClass("verificado").data("ok", true);
			}
		});
                
                
                
                
                
		$("#btnContinuar1").click(function () {
			if (!Chukupax.ajaxWorking) {
				var birthday = $("#fechaNacimiento").val();
				birthday = birthday.split("/");
				birthday = birthday[1] + "/" + birthday[0] + "/" + birthday[2];
				var age = calculateAge(new Date(birthday));
                                
                                /*if(!Chukupax.esMenor)
                                    //$('#agencias').dataTable().fnFilter($("#titular_departamento").val());
                                else
                                    //$('#agencias').dataTable().fnFilter($("#departamento").val());*/
                                if (!Chukupax.documentChange){
                                    Chukupax.documentChange = true;
                                    $( "#documento" ).change();
                                }
                                
				if ($("#adicional").prop('checked') && $("#documento").val() == $("#titular_documento").val()){
					$("#btnContinuar1").validationEngine("showPrompt", "El documento del titular debe ser diferente al adicional.");
                                }
				else if (!$("#documento").data("ok"))
					$("#documento").validationEngine("showPrompt", "Complete su documento");
				else if (!$("#email").data("ok"))
					$("#email").validationEngine("showPrompt", "Complete su email correctamente");
				else if ($("#fechaNacimiento").val() == "")
					$("#fechaNacimiento").validationEngine("showPrompt", "Debe completar su fecha de nacimiento");
				else if ($("#adicional").prop("checked") && age > 18)
					$("#fechaNacimiento").validationEngine("showPrompt", "La solicitud de adicional es solamente para un menor.");
				else if ($("#formSolicitud").validationEngine("validate")) {
					Chukupax.ajaxWorking = true;
					$("#btnContinuar1").validationEngine("showPrompt", "Validando registro, por favor espere...");
					if(age < 18 && ($("#titular_documento").val() == "" || $("#titular_nombre").val() == "" ||  $("#titular_apellido").val() == "")){
						$("#btnContinuar1").validationEngine("showPrompt", 'Ingrese correctamente los datos del titular');
						Chukupax.esMenor = true;
						Chukupax.modulo.showTitular();
						Chukupax.ajaxWorking = false;
					} else {
						Chukupax.esMenor = false;
						Chukupax.modulo.hideTitular();
																
						$.post(
								Chukupax.basePath + "/solicitud/_do1",
								$("#formSolicitud").serialize(),
								function (data) {
										Chukupax.ajaxWorking = false;

										if (data.error && data.error == "ok") {
												$("#paso1").slideUp();
												$("#paso2").slideDown();
												$(window).scrollTo(0, 0);
												$("#btnContinuar1").validationEngine("hideAll");
										} else {
                                                var msg = "Intente más tarde por favor";
                                                console.log(data);
												switch (data.error) {
														case 11:
														case 12:
														case 13:
														case 14:
																msg = "Ingresa correctamente el titular.";
																break;
														case 22:
																msg = "El documento del titular no debe coincidir con el del adicional";
																break;
														case 23:
																msg = "El mail del titular no debe coincidir con el del adicional";
                                                                break;
                                                        case 201:
                                                            msg = "El menor no cumple los requisitos de edad";
                                                        break;
												}
												$("#btnContinuar1").validationEngine("showPrompt", msg);
										}
								},
								'json'
						);
					}
				}
			}
		});
                $("#btnAnterior").click(function () {
                    $("#paso2").slideUp();
                    $("#paso1").slideDown();
                    $(window).scrollTo(0, 0);
                });    
                
		$("#btnAmarillo").click(function () {
			if ($("#sucursal").val() == "")
				$("#btnAmarillo").validationEngine("showPrompt", "Seleccione una sucursal");
			else if (($("#sucursal").val() == 5 || $("#sucursal").val() == 6) && $("#cifile").val() == "") {
				$("#btnAmarillo").validationEngine("showPrompt", "Debe ingresar su cédula de identidad escaneada o fotocopiada");
				$.scrollTo("#seccion4");
			} else if (!Chukupax.ajaxWorking) {
				if ($("#nagencia").val() == "" && $("#sucursal").val() == 5){
					$("#btnAmarillo").validationEngine("showPrompt", "Debe seleccionar una agencia del listado");
				} else {
					Chukupax.ajaxWorking = true;
					$("#formSolicitud").validationEngine("hideAll");
					$("#btnAmarillo").validationEngine("showPrompt", "Guardando...");
					$("#formSolicitud").attr("action", Chukupax.basePath + "/solicitud/_do_estado_1").submit();
				}	
			}
		})
                
                $("#btnSucursalesFortex").click(function (e) {
			e.preventDefault();
			$("#entregaFortex").slideDown();
                        $(this).attr("class", "datosEntrega datosEntregaSeleccionada");
                        $("#btnEntregaDomicilio").attr("class", "datosEntrega");
                        $("#btnEntregaRedPagos").attr("class", "datosEntrega");
                        $("#entregaDomicilio").slideUp();
                        $("#entregaRedPagos").slideUp();
		});
                                
                $("#btnEntregaDomicilio").click(function (e) {
				e.preventDefault();
                        $("#entregaDomicilio").slideDown();
                        $(this).attr("class", "datosEntrega datosEntregaSeleccionada");
                        $("#btnSucursalesFortex").attr("class", "datosEntrega");
                        $("#btnEntregaRedPagos").attr("class", "datosEntrega");
                        $("#entregaFortex").slideUp();
                        $("#entregaRedPagos").slideUp();
                        
                        $("#formSolicitud").validationEngine('detach');
                        $("#departamentoe").val($("#departamento").val());
                        $("#departamentoe,#localidade,#callee,#nroe,#zipe").attr("data-validation-engine", "validate[required]");
                        $("#formSolicitud").validationEngine('attach');
                        $("#datos_envio").stop(true).slideDown();
                        $("#IDpais").change();
                        $("#sucursal").val(6);
						
						/*$("#atencionDialog").dialog({
                            modal:true,
                            width:650,
                            buttons: {
                                "Confirmar": function() {   
                                    $("#atencionDialog").dialog("close");
                                 }
                            }
                         });*/
						
				});
                
                 $("#btnEntregaRedPagos").click(function (e) {
			e.preventDefault();
                        $("#entregaRedPagos").slideDown();
                        $(this).attr("class", "datosEntrega datosEntregaSeleccionada");
                        $("#btnEntregaDomicilio").attr("class", "datosEntrega");
                        $("#btnSucursalesFortex").attr("class", "datosEntrega");         
                        $("#entregaDomicilio").slideUp();
                        $("#entregaFortex").slideUp();
                        
                        $("#cont_frame_redpagos").slideDown();
                        $("#sucursal").val(5);
		});
                
                
		$("a.datos").click(function () {
			$(".datos").removeClass("sucursalSeleccionada");
			$(this).addClass("sucursalSeleccionada");
			$("#sucursal").val($(this).data("sucursal"));

			$("#formSolicitud").validationEngine('detach');
			$("#departamentoe,#localidade,#callee,#nroe,#zipe").removeAttr("data-validation-engine");
			$("#formSolicitud").validationEngine('attach');
			$("#datos_envio").slideUp();

			/*if ($(this).data("sucursal") == 5) {
				//redpagos
				$("#cont_frame_redpagos").slideDown();
				$.scrollTo("#agencias");

			} else if ($(this).data("sucursal") == 6) {
				//retiro domicilio
				$("#formSolicitud").validationEngine('detach');
                                $("#departamentoe").val($("#departamento").val());
				$("#departamentoe,#localidade,#callee,#nroe,#zipe").attr("data-validation-engine", "validate[required]");
				$("#formSolicitud").validationEngine('attach');
				$("#datos_envio").stop(true).slideDown();
				$("#IDpais").change();
			} else {*/

                        $("#ci_carga_cont").css("display", "none");
                        $("#cifile").val("");
                        $("#cont_frame_redpagos").slideUp();
                        $("#nagencia").val("");
                        $("#redpagos_seleccione").css("display", "block");
                        $("#redpagos_info").css("display", "none").html("");
			//}
		});
                
                $('#cifile_preview').click(function(e) {
                    $('#cifile').click(e.handler);
                }); 
                $('#contenedorCI_cifile').click(function(e) {
                    $('#cifile').click(e.handler);
                }); 
                $('#contenedorCI_cifile').click(function(e) {
                    $('#cifile').click(e.handler);
                });    
                $("#cifile").change(function (e) {
                    input = e.target;
                    if (input.files && input.files[0]) {                        
                        var ext = $("#cifile").val().split('.').pop().toLowerCase();                        
                        if($.inArray(ext, ['doc','docx','pdf']) == -1) {
                            var reader = new FileReader();                                                    
                            reader.onload = function (e) {
                                $('#cifile_preview').attr('src', e.target.result);
                            };
                            reader.readAsDataURL(input.files[0]);
                        } else {
                            $('#cifile_preview').attr('src', ''+Chukupax.basePath+'/imagenes/fondoSucursalSeleccionada.png');
                        } 
                        $('#contenedorCI_cifile').attr("class", "contenedorCI contenedorCIOK");
                    }
                });
                
                $('#contenedorCI_cifile2').click(function(e) {
                    $('#cifile2').click(e.handler);
                });
                $("#cifile2").change(function (e) {
                    input = e.target;
                    if (input.files && input.files[0]) {
                        var ext = $("#cifile2").val().split('.').pop().toLowerCase();                        
                        if($.inArray(ext, ['doc','docx','pdf']) == -1) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $('#cifile2_preview').attr('src', e.target.result);
                            };
                            reader.readAsDataURL(input.files[0]);
                        } else {
                            $('#cifile2_preview').attr('src', ''+Chukupax.basePath+'/imagenes/fondoSucursalSeleccionada.png');
                        }
                        $('#contenedorCI_cifile2').attr("class", "contenedorCI contenedorCIOK");
                    }
                });
                
                $('#contenedorCI_titular_cifile').click(function(e) {
                    $('#titular_cifile').click(e.handler);
                });    
                $("#titular_cifile").change(function (e) {
                    input = e.target;
                    if (input.files && input.files[0]) {                        
                        var ext = $("#titular_cifile").val().split('.').pop().toLowerCase();                        
                        if($.inArray(ext, ['doc','docx','pdf']) == -1) {
                            var reader = new FileReader();                                                    
                            reader.onload = function (e) {
                                $('#titular_cifile_preview').attr('src', e.target.result);
                            };
                            reader.readAsDataURL(input.files[0]);
                        } else {
                            $('#titular_cifile_preview').attr('src', ''+Chukupax.basePath+'/imagenes/fondoSucursalSeleccionada.png');
                        } 
                        $('#contenedorCI_titular_cifile').attr("class", "contenedorCI contenedorCIOK");
                    }
                });
                
                $('#contenedorCI_titular_cifile2').click(function(e) {
                    $('#titular_cifile2').click(e.handler);
                });
                $("#titular_cifile2").change(function (e) {
                    input = e.target;
                    if (input.files && input.files[0]) {
                        var ext = $("#titular_cifile2").val().split('.').pop().toLowerCase();                        
                        if($.inArray(ext, ['doc','docx','pdf']) == -1) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $('#titular_cifile2_preview').attr('src', e.target.result);
                            };
                            reader.readAsDataURL(input.files[0]);
                        } else {
                            $('#titular_cifile2_preview').attr('src', ''+Chukupax.basePath+'/imagenes/fondoSucursalSeleccionada.png');
                        }
                        $('#contenedorCI_titular_cifile2').attr("class", "contenedorCI contenedorCIOK");
                    }
                });
                
		$("#agencias tr.rowag").click(function () {
			$("#cont_frame_redpagos").slideUp();
			$("#nagencia").val($(this).data("agencia"));
			$.scrollTo("#seccion3");
			$("#redpagos_seleccione").css("display", "none");
			$("#redpagos_info").css("display", "block");
			$.get(
				Chukupax.basePath + "/solicitud/getAgencia_redpagos/" + $(this).data("agencia"),
				{},
				function (data) {
					if (data.error == "ok")
						$("#redpagos_info").html(data.html);
				},
				'json'
			);
		});
		$("#email").data("ok", false).change(function () {
			$("#email").validationEngine("hide").removeClass("incorrecto").removeClass("verificado").data("ok", false);
			$.post(
				Chukupax.basePath + "/solicitud/checkEmail", {
					email: $("#email").val()
				}, function (data) {
					if (data.error && data.error == "ok") {
						$("#email").removeClass("incorrecto").addClass("verificado").data("ok", true);
					} else {
						$("#email").removeClass("verificado").addClass("incorrecto").data("ok", false);
						if (data.error == "fail 4") $("#email").validationEngine("showPrompt", "El email ya se encuentra registrado");
						else
							$("#email").validationEngine("showPrompt", "El email no es correcto");
					}
				}, 'json');
		});
                                
		$("#tipoDocumento").change(function () {
			$("#documento").removeClass("incorrecto").removeClass("verificado").data("ok", false).val("");
		});
		$("#documento").data("ok", false).change(function () {
			$("#documento").validationEngine("showPrompt", "Espere por favor...").removeClass("incorrecto").removeClass("verificado").data("ok", false);
			if ($("#tipoDocumento").val() == "CI") {
				$.ajax({
					type: "POST",
					url: Chukupax.basePath + "/solicitud/checkDocumento",
					data: {
						documento: $.trim($("#documento").val())
					},
					success: function (data) {
						if (data.error && data.error == "ok") {
							$("#documento").removeClass("incorrecto").addClass("verificado").data("ok", true);
                            $("#documento").validationEngine("hideAll");
						} else {
							$("#documento").removeClass("verificado").addClass("incorrecto").data("ok", false);
							if (data.error == "fail 1")
								$("#documento").validationEngine("showPrompt", "Ingrese su CI sin puntos ni guiones");
							else if (data.error == "fail 2")
								$("#documento").validationEngine("showPrompt", "El documento no es correcto");
							else if (data.error == "fail 3")
								$("#documento").validationEngine("showPrompt", "El documento ya se encuentra registrado");
							else if (data.error == "fail cardpro")
								$("#documento").validationEngine("showPrompt", "El documento no puede ser registrado. Consulte.");
							else
								$("#documento").validationEngine("showPrompt", "Intente más tarde");
						}
					},
					dataType: 'json',
					async: false
				});
			} else {
				$.ajax({
					type: "POST",
					url: Chukupax.basePath + "/solicitud/checkDocumento",
					data: {
						documento: $.trim($("#documento").val())
					},
					success: function (data) {
						if (data.error && data.error == "ok") {
							$("#documento").removeClass("incorrecto").addClass("verificado").data("ok", true);
                            $("#documento").validationEngine("hideAll");
						} else {
							$("#documento").removeClass("verificado").addClass("incorrecto").data("ok", false);
							if (data.error == "fail 1")
								$("#documento").validationEngine("showPrompt", "Ingrese su documento");
							else if (data.error == "fail 2")
								$("#documento").validationEngine("showPrompt", "El documento ya se encuentra registrado");
							else if (data.error == "fail cardpro")
								$("#documento").validationEngine("showPrompt", "El documento no puede ser registrado. Consulte.");
						}
					},
					dataType: 'json',
					async: false
				});

			}
		});
                
                //if($("#agencias").length > 0){
                    $("#agencias").DataTable({
                                    "oLanguage": {
                                            "sProcessing": "Procesando...",
                                            "sLengthMenu": "Mostrar _MENU_ registros",
                                            "sZeroRecords": "No se encontraron resultados",
                                            "sEmptyTable": "Ningún dato disponible en esta tabla",
                                            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                                            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                                            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                                            "sInfoPostFix": "",
                                            "sSearch": "Busque aquí ingresando departamento, barrio o localidad:",
                                            "sUrl": "",
                                            "sInfoThousands": ",",
                                            "sLoadingRecords": "Cargando...",
                                            "oPaginate": {
                                                    "sFirst": "Primero",
                                                    "sLast": "Último",
                                                    "sNext": "Siguiente",
                                                    "sPrevious": "Anterior"
                                            },
                                            "oAria": {
                                                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                                            }
                                    },
                                    "bPaginate": false,
                                    "aaSorting": [[1, 'asc'], [2, 'asc'], [3, 'asc']]
                            });
	}
}
////////////////////////////////////////////////////////////////////
////               function contacto                           ////
//////////////////////////////////////////////////////////////////
function contacto() {
	this.init = function () {
		$("#contacto_form").validationEngine();
		$("#contacto_form input[type=text]").keydown(function (event) {
			if (event.keyCode == '13') $("#BTlogin").click();
		});
		$("#btnAmarillo").click(function () {
			if (!Chukupax.ajaxWorking) {
				Chukupax.ajaxWorking = true;
				if ($("#contacto_form").validationEngine('validate')) {
					$('#btnAmarillo').validationEngine('showPrompt', 'Enviando...');
					$.post(
						Chukupax.basePath + "/contacto/doContacto", $("#contacto_form").serialize(), function (data) {
							if (data.error == 'ok') {
								$("#contacto_form").validationEngine('hideAll');
								sending = false;
								$('#contacto_form').fadeTo(500, 0, function () {
									$(this).css('display', 'none');
									$('#contacto_ok').fadeTo(500, 1);
								});
							} else {
								$('#btnAmarillo').validationEngine('showPrompt', 'Int&eacute;ntelo m&aacute;s tarde por favor...');
								Chukupax.ajaxWorking = false;
							}
						}, 'json').error(function () {
							$('#btnAmarillo').validationEngine('showPrompt', 'Int&eacute;ntelo m&aacute;s tarde por favor...');
							Chukupax.ajaxWorking = false;
						});
				} else Chukupax.ajaxWorking = false;
			}
		});
	}
}
////////////////////////////////////////////////////////////////////
////               Payoneer Privado                          ////
//////////////////////////////////////////////////////////////////
function solicitarPrexConPayoneer(){
    this.init = function() {

        $('body').addClass('mainLanding');

        $('#landingUy').click(function(){
            let pais = 'Uy';
            cargarContenido(pais);
        });
        $('#landingArg').click(function(){
            let pais = 'Arg';
            cargarContenido(pais); 
        });
        function cargarContenido(pais){
            if (!Chukupax.ajaxWorking) {
                Chukupax.ajaxWorking = true;   
                Swal.fire({
                        type: 'info',
                        title: `Cargando`,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                        }
                    });
                $.ajax(
                    Chukupax.basePath + "/solicitarPrexConPayoneer", 
                        {
                        data: {
                            pais : pais
                        },
                        success: data => { 
                            if (data.error == 'ok') {
                                let contenedor = $('.main-container');
                                $('body').removeClass('mainLanding');
                                contenedor.html(data.html);
                                carousel_btns();
                                Swal.close();
                            } else {
                                Swal.close();
                                Swal.fire({
                                    type: 'error',
                                    title: `Ups! Hubo un error,Por favor intente más tarde.`,
                                    showConfirmButton: true,
                                    timer: 2500
                                });
                                Chukupax.ajaxWorking = false;
                            }
                        },
                        error: () => {
                            Swal.fire({
                                type: 'error',
                                title: `Ups! Por favor intente más tarde.`,
                                showConfirmButton: true,
                                timer: 2500
                            });
                            Chukupax.ajaxWorking = false;
                        },
                        dataType: 'json',
                        type: 'POST'
                    }
                );
                Chukupax.ajaxWorking = false;           
            }
        }
        
        function carousel_btns(){
            $('.s2_div1_carousel_btn.btn_back').click(function(){
                var boxActive = $(this).parent().find('.carousel_box_active');
                var boxes = $(this).parent().find('.s2_div1_carousel_box');
                var last = $('#carousel_box_last');
                var prevClass = boxActive.prev().attr('class');
                if (prevClass != undefined) {
                    boxActive.prev().addClass('carousel_box_active');
                    boxActive.removeClass('carousel_box_active');
                } else {
                    last.addClass('carousel_box_active');
                    boxActive.removeClass('carousel_box_active');
                }
            })
            $('.btn_forward').click(function(){
                var boxActive = $(this).parent().find('.carousel_box_active');
                var boxes = $(this).parent().find('.s2_div1_carousel_box');
                var first = $('#carousel_box_first');
                var nextClass = boxActive.next().attr('class').toString();
                
                if (nextClass == 's2_div1_carousel_box') {
                    boxActive.next().addClass('carousel_box_active');
                    boxActive.removeClass('carousel_box_active');
                } else {
                    first.addClass('carousel_box_active');
                    boxActive.removeClass('carousel_box_active');
                }
            })
        }
    }
}

////////////////////////////////////////////////////////////////////
////                        Cripto                             ////
//////////////////////////////////////////////////////////////////
function inversionesCripto() {
    this.init = function () {

        carousel_btns();

        function carousel_btns() {
            //BOTÓN BACK
            $('.btn_back').click(function () {
                var boxActive = $(this).parent().find('.carousel_box_active');
                var last = $('#carousel_box_last');
                var back = $('.carousel_box_back');
                var prevClass = back.prev().attr('class');

                boxActive.removeClass('carousel_box_active');
                back.addClass('carousel_box_active');
                back.removeClass('carousel_box_back');

                if (prevClass != undefined) {
                    back.prev().addClass('carousel_box_back');
                } else {
                    last.addClass('carousel_box_back');
                }
            })
            //BOTÓN FORWARD
            $('.btn_forward').click(function () {
                var boxActive = $(this).parent().find('.carousel_box_active');
                var first = $('#carousel_box_first');
                var back = $('.carousel_box_back');
                var nextClass = boxActive.next().attr('class');

                if (nextClass != undefined) {
                    boxActive.next().addClass('carousel_box_active');
                } else {
                    first.addClass('carousel_box_active');
                }
                back.removeClass('carousel_box_back');
                boxActive.addClass('carousel_box_back');
                boxActive.removeClass('carousel_box_active');
            })
        }
    }
}

////////////////////////////////////////////////////////////////////
////               function portada                            ////
//////////////////////////////////////////////////////////////////
function portada() {
    this.init = function () {
        $.ajax({   
            type: "post",
            url: Chukupax.basePath + "/webservice/getPreguntasFrecuentes",                        
            dataType: "json",
            
            success:function(data){  
                var total = Math.floor((data.length / 2) + 0.5);
                var contador = 0;
                var preguntasFrecuentesA = '';
                var preguntasFrecuentesB = '';
                var preguntasFrecuentes = '';

                $.each(data, function(index, value) { //Modulo
                    preguntasFrecuentes = ''
                    if(value.nombre=="Prex a Prex: traspaso de dinero") {                              
                        preguntasFrecuentes = preguntasFrecuentes + '<a name="faqMoneda" id="a"></a>';
                    }
                    preguntasFrecuentes = preguntasFrecuentes + '<h4><a href="javascript:void(0);" onclick="Faqs($(this));" class="seccionFaqs" target="_self" title="Ver preguntas de sección"><div style="display: inline-block;"><img src="https://de2aqb3kqoyo2.cloudfront.net/web/icoDesplegar.png" alt="Desplegar" width="40"/></div><div style="display: inline-block;width: 80%;vertical-align: middle;font-size: 16px;"> ' + value.nombre + '</div></a></h4><div class="boxPreguntas" style="display: none;">';

                    $.each(value.item, function(index2, value2) { //Pregunta                                
                        preguntasFrecuentes = preguntasFrecuentes + '<a href="javascript:void(0);" class=pregunta_frecuente onclick="MostrarRespuestas(' + "'" + "p.mostrarResps" + index2 + "'" + ')" >' + value2.nombre + '</a> <p>';
                                                                                                   //A mostrarRespuestas le paso como parametro, en lugar de una pergunta: el texto motrarResps+ el nro de pregunta
                                                                                                   //Ese es el nombre de la clase que se le asigna al p que se está creando
                        $.each(value2.item, function(index3, value3) { //Respuesta
                            
                            preguntasFrecuentes = preguntasFrecuentes + '<p class="mostrarResps' + index2 + '" style="display:none" >' + value3 + '</p>';
                        });                                
                    });
                    preguntasFrecuentes = preguntasFrecuentes + '</div>';

                    contador += 1;
                    if (contador <= total) {
                        preguntasFrecuentesA += preguntasFrecuentes;
                    }else{
                        preguntasFrecuentesB += preguntasFrecuentes;
                    }
                });       
                
                $("#getPreguntasFrecuentes").html(preguntasFrecuentesA); 
                $("#getPreguntasFrecuentes2").html(preguntasFrecuentesB);                
            }
        });
    }


    // IMAGENES SLIDE
    // PANTALLA GRANDE
    if (screen.width >= 426) {     
        $('#img_DESCUBRILAS').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/funcionalidades/prex_nuevasfunc.jpg');
        $('#img_DESCUBRI').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/facilidades/facilidades_prex.jpg');
        $('#img_PAYPAL').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/paypal/slideretpaypal.jpg');
        $('#img_SEGURIDAD').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/seguridad/prex_seguridad3.jpg');
        $('#img_CONTACTLESS').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/30contactless/contactless_nov.jpg');
        $('#img_CONTACTLESSB').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/30contactless/prex_contactless.jpg'); 
        $('#img_NUEVAAPP').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/principal/prexnuevaapp2.jpg'); 

    } else {
        $('#img_DESCUBRILAS').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/funcionalidades/prex_nuevasfuncb_mob.jpg');
        $('#img_DESCUBRI').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/facilidades/facilidadesmob_prex.jpg');
        $('#img_PAYPAL').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/paypal/slideretpaypal_mob.jpg'); 
        $('#img_SEGURIDAD').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/seguridad/prex_seguridad3_mob.jpg');
        $('#img_CONTACTLESS').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/30contactless/contactless_nov_mob.jpg');
        $('#img_CONTACTLESSB').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/30contactless/contactless_nov_mob.jpg'); 
        $('#img_NUEVAAPP').attr('src','https://prexcard.s3.amazonaws.com/web/Slides/principal/prexnuevaapp-mob.gif');  

    }
}

/*
Documentation:
https://github.com/DualH/rCountdown
*/
function rCountdown(dateEnd, element = 'rCountdown') {
    var exist_error = _controllers('first', {element, dateEnd}),
        timer;

    dateEnd = new Date(dateEnd);
    dateEnd = dateEnd.getTime();

    if ( isNaN(dateEnd) ) {
        return;
    }
    
    if (!exist_error){
        _addHTML(element);
        _addStyleCSS();

        timer = setInterval(_calculate, 1000);
    }
    
    function _calculate()
    {
        var dateStart = new Date();
        var dateStart = new Date(dateStart.getUTCFullYear(),
                             dateStart.getUTCMonth(),
                             dateStart.getUTCDate(),
                             dateStart.getUTCHours(),
                             dateStart.getUTCMinutes(),
                             dateStart.getUTCSeconds());
        var timeRemaining = parseInt((dateEnd - dateStart.getTime()) / 1000)
        
        if ( timeRemaining >= 0 ) {
            dias = parseInt(timeRemaining / 86400);
            timeRemaining = (timeRemaining % 86400);
            horas = parseInt(timeRemaining / 3600);
            timeRemaining = (timeRemaining % 3600);
            minutos = parseInt(timeRemaining / 60);
            timeRemaining = (timeRemaining % 60);
            segundos = parseInt(timeRemaining);
            
            _updateSpan(dias, ['DÍA', 'DÍAS'], 'dia', 'textoD');
            _updateSpan(horas, ['HORA', 'HORAS'], 'hora', 'textoH');
            _updateSpan(minutos, ['MINUTO', 'MINUTOS'], 'minuto', 'textoM');
            _updateSpan(segundos, ['SEGUNDO', 'SEGUNDOS'], 'segundo', 'textoS');
            
        } else {
            return;
        }
    }
    
    function _addHTML(idDom)
    {
        if (idDom == undefined) {
            console.error('Por favor debe asignar un id para llamar la función _addHTML');
            return;
        }
        
        var html = 	'<div class="d-inline-block text-center margin-right-5">'+
                        '<span id="dia_0" class="p-relative text-center margin-right-5r">0</span>'+
                        '<span id="dia_1" class="p-relative text-center">0</span>'+
                        '<p class="textoD" id="textoD">DÍA</p>'+
                    '</div>'+
                    
                    '<div class="d-inline-block text-center margin-right-5">'+
                        '<span id="hora_0" class="p-relative text-center margin-right-5r">0</span>'+
                        '<span id="hora_1" class="p-relative text-center">0</span>'+
                        '<p class="textoH" id="textoH">HORA</p>'+
                    '</div>'+
                    
                    '<div class="d-inline-block text-center margin-right-5">'+
                        '<span id="minuto_0" class="p-relative text-center margin-right-5r">0</span>'+
                        '<span id="minuto_1" class="p-relative text-center">0</span>'+
                        '<p class="textoM" id="textoM">MINUTO</p>'+
                    '</div>'+
                    
                    '<div class="d-inline-block text-center">'+
                        '<span id="segundo_0" class="p-relative text-center margin-right-5r">0</span>'+
                        '<span id="segundo_1" class="p-relative text-center">0</span>'+
                        '<p class="textoS" id="textoS">SEGUNDO</p>'+
                    '</div>';
        document.getElementById(idDom).innerHTML = html;
    }
    
    function _addStyleCSS()
    {
        var css = '#countdown {width: 100%;float: left;margin: 20px auto;}'+
                  '.timer {text-align: center;}'+
                  '.d-inline-block{display: inline-block;}'+
                  '.p-relative{border: 1.2px solid #E0E0E0;border-radius: 3px;padding: 0px 5px;font-size: 30px;font-weight: normal;color: #005bea;background-color:  #FFFFFF;position: relative;}'+
                  '.linea{position: absolute;z-index: 999;width: 100%;border-bottom: 1px solid #E0E0E0;top: 0;bottom: 0;left:0;right:0;margin: auto;width:100%;height: 0;}'+
                  '.margin-right-5{margin-right: 25px;}'+
                  '.margin-right-5r{margin-right: 10px}'+
                  '.margin-right-left-5{margin-right: 5px;margin-left: 5px;}'+
                  '.textoD{font-size: 12px;color: #FFFFFF;}'+
                  '.textoH{font-size: 12px;color: #FFFFFF;}'+
                  '.textoM{font-size: 12px;color: #FFFFFF;}'+
                  '.textoS{font-size: 12px;color: #FFFFFF;}'+
                  '.textoH::before,.textoM::before,'+
                  '.textoS::before,.textoD::before{white-space: pre;}'+
                  '.text-center{text-align: center;}',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }
    
    function _controllers(step, opts) 
    {
        switch(step) {
            case 'first':
                var var_expected = [
                        'element',
                        'dateEnd'
                    ];
                    var_expected = opts;
                var opt1 = document.getElementById(var_expected.element);
            
                if (opt1 == null) {
                    console.error('El elemento con id -> ' + var_expected.element + ' <- no se encuentra en esta página');
                    return true;
                }
            break;
        }
    }
    
    function _updateSpan(data, text, element0, element1)
    {
        if (data.toString().length == 1 ) {
            document.getElementById(element0 + "_0").innerHTML = '0<p class="linea"> </p>';
            document.getElementById(element0 + "_1").innerHTML = data + '<p class="linea"> </p>';
            if (data == 1) {
                document.getElementById(element1).innerHTML = text[0];
            } else if (data == 0) {
                document.getElementById(element1).innerHTML = text[1];
            }
        } else {
            let data_split = data.toString().split('');
            document.getElementById(element0 + "_0").innerHTML = data_split[0] + '<p class="linea"> </p>';
            document.getElementById(element0 + "_1").innerHTML = data_split[1] + '<p class="linea"> </p>';
            document.getElementById(element1).innerHTML = text[1];
        }
    }
}


///////////////////////////////////////////////////////////////////
////                   OTRAS FUNCIONES                        ////
/////////////////////////////////////////////////////////////////
$body = $("body");

var tarjeta    = '',
	clave      = '',
	permitidos = ["Backspace", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
	typingCard = $("#ingresarTarje").val(),
	typingKey  = $("#ingresarClave").val(),
	typingKey1 = $("#ingClave").val(),
	intentos   = 0,
	htmlNormal = 'Tu clave <i class="fa fa-info-circle"></i> : * * * *',
	passwordOculta = 1;

////////////////////////////////////////////////////////////////////
////               function keypressed                         ////
//////////////////////////////////////////////////////////////////
function keypressed(e){
	typingCard = $("#ingresarTarje").val();
	typingKey  = $("#ingresarClave").val();
	typingKey1 = $("#ingClave").val()
	
	if(inArray(e.key, permitidos)){
		if (typingCard == 1) {
			var element = '';
			if (e.key != permitidos[0]) {
				element = '.pressCaracter[data-caracter='+e.key+']';
			}else{
				element = '#pressBorrar';
			}

			$(element).addClass('btn-numero-active');
			setTimeout(function(){
				$(element).removeClass('btn-numero-active');
			}, 100);
			
			if (tarjeta.length <= 6) {
				if (e.key == permitidos[0]) {
					pressBorrar();
					updateCard(tarjeta);
				}else{
					if (tarjeta.length < 6) {
						tarjeta += e.key;
						updateCard(tarjeta);
					}
				}
			}
		}else if(typingKey == 1){
			var element = '';
			if (e.key != permitidos[0]) {
				element = '.pressCaracter[data-caracter='+e.key+']';
			}else{
				element = '#pressBorrar';
			}

			$(element).addClass('btn-numero-active');
			setTimeout(function(){
				$(element).removeClass('btn-numero-active');
			}, 100);

			if (clave.length <= 4) {
				if (e.key == permitidos[0]) {
					pressBorrar();
					updateKey(clave);
				}else{
					if (clave.length < 4) {
						clave += e.key;
						updateKey(clave);
					}
				}
			}
		}else if (typingKey1 == 1){
			var element = '';
			if (e.key != permitidos[0]) {
				element = '.pressCaracter[data-caracter='+e.key+']';
			}else{
				element = '#pressBorrar';
			}

			$(element).addClass('btn-numero-active');
			setTimeout(function(){
				$(element).removeClass('btn-numero-active');
			}, 100);

			if (clave.length <= 4) {
				if (e.key == permitidos[0]) {
					pressBorrar();
					updateKey(clave);
				}else{
					if (clave.length < 4) {
						clave += e.key;
						updateKey(clave);
					}
				}
			}
		}
	}
}
////////////////////////////////////////////////////////////////////
////               function pressCaracter                      ////
//////////////////////////////////////////////////////////////////
function pressCaracter(char){
	typingCard = $("#ingresarTarje").val();
	typingKey  = $("#ingresarClave").val();
	typingKey1 = $("#ingClave").val();

	if(inArray(char, permitidos)){
		if (typingCard == 1) {
			if (tarjeta.length < 6) {
				tarjeta += char;
				updateCard(tarjeta);
			}
		}else if(typingKey == 1){
			if (clave.length < 4) {
				clave += char;
				updateKey(clave);
			}
		}else if (typingKey1 == 1){
			if (clave.length < 4) {
				clave += char;
				updateKey(clave);
			}
		}
	}
}
////////////////////////////////////////////////////////////////////
////               function pressBorrar                        ////
//////////////////////////////////////////////////////////////////
function pressBorrar(){
	typingCard = $("#ingresarTarje").val();
	typingKey  = $("#ingresarClave").val();
	typingKey1 = $("#ingClave").val()
	if (typingCard == 1) {
		if (tarjeta.length > 0) {
			tarjeta = tarjeta.slice(0, -1);
			updateCard(tarjeta);
		}
	}else if(typingKey == 1){
		if (clave.length > 0) {
			clave = clave.slice(0, -1);
			updateKey(clave);
		}
	}else if (typingKey1 == 1){
		if (clave.length > 0) {
			clave = clave.slice(0, -1);
			updateKey(clave);
		}
	}
}
////////////////////////////////////////////////////////////////////
////               function inArray                            ////
//////////////////////////////////////////////////////////////////
function inArray(needle, haystack) {
	var length = haystack.length;
	for(var i = 0; i < length; i++) {
		if(haystack[i] == needle) return true;
	}
	return false;
}
////////////////////////////////////////////////////////////////////
////               function updateCard                         ////
//////////////////////////////////////////////////////////////////
function updateCard(tarjeta){
	var cardInit = '5*** **** **__ ____';
	spanCard = "#prex-card";
	switch(tarjeta.length){
		case 0:
			cardInit = '5*** **** **__ ____';
			$(spanCard).html(cardInit);
			$("#btnStep1").hide();
		break;
		case 1:
			cardInit = '5*** **** **'+tarjeta.slice(0,1)+'_ ____';
			$(spanCard).html(cardInit);
			$("#btnStep1").hide();
		break;
		case 2:
			cardInit = '5*** **** **'+tarjeta.slice(0,2)+' ____';
			$(spanCard).html(cardInit);
			$("#btnStep1").hide();
		break;
		case 3:
			cardInit = '5*** **** **'+tarjeta.slice(0,2)+' '+tarjeta.slice(2,3)+'___';
			$(spanCard).html(cardInit);
			$("#btnStep1").hide();
		break;
		case 4:
			cardInit = '5*** **** **'+tarjeta.slice(0,2)+' '+tarjeta.slice(2,4)+'__';
			$(spanCard).html(cardInit);
			$("#btnStep1").hide();
		break;
		case 5:
			cardInit = '5*** **** **'+tarjeta.slice(0,2)+' '+tarjeta.slice(2,5)+'_';
			$(spanCard).html(cardInit);

			$("#btnStep1").hide();
		break;
		case 6:
			cardInit = '5*** **** **'+tarjeta.slice(0,2)+' '+tarjeta.slice(2,6);
			$(spanCard).html(cardInit);
			$("div.modal-new-password > div:nth-child(4) > div:nth-child(3) > div:nth-child(1) > span:nth-child(1)").html("Tu tarjeta: " + cardInit);
			// $("#btnStep1").show();
			$("#btnStep1").click();
		break;
	}
}
////////////////////////////////////////////////////////////////////
////               function updateKey                         ////
//////////////////////////////////////////////////////////////////
function updateKey(clave){
	switch(clave.length){
		case 0:
			$('.cs-circulos[data-circulo=1]').attr({class: 'cs-circulos cs-vacio'});
			$('.cs-circulos[data-circulo=2]').attr({class: 'cs-circulos cs-vacio'});
			$('.cs-circulos[data-circulo=3]').attr({class: 'cs-circulos cs-vacio'});
			$('.cs-circulos[data-circulo=4]').attr({class: 'cs-circulos cs-vacio'});
			if(typingKey == 1){
				$("#btnStep2").hide();
			}else if (typingKey1 == 1){
				$("#btnPagarP2P").hide();
			}
		break;
		case 1:
			$('.cs-circulos[data-circulo=1]').attr({class: 'cs-circulos cs-escrito'});
			$('.cs-circulos[data-circulo=2]').attr({class: 'cs-circulos cs-vacio'});
			$('.cs-circulos[data-circulo=3]').attr({class: 'cs-circulos cs-vacio'});
			$('.cs-circulos[data-circulo=4]').attr({class: 'cs-circulos cs-vacio'});
			if(typingKey == 1){
				$("#btnStep2").hide();
			}else if (typingKey1 == 1){
				$("#btnPagarP2P").hide();
			}
		break;
		case 2:
			$('.cs-circulos[data-circulo=1]').attr({class: 'cs-circulos cs-escrito'});
			$('.cs-circulos[data-circulo=2]').attr({class: 'cs-circulos cs-escrito'});
			$('.cs-circulos[data-circulo=3]').attr({class: 'cs-circulos cs-vacio'});
			$('.cs-circulos[data-circulo=4]').attr({class: 'cs-circulos cs-vacio'});
			if(typingKey == 1){
				$("#btnStep2").hide();
			}else if (typingKey1 == 1){
				$("#btnPagarP2P").hide();
			}
		break;
		case 3:
			$('.cs-circulos[data-circulo=1]').attr({class: 'cs-circulos cs-escrito'});
			$('.cs-circulos[data-circulo=2]').attr({class: 'cs-circulos cs-escrito'});
			$('.cs-circulos[data-circulo=3]').attr({class: 'cs-circulos cs-escrito'});
			$('.cs-circulos[data-circulo=4]').attr({class: 'cs-circulos cs-vacio'});
			if(typingKey == 1){
				$("#btnStep2").hide();
			}else if (typingKey1 == 1){
				$("#btnPagarP2P").hide();
			}
		break;
		case 4:
			$('.cs-circulos[data-circulo=1]').attr({class: 'cs-circulos cs-escrito'});
			$('.cs-circulos[data-circulo=2]').attr({class: 'cs-circulos cs-escrito'});
			$('.cs-circulos[data-circulo=3]').attr({class: 'cs-circulos cs-escrito'});
			$('.cs-circulos[data-circulo=4]').attr({class: 'cs-circulos cs-escrito'});
			if(typingKey == 1){
				$("#claveseguridad").attr({'title':clave});
				// $("#btnStep2").show();
				$("#btnStep2").click();
			}else if (typingKey1 == 1){
				var url = window.location.href;
				if(url.indexOf("spi") >= 0){
					$("#btnEnviarTransferencia").click();
				}else if (url.indexOf("cambiarmail") >= 0) {
					$("#btnCambiarMail").click();
				}else{
					$("#btnPagarP2P").click();
				}
			}
		break;
	}
}
////////////////////////////////////////////////////////////////////
////               function olvidoClaveSeguridad               ////
//////////////////////////////////////////////////////////////////
function olvidoClaveSeguridad(){
	$.ajax({
		url: '/p2p/set_clave_seguridad',
		type: 'POST',
		dataType: 'json',
		data: {
			IDUsuario: $("#idU").val(),
			ClaveSeguridad: "",
			Tarjeta: ""
		},
	})
	.done(function(data){
		if (data.error == 0) {
			typingKey = 0;
			typingCard = 1;
			spanCard = "#prex-card";
			tarjeta = '';

			$("#ingresarTarje").val(1);
			$("#ingresarClave").val(0);
			
			$('.cs-circulos[data-circulo=1]').attr({class: 'cs-circulos cs-vacio'});
			$('.cs-circulos[data-circulo=2]').attr({class: 'cs-circulos cs-vacio'});
			$('.cs-circulos[data-circulo=3]').attr({class: 'cs-circulos cs-vacio'});
			$('.cs-circulos[data-circulo=4]').attr({class: 'cs-circulos cs-vacio'});

			cardInit = '5*** **** **__ ____';
			$(spanCard).html(cardInit);

			$("div.modal-new-password > div:nth-child(2)").show();
			$("div.modal-new-password > div:nth-child(5)").show();
			$("div.modal-new-password > div:nth-child(4)").hide();

			$("div.modal-password").fadeOut('slow');
			$("div.modal-new-password").fadeIn('slow');
			$("#_tienep").val(0);
		}else{
			window.location.reload();
		}
	})
	.always(function() {
		$("#spinner-loading").addClass('hide-spinner');
	});
}
////////////////////////////////////////////////////////////////////
////               function hideObligatorio                    ////
//////////////////////////////////////////////////////////////////
function hideObligatorio(){
	$("#spinner-loading").removeClass('hide-spinner');
	$(".pop-up-notification").css({'display': 'none'});
	$(".px-overlay").css({'display': 'none'});
}
////////////////////////////////////////////////////////////////////
////               function get_notification_vistas            ////
//////////////////////////////////////////////////////////////////
function get_notification_vistas(id_u, title){

	$.ajax({
		url: "/notificaciones/call_notifications",
		type: 'POST',
		dataType: 'json',
		data: {
			id: id_u,
			tipo: 'listado'
		},
	})
	.done(function(data) {
		var html = $("#listado-notificaciones").html(),
			notificaciones_procesadas = 0;

		if (data.row.length > 0) {
	  		data.row.forEach(function(valor, indice){
				html = html + 
				'<div class="notification-container col-md-12 nro-orden-'+ indice +'" data-nronoti=' + valor.id + '>' +
					'<div class="notification-title col-md-12">' + valor.titulo + '</div>' +
					'<div class="notification-body col-md-12">' + valor.cuerpo + '</div>' +
					'<div class="notification-date col-md-12">' + valor.fecha + '</div>' +
				'</div>';
				notificaciones_procesadas++;

				if (data.row.length === notificaciones_procesadas) {
					cantidad_noti = notificaciones_procesadas;
					$("#listado-notificaciones").html(html);
				}
			});
		}else{
			html = '<div class="notification-container col-md-12">' +
						'<input type="hidden" id="no-notification" value ="1">' +
						'<div class="notification-empty col-md-6 col-md-offset-3"><img src="/assets/prex/img/vacio.png" class="img-responsive"></div>' +
						'<div class="notification-text-empty col-md-12 text-center"><h2>¡No tienes notificaciones!</h2><p>¡Recibiras notificaciones al hacer un Prex a Prex, una carga y muchos más!</div>' +
				   '</div>';

			// $("#notifications > div.seeAll").css({display: 'none'});
			$("#listado-notificaciones").html(html);
		}

		titleU = title;
		if (data.cantidadNotificaciones == 0) {
			document.title = title;	
		}
	});
}
////////////////////////////////////////////////////////////////////
////               function get_notification_nuevas            ////
//////////////////////////////////////////////////////////////////
function get_notification_nuevas(id_u, title){
	$.ajax({
		url: "/notificaciones/call_notifications",
		type: 'POST',
		dataType: 'json',
		data: {
			id: id_u,
			tipo: 'nueva'
		},
	})
	.done(function(data) {
		var html = $("#listado-notificaciones").html();

		if (data.cantidadNotificaciones != 0) {
			if ($('*[data-notifiid="' + data.row.id + '"]').length == 0) {

				if($("#no-notification").val() == 1){
					$("#notifications > div.seeAll").css({display: 'block'});
					html = '';
				}

	  			html = '<div class="notification-container col-md-12 fadeIn animated add-html notification-added" data-notifiid="' + data.row.id + '">' +
							'<div class="notification-title col-md-12">' + data.row.titulo + '</div>' +
							'<div class="notification-body col-md-12">' + data.row.cuerpo + '</div>' +
							'<div class="notification-date col-md-12">' + data.row.fecha + '</div>' +
						'</div>' + html;
				
				$("#listado-notificaciones").html(html);

				if ($("#notifications").is(":visible")) {
	        		markNotification(data.row.id);
		        };
		    }
  		}

		titleU = title;
		if (data.cantidadNotificaciones == 0) {
			document.title = title;	
		}else{
			$('#noti_Counter').css({ opacity: 0 })
	            .text(data.cantidadNotificaciones)
	            .css({ top: '-10px', display: 'block' })
	            .animate({ top: '-2px', opacity: 1 }, 500);
	        $("#noti_Button").effect('shake', {distance: 2});
			document.title = "(" + data.cantidadNotificaciones + ") " + title;
		}
	});
}
////////////////////////////////////////////////////////////////////
////               function markNotification                   ////
//////////////////////////////////////////////////////////////////
function markNotification($idNoti){
	var idNotification = $idNoti;
	$("#mostrando").val(0);
	$.ajax({
		url: "/notificaciones/markNotification",
		type: 'POST',
		dataType: 'json',
		data: {
			id: idNotification
		},
	})
	.done(function(data) {	
		if (data.error == 0) {
			$('*[data-notifiid="' + $idNoti + '"]').removeClass('notification-added');
			$('#noti_Counter').fadeOut('slows');
		}
	});
}
////////////////////////////////////////////////////////////////////
////               function bajaNotification                   ////
//////////////////////////////////////////////////////////////////
function bajaNotification(idN){
	var idNotification = idN;

	$.ajax({
		url: "/notificaciones/bajaNotification",
		type: 'POST',
		dataType: 'json',
		data: {
			id: idNotification
		},
	})
	.done(function(data) {
		if (data.error == 0) {
			location.reload();
		}
	});
}
////////////////////////////////////////////////////////////////////
////               function siguienteTabindex                  ////
//////////////////////////////////////////////////////////////////
function siguienteTabindex(objeto){
  if($(objeto).val() != ''){
    var tabindex = $(objeto).attr('tabindex');
    tabindex++;
    $('[tabindex=' + tabindex + ']').focus();
  }else
    setTimeout(function(){
      siguienteTabindex(objeto);
    }, 50);
}
////////////////////////////////////////////////////////////////////
////               function anterioreTabindex                  ////
//////////////////////////////////////////////////////////////////
function anteriorTabindex(objeto){
  var tabindex = $(objeto).attr('tabindex');
  tabindex--;
  $('[tabindex=' + tabindex + ']').focus();
}
////////////////////////////////////////////////////////////////////
////               function checkout                           ////
//////////////////////////////////////////////////////////////////
function checkout(){
  $(document).ready(function() {
    if ($('#pin-countdown').length) {
      setTimeout(update_countdown, 1000);
    }
    var $form = $("#formSolicitud");
    $form.validationEngine();
  });
    
  $('body').on("keydown", "input[name*='paymentPIN'], input[name*='paymentCVC']", function(e) {
    if(e.keyCode == 46 || e.keyCode == 8){
      if($(this).attr('tabindex') != 1){                
        $(this).val('');
        anteriorTabindex($(this));                
      }            
  	}        
  }); 
  $('body').on("keypress", "input[name*='paymentPIN'], input[name*='paymentCVC']", function(e) {        
    siguienteTabindex($(this));
  }); 
  $( document ).ready(function() {
    if ($('#ping-loading-gif').length) {
      pinConfirmation();
    }
  });
    
  $('#monto,#moneda').change(function () {
    if ($(this).val()){
      if (($("#monto").val() < 50 && $("#moneda").val() == 840) || ($("#monto").val() < 1500 && $("#moneda").val() == 858)){
        $("#advertenciaComision").show();
        if ($("#moneda").val() == 840){
          $("#montoComision").html(window.ComisionUSD);
          $("#montoComisionLow").html(window.ComisionUSDLow);
        }else{
          $("#montoComision").html(window.Comision);
          $("#montoComisionLow").html(window.ComisionLow);
        }

        return false;
      }
    }
		$("#advertenciaComision").hide();
  });
}
////////////////////////////////////////////////////////////////////
////               function update_countdown                   ////
//////////////////////////////////////////////////////////////////
function update_countdown(){
  var seconds = parseInt($('#pin-countdown').html());
  if(seconds > 2){
    --seconds;
    $('#pin-countdown').html(seconds);
    setTimeout(update_countdown, 1000);
  }else{
    if(seconds <= 2){
      $('#pin-countdownContainer').hide();
      $('#pin-error-msj-container').show();
    }
  }
}
////////////////////////////////////////////////////////////////////
////               function cerrarDiv                          ////
//////////////////////////////////////////////////////////////////
function cerrarDiv(IDDiv){    
    $('#' + IDDiv).fadeOut(400);    
}
////////////////////////////////////////////////////////////////////
////               function MostrarRespuestas                  ////
//////////////////////////////////////////////////////////////////
function MostrarRespuestas(unaPregunta, nroPregunta) {
    $(unaPregunta).toggle();
  	var cantRespuestas=$(".respuesta").size();
  	for (var i=0; i<cantRespuestas; i++) {
    	if (i!= nroPregunta){
     		$(".mostrarResps" + i).hide();     
   		}else {
     
   		}
 	}
}

////////////////////////////////////////////////////////////////////
////               function MostrarPreguntas                   ////
//////////////////////////////////////////////////////////////////
function MostrarPreguntas(unModulo, idModulo){
  	var IdmodAnt=idModulo-1;
  	var cantModulos= $(".ModulosAyuda").size();
 	$("#" + idModulo).toggleClass("active");
   	$(unModulo).toggle();
	if (idModulo % 2 != 0){
		$("#" + IdmodAnt).toggleClass("modulo-ayuda-siguiente");
	}
  	for (var i=0; i<cantModulos; i++) {
    	if (i!= idModulo){
        	if(i!= IdmodAnt){
                $("#" + i).removeClass("modulo-ayuda-siguiente");
        	}
	     	$(".boxPreguntas" + i).hide();
	     	$("#" + i).removeClass("active");
   		}
 	}
}
////////////////////////////////////////////////////////////////////
////               function Faqs                               ////
//////////////////////////////////////////////////////////////////
function Faqs(n){
    if (n.hasClass('desplegado')) {
        n.children('img').css({
            'transform': 'rotate(0deg)'
        });
        n.parent('h4').next('.boxPreguntas').slideUp(500);
        n.removeClass('desplegado');

    } else {
        $('.desplegado').children('img').css({
            'transform': 'rotate(0deg)'
        });
        $('.desplegado').parent('h4').next('.boxPreguntas').slideUp(500);
        $('.desplegado').removeClass('desplegado');
        n.children('img').css({
            'transform': 'rotate(180deg)'
        });
        n.parent('h4').next('.boxPreguntas').slideDown(500);
        n.addClass('desplegado');
    }
}