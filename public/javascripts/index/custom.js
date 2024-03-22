if ( window.location.pathname === "/login" ) {
    let form = document.querySelector("#form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.submitter.setAttribute("disabled", true);
        // setTimeout(() => {
        //     e.submitter.removeAttribute("disabled");
        // }, timeout);

        let email = form.email.value.trim().toLowerCase();
        let password = form.password.value;
        
        try {
            res = await fetch(form.action, {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
                headers: {
                    "Content-type": "application/json",
                },
            });
            const data = await res.json();
            if (data.status === 200) {
                // alertText.textContent = data.statusText;
                // getSuccess();
                // setTimeout(() => {
                //     location.pathname = '/admin/';
                // }, timeout);
                location.pathname = '/admin/';
            } else {
                // alertText.textContent = data.statusText;
                // getError();
                console.log('Error', data);
            }
        } catch (error) {
            return error;
        };
        // setTimeout(() => {
        //     alertText.textContent = '';
        //     alertIcon.classList = '';
        //     alertMessage.style.display = 'none';
        //     alertMessage.classList.remove('error', 'success');
        //     // progressBar.classList.remove('active');
        // }, timeout);
    });
}