"use strict";

/************************************
 * TOGGLE MENU
 ************************************/
let menuItems = document.getElementById("menuItems");

if (menuItems) {
    menuItems.style.maxHeight = "0px";
}

function menuToggle() {
    menuItems.style.maxHeight =
        menuItems.style.maxHeight === "0px" ? "200px" : "0px";
}

/************************************
 * PRODUCT GALLERY (Switch Images)
 ************************************/
let productImg = document.getElementById("productImg");
let smallImages = document.getElementsByClassName("small-img");

if (productImg && smallImages.length > 0) {
    for (let i = 0; i < smallImages.length; i++) {
        smallImages[i].addEventListener("click", function () {
            productImg.src = smallImages[i].src;
        });
    }
}

/************************************
 * LOGIN / REGISTER FORM TOGGLE
 ************************************/
let loginForm = document.getElementById("loginForm");
let regForm = document.getElementById("regForm");
let indicator = document.getElementById("indicator");

function register() {
    if (regForm && loginForm && indicator) {
        regForm.style.transform = "translateX(0px)";
        loginForm.style.transform = "translateX(0px)";
        indicator.style.transform = "translateX(100px)";
    }
}

function login() {
    if (regForm && loginForm && indicator) {
        regForm.style.transform = "translateX(300px)";
        loginForm.style.transform = "translateX(300px)";
        indicator.style.transform = "translateX(0px)";
    }
}

if (regForm) {
    regForm.addEventListener("submit", e => e.preventDefault());
}

/************************************
 * PAGINATION
 ************************************/
let pages = document.querySelectorAll(".child");
let buttons = document.querySelectorAll(".jump");
let nextBtn = document.getElementById("nextBtn");
let current = 0;

if (pages.length > 0) {
    pages[current].classList.add("active");
    buttons[current].classList.add("focus");

    function showPage(index) {
        pages.forEach(p => p.classList.remove("active"));
        buttons.forEach(btn => btn.classList.remove("focus"));

        pages[index].classList.add("active");
        if (buttons[index]) buttons[index].classList.add("focus");

        current = index;
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (current < pages.length - 1) {
                showPage(current + 1);
            }
        });
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            let index = parseInt(btn.dataset.index);
            showPage(index);
        });
    });
}

/************************************
 * CART SYSTEM (LOCAL STORAGE)
 ************************************/
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/************************************
 * ADD TO CART (PRODUCT PAGE)
 ************************************/
let addToCartBtn = document.getElementById("addToCartBtn");

if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function (e) {
        e.preventDefault();

        let sizeSelect = document.querySelector("select");
        let size = sizeSelect.value;

        if (!size) {
            alert("Please select a size!");
            return;
        }

        let qtyInput = document.querySelector("input[type='number']");
        let quantity = parseInt(qtyInput.value);

        if (quantity < 1) {
            alert("Quantity cannot be less than 1.");
            qtyInput.value = 1;
            return;
        }

        let product = {
            name: document.querySelector(".col-2 h1").innerText,
            price: parseFloat(
                document.querySelector(".col-2 h4").innerText.replace("$", "")
            ),
            image: document.getElementById("productImg").src,
            quantity: quantity,
            size: size
        };

        let cart = getCart();

        let existing = cart.find(
            item => item.name === product.name && item.size === product.size
        );

        if (existing) {
            existing.quantity += product.quantity;
        } else {
            cart.push(product);
        }

        saveCart(cart);
        alert("Added to cart!");

        // ✅ reset inputs
        qtyInput.value = 1;
        sizeSelect.selectedIndex = 0;
    });
}


/************************************
 * RENDER CART (cart.html)
 ************************************/
let cartTable = document.querySelector(".cart-page table");

if (cartTable) renderCart();

function renderCart() {
    let cart = getCart();

    let rows = `
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Subtotal</th>
        </tr>
    `;

    let subtotal = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        rows += `
            <tr>
                <td>
                    <div class="cart-info">
                        <img src="${item.image}">
                        <div>
                            <p>${item.name}</p>
                            <small>Size: <b>${item.size}</b></small><br>
                            <small>Price: $${item.price.toFixed(2)}</small><br>
                            <a href="#" class="remove-btn" data-index="${index}">Remove</a>
                        </div>
                    </div>
                </td>
                <td>
                    <input 
                        type="number" min="1" 
                        value="${item.quantity}" 
                        class="qty-input" 
                        data-index="${index}">
                </td>
                <td>$${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    cartTable.innerHTML = rows;

    // totals section
    let totalDiv = document.querySelector(".total-price table");
    if (totalDiv) {
        let tax = subtotal * 0.10;
        let total = subtotal + tax;

        totalDiv.innerHTML = `
            <tr><td>Subtotal</td><td>$${subtotal.toFixed(2)}</td></tr>
            <tr><td>Tax</td><td>$${tax.toFixed(2)}</td></tr>
            <tr><td>Total</td><td>$${total.toFixed(2)}</td></tr>
        `;
    }

    activateCartButtons();
}

/************************************
 * REMOVE + UPDATE QUANTITY
 ************************************/
function activateCartButtons() {
    // remove
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            let index = this.dataset.index;
            let cart = getCart();
            cart.splice(index, 1);
            saveCart(cart);
            renderCart();
        });
    });

    // update quantity
    document.querySelectorAll(".qty-input").forEach(input => {
        input.addEventListener("change", function () {
            let index = this.dataset.index;
            let cart = getCart();

            let newQty = parseInt(this.value);
            if (newQty < 1) {
                this.value = 1;
                newQty = 1;
            }

            cart[index].quantity = newQty;
            saveCart(cart);
            renderCart();
        });
    });
}
