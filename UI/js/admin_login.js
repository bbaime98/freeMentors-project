	const email = document.querySelector('#email');
	const password = document.querySelector('#password');
	const admin = document.querySelector('.admin');

	admin.addEventListener('click', ()=>{
		if(email.value == "admin@gmail.com" && password.value == "123"){
			location.replace('../html/admin-pannel.html');
		}
		else if(email.value == "guest@gmail.com" && password.value == "123"){
			location.replace('../html/mentee-panel.html')
		}
	
		else{
			alert('access denied')
		}
		
	})