class CartList{
  constructor(elementToRenderIn, counter){
    this.elementToRenderIn = elementToRenderIn
    this.cart = {}
    this.counter = counter
  }

// this method either creates a new product object or //
// increases the value of the key "quantity" within an existing product object//

  addItemToCart(item){
    // check for duplicates
    if(this.cart.hasOwnProperty(item.id)){
      this.cart[item.id].quantity += 1
      localStorage.setItem('cart', JSON.stringify(this.cart))
    }
    else {
      item.index = Object.keys(this.cart).length
      item.quantity = 1
      this.cart[item.id] = item
      localStorage.setItem('cart', JSON.stringify(this.cart))
    }
    return this
  }

  static renderCartItem(item, removecb){
    const li = document.createElement('li')
    addClassesToElement(li, 'cart-item', 'panel-block')
    const div = document.createElement('div')

    const h6 = document.createElement('h6')
    h6.innerHTML = item.name
    div.appendChild(h6)

    const remove = document.createElement('span')
    addClassesToElement(remove, 'remove')
    remove.innerHTML = '<i class=\"far fa-trash-alt\"></i>'
    remove.addEventListener('click', function(event){
      removecb(item)
    })
    h6.appendChild(remove)

    const small = document.createElement('small')
    small.innerHTML = `${item.quantity} x ${item.price}`
    div.appendChild(small)

    li.appendChild(div)

    const price = document.createElement('span')
    price.innerHTML = `${(item.quantity*item.price)} Souls`

    li.appendChild(price)
    return li

  }

  removeItemFromCart(item){
    if(item.quantity > 1){
      item.quantity --
    }
    else{
      delete this.cart[item.id]
    }
    localStorage.setItem('cart', JSON.stringify(this.cart))
  }

  renderTotal(){
    const li = document.createElement('li')
    addClassesToElement(li, 'panel-block', 'cart-item')

    const span = document.createElement('span')
    span.innerHTML = 'Total'
    li.appendChild(span)

    const strong = document.createElement('strong')
    strong.innerHTML = ` ${this.calculateTotalPrice()} Souls`
    li.appendChild(strong)

    return li
  }

  calculateTotalPrice(){
    return Object.values(this.cart).reduce((acc, ele) => acc + (ele.price * ele.quantity),0)
  }

  // impure method
  render(){
    this.cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : this.cart
    const removeCallback = (item) => {
      this.removeItemFromCart(item)
      this.render()
    }

    const sortedByIndexCart = Object.values(this.cart).sort((a,b) => a.index - b.index)

    const cartIncludingTotal = [
      ...sortedByIndexCart.map((product) => CartList.renderCartItem(product, removeCallback)), this.renderTotal()
    ]

    this.counter.innerHTML = Object.values(this.cart).reduce((acc, ele) => {return acc+ele.quantity}, 0)

    // modifying the DOM
    empty(this.elementToRenderIn)
    appendChildrenArray(this.elementToRenderIn, cartIncludingTotal)
  }
}
