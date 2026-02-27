const socket = io();

const form = document.getElementById("productForm");
const productList = document.getElementById("productList");
const deleteBtn = document.getElementById("deleteBtn");

form.addEventListener("submit", (e) => {
   e.preventDefault();

   const formData = new FormData(form);
   const product = {
      title: formData.get("title"),
      price: formData.get("price"),
      description: "Sin descripción",
      code: Date.now().toString(),
      stock: 10,
      category: "General",
      thumbnails: []
   };

   socket.emit("addProduct", product);
   form.reset();
});

deleteBtn.addEventListener("click", () => {
   const id = document.getElementById("deleteId").value;
   socket.emit("deleteProduct", id);
});

function deleteProduct(id) {
   socket.emit("deleteProduct", id);
}

socket.on("updateProducts", (products) => {
   productList.innerHTML = "";

   products.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `
         ${p.title} - $${p.price}
         <button onclick="deleteProduct('${p.id}')">Eliminar</button>
      `;
      productList.appendChild(li);
   });
});