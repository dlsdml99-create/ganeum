// 계산식 받기 페이지: 링크 속 계산식을 글자로만 보여 줘요 (화면에 코드로 넣지 않음)
(function () {
  var code = (location.hash || '').slice(1);
  if (!/^[A-Za-z0-9_-]{8,3000}$/.test(code)) return;
  var o;
  try {
    var b64 = code.replace(/-/g, '+').replace(/_/g, '/');
    b64 += '='.repeat((4 - b64.length % 4) % 4);
    var bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    o = JSON.parse(new TextDecoder().decode(bytes));
  } catch (e) { return; }
  if (!o || typeof o.n !== 'string' || typeof o.f !== 'string') return;
  var card = document.getElementById('card');
  card.textContent = '';
  var h = document.createElement('h1'); h.textContent = o.n.slice(0, 24); card.appendChild(h);
  var f = document.createElement('p'); f.className = 'f'; f.textContent = o.f.slice(0, 120); card.appendChild(f);
  if (typeof o.t === 'string') { var n = document.createElement('p'); n.className = 'n'; n.textContent = o.t.slice(0, 80); card.appendChild(n); }
  var page = location.href.split('#')[0].replace(/p\.html$/, '');
  document.getElementById('toApp').href = 'intent://p/' + code + '#Intent;scheme=ganeum;package=com.ganeum.calc;S.browser_fallback_url=' + encodeURIComponent(page) + ';end';
  if (!/Android/i.test(navigator.userAgent)) document.getElementById('toApp').hidden = true;
  document.getElementById('toWeb').href = 'app.html#p=' + code;
  document.getElementById('btns').hidden = false;
  document.getElementById('hint').hidden = false;
})();
