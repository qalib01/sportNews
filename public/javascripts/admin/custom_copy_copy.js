let createBtn = document.querySelector("#createBtn");
let editBtn = document.querySelectorAll(".editBtn");
let deleteBtn = document.querySelectorAll(".deleteBtn");
let deleteForm = document.querySelector("#deleteForm");
let basicForm = document.querySelector("#basicForm");
const submitterSave = document.querySelector("button[value=save]");
let alertMessage = document.querySelector("#alert-message");
let timeout = 4000;
const azerbaijaniToEnglishMap = { "ə": "e", "ı": "i", "ö": "o", "ğ": "g", "ü": "u", "ş": "s", "ç": "c", "-": "-", "_": "", " ": "-", '"': "", "'": "", ":": "", ";": "", ",": "", ".": "", "“": "", "”": "", "?": "", "!": "", ".": "", ",": "", "/": "" };

function changeLetters(str) {
    return str.replace(/[əıöğüşç\s\-_'"':;,.“”?!.,/]/g, (match) => azerbaijaniToEnglishMap[match]);
}

function showAlert(text, key, isShow) {
    if (alertMessage) {
        const alertIcon = alertMessage.querySelector("i");
        const alertText = alertMessage.querySelector("p");
        alertIcon.classList = (key === "success") ? "bx bx-check-circle" : "bx bxs-error";
        alertText.textContent = text;
        alertMessage.style.display = isShow ? "flex" : "none";
        alertMessage.classList.remove("error", "success");
        if (key) {
            alertMessage.classList.add(key);
        }
    }
    setTimeout(() => {
        showAlert("", "", false);
    }, timeout);
}

if (createBtn) {
    createBtn.addEventListener("click", () => {
        basicForm.reset();
        let action = createBtn.getAttribute("data-action");
        basicForm.action = action;
    });
}

if (editBtn) {
    editBtn.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            basicForm.reset();
            let action = btn.getAttribute("data-action");
            let item = btn.getAttribute("data-item");
            let id = btn.getAttribute("data-id");
            basicForm.action = action;

            let res = await fetch(`/admin/selected-${item}?id=${id}`);
            let dataAsString = await res.text();
            let data = JSON.parse(dataAsString);

            if (item == "news") {
                basicForm.title.value = data.title;
                editorInstance.setData(data.content);
                basicForm.status.value = +data.status;
                basicForm.headNews.value = +data.isHeadNews;
                basicForm.category.value = data.categoryId;
                var categoryDropdown = document.getElementById("category");
                var event = new Event("change");
                categoryDropdown.dispatchEvent(event);
                basicForm.subCategory.value = data.subCategoryId;

                const longDateString = data.sharedAt;
                const dateTime = new Date(longDateString.replaceAll("Z", ""));

                const formatterTime = new Intl.DateTimeFormat("az-AZ", {
                hour: "2-digit",
                minute: "2-digit",
                });
                const formattedTime = formatterTime.format(dateTime);
                basicForm.time.value = formattedTime;

                const formatterDate = new Intl.DateTimeFormat("az-AZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                });
                const formattedDate = formatterDate.format(dateTime);
                basicForm.date.value = formattedDate;

                document
                .querySelectorAll('input[type="checkbox"][id="tag"]')
                .forEach(function (checkbox) {
                    data.news_tags.forEach((news_tag) => {
                    if (checkbox.value === news_tag.tagId) {
                        checkbox.checked = true;
                    }
                    });
                });
            } else if (item == "user") {
                basicForm.name.value = data.name;
                basicForm.surname.value = data.surname;
                basicForm.email.value = data.email;
                basicForm.status.value = +data.status;
            } else if (item == "social_media") {
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
        btn.addEventListener("click", async () => {
            let action = btn.getAttribute("data-action");
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
            name,
            description,
            categoryId,
            status,
            inOrder,
            key,
        };

        res = await fetch(basicForm.action, {
            method: method,
            body: JSON.stringify(requestBody),
            headers: {
                "Content-type": "application/json",
            },
        }).then(async (data) => {
            let resData = await data.json();
            showAlert(resData.message, resData.key, true);
            data.status == 200 ? location.reload() : false;
        });
    } catch (error) {
        return error;
    }
};

const newsFormCreateUpdate = async (method) => {
  try {
    let title = basicForm.title.value.trim();
    let categoryId = basicForm.category.value.trim();
    let subCategoryId = basicForm.subCategory.value.trim();
    let img = document.querySelector("#img");
    img = img.files[0];
    let content = editorInstance.getData().trim();
    let tags = [];
    document
      .querySelectorAll('input[type="checkbox"][id="tag"]')
      .forEach(function (checkbox) {
        if (checkbox.checked) {
          tags.push(checkbox.value);
        }
      });
    let date = basicForm.date.value.trim();
    let time = basicForm.time.value.trim();

    let sharedAt = `${date} ${time}`;
    if (
      sharedAt.trim() == "" ||
      sharedAt.trim() == undefined ||
      sharedAt.trim() == null
    ) {
      sharedAt = new Date();
    }
    let status = basicForm.status.value.trim();
    let isHeadNews = basicForm.headNews.value.trim();
    let key = changeLetters(title.toLowerCase());

    let formData = new FormData();
    formData.append("title", title);
    formData.append("key", key);
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append("content", content);
    formData.append("status", status);
    formData.append("isHeadNews", isHeadNews);
    formData.append("img", img);
    formData.append("tags", tags);
    formData.append("sharedAt", sharedAt);

    res = await fetch(basicForm.action, {
      method: method,
      body: formData,
    }).then(async (data) => {
      let resData = await data.json();
      showAlert(resData.message, resData.key, true);
      data.status == 200 ? location.reload() : false;
    });
  } catch (error) {
    return error;
  }
};

const userFormCreateUpdate = async (method) => {
  try {
    let name = basicForm.name.value.trim();
    let surname = basicForm.surname.value.trim();
    let email = basicForm.email.value.trim();
    let password = basicForm.password.value.trim();
    let status = basicForm.status.value.trim();

    const requestBody = {
      name,
      surname,
      email,
      password,
      status,
    };

    res = await fetch(basicForm.action, {
      method: method,
      body: JSON.stringify(requestBody),
      headers: {
        "Content-type": "application/json",
      },
    }).then(async (data) => {
      let resData = await data.json();
      showAlert(resData.message, resData.key, true);
      data.status == 200 ? location.reload() : false;
    });
  } catch (error) {
    return error;
  }
};

const socialMediaFormCreateUpdate = async (method) => {
  try {
    let name = basicForm.name.value.trim();
    let linkSlug = basicForm.linkSlug.value.trim();
    let socialMediaId = basicForm.socialMediaId.value.trim();
    let status = basicForm.status.value.trim();

    const requestBody = {
      name,
      linkSlug,
      socialMediaId,
      status,
    };

    res = await fetch(basicForm.action, {
      method: method,
      body: JSON.stringify(requestBody),
      headers: {
        "Content-type": "application/json",
      },
    }).then(async (data) => {
      let resData = await data.json();
      showAlert(resData.message, resData.key, true);
      data.status == 200 ? location.reload() : false;
    });
  } catch (error) {
    return error;
  }
};

if (basicForm) {
    basicForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const method = basicForm.action.includes("create") ? "POST" : "PUT";
        // await handleFormSubmission(method);


        const isNewsAction = basicForm.action.includes("news");
        const isSocialMediaAction = basicForm.action.includes("social_media");
        const isUserAction = basicForm.action.includes("user");

        isNewsAction ? await newsFormCreateUpdate(method) : null;
        isUserAction ? await userFormCreateUpdate(method) : null;
        isSocialMediaAction ? await socialMediaFormCreateUpdate(method) : null;
        await itemFormCreateUpdate(method);
    });
}

if (deleteForm) {
  deleteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      res = await fetch(deleteForm.action, {
        method: "DELETE",
      }).then(async (data) => {
        let resData = await data.json();
        showAlert(resData.message, resData.key, true);
        data.status == 200 ? location.reload() : false;
      });
    } catch (error) {
      return error;
    }
  });
}

if (window.location.pathname === "/admin/news") {
    const categoryDropdown = document.getElementById("category");
    const subCategoryDropdown = document.getElementById("subCategory");
    const newsItems = document.querySelector("#news-items");
    const pagination = document.getElementById('paginationNews');
    const searchForm = document.querySelector('#searchForm');
    let limit = 30;
    let activePage = 1;

    categoryDropdown.addEventListener("change", async function () {
        const categoryId = this.value;
        subCategoryDropdown.innerHTML = "<option selected hidden disabled> Seçim edin </option>";

        if (categoryId) {
            try {
                const res = await fetch(`/admin/get-subCategories?categoryId=${categoryId}`);
                const data = await res.json();

                if (res.ok) {
                    data.forEach((subCategory) => {
                        const option = document.createElement("option");
                        option.value = subCategory.id;
                        option.textContent = subCategory.name;
                        subCategoryDropdown.appendChild(option);
                    });
                } else {
                    showAlert(data.message, data.key, true);
                }
            } catch (error) {
                showAlert(error.message, "error", true);
            }
        }
    });

    // Function to fetch and render news items
    async function fetchAndRenderNews(link, startIndex) {
        try {
            const res = await fetch(link);
            const data = await res.json();

            if (res.ok) {
                const { news, totalPages, totalCount } = data;
                // const totalCount = news.length;

                updateTotalCount(totalCount);

                if (totalCount > 0) {
                    // const startIndex = (page - 1) * limit + 1;
                    renderNewsItems(news, startIndex);
                    renderPagination(totalPages);
                } else {
                    newsItems.innerHTML = '<tr><td colspan="6">Hal-hazırda heç bir xəbər materialı əldə olunmadı.</td></tr>';
                }
            } else {
                displayAlert(data.message, "error");
            }
        } catch (error) {
            console.error('Error fetching news items:', error);
        }
    }

    // Function to render news items
    function renderNewsItems(news, startIndex) {
        let itemCounter = 1;
        newsItems.innerHTML = "";
        
        news.forEach((item) => {
            const childEl = `<tr>
                <td><span class="fw-medium">${ !startIndex ? itemCounter++ : startIndex++ }</span></td>
                <td class="text-wrap">${item.title}</td>
                <td>${renderCategory(item.category)}</td>
                <td class="text-wrap">${renderNewsTags(item.news_tags)}</td>
                <td>${renderStatus(item.status)}</td>
                <td>${renderDropdownMenu(item)}</td>
            </tr>`;
            newsItems.innerHTML += childEl;
        });
    }

    // Function to render category with status icon
    function renderCategory(category) {
        if (category) {
            return category.name + (category.status ? '<i class="bx bx-check-circle" style="color: #198754;"></i>' : '<i class="bx bx-x-circle" style="color: #ED4337"></i>');
        } else {
            return "Təyin edilmədi" + '<i class="bx bx-x-circle" style="color: #ED4337"></i>';
        }
    }

    // Function to render news tags
    function renderNewsTags(newsTags) {
        return newsTags.length > 0 ? newsTags.map((newsTag) => newsTag && newsTag.tag ? `<span class="badge bg-label-success me-1">${newsTag.tag.name}</span>` : "").join("") : "";
    }

    // Function to render status badge
    function renderStatus(status) {
        return status ? '<span class="badge bg-label-primary me-1">Aktiv</span>' : '<span class="badge bg-label-danger me-1">Passiv</span>';
    }

    // Function to render dropdown menu
    function renderDropdownMenu(item) {
        return `<div class="dropdown">
                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                        <i class="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item editBtn" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#basicModal" data-action="/admin/edit-news?id=${item.id}" data-id="${item.id}" data-item="news">
                            <i class="bx bx-edit-alt me-1"></i> Düzəlt
                        </a>
                        <a class="dropdown-item deleteBtn" href="javascript:void(0);" data-action="/admin/delete-news?id=${item.id}" data-bs-toggle="modal" data-bs-target="#deleteModal" data-item="news">
                            <i class="bx bx-trash me-1"></i> Sil
                        </a>
                        <a class="dropdown-item" href="/news/news-detail?key=${item.key}">
                            <i class='bx bx-link-alt'></i> Xəbərə get
                        </a>
                    </div>
                </div>`;
    }

    // Function to render pagination
    function renderPagination(totalPages, key) {
        let pages = '';

        for (let num = 1; num <= totalPages; num++) {
            pages += `<li class="page-item ${num === activePage ? 'active' : ''}">
                <a class="page-link" href="/admin/news/load-more?key=${key}&startIndex=${(num - 1) * limit}&limit=${limit}">${num}</a>
            </li>`;
        }

        pagination.innerHTML = pages;
    }

    // Function to update total count
    function updateTotalCount(totalCount) {
        const totalCountElement = document.querySelector('#totalCount');
        totalCountElement.innerHTML = totalCount;
    }

    // Event listener for pagination links
    pagination.addEventListener('click', (e) => {
        e.preventDefault();
        let startIndex = 1;

        if (e.target.classList.contains('page-link') && !e.target.parentElement.classList.contains('disabled')) {
            let href = e.target.getAttribute('href');
            let clickedPage = Number(e.target.textContent);
            if (clickedPage === activePage) {
                return;
            }
            activePage = clickedPage;
            if (href.includes('startIndex=0')) {
                itemCounter = 1;
                startIndex = 1;
            } else {
                startIndex = ((clickedPage - 1) * limit) + 1;
            }
            fetchAndRenderNews(href, startIndex);
        }
    });

    // Event listener for search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            itemCounter = 0;

            try {
                const input = searchForm.input.value.trim();
                const key = changeLetters(input.toLowerCase());
                const action = `/admin/news/search?key=${key}&startIndex=0&limit=${limit}`;
                newsItems.innerHTML = '';

                if (key == '' || key == undefined || key == null) {
                    fetchAndRenderNews(`/admin/news/load-more?key=${undefined}&startIndex=0&limit=${limit}`);
                } else {
                    await fetchAndRenderNews(action, 0, key);
                }
            } catch (error) {
                console.error('Error performing search:', error);
            }
        });
    }

    // Initial rendering of news items
    fetchAndRenderNews(`/admin/news/load-more?key=${undefined}&startIndex=0&limit=${limit}`);
}