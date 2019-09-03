

// posting session request

let question =  document.getElementsByClassName('session-question');
let changeColor = document.querySelector('.booked');
for(let i=0; i<question.length;i++){
  question[i].addEventListener('click' , () => {
    document.querySelector('.modal').style.display = 'flex';
    document.querySelector('.modal-button').addEventListener('click', ()=>{
      question[i].innerHTML = 'Cancel session!';
      question[i].style.backgroundColor = "red";
      question[i].style.color = "white";
      document.querySelector('.modal').style.display = 'none';
    })
    });
}

document.querySelector('.close').addEventListener('click', ()=>{
  document.querySelector('.modal').style.display = 'none';
  question[i].innerHTML = 'Book session!'
});

//accepting and declining session request

