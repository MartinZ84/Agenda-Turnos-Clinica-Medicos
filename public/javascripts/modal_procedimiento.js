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
  $(document).on("click", "#btnEditarProcedimiento", function () {
    fila = $(this).closest("tr");
    id = parseInt(fila.find("td:eq(0)").text());
    nombre = fila.find("td:eq(1)").text();
    descripcion = fila.find("td:eq(2)").text();
    indicaciones = fila.find("td:eq(3)").text();
    fecha_creacion = fila.find("td:eq(4)").text();

    let arrFecCrea = fecha_creacion.split("/");

    // RELLENO DE FORM EN EL MODAL

    $("#id").val(id);
    $("#nombre").val(nombre);
    $("#descripcion").val(descripcion);
    $("#indicaciones").val(indicaciones);
    $("#fecha_creacion").attr({
      value: arrFecCrea[2] + "-" + arrFecCrea[1] + "-" + arrFecCrea[0],
      type: "date",
      disabled: "disabled",
    });

    $(".modal-header").css("background-color", "#007bff");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Editar");
    $("#btnModalProcedimiento")
      .attr({
        class: "btn btn-primary",
        type: "submit",
        formaction: "../procedimiento/updateProcedimiento",
      })
      .html("Guardar cambios");
    $("#modalProcedimiento").modal("show");
  });

  ///botón BORRAR
  $(document).on("click", "#btnBorrarProcedimiento", function () {
    fila = $(this).closest("tr");
    console.log("fila:  " + JSON.stringify(fila));
    id = parseInt(fila.find("td:eq(0)").text());
    nombre = fila.find("td:eq(1)").text();
    descripcion = fila.find("td:eq(2)").text();
    indicaciones = fila.find("td:eq(3)").text();
    fecha_creacion = fila.find("td:eq(4)").text();

    $("#idb").val(id);
    $("#nombreb").attr({ value: nombre, disabled: "disabled" });
    $("#descripcionb").attr({ value: descripcion, disabled: "disabled" });
    $("#indicacionesb").attr({ value: indicaciones, disabled: "disabled" });

    $("#fecha_creacionb").attr({
      value: fecha_creacion,
      type: "date",
      disabled: "disabled",
    });

    $(".modal-header").css("background-color", "#F3370D");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("¿Seguro desea borrar lo selccionado?");
    $("#btnModalProcedimientoBorrar")
      .attr({
        class: "btn btn-danger",
        type: "submit",
        formaction: "../procedimiento/deleteProcedimiento",
      })
      .html("Borrar");
    $("#modalProcedimientoBorrar").modal("show");
  });

  // FIN JQUERY
});
