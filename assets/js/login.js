let users = [
  {
    name: "Francisco",
    password: "123456",
    mail: "fraesri@gmail.com"
  },
  {
    name: "Jasmina",
    password: "123456",
    mail: "jkvelozo@gmail.com"
  }
]


document.getElementById("form-login").addEventListener("submit", function(event){
  event.preventDefault();
  
  let name = document.getElementById("login-name").value;
  let password = document.getElementById("login-password").value;

  let found = users.find(user => user.name == name && user.password == password)

  if (found) {
    alertSystem('success', 'Usuario autenticado.');      
    location.href= "./index.html";
  }else{    
    alertSystem('error', 'Datos incorrectos.');      
  }
})