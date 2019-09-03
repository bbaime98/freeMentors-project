
// change user

let changeUser =  document.getElementsByClassName('changeUser');

for(let i=0; i<changeUser.length;i++){
    changeUser[i].addEventListener('click' , () => {
    if(changeUser[i].innerHTML == 'Change to Mentor'){
        changeUser[i].innerHTML = 'Change to User'
        changeUser[i].style.backgroundColor = "green";
        changeUser[i].style.color = "white";
    }
        else{
            
            changeUser[i].innerHTML = 'Change to Mentor';
            changeUser[i].style.backgroundColor = "darkorange";
             changeUser[i].style.color = "white";
        }
        
    })
}