function validateForm(fields, formId, submit = true, name_button = null) {
  
  var faltantes = [];
  let pass      = true;

  $.each(fields, function (index, value) {
    switch (value.type) {
      case 'select':        
        if ($('#' + index).val() == '-' || $('#' + index).val() == '') {
          pass = false;
          faltantes.push(value.name);
        }

        break;
      case 'input':        
        if ($('#'+index).val()=='' || $('#'+index).val()==undefined) {
          pass = false;
          faltantes.push(value.name);
        }
        break;
      case 'expresion':
        let field_1 = $('#' + value.fieldsCompare[0]).val();
        let field_2 = $('#' + value.fieldsCompare[1]).val();
        switch (value.condition) {
          case '!=':
            if (field_1 != field_2) {
              pass = false;
              faltantes.push(value.name);
            }
            break;
          case '==':
            if (field_1 == field_2) {
              pass = false;
              faltantes.push(value.name);
            }
            break;
        }
        pass = false;
        break;
    }
  });

  if (pass) {
    if (submit) {
      $("#" + formId).removeAttr('onsubmit');
      $("#" + formId).submit();
    }
  } else {

    if (name_button != null) {
      $("input[type=submit][name=" + name_button + "]").removeAttr('disabled');
    }

    $("#" + formId).attr('onsubmit', 'return false');
    let fieldsShow = '<ul>';
    $.each(faltantes, function (index, value) {
      fieldsShow += '<li>' + value + '</li>';
    });
    fieldsShow += '</ul>';
    toastr.error('', 'Debe ingresar los campos faltantes ' + fieldsShow);
  }

  return pass;
}

//FUNCION ENCARGADA DE MOSTRAR ALERTAS 
function alertSystem(type, msj) {  

  let typeAlert = '';

  switch (type) {
    case 'success':
      typeAlert = 'success'
      break;
    case 'error':
      typeAlert = 'error'
      break;
    default:
      typeAlert = 'danger'
      break;
  }

  Swal.fire({
    position: 'center',
    icon: type,
    title: msj,
    showConfirmButton: false,
    timer: 1500
  })
}