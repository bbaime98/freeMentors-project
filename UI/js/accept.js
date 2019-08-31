

let question =  document.getElementsByClassName('session-question');
let accept   =   document.getElementsByClassName('Accept');
let decline   =   document.getElementsByClassName('Decline');

for(let i=0; i<question.length;i++){
  question[i].addEventListener('click' , () => {
    document.querySelector('.modal').style.display = 'flex';
    
    document.querySelector('.modal-btn').addEventListener('click', ()=>{
      question[i].innerHTML = 'Accepted';
      decline[i].innerHTML = 'Decline';
      document.querySelector('.modal').style.display = 'none';
    }); 
    }); 
};
for(let i=0; i<decline.length;i++){
decline[i].addEventListener('click', ()=>{
      decline[i].innerHTML = 'Declined';
      question[i].innerHTML = 'Accept';
    });
}

document.querySelector('.close').addEventListener('click', ()=>{
  document.querySelector('.modal').style.display = 'none';
  accept[i].innerHTML = 'Accept'
});