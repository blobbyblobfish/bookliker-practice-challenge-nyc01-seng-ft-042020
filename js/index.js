const BASE_URL = "http://localhost:3000/books"

document.addEventListener("DOMContentLoaded", function() {

    const listUl = document.getElementById("list")
    const showPanel = document.getElementById("show-panel")

    fetch(BASE_URL)
    .then(resp => resp.json())
    .then(json => renderBookList(json))

    function renderBookList(books) {
        books.forEach(book => renderBookListElement(book))
    }

    function renderBookListElement(book){
        const li = document.createElement("li")
        li.textContent = book.title
        li.className = "book-li"
        li.dataset.id = book.id
        listUl.append(li)
    }

    document.addEventListener("click", (e) => {
        if (e.target.className === "book-li") {
            const bookId = e.target.dataset.id

            fetch(`${BASE_URL}/${bookId}`)
            .then(resp => resp.json())
            .then(json => renderBook(json))
            .catch(error => window.alert(error.message))
        }

        else if (e.target.dataset.id === "like-button") {
            const bookContainer = e.target.parentNode
            const usersUl = bookContainer.querySelector("ul")
            const bookId = bookContainer.querySelector("h2").dataset.id
            const user = {"id":1, "username":"pouros"}
            let users = getUsers(bookContainer)
            let userObjects = (user) => {
                return(user)
            }

            // if (e.target.dataset.liked === "false") {                
                users.push(user)

                const configObj = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        "users": 
                        userObjects(users)
                    })
                }

                fetch(`${BASE_URL}/${bookId}`, configObj)
                .then(resp => resp.json())
                .then(showUser(user, usersUl))
                .catch(error => window.alert(error.message))

                e.target.textContent = "Unlike"
                e.target.dataset.liked = "false"
            //  }

            //  else if (e.target.dataset.liked === "true") {
            //     const configObj = {
            //         method: "PATCH",
            //         headers: {
            //             "Content-Type": "application/json",
            //             "Accept": "application/json"
            //         },
            //         body: JSON.stringify({
            //             "users": 
            //             userObjects(users)
            //         })
            //     }

            //     fetch(`${BASE_URL}/${bookId}`, configObj)
            //     .then(resp => resp.json())
            //     .then(json => console.log(json))
            //     .catch(error => window.alert(error.message))

            //     e.target.textContent = "Like"
            //     e.target.dataset.liked = "true"
            //  }
        }
    })

    function renderBook(book){
        showPanel.innerHTML = `
            <h2 data-id=${book.id}>${book.title}</h2>
            <img src=${book.img_url}>
            <p>${book.description}</p>
            <ul>${showUsers(book)}</ul>
            <button data-id="like-button" data-liked=${book.liked || false}>Like</button>
            `
    }

    function showUsers(book){
        const usersUl = document.createElement("ul")
        usersUl.dataset.id = "users-ul"

        if (book.users) {
            book.users.forEach(user => {
                usersLi = document.createElement("li")
                usersLi.textContent = user.username
                usersLi.dataset.id = user.id
                usersUl.append(usersLi)
            })

            return usersUl.innerHTML
        }
    }

    function showUser(user, usersUl){
        usersLi = document.createElement("li")
        usersLi.textContent = user.username
        usersLi.dataset.id = user.id
        usersUl.append(usersLi)
    }

    function getUsers(bookContainer){
        const users = []

        bookContainer.querySelectorAll("li").forEach(li => {
            const usersObj = {}
            usersObj.id = li.dataset.id
            usersObj.username = `${li.textContent}`
            users.push(usersObj)
        })

        return users
    }

    // set users array object property to "liked" or "unliked"
    // bind status to button dataset
    // set up conditional based on button dataset
    // if "unliked", do a fetch get and fetch patch request
    
});
