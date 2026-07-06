const apiBase = 'http://localhost:3000/api/books';
const form = document.getElementById('book-form');
const themeToggle = document.getElementById('theme-toggle');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const messageEl = document.getElementById('message');
let editingId = null;

function showMessage(text, type = 'success') {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  const isDark = theme === 'dark';
  themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('libbook-theme', theme);
}

function statusIcon(status) {
  const normalized = status || 'available';
  if (normalized === 'available') return '✅';
  if (normalized === 'borrowed') return '📖';
  return '🛠️';
}

function resetForm() {
  form.reset();
  editingId = null;
  formTitle.textContent = 'เพิ่มหนังสือใหม่';
  submitBtn.textContent = 'บันทึกหนังสือ';
  cancelBtn.style.display = 'none';
}

function statusBadge(status) {
  const normalized = status || 'available';
  const label = normalized === 'available' ? 'พร้อมให้ยืม' : normalized === 'borrowed' ? 'ถูกยืม' : 'ชำรุด';
  return `<span class="pill ${normalized}">${statusIcon(normalized)} ${label}</span>`;
}

async function fetchBooks() {
  try {
    const tbody = document.querySelector('#books-table tbody');
    tbody.innerHTML = '<tr><td colspan="8"><div class="loading">กำลังโหลดข้อมูล...</div></td></tr>';
    const res = await fetch(apiBase);
    const data = await res.json();
    tbody.innerHTML = '';

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#6b7a90;">ยังไม่มีข้อมูลหนังสือ</td></tr>';
      return;
    }

    data.forEach((b) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${b.id}</td>
        <td>${b.isbn || ''}</td>
        <td>${b.title || ''}</td>
        <td>${b.author || ''}</td>
        <td>${b.category || ''}</td>
        <td>${b.year || ''}</td>
        <td>${statusBadge(b.status)}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary edit" data-id="${b.id}">✏️ แก้ไข</button>
            <button class="btn btn-danger del" data-id="${b.id}">🗑️ ลบ</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    showMessage('ไม่สามารถโหลดข้อมูลได้', 'error');
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if (data.year) data.year = parseInt(data.year, 10);

  try {
    if (editingId !== null) {
      await fetch(`${apiBase}/${editingId}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
      showMessage('อัปเดตหนังสือเรียบร้อยแล้ว');
    } else {
      await fetch(apiBase, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
      showMessage('เพิ่มหนังสือเรียบร้อยแล้ว');
    }

    resetForm();
    await fetchBooks();
  } catch (err) {
    showMessage('บันทึกข้อมูลไม่สำเร็จ', 'error');
  }
});

cancelBtn.addEventListener('click', () => {
  resetForm();
});

document.querySelector('#books-table').addEventListener('click', async (e) => {
  const button = e.target.closest('button');
  if (!button) return;

  const id = Number(button.dataset.id);
  if (!Number.isInteger(id) || id <= 0) {
    showMessage('ไม่พบรหัสหนังสือที่ถูกต้อง', 'error');
    return;
  }

  if (button.classList.contains('del')) {
    try {
      await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
      showMessage('ลบข้อมูลเรียบร้อยแล้ว');
      await fetchBooks();
    } catch (err) {
      showMessage('ลบข้อมูลไม่สำเร็จ', 'error');
    }
  }

  if (button.classList.contains('edit')) {
    try {
      const res = await fetch(`${apiBase}/${id}`);
      const book = await res.json();
      editingId = id;
      formTitle.textContent = 'แก้ไขข้อมูลหนังสือ';
      submitBtn.textContent = 'อัปเดตข้อมูล';
      cancelBtn.style.display = 'inline-block';
      form.isbn.value = book.isbn || '';
      form.title.value = book.title || '';
      form.author.value = book.author || '';
      form.category.value = book.category || '';
      form.year.value = book.year || '';
      form.status.value = book.status || 'available';
      showMessage('กำลังแก้ไขข้อมูลหนังสือ', 'success');
    } catch (err) {
      showMessage('ไม่สามารถโหลดข้อมูลเพื่อแก้ไขได้', 'error');
    }
  }
});

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(nextTheme);
});

const storedTheme = localStorage.getItem('libbook-theme') || 'light';
applyTheme(storedTheme);

fetchBooks();
