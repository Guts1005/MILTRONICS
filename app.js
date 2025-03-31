document.addEventListener("DOMContentLoaded", function () {
    // Mobile Menu Toggle
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.navbar__menu');
  
    if (menu && menuLinks) {
      menu.addEventListener('click', function () {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
      });
  
      document.addEventListener("click", function (e) {
        if (!menu.contains(e.target) && !menuLinks.contains(e.target)) {
          menu.classList.remove('is-active');
          menuLinks.classList.remove('active');
        }
      });
    }
  
    // Flash Message Handling
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    const type = params.get('type');
    const messageDiv = document.getElementById('message');
  
    if (messageDiv && message) {
      messageDiv.textContent = decodeURIComponent(message);
      messageDiv.style.padding = '10px';
      messageDiv.style.marginBottom = '10px';
      messageDiv.style.color = type === 'success' ? 'green' : 'red';
      messageDiv.style.border = type === 'success' ? '1px solid green' : '1px solid red';
      
      setTimeout(() => {
        messageDiv.textContent = '';
      }, 5000); // Clear message after 5 seconds
    }
  
    // Signup Form Submission
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
      signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = document.getElementById("signupUsername").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();
  
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
  
        try {
          const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `signupUsername=${username}&signupEmail=${email}&signupPassword=${password}&signupConfirmPassword=${confirmPassword}`
          });
          const result = await response.text();
          alert(result);
          if (result.includes("success")) {
            signupForm.reset();
          }
        } catch (error) {
          alert("An error occurred during signup. Please try again.");
        }
      });
    }
  
    // Login Form Validation
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
  
        if (!email || !password) {
          alert("Please fill in all fields.");
          return;
        }
  
        alert("Login Successful!");
        loginForm.reset();
      });
    }
  
    // Forgot Password Form
    const forgotPasswordForm = document.getElementById("forgot-password-form");
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("forgotEmail").value.trim();
  
        if (!email) {
          alert("Please enter your email.");
          return;
        }
  
        alert("Password reset link sent to your email!");
        forgotPasswordForm.reset();
      });
    }
  
    // Cart Functionality
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    function addToCart(product) {
      let existingProduct = cart.find(item => item.name === product.name);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        product.quantity = 1;
        cart.push(product);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to Cart!");
    }
  
    document.querySelectorAll(".product__card button").forEach(button => {
      button.addEventListener("click", function () {
        let productCard = this.closest(".product__card");
        let product = {
          name: productCard.querySelector("h2").innerText,
          price: productCard.querySelector("span").innerText,
          image: productCard.querySelector("img").src
        };
        addToCart(product);
      });
    });
  });
  