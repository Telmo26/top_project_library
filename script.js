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

Book.prototype.toggleRead = function() {
    this.read = !this.read;
}

const myLibrary = [];

function addBookToLibrary(title, author, pages, read) {
    const id = crypto.randomUUID();
    const book = new Book(title, author, pages, read);

    myLibrary[id] = book;
}

function displayBooks() {
    const table_body = document.querySelector("tbody");

    while (table_body.hasChildNodes()) {
        table_body.removeChild(table_body.firstChild);
    }

    for (const id in myLibrary) {
        const book = myLibrary[id];

        const tr = document.createElement("tr");

        const delete_td = document.createElement("td"); 
        {
            const delete_btn = document.createElement("button");
            delete_btn.textContent = "✖️";
            delete_btn.addEventListener("click", () => {
                delete myLibrary[id];
                displayBooks();
            })
            delete_td.appendChild(delete_btn);
        }
        tr.appendChild(delete_td);

        for (const key of ["title", "author", "pages", "read"]) {
            const value = book[key];

            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        }

        const toggle_td = document.createElement("td"); 
        {
            const button = document.createElement("button");
            button.textContent = "Toggle Read";
            button.addEventListener("click", () => {
                book.toggleRead();
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