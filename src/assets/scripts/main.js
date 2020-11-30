const getOnTheList = async () => {
  try {
    const email = document.getElementById('email');
    const body = {
      api_key: window.env.EMAIL_OCTOPUS_API_KEY,
      email: email.value
    }
    const res = await fetch("https://emailoctopus.com/api/1.5/lists/f7da3c7e-331d-11eb-a3d0-06b4694bee2a/contacts", {
      method: "post",
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if(json.status) {
      email.value = '';
      setAlert("You're on the list!", "success")
    }
  } catch (error) {
    console.log(error);
    setAlert(error.message, "error")
  }
};

const setAlert = (message, type) => {
  try {
    const messageContainer = document.getElementById("message-container");
    switch(type) {
      case 'error': 
        messageContainer.style.display = "block";
        messageContainer.style.color = "#fff";
        messageContainer.style.background = "#ff0033";
        messageContainer.innerText = message;
        setTimeout(() => {
          messageContainer.style.display = "none";
        }, 2000);
        break;
      case 'success': 
        messageContainer.style.display = "block";
        messageContainer.style.color = "#fff";
        messageContainer.style.background = "#4BB543";
        messageContainer.innerText = message;
        setTimeout(() => {
          messageContainer.style.display = "none";
        }, 2000);
        break;
      default: 
        break;
    }
  } catch (error) {
    console.log(error);
  }
};
