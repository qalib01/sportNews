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

// if ( window.location.pathname === "/admin/news" ) {
//     let newsItems = document.querySelector('#news-items');
//     let searchQuery = document.location.search.replace('?', '&');
    
//     document.addEventListener('DOMContentLoaded', function() {
//         let startIndex = 0;
//         const limit = 20; // Number of items to fetch each time

//         // Function to fetch items from server
//         function fetchItems() {
//             fetch(`admin/news/load-more?startIndex=${startIndex}${searchQuery}&limit=${limit}`)
//             .then(res => res.json())
//             .then(items => {
//                 if (items.length > 0) {
//                     items.forEach((item) => {
//                         let childEl = `<div class="flex-wr-sb-s p-t-40 p-b-15 how-bor2">
//                             <a href="/news/news-detail?key=${item.key}" class="size-w-8 wrap-pic-w hov1 trans-03 w-full-sr575 m-b-25 text-decoration-none" style="aspect-ratio: 4/3;" aria-label="${item.title.replaceAll('"','')}">
//                                 <img src="/images/news/${item.img}" alt="${item.title.replaceAll('"','')}" class="object-fit-cover h-100">
//                             </a>

//                             <div class="size-w-9 w-full-sr575 m-b-25">
//                                 <a href="/news/news-detail?key=${item.key}" class="f1-l-1 cl2 hov-cl10 trans-03 respon2 fw-bold text-decoration-none p-b-12">
//                                     ${item.title}
//                                 </a>

//                                 <div class="cl19 p-b-18">
//                                     <span class="f1-s-3">
//                                         ${item.createdAt}
//                                     </span>
//                                 </div>

//                                 <p class="cl19">
//                                     ${item.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...'}
//                                 </p>

//                                 <a href="/news/news-detail?key=${item.key}" class="f1-s-1 cl19 hov-cl10 trans-03 text-decoration-none p-t-10 d-block"">
//                                     Ətraflı bax
//                                     <i class="fa fa-long-arrow-alt-right m-l-2"></i>
//                                 </a>
//                             </div>
//                         </div>`
//                         newsItems.innerHTML += childEl;
//                     });

//                     startIndex += limit;
//                     if(items.length < limit) {
//                         document.querySelector('#load-more').style.display = 'none';
//                     }
//                 } else {
//                     let childEl = `<div class="flex-wr-sb-s p-t-40 p-b-15 how-bor2"> Hal-hazırda heç bir xəbər materialı əldə olunmadı. </div>`
//                     newsItems.innerHTML += childEl;
//                     document.querySelector('#load-more').style.display = 'none';
//                 }
//             })
//             .catch(error => console.error('Error fetching items:', error));
//         }
    
//         // Initial fetch
//         fetchItems();
    
//         // Load more button click event
//         document.getElementById('load-more').addEventListener('click', fetchItems);
//     });
// }