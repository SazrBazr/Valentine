// Array to hold the cart items
let cart = [];
let balance = 300; // Initial gift card balance

let selectedItem = {};

function showPopup(name, price, description) {
    selectedItem = { name, price };
    document.getElementById("popupTitle").textContent = name;
    document.getElementById("popupDescription").innerHTML = description.split('. ').join('<br>');
    document.getElementById("popupModal").classList.remove("hidden");
}

function closePopup() {
    document.getElementById("popupModal").classList.add("hidden");
}

document.getElementById("confirmAddToCart").addEventListener("click", function() {
    addToCart(selectedItem.name, selectedItem.price);
    closePopup();
});


// Function to add items to the cart
function addToCart(itemName, price) {
    if (price > balance) {
        alert("Oops! Not enough balance for this item. Choose something else, mi amor! 💖");
        return;
    }

    // Check if the item is already in the cart
    let item = cart.find(i => i.name === itemName);
    if (item) {
        item.quantity += 1;  // If item already in cart, increase quantity
    } else {
        cart.push({ name: itemName, price: price, quantity: 1 });
    }

    balance -= price; // Deduct price from balance
    updateCartView();
    updateBalanceDisplay();
    checkButtonStates();
}

// Function to update the cart display
// Function to update the cart display
function updateCartView() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = ''; // Clear the cart list before updating

    let total = 0;

    // Loop through cart items and display them
    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price} x ${item.quantity} `;

        // Create Remove Button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "❌";
        removeBtn.style.marginLeft = "10px";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.border = "none";
        removeBtn.style.background = "transparent";
        removeBtn.style.color = "red";
        removeBtn.style.fontSize = "1rem";

        // Attach click event to remove item
        removeBtn.onclick = () => removeFromCart(index);

        li.appendChild(removeBtn);
        cartItemsContainer.appendChild(li);
    });

    // Update the total in the checkout button
    document.querySelector('.checkout-btn').textContent = `Proceed to Checkout ($${total})`;
}

// Function to remove one quantity of an item from the cart
function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1; // Reduce quantity by 1
        balance += cart[index].price; // Refund the price of one unit
    } else {
        balance += cart[index].price; // Refund the price
        cart.splice(index, 1); // Remove item completely if only 1 left
    }

    updateCartView();
    updateBalanceDisplay();
    checkButtonStates();
}

// Function to update the balance display
function updateBalanceDisplay() {
    document.getElementById('balance').textContent = balance.toFixed(2);
}

// Function to prevent selecting items over the remaining balance
function checkButtonStates() {
    document.querySelectorAll('.card button').forEach(button => {
        let price = parseInt(button.parentElement.querySelector('.card-price').textContent.replace('$', ''));
        if (price > balance) {
            button.disabled = true;
            button.style.opacity = "0.5"; // Make it look unavailable
        } else {
            button.disabled = false;
            button.style.opacity = "1";
        }
    });
}

// // Function to toggle cart visibility
// function toggleCart() {
//     const cartSection = document.getElementById('cart');

//     if (cartSection.classList.contains('hidden')) {
//         cartSection.style.display = "block";  // Show cart
//         cartSection.classList.remove('hidden');
//     } else {
//         cartSection.style.display = "none";   // Hide cart
//         cartSection.classList.add('hidden');
//     }
// }

// Function to handle the checkout process
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add items to your cart.");
        return;
    }

    cart.forEach(item => {
        fetch("https://script.google.com/macros/s/AKfycbyFGNCdG7RfLFxaFNymZmny8xt1dqKzUHmrzmkZ6CmHFdWt0pBGnp7pu3YCTrzfRHvnZw/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                item: item.name,
                price: item.price,
                quantity: item.quantity
            })
        })
        .then(response => response.json())
        .then(data => console.log("Success:", data))
        .catch(error => console.error("Error:", error));
    });

    const orderDetails = cart.map(item => `${item.name} - $${item.price} x ${item.quantity}`).join('\n');
    alert(`Order placed successfully! You ordered:\n\n${orderDetails}\n\nTe amo! 💖`);

    // Clear cart after purchase
    cart = [];
    balance = 300; // Reset balance
    updateCartView();
    updateBalanceDisplay();
    checkButtonStates();
}
