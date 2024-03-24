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
        "-": "",
        _: "",
        " ": "-",
        '"': '',
        "'": "",
    };
    return str.replace(/[əıöğüşç\s\-_'"']/g, (match) => azerbaijaniToEnglishMap[match]);
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
            let data = await res.json();

            if (item == 'news') {
                basicForm.title.value = data.title;
                editorInstance.setData(data.content);
                basicForm.status.value = +data.status;
                basicForm.category.value = data.categoryId;
                basicForm.img.value = data.img;

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
            } else {
                basicForm.name.value = data.name;
                basicForm.description = data.description;
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

const itemFormCreateUpdate = async (isCreateAction, method) => {
    try {
        let name = basicForm.name.value.trim();
        let description = basicForm.description.value.trim();
        let status = basicForm.status.value.trim();
        
        const requestBody = {
            name, description, status
        };

        // Add key if it's a create action
        if (isCreateAction) {
            let key = changeLetters(name.toLowerCase());
            requestBody.key = key;
        }

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
        let img = basicForm.img.value.trim();
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
        
        const requestBody = {
            title, categoryId, content, status, img, tags, sharedAt
        };

        // Add key if it's a create action
        if (isCreateAction) {
            let key = changeLetters(title.toLowerCase());
            requestBody.key = key;
        }
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
        const method = isCreateAction ? "POST" : "PUT";

        if (isNewsAction) {
            await newsFormCreateUpdate(isCreateAction, method);
        } else {
            await itemFormCreateUpdate(isCreateAction, method);
        }
    })
}

// if (createForm) {
//     createForm.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         // e.submitter.setAttribute("disabled", true);
//         // setTimeout(() => {
//         //     e.submitter.removeAttribute("disabled");
//         // }, timeout);

//         let item = e.submitter.getAttribute('data-item');
//         if (item == 'news') {
//             try {
//                 let title = createForm.title.value.trim();
//                 let img = createForm.img.files[0]; // Get the selected image file
//                 let key = changeLetters(title.toLowerCase());
//                 let content = editorInstance.getData().trim(); // Retrieve content from CKEditor
//                 let tags = [];
//                 document.querySelectorAll('input[type="checkbox"][id="tag"]').forEach(function (checkbox) {
//                     if (checkbox.checked) {
//                         tags.push(checkbox.value);
//                     }
//                 });
//                 console.log(tags);
//                 let categoryId = createForm.category.value.trim();
//                 let status = createForm.status.value.trim();
//                 let sharedDate = createForm.sharedDate.value.trim();
//                 let sharedTime = createForm.sharedTime.value.trim();
//                 let sharedDateTime = `${sharedDate} ${sharedTime}`;

//                 res = await fetch(createForm.action, {
//                     method: "POST",
//                     body: JSON.stringify({
//                         title, key, img, content, tags, categoryId, status, sharedDateTime
//                     }),
//                     headers: {
//                         "Content-type": "application/json",
//                     },
//                 });
//                 const data = await res.json();
//                 if (data.status == 200) {
//                     location.reload();
//                 }
//             } catch (error) {
//                 return error;
//             }
//         } else {
//             let name = createForm.name.value.trim();
//             let key = changeLetters(name.toLowerCase());
//             let description = createForm.description.value.trim();
//             let status = createForm.status.value.trim();

//             try {
//                 res = await fetch(createForm.action, {
//                     method: "POST",
//                     body: JSON.stringify({
//                         name, key, description, status,
//                     }),
//                     headers: {
//                         "Content-type": "application/json",
//                     },
//                 });
//                 const data = await res.json();
//                 if (data.status == 200) {
//                     location.reload();
//                 }
//             } catch (error) {
//                 return error;
//             }
//         }
//     })
// }

// if (editForm) {
//     editForm.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         // e.submitter.setAttribute("disabled", true);
//         // setTimeout(() => {
//         //     e.submitter.removeAttribute("disabled");
//         // }, timeout);
//         let item = e.submitter.getAttribute('data-item');
//         if (item == 'news') {
//             try {
//                 let title = createForm.title.value.trim();
//                 let img = createForm.img.files[0]; // Get the selected image file
//                 let key = changeLetters(title.toLowerCase());
//                 let content = editorInstance.getData().trim(); // Retrieve content from CKEditor
//                 let tags = [];
//                 document.querySelectorAll('input[type="checkbox"][id="tag"]').forEach(function (checkbox) {
//                     if (checkbox.checked) {
//                         tags.push(checkbox.value);
//                     }
//                 });
//                 console.log(tags);
//                 let categoryId = createForm.category.value.trim();
//                 let status = createForm.status.value.trim();
//                 let sharedDate = createForm.sharedDate.value.trim();
//                 let sharedTime = createForm.sharedTime.value.trim();
//                 let sharedDateTime = `${sharedDate} ${sharedTime}`;

//                 res = await fetch(createForm.action, {
//                     method: "POST",
//                     body: JSON.stringify({
//                         title, key, img, content, tags, categoryId, status, sharedDateTime
//                     }),
//                     headers: {
//                         "Content-type": "application/json",
//                     },
//                 });
//                 const data = await res.json();
//                 if (data.status == 200) {
//                     location.reload();
//                 }
//             } catch (error) {
//                 return error;
//             }
//         } else {
//             let name = editForm.name.value.trim();
//             let key = changeLetters(name.toLowerCase());
//             let description = editForm.description.value.trim();
//             let status = editForm.status.value.trim();

//             try {
//                 res = await fetch(editForm.action, {
//                     method: "PUT",
//                     body: JSON.stringify({
//                         name,
//                         key,
//                         description,
//                         status,
//                     }),
//                     headers: {
//                         "Content-type": "application/json",
//                     },
//                 });
//                 const data = await res.json();
//                 if (data.status == 200) {
//                     location.reload();
//                 }
//             } catch (error) {
//                 return error;
//             }
//         }
//     })
// }

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