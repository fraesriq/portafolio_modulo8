import moment from "moment";

export function sumarHelper(param1, param2) {  
  let result = param1 + param2;
  return result;
}

export function restarHelper(param1, param2) {  
  let result = param1 - param2;
  return result;
}

export function fechaHelper(date) {
  return moment(date).format('DD/MM/YYYY');
}