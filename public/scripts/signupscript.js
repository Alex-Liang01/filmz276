let password=document.getElementById("password");
function matchpassword(elem){
    if(elem.value.length>0){
        if(elem.value != password.value){
            document.getElementById('passwordalert').innerHTML='Passwords do not match';
        }else{
            document.getElementById('passwordalert').innerHTML='Passwords match';
        }
    }
}

let email=document.getElementById('email');
function matchemail(elem){
    if(elem.value.length>0){
        if(elem.value != email.value){
            document.getElementById('emailalert').innerHTML='Emails do not match';
        }else{
            document.getElementById('emailalert').innerHTML='Emails match';
        }
    }
}

let username=document.getElementById('username');
function matchusername(elem){
    if(elem.value.length>0){
        if(elem.value != username.value){
            document.getElementById('usernamealert').innerHTML='Usernames do not match';
        }else{
            document.getElementById('usernamealert').innerHTML='Usernames match';
        }
    }
}