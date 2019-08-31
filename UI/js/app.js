

// posting session request

let question =  document.getElementsByClassName('session-question');

for(let i=0; i<question.length;i++){
  question[i].addEventListener('click' , () => {
    document.querySelector('.modal').style.display = 'flex';
    document.querySelector('.modal-button').addEventListener('click', ()=>{
      question[i].innerHTML = 'Cancel session!';
      document.querySelector('.modal').style.display = 'none';
    })
    });
}

document.querySelector('.close').addEventListener('click', ()=>{
  document.querySelector('.modal').style.display = 'none';
  question[i].innerHTML = 'Book session!'
});

//accepting and declining session request

