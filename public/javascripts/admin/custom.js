let createBtn = document.querySelector('#createBtn');
let editBtn = document.querySelectorAll('.editBtn');
let deleteBtn = document.querySelectorAll('.deleteBtn');
let deleteForm = document.querySelector('#deleteForm');
let createForm = document.querySelector('#createForm');
let editForm = document.querySelector('#editForm');
let basicForm = document.querySelector('#basicForm');

function changeLetters(str) {
    const azerbaijaniToEnglishMap = {
        ə: "e",
        ı: "i",
        ö: "o",
        ğ: "g",
        ü: "u",
        ş: "s",
        ç: "c",
        "-": "-",
        _: "",
        " ": "-",
        '"': '',
        "'": "",
        ":": "",
        ";":"",
        ",": "",
        ".": "",
        "“": "",
        "”": "",
        "?": "",
        "!": "",
        ".": "",
        ",": ""
    };
    return str.replace(/[əıöğüşç\s\-_'"':;,.“”?!.,]/g, (match) => azerbaijaniToEnglishMap[match]);
}

var alertMessage = document.querySelector('#alert-message');
var timeout = 4000;
if (alertMessage) {
    alertIcon = alertMessage.querySelector('i');
    alertText = alertMessage.querySelector('p');
    // progressBar = document.querySelector('#progress-bar');
    getError = () => {
        alertMessage.appendChild(alertIcon);
        alertMessage.appendChild(alertText);
        alertIcon.className = 'fa-solid fa-circle-exclamation';
        // progressBar.classList.add('active');
        alertMessage.style.display = 'block';
        alertMessage.classList.add('error');
    };
    getSuccess = () => {
        alertMessage.appendChild(alertIcon);
        alertMessage.appendChild(alertText);
        alertIcon.className = 'fa-solid fa-circle-check';
        // progressBar.classList.add('active');
        alertMessage.style.display = 'block';
        alertMessage.classList.add('success');
    };
}

if (createBtn) {
    createBtn.addEventListener('click', () => {
        basicForm.reset();
        let action = createBtn.getAttribute('data-action');
        basicForm.action = action;
    });
}

if (editBtn) {
    editBtn.forEach((btn) => {
        btn.addEventListener('click', async () => {
            basicForm.reset();
            let action = btn.getAttribute('data-action');
            let item = btn.getAttribute('data-item');
            let id = btn.getAttribute('data-id');
            basicForm.action = action;

            let res = await fetch(`/admin/selected-${item}?id=${id}`);
            // let data = await res.json();
            // console.log(data);
            let dataAsString = await res.text(); // Get the response as text
            let data = JSON.parse(dataAsString); // Parse the string as JSON
            console.log(data);

            if (item == 'news') {
                basicForm.title.value = data.title;
                editorInstance.setData(data.content);
                basicForm.status.value = +data.status;
                basicForm.category.value = data.categoryId;

                const longDateString = data.sharedAt;
                const dateTime = new Date(longDateString);
                
                const formatterTime = new Intl.DateTimeFormat('az-AZ', { hour: '2-digit', minute: '2-digit' });
                const formattedTime = formatterTime.format(dateTime);
                basicForm.time.value = formattedTime;

                const formatterDate = new Intl.DateTimeFormat('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const formattedDate = formatterDate.format(dateTime);
                basicForm.date.value = formattedDate;

                document.querySelectorAll('input[type="checkbox"][id="tag"]').forEach(function (checkbox) {
                    data.news_tags.forEach((news_tag) => {
                        if (checkbox.value === news_tag.tagId) {
                            checkbox.checked = true;
                        }
                    });
                });
            } else if (item == 'user') {
                basicForm.name.value = data.name;
                basicForm.surname.value = data.surname;
                basicForm.email.value = data.email;
                basicForm.status.value = +data.status;
            } else if (item == 'social_media') {
                basicForm.name.value = data.name;
                basicForm.linkSlug.value = data.linkSlug;
                basicForm.socialMediaId.value = data.socialMediaId;
                basicForm.status.value = +data.status;
            } else {
                basicForm.name.value = data.name;
                basicForm.description.value = data.description;
                basicForm.status.value = +data.status;
            }
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

const itemFormCreateUpdate = async (method) => {
    try {
        let name = basicForm.name.value.trim();
        let description = basicForm.description.value.trim();
        let status = basicForm.status.value.trim();
        let key = changeLetters(name.toLowerCase());
        
        const requestBody = {
            name, description, status, key
        };

        // Add key if it's a create action
        // if (isCreateAction) {
            
            // requestBody.key = key;
        // }

        res = await fetch(basicForm.action, {
            method: method,
            body: JSON.stringify( requestBody ),
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
}

const newsFormCreateUpdate = async (isCreateAction, method) => {
    try {
        let title = basicForm.title.value.trim();
        let categoryId = basicForm.category.value.trim();
        let img = document.querySelector('#img');
        img = img.files[0];
        console.log(img);
        let content = editorInstance.getData().trim();
        let tags = [];
        document.querySelectorAll('input[type="checkbox"][id="tag"]').forEach(function (checkbox) {
            if (checkbox.checked) {
                tags.push(checkbox.value);
            }
        });
        let date = basicForm.date.value.trim();
        let time = basicForm.time.value.trim();
        
        let sharedAt = `${date} ${time}`;
        let status = basicForm.status.value.trim();
        
        // const requestBody = {
        //     title, categoryId, content, status, img, tags, sharedAt
        // };

        let formData = new FormData();

        formData.append('title', title);
        formData.append('categoryId', categoryId);
        formData.append('content', content);
        formData.append('status', status);
        // if (!img) {
            formData.append('img', img);
        // }
        formData.append('tags', tags);
        formData.append('sharedAt', sharedAt);

        // Add key if it's a create action
        if (isCreateAction) {
            let key = changeLetters(title.toLowerCase());
            // requestBody.key = key;
            formData.append('key', key)
        }


        res = await fetch(basicForm.action, {
            method,
            // body: JSON.stringify( requestBody ),
            body: formData,
            // headers: {
            //     "Content-type": "application/json",
            // },
        });
        console.log(res);
        const data = await res.json();
        if (data.status == 200) {
            location.reload();
        }
    } catch (error) {
        return error;
    }
}

const userFormCreateUpdate = async (method) => {
    try {
        let name = basicForm.name.value.trim();
        let surname = basicForm.surname.value.trim();
        let email = basicForm.email.value.trim();
        let password = basicForm.password.value.trim();
        let status = basicForm.status.value.trim();
        
        const requestBody = {
            name, surname, email, password, status
        };
        
        res = await fetch(basicForm.action, {
            method: method,
            body: JSON.stringify( requestBody ),
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
}

const socialMediaFormCreateUpdate = async (isCreateAction, method) => {
    try {
        console.log(method);
        let name = basicForm.name.value.trim();
        let linkSlug = basicForm.linkSlug.value.trim();
        let socialMediaId = basicForm.socialMediaId.value.trim();
        let status = basicForm.status.value.trim();
        
        const requestBody = {
            name, linkSlug, socialMediaId, status
        };

        console.log(requestBody);
        
        res = await fetch(basicForm.action, {
            method: method,
            body: JSON.stringify( requestBody ),
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
}

if (basicForm) {
    basicForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // e.submitter.setAttribute("disabled", true);
        // setTimeout(() => {
        //     e.submitter.removeAttribute("disabled");
        // }, timeout);

        // Check if the form action contains "create" or "update"
        const isCreateAction = basicForm.action.includes("create");
        const isNewsAction = basicForm.action.includes("news");
        const isSocialMediaAction = basicForm.action.includes("social_media");
        const isUserAction = basicForm.action.includes("user");
        const method = isCreateAction ? "POST" : "PUT";

        isNewsAction ?  await newsFormCreateUpdate(isCreateAction, method) : null;
        isUserAction ?  await userFormCreateUpdate(method) : null;
        isSocialMediaAction ? await socialMediaFormCreateUpdate(isCreateAction, method) : null;
        await itemFormCreateUpdate(method);

    })
}

if (deleteForm) {
    deleteForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // e.submitter.setAttribute("disabled", true);
        // setTimeout(() => {
        //     e.submitter.removeAttribute("disabled");
        // }, timeout);

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