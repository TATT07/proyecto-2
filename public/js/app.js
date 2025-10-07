const API = 'https://todoapitest.juansegaliz.com';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function req(method, path, body=null) {
  const url = API + path;
  const opts = { method, headers: { Accept: 'application/json' } };
  if (body !== null) { opts.headers['Content-Type']='application/json'; opts.body = JSON.stringify(body); }
  const res = await fetch(url, opts).catch(()=>{ throw new Error('No se pudo conectar'); });
  const txt = await res.text();
  let data = null;
  try { data = txt ? JSON.parse(txt) : null; } catch { data = txt; }
  if (!res.ok) throw new Error((typeof data === 'string') ? data : JSON.stringify(data));
  return (data && data.data !== undefined) ? data.data : (data ?? null);
}

async function load() {
  const ul = $('list'); if (!ul) return;
  ul.innerHTML = '<li>Cargando...</li>';
  try {
    const todos = await req('GET', '/todos') || [];
    if (!todos.length) return ul.innerHTML = '<li>No hay tareas</li>';
    ul.innerHTML = '';
    todos.forEach(t => {
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${esc(t.title)}</strong><div>${esc(t.description||'')}</div></div>
                      <div>
                        <button data-id="${t.id}" class="view">Ver</button>
                        <button data-id="${t.id}" class="edit">Editar</button>
                        <button data-id="${t.id}" class="del">Eliminar</button>
                      </div>`;
      ul.appendChild(li);
    });
  } catch (e) { ul.innerHTML = `<li style="color:red">${esc(e.message)}</li>`; }
}

if ($('form')) $('form').addEventListener('submit', async e => {
  e.preventDefault();
  const id = $('id')?.value || '';
  const title = $('title').value.trim();
  if (!title) return alert('Título requerido');
  const body = { title, description: $('desc')?.value.trim() || '', isCompleted: !!$('completed')?.checked };
  try {
    if (id) await req('PUT', `/todos/${encodeURIComponent(id)}`, body);
    else await req('POST', `/todos`, body);
    $('form').reset(); if ($('id')) $('id').value = '';
    load();
  } catch (err) { alert('Error: ' + err.message); }
});

if ($('list')) $('list').addEventListener('click', async ev => {
  const btn = ev.target.closest('button'); if (!btn) return;
  const id = btn.dataset.id; if (!id) return;
  try {
    if (btn.classList.contains('view')) {
      const it = await req('GET', `/todos/${encodeURIComponent(id)}`);
      alert(`${it.title}\n\n${it.description||''}\n\nCompletado: ${it.isCompleted}`);
    } else if (btn.classList.contains('edit')) {
      const it = await req('GET', `/todos/${encodeURIComponent(id)}`);
      if ($('id')) $('id').value = it.id;
      if ($('title')) $('title').value = it.title || '';
      if ($('desc')) $('desc').value = it.description || '';
      if ($('completed')) $('completed').checked = !!it.isCompleted;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (btn.classList.contains('del')) {
      if (!confirm('Eliminar?')) return;
      await req('DELETE', `/todos/${encodeURIComponent(id)}`);
      load();
    }
  } catch (err) { alert('Error: ' + err.message); }
});

load();
