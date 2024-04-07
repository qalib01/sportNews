if ( window.location.pathname === "/login" ) {
    let form = document.querySelector("#form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.submitter.setAttribute("disabled", true);
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
                location.pathname = '/admin/';
            } else {
                console.log('Error', data);
            }
        } catch (error) {
            return error;
        };
    });
}