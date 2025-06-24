
const API_BASE_URL = window.location.origin + "/api"

const searchInput = document.getElementById("searchInput")
const clearSearchBtn = document.getElementById("clearSearch")
const categoryFilter = document.getElementById("categoryFilter")
const minPriceInput = document.getElementById("minPrice")
const maxPriceInput = document.getElementById("maxPrice")
const applyFiltersBtn = document.getElementById("applyFilters")
const searchResultsText = document.getElementById("searchResultsText")

const productForm = document.getElementById("productForm")
const productsContainer = document.getElementById("productsContainer")
const loadingSpinner = document.getElementById("loadingSpinner")
const emptyState = document.getElementById("emptyState")
const emptyStateMessage = document.getElementById("emptyStateMessage")
const productsCount = document.getElementById("productsCount")
const toastContainer = document.getElementById("toastContainer")

const confirmModal = document.getElementById("confirmModal")
const productToDelete = document.getElementById("productToDelete")
const confirmDeleteBtn = document.getElementById("confirmDelete")
const cancelDeleteBtn = document.getElementById("cancelDelete")

const formTitle = document.getElementById("formTitle")
const submitBtn = document.getElementById("submitBtn")
const submitText = document.getElementById("submitText")
const cancelBtn = document.getElementById("cancelBtn")

let products = []
let filteredProducts = []
let productToDeleteId = null
let isEditing = false
let searchTimeout = null


document.addEventListener("DOMContentLoaded", () => {
  loadProducts()
  loadCategories()
  setupEventListeners()
})


function setupEventListeners() {

  productForm.addEventListener("submit", handleFormSubmit)
  cancelBtn.addEventListener("click", resetForm)

  searchInput.addEventListener("input", handleSearchInput)
  clearSearchBtn.addEventListener("click", clearSearch)
  applyFiltersBtn.addEventListener("click", applyFilters)


  categoryFilter.addEventListener("change", applyFilters)
  minPriceInput.addEventListener("input", debounce(applyFilters, 500))
  maxPriceInput.addEventListener("input", debounce(applyFilters, 500))

  cancelDeleteBtn.addEventListener("click", hideConfirmModal)
  confirmDeleteBtn.addEventListener("click", handleConfirmDelete)
  confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) hideConfirmModal()
  })

  const inputs = productForm.querySelectorAll("input, select, textarea")
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input))
    input.addEventListener("input", () => clearFieldError(input))
  })


  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault()
      searchInput.focus()
    }
    if (e.key === "Escape") {
      if (confirmModal.classList.contains("show")) {
        hideConfirmModal()
      }
      if (isEditing) {
        resetForm()
      }
    }
  })
}


function handleSearchInput(e) {
  const searchTerm = e.target.value.trim()


  clearSearchBtn.style.display = searchTerm ? "block" : "none"


  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    performSearch(searchTerm)
  }, 300)
}

function clearSearch() {
  searchInput.value = ""
  clearSearchBtn.style.display = "none"
  searchResultsText.textContent = ""
  filteredProducts = products
  renderProducts()
}

async function performSearch(searchTerm) {
  if (!searchTerm) {
    filteredProducts = products
    searchResultsText.textContent = ""
    renderProducts()
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(searchTerm)}`)
    const result = await response.json()

    if (result.success) {
      filteredProducts = result.data
      searchResultsText.textContent = result.message
      renderProducts()
    } else {
      showToast(result.message || "Error en la búsqueda", "error")
    }
  } catch (error) {
    console.error("Error en búsqueda:", error)
    showToast("Error de conexión en la búsqueda", "error")
  }
}

function applyFilters() {
  const searchTerm = searchInput.value.trim()
  const category = categoryFilter.value
  const minPrice = minPriceInput.value
  const maxPrice = maxPriceInput.value

  const params = new URLSearchParams()
  if (searchTerm) params.append("search", searchTerm)
  if (category) params.append("category", category)
  if (minPrice) params.append("minPrice", minPrice)
  if (maxPrice) params.append("maxPrice", maxPrice)

  loadProductsWithFilters(params.toString())
}

async function loadProductsWithFilters(queryString) {
  try {
    showLoading(true)

    const url = queryString ? `${API_BASE_URL}/products?${queryString}` : `${API_BASE_URL}/products`

    const response = await fetch(url)
    const result = await response.json()

    if (result.success) {
      products = result.data
      filteredProducts = result.data
      searchResultsText.textContent = result.message || ""
      renderProducts()
      updateProductsCount()
    } else {
      showToast("Error al cargar productos", "error")
    }
  } catch (error) {
    console.error("Error:", error)
    showToast("Error de conexión al cargar productos", "error")
  } finally {
    showLoading(false)
  }
}


async function loadProducts() {
  try {
    showLoading(true)

    const response = await fetch(`${API_BASE_URL}/products`)
    const result = await response.json()

    if (result.success) {
      products = result.data
      filteredProducts = result.data
      renderProducts()
      updateProductsCount()
    } else {
      showToast("Error al cargar productos", "error")
    }
  } catch (error) {
    console.error("Error:", error)
    showToast("Error de conexión al cargar productos", "error")
  } finally {
    showLoading(false)
  }
}

async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`)
    const result = await response.json()

    if (result.success) {
      const categories = result.data
      categoryFilter.innerHTML = '<option value="">Todas las categorías</option>'

      categories.forEach((category) => {
        const option = document.createElement("option")
        option.value = category
        option.textContent = category
        categoryFilter.appendChild(option)
      })
    }
  } catch (error) {
    console.error("Error al cargar categorías:", error)
  }
}

function renderProducts() {
  if (filteredProducts.length === 0) {
    productsContainer.style.display = "none"
    emptyState.style.display = "block"

    const searchTerm = searchInput.value.trim()
    if (searchTerm) {
      emptyStateMessage.textContent = `No se encontraron productos para "${searchTerm}"`
    } else {
      emptyStateMessage.textContent = "No hay productos registrados."
    }
    return
  }

  emptyState.style.display = "none"
  productsContainer.style.display = "block"

  productsContainer.innerHTML = filteredProducts
    .map(
      (product) => `
      <div class="product-card" data-id="${product._id}">
        <div class="product-info">
          <div class="product-image">
            ${
              product.imageUrl
                ? `<img src="${product.imageUrl}" alt="${escapeHtml(product.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                 <i class="fas fa-image" style="display: none;"></i>`
                : `<i class="fas fa-image"></i>`
            }
          </div>
          <div class="product-details">
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.description)}</p>
            <div class="product-meta">
              <span class="price-badge">$${product.price.toFixed(2)}</span>
              <span class="category-badge">${escapeHtml(product.category)}</span>
              <span class="stock-badge ${getStockClass(product.stock)}">
                Stock: ${product.stock}
              </span>
            </div>
          </div>
          <div class="product-actions">
            <button class="btn btn-primary btn-small" onclick="editProduct('${product._id}')">
              <i class="fas fa-edit"></i>
              Editar
            </button>
            <button class="btn btn-danger btn-small" onclick="showDeleteConfirmation('${product._id}', '${escapeHtml(product.name)}')">
              <i class="fas fa-trash"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `,
    )
    .join("")
}

function getStockClass(stock) {
  if (stock === 0) return "out-of-stock"
  if (stock <= 5) return "low-stock"
  return "in-stock"
}

function updateProductsCount() {
  productsCount.textContent = filteredProducts.length
}


async function handleFormSubmit(e) {
  e.preventDefault()

  if (!validateForm()) {
    showToast("Por favor corrige los errores en el formulario", "error")
    return
  }

  const formData = new FormData(productForm)
  const productData = {
    name: formData.get("name").trim(),
    description: formData.get("description").trim(),
    price: Number.parseFloat(formData.get("price")),
    category: formData.get("category"),
    stock: Number.parseInt(formData.get("stock")),
    available: formData.get("available") === "on",
    imageUrl: formData.get("imageUrl").trim() || undefined,
  }

  try {
    setSubmitButtonLoading(true)

    const url = isEditing ? `${API_BASE_URL}/products/${formData.get("id")}` : `${API_BASE_URL}/products`

    const method = isEditing ? "PATCH" : "POST"

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    const result = await response.json()

    if (result.success) {
      showToast(isEditing ? "¡Producto actualizado exitosamente!" : "¡Producto creado exitosamente!", "success")
      resetForm()
      loadProducts()
    } else {
      showToast(result.message || "Error al procesar el producto", "error")
    }
  } catch (error) {
    console.error("Error:", error)
    showToast("Error de conexión. Por favor intenta nuevamente.", "error")
  } finally {
    setSubmitButtonLoading(false)
  }
}

function editProduct(id) {
  const product = products.find((p) => p._id === id)
  if (!product) return


  document.getElementById("productId").value = product._id
  document.getElementById("name").value = product.name
  document.getElementById("description").value = product.description
  document.getElementById("price").value = product.price
  document.getElementById("category").value = product.category
  document.getElementById("stock").value = product.stock
  document.getElementById("available").checked = product.available
  document.getElementById("imageUrl").value = product.imageUrl || ""

 
  isEditing = true
  formTitle.textContent = "Editar Producto"
  submitText.textContent = "Actualizar Producto"
  submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Producto'
  cancelBtn.style.display = "inline-flex"


  document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" })
}

function resetForm() {
  productForm.reset()
  document.getElementById("productId").value = ""


  const errorMessages = productForm.querySelectorAll(".error-message")
  errorMessages.forEach((error) => error.classList.remove("show"))

  const inputs = productForm.querySelectorAll("input, select, textarea")
  inputs.forEach((input) => (input.style.borderColor = "var(--border-color)"))


  isEditing = false
  formTitle.textContent = "Agregar Nuevo Producto"
  submitText.textContent = "Agregar Producto"
  submitBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar Producto'
  cancelBtn.style.display = "none"
}


function validateField(field) {
  const value = field.value.trim()
  const fieldName = field.name
  let isValid = true
  let errorMessage = ""

  clearFieldError(field)

  switch (fieldName) {
    case "name":
      if (!value) {
        errorMessage = "El nombre es obligatorio"
        isValid = false
      } else if (value.length < 2) {
        errorMessage = "El nombre debe tener al menos 2 caracteres"
        isValid = false
      } else if (value.length > 100) {
        errorMessage = "El nombre no puede exceder 100 caracteres"
        isValid = false
      }
      break

    case "description":
      if (!value) {
        errorMessage = "La descripción es obligatoria"
        isValid = false
      } else if (value.length > 500) {
        errorMessage = "La descripción no puede exceder 500 caracteres"
        isValid = false
      }
      break

    case "price":
      const price = Number.parseFloat(value)
      if (!value) {
        errorMessage = "El precio es obligatorio"
        isValid = false
      } else if (isNaN(price) || price < 0) {
        errorMessage = "El precio debe ser un número válido mayor o igual a 0"
        isValid = false
      }
      break

    case "stock":
      const stock = Number.parseInt(value)
      if (!value) {
        errorMessage = "El stock es obligatorio"
        isValid = false
      } else if (isNaN(stock) || stock < 0) {
        errorMessage = "El stock debe ser un número entero mayor o igual a 0"
        isValid = false
      }
      break

    case "category":
      if (!value) {
        errorMessage = "Debes seleccionar una categoría"
        isValid = false
      }
      break

    case "imageUrl":
      if (value && !isValidUrl(value)) {
        errorMessage = "Por favor ingresa una URL válida"
        isValid = false
      }
      break
  }

  if (!isValid) {
    showFieldError(field, errorMessage)
  }

  return isValid
}

function showFieldError(field, message) {
  const errorElement = document.getElementById(`${field.name}Error`)
  if (errorElement) {
    errorElement.textContent = message
    errorElement.classList.add("show")
  }
  field.style.borderColor = "var(--danger-color)"
}

function clearFieldError(field) {
  const errorElement = document.getElementById(`${field.name}Error`)
  if (errorElement) {
    errorElement.classList.remove("show")
  }
  field.style.borderColor = "var(--border-color)"
}

function validateForm() {
  const inputs = productForm.querySelectorAll("input[required], select[required], textarea[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false
    }
  })

  return isValid
}

function setSubmitButtonLoading(loading) {
  if (loading) {
    submitBtn.disabled = true
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...'
  } else {
    submitBtn.disabled = false
    submitBtn.innerHTML = `<i class="fas fa-${isEditing ? "save" : "plus"}"></i> ${submitText.textContent}`
  }
}


function showDeleteConfirmation(id, name) {
  productToDeleteId = id
  productToDelete.textContent = name
  showConfirmModal()
}

function showConfirmModal() {
  confirmModal.classList.add("show")
  document.body.style.overflow = "hidden"
}

function hideConfirmModal() {
  confirmModal.classList.remove("show")
  document.body.style.overflow = "auto"
  productToDeleteId = null
}

async function handleConfirmDelete() {
  if (!productToDeleteId) return

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productToDeleteId}`, {
      method: "DELETE",
    })

    const result = await response.json()

    if (result.success) {
      showToast("Producto eliminado exitosamente", "success")
      loadProducts()
    } else {
      showToast(result.message || "Error al eliminar el producto", "error")
    }
  } catch (error) {
    console.error("Error:", error)
    showToast("Error de conexión al eliminar producto", "error")
  } finally {
    hideConfirmModal()
  }
}

function showLoading(show) {
  if (show) {
    loadingSpinner.style.display = "block"
    productsContainer.style.display = "none"
    emptyState.style.display = "none"
  } else {
    loadingSpinner.style.display = "none"
    productsContainer.style.display = "block"
  }
}

function showToast(message, type = "success") {
  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  const icon = type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "exclamation-triangle"

  toast.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${escapeHtml(message)}</span>
  `

  toastContainer.appendChild(toast)


  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = "slideInRight 0.3s ease reverse"
      setTimeout(() => {
        if (toast.parentNode) {
          toastContainer.removeChild(toast)
        }
      }, 300)
    }
  }, 5000)
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

window.addEventListener("error", (e) => {
  console.error("Error global:", e.error)
  showToast("Ha ocurrido un error inesperado", "error")
})

window.addEventListener("online", () => {
  showToast("Conexión restaurada", "success")
})

window.addEventListener("offline", () => {
  showToast("Sin conexión a internet", "warning")
})

window.editProduct = editProduct
window.showDeleteConfirmation = showDeleteConfirmation
