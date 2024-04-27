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

    document.addEventListener('DOMContentLoaded', function() {
        let newsItems = document.querySelector('#news-items');
        let startIndex = 0;
        let itemCounter = 0;
        const limit = 20;
        let activePage = 1;
        let totalPages = 1;
        let firstLink = `/admin/news/load-more?startIndex=${startIndex}&limit=${limit}`;

        function fetchItems(link) {
            return new Promise((resolve, reject) => {
                fetch(link)
                .then(res => res.json())
                .then(data => {
                    let news = data.news;
                    let visiblePages = data.visiblePages;
                    totalPages = data.totalPages;
                    if (news.length > 0) {
                        newsItems.innerHTML = '';
                        news.forEach((item, id) => {
                            let childEl = `<tr>
                                <td>
                                    <span class="fw-medium">
                                        ${itemCounter + 1}
                                    </span>
                                </td>
                                <td class="text-wrap">
                                    ${item.title}
                                </td>
                                <td>
                                    ${item.category ? item.category.name + (item.category.status ? '<i class="bx bx-check-circle" style="color: #198754;"></i>' : '<i class="bx bx-x-circle" style="color: #ED4337"></i>') : 'Təyin edilmədi' + '<i class="bx bx-x-circle" style="color: #ED4337"></i>'}
                                </td>
                                <td class="text-wrap">
                                    ${item.news_tags.length > 0 ? item.news_tags.map(news_tag => news_tag && news_tag.tag ? `<span class="badge bg-label-success me-1">${news_tag.tag.name}</span>` : '').join('') : ''}
                                </td>
                                <td>
                                    ${ item.status == true ? '<span class="badge bg-label-primary me-1">Aktiv</span>' : '<span class="badge bg-label-danger me-1">Passiv</span>' }
                                </td>
                                <td>
                                    <div class="dropdown">
                                        <button type="button" class="btn p-0 dropdown-toggle hide-arrow"
                                            data-bs-toggle="dropdown">
                                            <i class="bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item editBtn" href="javascript:void(0);"
                                                data-bs-toggle="modal" data-bs-target="#basicModal"
                                                data-action="/admin/edit-news?id=${item.id}"
                                                data-id="${item.id}" data-item="news">
                                                <i class="bx bx-edit-alt me-1"></i> Düzəlt
                                            </a>
                                            <a class="dropdown-item deleteBtn" href="javascript:void(0);"
                                                data-action="/admin/delete-news?id=${item.id}"
                                                data-bs-toggle="modal" data-bs-target="#deleteModal"
                                                data-item="news">
                                                <i class="bx bx-trash me-1"></i> Sil
                                            </a>
                                            <a class="dropdown-item" href="/news/news-detail?key=${item.key}">
                                                <i class='bx bx-link-alt'></i> Xəbərə get
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>`
                            newsItems.innerHTML += childEl;
                            itemCounter++;
                        });
                        let pagination = document.getElementById('paginationNews');
                        let pages = '';


                        function generateVisiblePageNumbers(activePage, totalPages) {
                            const maxVisiblePages = 8;
                            let visiblePageNumbers = [];
                            if (totalPages <= maxVisiblePages) {
                                for (let i = 1; i <= totalPages; i++) {
                                    visiblePageNumbers.push(i);
                                }
                            } else {
                                // If there are more pages than maxVisiblePages, show first, last, and dots
                                const threshold = Math.floor(maxVisiblePages / 2);
                                visiblePageNumbers.push(1);
                                if (activePage <= threshold + 2) {
                                    for (let i = 2; i <= 2 + threshold; i++) {
                                        visiblePageNumbers.push(i);
                                    }
                                    visiblePageNumbers.push('...');
                                    for (let i = totalPages - 1; i <= totalPages; i++) {
                                        visiblePageNumbers.push(i);
                                    }
                                } else if (activePage >= totalPages - threshold - 1) {
                                    for (let i = 1; i <= 2; i++) {
                                        visiblePageNumbers.push(i);
                                    }
                                    visiblePageNumbers.push('...');
                                    for (let i = totalPages - threshold - 1; i <= totalPages; i++) {
                                        visiblePageNumbers.push(i);
                                    }
                                } else {
                                    for (let i = 1; i <= 2; i++) {
                                        visiblePageNumbers.push(i);
                                    }
                                    visiblePageNumbers.push('...');
                                    for (let i = activePage - threshold; i <= activePage + threshold; i++) {
                                        visiblePageNumbers.push(i);
                                    }
                                    visiblePageNumbers.push('...');
                                    for (let i = totalPages - 1; i <= totalPages; i++) {
                                        visiblePageNumbers.push(i);
                                    }
                                }
                            }
                            return visiblePageNumbers;
                        }


                        let visiblePageNumbers = generateVisiblePageNumbers(activePage, totalPages);
                        visiblePageNumbers.forEach((num) => {
                            if (num === '...') {
                                pages += `<li class="page-item disabled"><a class="page-link" href="#">${num}</a></li>`;
                            } else {
                                pages += `
                                    <li class="page-item ${num === activePage ? 'active' : ''}"> <!-- Add 'active' class for the active page -->
                                        <a class="page-link" href="/admin/news/load-more?startIndex=${(num - 1) * limit}&limit=${limit}">${num}</a>
                                    </li>`;
                            }
                        });

                        pagination.innerHTML =  pages;
                        resolve();
                    } else {
                        let childEl = `Hal-hazırda heç bir xəbər materialı əldə olunmadı.`;
                        newsItems.innerHTML += childEl;
                        resolve();
                    }
                })
                .catch(error => reject(error));
            });
        }
    
        function renderTable(link) {
            fetchItems(link)
            .then(() => {
                let paginationLinks = document.querySelectorAll('.page-link');
                paginationLinks.forEach((link) => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();

                        if (e.target.classList.contains('page-link') && !e.target.parentElement.classList.contains('disabled')) {
                            let href = e.target.getAttribute('href');
                            let clickedPage = Number(e.target.textContent);
                            if (clickedPage === activePage) {
                                return;
                            }
                            activePage = clickedPage;
                            if (href.includes('startIndex=0')) {
                                itemCounter = 0;
                                startIndex = 0;
                            } else {
                                startIndex = (clickedPage - 1) * limit;
                            }
                            renderTable(href);
                        }
                    });
                });

                createBtn = document.querySelector('#createBtn');
                editBtn = document.querySelectorAll('.editBtn');
                deleteBtn = document.querySelectorAll('.deleteBtn');
                deleteForm = document.querySelector('#deleteForm');
                createForm = document.querySelector('#createForm');
                editForm = document.querySelector('#editForm');
                basicForm = document.querySelector('#basicForm');
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
            })
            .catch(error => console.error('Error fetching items:', error));
        }

        renderTable(firstLink, false);
    });
}