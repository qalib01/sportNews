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

if ( window.location.pathname === "/news" ) {
    let newsItems = document.querySelector('#news-items');
    let searchQuery = document.location.search.replace('?', '&');
    
    document.addEventListener('DOMContentLoaded', function() {
        let startIndex = 0;
        const limit = 10; // Number of items to fetch each time

        // Function to fetch items from server
        function fetchItems() {
            fetch(`news/load-more?startIndex=${startIndex}${searchQuery}&limit=${limit}`)
            .then(res => res.json())
            .then(items => {
                if (items.length > 0) {
                    items.forEach((item) => {
                        let childEl = `<div class="flex-wr-sb-s p-t-40 p-b-15 how-bor2">
                            <a href="/news/news-detail?key=${item.key}" class="size-w-8 wrap-pic-w hov1 trans-03 w-full-sr575 m-b-25 text-decoration-none" style="aspect-ratio: 4/3;" aria-label="${item.title.replaceAll('"','')}">
                                <img src="/images/news/${item.img}" alt="${item.title.replaceAll('"','')}" class="object-fit-cover h-100" onerror=setDefaultImage(this)>
                            </a>

                            <div class="size-w-9 w-full-sr575 m-b-25">
                                <a href="/news/news-detail?key=${item.key}" class="f1-l-1 cl2 hov-cl10 trans-03 respon2 fw-bold text-decoration-none p-b-12">
                                    ${item.title}
                                </a>

                                <div class="cl19 p-b-18">
                                    <span class="f1-s-3">
                                        ${item.sharedAt}
                                    </span>
                                </div>

                                <p class="cl19">
                                    ${item.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...'}
                                </p>

                                <a href="/news/news-detail?key=${item.key}" class="f1-s-1 cl19 hov-cl10 trans-03 text-decoration-none p-t-10 d-block"">
                                    Ətraflı bax
                                    <i class="fa fa-long-arrow-alt-right m-l-2"></i>
                                </a>
                            </div>
                        </div>`
                        newsItems.innerHTML += childEl;
                    });

                    startIndex += limit;
                    if(items.length < limit) {
                        document.querySelector('#load-more').style.display = 'none';
                    }
                } else {
                    let childEl = `<div class="flex-wr-sb-s p-t-40 p-b-15 how-bor2"> Hal-hazırda heç bir xəbər materialı əldə olunmadı. </div>`
                    newsItems.innerHTML += childEl;
                    if (document.getElementById('load-more')) {
                        document.querySelector('#load-more').style.display = 'none';
                    }
                }
            })
            .catch(error => console.error('Error fetching items:', error));
        }
    
        // Initial fetch
        fetchItems();
    
        // Load more button click event
        if (document.getElementById('load-more')) {
            document.getElementById('load-more').addEventListener('click', fetchItems);
        }
    });
}

const setDefaultImage = (img) => {
    img.src = '/images/news/default_image.webp';
}