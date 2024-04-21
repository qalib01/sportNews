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
        ",": "",
        "/": "", 
    };
    return str.replace(/[əıöğüşç\s\-_'"':;,.“”?!.,/]/g, (match) => azerbaijaniToEnglishMap[match]);
}



let alertMessage = document.querySelector('#alert-message');
let timeout = 4000;
if (alertMessage) {
    alertIcon = alertMessage.querySelector('i');
    alertText = alertMessage.querySelector('p');
    getAlert = (text, key, isShow) => {
        alertMessage.appendChild(alertIcon);
        alertMessage.appendChild(alertText);
        alertIcon.classList = key == 'success' ? 'bx bx-check-circle' : 'bx bxs-error';
        alertText.textContent = text;
        alertMessage.style.display = isShow ? 'flex' : 'none';
        alertMessage.classList.remove('error', 'success');
        if (key) {
            alertMessage.classList.add(key);
        }
    }
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
        btn.addEventListener('click', async (e) => {
            basicForm.reset();
            let action = btn.getAttribute('data-action');
            let item = btn.getAttribute('data-item');
            let id = btn.getAttribute('data-id');
            basicForm.action = action;

            let res = await fetch(`/admin/selected-${item}?id=${id}`);
            let dataAsString = await res.text();
            let data = JSON.parse(dataAsString);

            if (item == 'news') {
                basicForm.title.value = data.title;
                editorInstance.setData(data.content);
                basicForm.status.value = +data.status;
                basicForm.headNews.value = +data.isHeadNews;
                basicForm.category.value = data.categoryId;
                var categoryDropdown = document.getElementById('category');
                var event = new Event('change');
                categoryDropdown.dispatchEvent(event);
                basicForm.subCategory.value = data.subCategoryId;

                const longDateString = data.sharedAt;
                const dateTime = new Date(longDateString.replaceAll('Z', ''));
                
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
                basicForm.description.innerHTML = data.description;
                basicForm.status.value = +data.status;
                if (basicForm.category) {
                    basicForm.category.value = data.categoryId;
                }
                if (basicForm.inOrder) {
                    basicForm.inOrder.value = data.inOrder;
                }
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
        let categoryId;
        let inOrder;
        if (basicForm.category) {
            categoryId = basicForm.category.value.trim();
        }
        if (basicForm.inOrder) {
            inOrder = basicForm.inOrder.value.trim();
        }

        const requestBody = {
            name, description, categoryId, status, inOrder, key
        };
        
        res = await fetch(basicForm.action, {
            method: method,
            body: JSON.stringify( requestBody ),
            headers: {
                "Content-type": "application/json",
            },
        })
        .then(async data => {
            let resData = await data.json();
            getAlert(resData.message, resData.key, true);
            data.status == 200 ? location.reload() : false;
            setTimeout(() => {
                getAlert('', '', false)
            }, timeout);
        })
    } catch (error) {
        return error;
    }
}

const newsFormCreateUpdate = async (method) => {
    try {
        let title = basicForm.title.value.trim();
        let categoryId = basicForm.category.value.trim();
        let subCategoryId = basicForm.subCategory.value.trim();
        let img = document.querySelector('#img');
        img = img.files[0];
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
        if (sharedAt.trim() == '' || sharedAt.trim() == undefined || sharedAt.trim() == null) {
            sharedAt = new Date();
        }
        let status = basicForm.status.value.trim();
        let isHeadNews = basicForm.headNews.value.trim();
        let key = changeLetters(title.toLowerCase());

        let formData = new FormData();
        formData.append('title', title);
        formData.append('key', key);
        formData.append('categoryId', categoryId);
        formData.append('subCategoryId', subCategoryId);
        formData.append('content', content);
        formData.append('status', status);
        formData.append('isHeadNews', isHeadNews);
        formData.append('img', img);
        formData.append('tags', tags);
        formData.append('sharedAt', sharedAt);

        res = await fetch(basicForm.action, {
            method: method,
            body: formData,
        })
        .then(async data => {
            let resData = await data.json();
            getAlert(resData.message, resData.key, true);
            data.status == 200 ? location.reload() : false;
            setTimeout(() => {
                getAlert('', '', false)
            }, timeout);
        })
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
        })
        .then(async data => {
            let resData = await data.json();
            getAlert(resData.message, resData.key, true);
            data.status == 200 ? location.reload() : false;
            setTimeout(() => {
                getAlert('', '', false)
            }, timeout);
        })
    } catch (error) {
        return error;
    }
}

const socialMediaFormCreateUpdate = async (method) => {
    try {
        let name = basicForm.name.value.trim();
        let linkSlug = basicForm.linkSlug.value.trim();
        let socialMediaId = basicForm.socialMediaId.value.trim();
        let status = basicForm.status.value.trim();
        
        const requestBody = {
            name, linkSlug, socialMediaId, status
        };

        res = await fetch(basicForm.action, {
            method: method,
            body: JSON.stringify( requestBody ),
            headers: {
                "Content-type": "application/json",
            },
        })
        .then(async data => {
            let resData = await data.json();
            getAlert(resData.message, resData.key, true);
            data.status == 200 ? location.reload() : false;
            setTimeout(() => {
                getAlert('', '', false)
            }, timeout);
        })
    } catch (error) {
        return error;
    }
}

if (basicForm) {
    basicForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const isCreateAction = basicForm.action.includes("create");
        const isNewsAction = basicForm.action.includes("news");
        const isSocialMediaAction = basicForm.action.includes("social_media");
        const isUserAction = basicForm.action.includes("user");
        const method = isCreateAction ? "POST" : "PUT";

        isNewsAction ?  await newsFormCreateUpdate(method) : null;
        isUserAction ?  await userFormCreateUpdate(method) : null;
        isSocialMediaAction ? await socialMediaFormCreateUpdate(method) : null;
        await itemFormCreateUpdate(method);
    })
}

if (deleteForm) {
    deleteForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            res = await fetch(deleteForm.action, {
                method: "DELETE",
            })
            .then(async data => {
                let resData = await data.json();
                getAlert(resData.message, resData.key, true);
                data.status == 200 ? location.reload() : false;
                setTimeout(() => {
                    getAlert('', '', false)
                }, timeout);
            });
        } catch (error) {
            return error;
        }
    })
}

if ( window.location.pathname === "/admin/news" ) {
    document.getElementById('category').addEventListener('change', function() {
        var categoryId = this.value; // Get the selected category ID
        var subcategoryDropdown = document.getElementById('subCategory');
        subcategoryDropdown.innerHTML = '<option selected hidden disabled>Seçim edin</option>';
    
        if (categoryId) {
            fetch('/admin/get-subCategories?categoryId=' + categoryId)
            .then(async data => {
                let resData = await data.json();
                data.status == 200 ? resData.forEach((subcategory) => {
                    let option = document.createElement('option');
                    option.value = subcategory.id;
                    option.textContent = subcategory.name;
                    subcategoryDropdown.appendChild(option);
                }) : getAlert(resData.message, resData.key, true);
                setTimeout(() => {
                    getAlert('', '', false)
                }, timeout);
            })
        }
    });
}