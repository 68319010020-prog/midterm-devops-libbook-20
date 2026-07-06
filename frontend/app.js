const apiBase = 'http://localhost:3000/api/books';

async function fetchBooks() {
  const res = await fetch(apiBase);
  const data = await res.json();
  const tbody = document.querySelector('#books-table tbody');
  tbody.innerHTML = '';
  data.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${b.id}</td>
      <td>${b.isbn || ''}</td>
      <td>${b.title || ''}</td>
      <td>${b.author || ''}</td>
      <td>${b.category || ''}</td>
      <td>${b.year || ''}</td>
      <td>${b.status || ''}</td>
      <td>
        <button data-id="${b.id}" class="edit">Edit</button>
        <button data-id="${b.id}" class="del">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('book-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  if (data.year) data.year = parseInt(data.year, 10);
  await fetch(apiBase, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
  form.reset();
  await fetchBooks();
});

document.querySelector('#books-table').addEventListener('click', async (e) => {
  if (e.target.classList.contains('del')) {
    const id = e.target.dataset.id;
    await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    await fetchBooks();
  }
  if (e.target.classList.contains('edit')) {
    const id = e.target.dataset.id;
    const res = await fetch(`${apiBase}/${id}`);
    const book = await res.json();
    const form = document.getElementById('book-form');
    form.isbn.value = book.isbn || '';
    form.title.value = book.title || '';
    form.author.value = book.author || '';
    form.category.value = book.category || '';
    form.year.value = book.year || '';
    form.status.value = book.status || 'available';

    // change submit to update
    form.onsubmit = async (ev) => {
      ev.preventDefault();
      const updated = Object.fromEntries(new FormData(form).entries());
      if (updated.year) updated.year = parseInt(updated.year, 10);
      await fetch(`${apiBase}/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updated) });
      form.reset();
      form.onsubmit = null; // reset
      await fetchBooks();
    };
  }
});

fetchBooks();
