function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to create an object")
    }

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function() {
        return `${this.title} by ${this.author}, ${this.pages}, ${
            this.read ? "read" : "not read yet"
        }`
    }
}

const myLibrary = [];

function addBookToLibrary(title, author, pages, read) {
    const id = crypto.randomUUID();
    const book = new Book(title, author, pages, read);

    myLibrary.push([id, book]);
}

function toggleReadStatus(id) {
    for (let i = 0 ; i < myLibrary.length ; i++) {
        if (myLibrary[i][0] === id) {
            let book = myLibrary[i][1];
            book.read = !book.read;
        }
    }
}

function deleteBook(id) {
    for (let i = 0 ; i < myLibrary.length ; i++) {
        if (myLibrary[i][0] === id) {
            myLibrary.splice(i, 1);
        }
    }
}

function displayBooks() {
    const table_body = document.querySelector("tbody");

    while (table_body.hasChildNodes()) {
        table_body.removeChild(table_body.firstChild);
    }

    for (const [id, book] of myLibrary) {
        const tr = document.createElement("tr");
        tr.dataset.id = id;

        const delete_td = document.createElement("td"); 
        {
            const delete_btn = document.createElement("button");
            delete_btn.innerText = "✖️";
            delete_btn.addEventListener("click", () => {
                deleteBook(delete_btn.parentElement.parentElement.dataset.id);
                displayBooks();
            })
            delete_td.appendChild(delete_btn);
        }
        tr.appendChild(delete_td);

        for (const key of ["title", "author", "pages", "read"]) {
            const value = book[key];

            const td = document.createElement("td");
            td.innerHTML = value;
            tr.appendChild(td);
        }

        const toggle_td = document.createElement("td"); 
        {
            const button = document.createElement("button");
            button.textContent = "Toggle Read";
            button.addEventListener("click", () => {
                toggleReadStatus(button.parentElement.parentElement.dataset.id);
                displayBooks();
            })
            toggle_td.appendChild(button);
        }
        tr.appendChild(toggle_td);

        table_body.appendChild(tr);
    }
}

const dialog = document.querySelector("#book-adder");

const new_button = document.querySelector(".new-book");
new_button.addEventListener("click", (e) => {
    dialog.showModal();
    displayBooks();
});

const submit = document.querySelector("form");
submit.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(submit);

    const read = formData.get("read") ? true : false;

    addBookToLibrary(formData.get("title"), formData.get("author"), formData.get("pages"), read);
    displayBooks();
    dialog.close();
})