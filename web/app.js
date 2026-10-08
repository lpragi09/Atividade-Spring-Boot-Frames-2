const $ = (id) => document.getElementById(id);

const campoUrl = $('baseUrl');
const statusEl = $('status');
const lista = $('lista');
const log = $('log');
const form = $('form');

try {
  const salvo = localStorage.getItem('baseUrl');
  if (salvo) campoUrl.value = salvo;
} catch (e) {}

function baseUrl() {
  return campoUrl.value.trim().replace(/\/+$/, '');
}

async function chamar(metodo, caminho, corpo) {
  const url = baseUrl() + caminho;
  const opcoes = { method: metodo, headers: {} };
  if (corpo) {
    opcoes.headers['Content-Type'] = 'application/json';
    opcoes.body = JSON.stringify(corpo);
  }

  let texto = `${metodo} ${url}\n`;
  if (corpo) texto += JSON.stringify(corpo, null, 2) + '\n';

  try {
    const resp = await fetch(url, opcoes);
    const bruto = await resp.text();
    const dados = bruto ? JSON.parse(bruto) : null;
    texto += `\n← ${resp.status} ${resp.statusText}\n`;
    if (dados !== null) texto += JSON.stringify(dados, null, 2);
    log.textContent = texto;
    return { ok: resp.ok, status: resp.status, dados };
  } catch (erro) {
    texto += `\nFalhou: ${erro.message}\nA API está rodando nesse endereço?`;
    log.textContent = texto;
    throw erro;
  }
}

function formatarData(iso) {
  if (!iso) return 'sem prazo';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

function desenhar(tarefas) {
  lista.innerHTML = '';
  if (!tarefas.length) {
    lista.innerHTML = '<li class="vazio">Nenhuma tarefa cadastrada.</li>';
    return;
  }
  for (const t of tarefas.sort((a, b) => a.id - b.id)) {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="topo"><strong></strong><span class="id">#${t.id}</span></div>
      <p></p>
      <span class="prazo">Prazo: ${formatarData(t.dueDate)}</span>
      <div class="botoes">
        <button type="button" class="secundario" data-acao="ver">GET</button>
        <button type="button" class="secundario" data-acao="editar">Editar</button>
        <button type="button" class="perigo" data-acao="excluir">Excluir</button>
      </div>`;
    li.querySelector('strong').textContent = t.title || '(sem título)';
    li.querySelector('p').textContent = t.description || '';
    li.querySelector('[data-acao="ver"]').onclick = () => chamar('GET', `/tasks/${t.id}`);
    li.querySelector('[data-acao="editar"]').onclick = () => editar(t);
    li.querySelector('[data-acao="excluir"]').onclick = () => excluir(t.id);
    lista.appendChild(li);
  }
}

async function carregar() {
  try {
    const r = await chamar('GET', '/tasks');
    desenhar(r.dados || []);
    statusEl.textContent = 'conectado';
    statusEl.className = 'status ok';
  } catch (e) {
    lista.innerHTML = '<li class="vazio">Não foi possível falar com a API.</li>';
    statusEl.textContent = 'sem conexão';
    statusEl.className = 'status erro';
  }
}

function limparForm() {
  form.reset();
  $('id').value = '';
  $('tituloForm').textContent = 'Nova tarefa';
  $('salvar').textContent = 'Criar (POST)';
  $('cancelar').hidden = true;
}

function editar(t) {
  $('id').value = t.id;
  $('title').value = t.title || '';
  $('description').value = t.description || '';
  $('dueDate').value = t.dueDate || '';
  $('tituloForm').textContent = `Editando #${t.id}`;
  $('salvar').textContent = 'Salvar (PUT)';
  $('cancelar').hidden = false;
  $('title').focus();
}

async function excluir(id) {
  if (!confirm(`Excluir a tarefa #${id}?`)) return;
  try {
    await chamar('DELETE', `/tasks/${id}`);
  } catch (e) {
    return;
  }
  if ($('id').value === String(id)) limparForm();
  const r = await fetch(baseUrl() + '/tasks').then((x) => x.json()).catch(() => null);
  if (r) desenhar(r);
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const id = $('id').value;
  const corpo = {
    title: $('title').value.trim(),
    description: $('description').value.trim(),
    dueDate: $('dueDate').value || null,
  };
  try {
    if (id) await chamar('PUT', `/tasks/${id}`, corpo);
    else await chamar('POST', '/tasks', corpo);
  } catch (e) {
    return;
  }
  limparForm();
  const r = await fetch(baseUrl() + '/tasks').then((x) => x.json()).catch(() => null);
  if (r) desenhar(r);
});

$('cancelar').onclick = limparForm;
$('recarregar').onclick = carregar;

$('conexao').addEventListener('submit', (ev) => {
  ev.preventDefault();
  try { localStorage.setItem('baseUrl', baseUrl()); } catch (e) {}
  carregar();
});

carregar();
