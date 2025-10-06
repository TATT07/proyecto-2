// Proyecto 2 - Bootstrap + JS (mínimo)
const API = 'https://todoapitest.juansegaliz.com/todos';

const el = {
  list: document.getElementById('list'),
  listInfo: document.getElementById('listInfo'),
  msg: document.getElementById('msg'),
  form: document.getElementById('form'),
  id: document.getElementById('id'),
  title: document.getElementById('title'),
  desc: document.getElementById('desc'),
  completed: document.getElementById('completed'),
  clear: document.getElementById('clear')
};

async function request(url, options = {}) {
  try {
    const resp = await fetch(url, options);
    if (resp.status === 204) return null;
    const body = await resp.json();
    if (!resp.ok) throw body;
    return (body && body.data !== undefined) ? body.data : body;
  } catch (err) {
    el.msg.textContent = 'Error: ' + (err.message || JSON.stringify(err));
    console.error(err);
    throw err;
  }
}

async function loadAll() {
  el.listInfo.textContent = 'Cargando...';
  el.list.innerHTML = '';
  try {
    const data = await request(API);
    const todos = Array.isArray(data) ? data : [];
    el.listInfo.textContent = `Total: ${todos.length}`;
    if (!todos.length) {
      el.list.innerHTML = '<li class="list-group-item">No hay tareas</li>';
      return;
    }
    todos.forEach(t => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start';
      li.innerHTML = `
        <div class="ms-2 me-auto">
          <div class="fw-bold ${t.isCompleted ? 'text-decoration-line-through text-muted' : ''}">${escape(t.title)}</div>
          <div class="meta">${escape(t.description || '')}</div>
        </div>
        <div class="btn-group btn-group-sm" role="group" aria-label="actions">
          <button class="btn btn-light btn-sm view" data-id="${t.id}">Ver</button>
          <button class="btn btn-warning btn-sm edit" data-id="${t.id}">Editar</button>
          <button class="btn btn-danger btn-sm del" data-id="${t.id}">Eliminar</button>
        </div>
      `;
      el.list.appendChild(li);
    });
  } catch (e) {
    el.listInfo.textContent = 'Error cargando';
    el.list.innerHTML = '<li class="list-group-item text-danger">Error cargando tareas</li>';
  }
}

async function getOne(id) {
  try {
    const resp = await fetch(`${API}/${id}`);
    const parsed = await resp.json();
    return parsed && parsed.data ? parsed.data : parsed;
  } catch (e) { throw e; }
}

async function createTodo(payload) {
  const body = { title: payload.title, description: payload.description, isCompleted: !!payload.completed };
  const resp = await fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const parsed = await resp.json();
  if (!resp.ok) throw parsed;
  return parsed.data ?? parsed;
}

async function updateTodo(id, payload) {
  const body = { title: payload.title, description: payload.description, isCompleted: !!payload.completed };
  const resp = await fetch(`${API}/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const parsed = await resp.json();
  if (!resp.ok) throw parsed;
  return parsed.data ?? parsed;
}

async function deleteTodo(id) {
  const resp = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!resp.ok) {
    const parsed = await resp.json().catch(()=>null);
    throw parsed || new Error('Error eliminar');
  }
  return null;
}

function escape(s){ return String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

// Events
el.form.addEventListener('submit', async e => {
  e.preventDefault();
  el.msg.textContent = '';
  const payload = { title: el.title.value.trim(), description: el.desc.value.trim(), completed: el.completed.checked };
  if (!payload.title) { el.msg.textContent = 'El título es obligatorio'; return; }
  try {
    if (el.id.value) {
      await updateTodo(el.id.value, payload);
      el.msg.textContent = 'Tarea actualizada';
    } else {
      await createTodo(payload);
      el.msg.textContent = 'Tarea creada';
    }
    el.form.reset();
    el.id.value = '';
    loadAll();
  } catch (err) {
    console.error(err);
    el.msg.textContent = 'Error al guardar';
  }
});

el.clear.addEventListener('click', () => { el.form.reset(); el.id.value=''; el.msg.textContent=''; });

el.list.addEventListener('click', async e => {
  if (!e.target.matches('button')) return;
  const id = e.target.dataset.id;
  if (e.target.classList.contains('view')) {
    try {
      const t = await getOne(id);
      const item = t && t.data ? t.data : t;
      el.msg.textContent = `Ver: ${item.title} — ${item.description || ''} — Completado: ${item.isCompleted}`;
    } catch (e) { el.msg.textContent = 'Error al obtener'; }
  } else if (e.target.classList.contains('edit')) {
    try {
      const t = await getOne(id);
      const item = t && t.data ? t.data : t;
      el.id.value = item.id;
      el.title.value = item.title;
      el.desc.value = item.description || '';
      el.completed.checked = !!item.isCompleted;
      el.msg.textContent = 'Editando...';
    } catch (e) { el.msg.textContent = 'Error al obtener'; }
  } else if (e.target.classList.contains('del')) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await deleteTodo(id);
      el.msg.textContent = 'Tarea eliminada';
      loadAll();
    } catch (e) { el.msg.textContent = 'Error al eliminar'; }
  }
});

// Init
loadAll();
