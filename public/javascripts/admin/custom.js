let createBtn = document.querySelector('#createBtn');
let editBtn = document.querySelectorAll('.editBtn');
let deleteBtn = document.querySelectorAll('.deleteBtn');
let deleteForm = document.querySelector('#deleteForm');
let createForm = document.querySelector('#createForm');
let editForm = document.querySelector('#editForm');

if (createBtn) {
    createBtn.addEventListener('click', () => {
        let action = createBtn.getAttribute('data-action');
        createForm.action = action;
    });
}

if (editBtn) {
    editBtn.forEach((btn) => {
        btn.addEventListener('click', async () => {
            let action = btn.getAttribute('data-action');
            let item = btn.getAttribute('data-item');
            let id = btn.getAttribute('data-id');
            console.log(action);
            console.log(editForm);
            editForm.action = action;

            let res = await fetch(`/admin/${item}?id=${id}`);
            let data = await res.json();

            editForm.name.value = data.name;
            editForm.description = data.description;
            editForm.status.value = +data.status;
        });
    });
}

if (deleteBtn) {
    deleteBtn.forEach((btn) => {
        btn.addEventListener('click', async () => {
            let action = btn.getAttribute('data-action');
            deleteForm.action = action;
        });
    });
}

function changeLetters(str) {
    const azerbaijaniToEnglishMap = {
        ə: "e",
        ı: "i",
        ö: "o",
        ğ: "g",
        ü: "u",
        ş: "s",
        ç: "c",
        "-": "",
        _: "",
        " ": "_"
    };
    return str.replace(/[əıöğüşç\s\-_]/g, (match) => azerbaijaniToEnglishMap[match]);
}

if (createForm) {
    createForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // e.submitter.setAttribute("disabled", true);
        // setTimeout(() => {
        //     e.submitter.removeAttribute("disabled");
        // }, timeout);

        let name = createForm.name.value.trim();
        let key = changeLetters(name.toLowerCase());
        let description = createForm.description.value.trim();
        let status = createForm.status.value.trim();

        try {
            res = await fetch(createForm.action, {
                method: "POST",
                body: JSON.stringify({
                    name,
                    key,
                    description,
                    status,
                }),
                headers: {
                    "Content-type": "application/json",
                },
            });
            const data = await res.json();
            if (data.status == 200) {
                location.reload();
            }
        } catch (error) {
            return error;
        }
    })
}

if (editForm) {
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // e.submitter.setAttribute("disabled", true);
        // setTimeout(() => {
        //     e.submitter.removeAttribute("disabled");
        // }, timeout);

        let name = editForm.name.value.trim();
        let key = changeLetters(name.toLowerCase());
        let description = editForm.description.value.trim();
        let status = editForm.status.value.trim();

        try {
            res = await fetch(editForm.action, {
                method: "PUT",
                body: JSON.stringify({
                    name,
                    key,
                    description,
                    status,
                }),
                headers: {
                    "Content-type": "application/json",
                },
            });
            const data = await res.json();
            if (data.status == 200) {
                location.reload();
            }
        } catch (error) {
            return error;
        }
    })
}

if (deleteForm) {
    deleteForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // e.submitter.setAttribute("disabled", true);
        // setTimeout(() => {
        //     e.submitter.removeAttribute("disabled");
        // }, timeout);
        console.log(deleteForm.action);

        try {
            res = await fetch(deleteForm.action, {
                method: "DELETE",
                body: JSON.stringify(),
                headers: {
                    "Content-type": "application/json",
                },
            });
            const data = await res.json();
            if (data.status == 200) {
                location.reload();
            }
        } catch (error) {
            return error;
        }
    })
}