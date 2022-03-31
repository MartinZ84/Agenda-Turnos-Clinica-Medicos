///PARA NO PODER NAVEGAR EN EL CACHE DEL NAVEGADOR UNA VEZ QUE SE HACE EL LOGOUT
if (window.history.replaceState) {
  // verificamos disponibilidad
  window.history.replaceState(null, null, window.location.href);
}
///Parte  CLINICAS
$(document).ready(function () {
  tablaPersonas = $("#tablaClinicas").DataTable({
    order: [[1, "asc"]],

    //Para cambiar el lenguaje a español
    language: {
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraron resultados",
      info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
      infoFiltered: "(filtrado de un total de _MAX_ registros)",
      sSearch: "Buscar:",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      sProcessing: "Procesando...",
    },
  });

  var fila; //capturar la fila para editar o borrar el registro

  //botón EDITAR
  $(document).on("click", "#btnEditarClinica", function () {
    fila = $(this).closest("tr");
    id = parseInt(fila.find("td:eq(0)").text());
    nombre = fila.find("td:eq(1)").text();
    direccion = fila.find("td:eq(2)").text();
    fecha_creacion = fila.find("td:eq(3)").text();

    let arrFecCrea = fecha_creacion.split("/");

    // RELLENO DE FORM EN EL MODAL

    $("#id").val(id);
    $("#nombre").val(nombre);
    $("#direccion").val(direccion);

    $("#fecha_creacion").attr({
      value: arrFecCrea[2] + "-" + arrFecCrea[1] + "-" + arrFecCrea[0],
      type: "date",
      disabled: "disabled",
    });

    $(".modal-header").css("background-color", "#007bff");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Editar");
    $("#btnModalClinica")
      .attr({
        class: "btn btn-primary",
        type: "submit",
        formaction: "../clinica/updateClinica",
      })
      .html("Guardar cambios");
    $("#modalClinica").modal("show");
  });

  ///botón BORRAR
  $(document).on("click", "#btnBorrarClinica", function () {
    fila = $(this).closest("tr");
    console.log("fila:  " + JSON.stringify(fila));
    id = parseInt(fila.find("td:eq(0)").text());
    nombre = fila.find("td:eq(1)").text();
    direccion = fila.find("td:eq(2)").text();
    fecha_creacion = fila.find("td:eq(3)").text();

    $("#idb").val(id);
    $("#nombreb").attr({ value: nombre, disabled: "disabled" });
    $("#direccionb").attr({ value: direccion, disabled: "disabled" });

    $("#fecha_creacionb").attr({
      value: fecha_creacion,
      type: "date",
      disabled: "disabled",
    });

    $(".modal-header").css("background-color", "#F3370D");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("¿Seguro desea borrar lo selccionado?");
    $("#btnModalClinicaBorrar")
      .attr({
        class: "btn btn-danger",
        type: "submit",
        formaction: "../clinica/deleteClinica",
      })
      .html("Borrar");
    $("#modalClinicaBorrar").modal("show");
  });

  // FIN JQUERY
});

///Parte de Listas
$(document).ready(function () {
  tablaListas = $("#tablaListas").DataTable({
    order: [[5, "desc"]],

    //Para cambiar el lenguaje a español
    language: {
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraron resultados",
      info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
      infoFiltered: "(filtrado de un total de _MAX_ registros)",
      sSearch: "Buscar:",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      sProcessing: "Procesando...",
    },
  });

  var fila; //capturar la fila para editar o borrar el registro

  //botón EDITAR
  $(document).on("click", "#btnEditarLista", function () {
    fila = $(this).closest("tr");
    id = parseInt(fila.find("td:eq(0)").text());
    titulo = fila.find("td:eq(1)").text();
    estado = fila.find("td:eq(2)").text();
    categoria_titulo = fila.find("td:eq(3)").text();
    categoriaId = fila.find("td:eq(4)").text();
    fecha_creacion = fila.find("td:eq(5)").text();
    fecha_resolucion = fila.find("td:eq(6)").text();

    let arrFecCrea = fecha_creacion.split("/");

    // RELLENO DE FORM EN EL MODAL

    $("#id").val(id);
    $("#titulo").val(titulo);
    // $("#categoria_titulo").val(categoria_titulo);
    // $("#categoriaId").val(categoriaId);
    if (!categoriaId || categoriaId == 0) {
      categoriaId = null;
      categoria_titulo = "-- ninguna -- ";

      $("#categoria")
        .attr({
          value: "0",
          // selected: "selected",
        })
        .html(categoria_titulo);
      console.log("if categoriaId" + categoriaId);
    } else {
      console.log(
        "en el else categoriaId= " +
          categoriaId +
          " titulo -" +
          categoria_titulo
      );
      $("#categoria")
        .attr({
          value: categoriaId,
          // selected: "selected",
        })
        .html(categoria_titulo);
    }

    $("#fecha_creacion").attr({
      value: arrFecCrea[2] + "-" + arrFecCrea[1] + "-" + arrFecCrea[0],
      type: "date",
      disabled: "disabled",
    });
    $("#estado").val(estado);
    if (fecha_resolucion != "No se ingreso fecha de resolucion") {
      let arrFec_res = fecha_resolucion.split("/");
      $("#fecha_resolucion").attr({
        value: arrFec_res[2] + "-" + arrFec_res[1] + "-" + arrFec_res[0],
        type: "date",
        // disabled: "disabled",
      });
      console.log("if");
    } else {
      console.log("else");
      let now = new Date();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      let today = now.getFullYear() + "-" + month + "-" + day;
      $("#fecha_resolucion").attr({
        value: today,
        type: "date",
        min: today,
      });
      // } //FIN ELSE  PARA TODOS LOS ITEMS QUE NO ESTAN RESUELTOS
    }
    $(".modal-header").css("background-color", "#007bff");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Editar");
    $("#btnModalLista")
      .attr({
        class: "btn btn-primary",
        type: "submit",
        formaction: "../lista/updateLista",
      })
      .html("Guardar cambios");
    $("#modalLista").modal("show");
  });

  // //botón BORRAR
  $(document).on("click", "#btnBorrarLista", function () {
    fila = $(this).closest("tr");
    console.log("fila:  " + JSON.stringify(fila));
    id = parseInt(fila.find("td:eq(0)").text());
    titulo = fila.find("td:eq(1)").text();
    estado = fila.find("td:eq(2)").text();
    categoria_titulo = fila.find("td:eq(3)").text();
    categoriaId = fila.find("td:eq(4)").text();
    fecha_creacion = fila.find("td:eq(5)").text();
    fecha_resolucion = fila.find("td:eq(6)").text();

    let arr = fecha_creacion.split("/");
    let dia = arr[0];
    let mes = arr[1];
    let año = arr[2];
    console.log(año + "/" + mes + "/" + dia);
    console.log(fecha_creacion);

    $("#idb").val(id);
    // $("#titulo").val("");
    $("#titulob").attr({ value: titulo, disabled: "disabled" });
    $("#categoria_titulob").val(categoria_titulo);
    $("#categoriaIdb").val(categoriaId);
    $("#fecha_creacionb").attr({
      value: dia + "-" + mes + "-" + año,
      type: "text",
      disabled: "disabled",
    });
    $("#estadob").val(estado);
    // alert(fecha_resolucion);
    if (fecha_resolucion != "No se ingreso fecha de resolucion") {
      $("#fecha_resolucionb").val(fecha_resolucion);
      console.log("if");
    } else {
      $("#fecha_resolucionb").val("No se ingreso fecha de resolucion");
    }

    $(".modal-header").css("background-color", "#F3370D");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Borrar");
    $("#btnModalListaBorrar")
      .attr({
        class: "btn btn-danger",
        type: "submit",
        formaction: "../lista/deleteLista",
      })
      .html("Borrar");
    $("#modalListaBorrar").modal("show");
  });

  // FIN JQUERY
});

$(document).ready(function () {
  tablaCategorias = $("#tablaCategorias").DataTable({
    order: [[2, "desc"]],

    //Para cambiar el lenguaje a español
    language: {
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraron resultados",
      info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
      infoFiltered: "(filtrado de un total de _MAX_ registros)",
      sSearch: "Buscar:",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      sProcessing: "Procesando...",
    },
  });
  // FIN JQUERY CATEGORIAS
});
