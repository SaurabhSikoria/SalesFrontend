export const loginUser = async user => {
  return await fetch(`http://localhost:3000/users/${user.id}`, {
    method: 'POST',
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

export const fetchSaleOrders = async () => {
  return await fetch('http://localhost:3000/sale_orders', {
    method: 'GET',
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

export const fetchCustomers = async () => {
  return await fetch('http://localhost:3000/customers', {
    method: 'GET',
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

export const fetchProducts = async () => {
  return await fetch('http://localhost:3000/products', {
    method: 'GET',
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

export const createSalesOrder = async order => {
  return await fetch('http://localhost:3000/sale_orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

export const editSalesOrder = async order => {
  return await fetch(`http://localhost:3000/sale_orders/${order.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};
