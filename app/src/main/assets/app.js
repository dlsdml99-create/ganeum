(function () {
'use strict';

/* ───── 앱 정보 (버전·업데이트 내용) ───── */
/* preview: 미리보기(게시 페이지)에서는 인터넷을 쓰지 않고 저장 환율로 계산. 앱(APK)에서는 false */
/* 앱(APK) 안에서는 window.Android(폰 기능 연결)가 있다. 웹(github.io)과 앱은 인터넷으로 환율을 받고, 그 밖(미리보기)은 저장 환율만 쓴다 */
const NATIVE = typeof window.Android === 'object' && window.Android ? window.Android : null;
/* 웹앱을 만들 때 빌드 번호(예: 1.10)가 여기에 들어가요. 앱(APK)은 폰에 설치된 버전 번호를 써요 */
const BUILD = '';
const APP = { name: '가늠', version: '', label: '', repo: 'dlsdml99-create/ganeum', preview: !NATIVE && !/github\.io$/.test(location.hostname), shareBase: 'https://dlsdml99-create.github.io/ganeum/' };
APP.web = !NATIVE && !APP.preview;
const NOTES = [
  { v: 'v1.10', d: '2026.11.12', items: [
    '🔒 백업 파일을 비밀번호로 잠글 수 있어요 (선택 · 6글자 이상). 잠근 백업은 비밀번호를 알아야 열려요',
    '🔒 보안 강화: 정해진 파일 말고는 화면에서 실행되지 않게 막고, 인터넷은 환율과 새 버전 확인에만 써요. 바깥 링크는 정해진 안전한 주소만 열고, 폰 자동 백업에서도 빠져요',
    '🔎 찾기: 계산 기록·자주 쓰는 계산·통화 고르기에서 여러 단어로 찾아요 (예: 부가 1.1)',
    '💱 환율 탭에 최근 환산 기록이 생겼어요. 누르면 그 금액으로 다시 계산해요. 해외에 가면 그 나라 통화를 맨 위에 넣어 드려요',
    '👀 처음 쓰는 분을 위해 "예시로 둘러보기"가 생겼어요 (예시는 저장되지 않아요)',
    '✏️ 쉬운 말로 바꿨어요: 프리셋 → 자주 쓰는 계산·계산식, 편집 → 고치기, 삭제 → 지우기, 꾹 → 길게. 기본 계산식과 내가 넣은 계산식을 나눠 보여요',
    '👓 회색 글자를 더 진하게, 작은 버튼을 더 크게 했어요. 환율 탭 위 버튼에 이름을 붙였어요. 버전 정보 창을 다른 앱과 같은 순서·글자 크기로 맞췄어요',
    '📱 아이폰 웹앱 화면이 아주 작게 보이던 문제와 버전 번호가 v1.1로 보이던 문제를 고쳤어요. 웹에서도 "새 버전 확인"이 돼요',
    '0으로 나눈 뒤 숫자를 누르면 새 계산으로 시작해요. 음수는 −5처럼 보여요. 저장 공간이 부족해 저장하지 못하면 알려 드려요'
  ] },
  { v: 'v1.9', d: '2026.11.05', items: ['보안 강화: 앱 화면이 허락된 곳 말고는 스크립트를 불러오지 못하게 막고, 폰의 다른 파일을 읽지 못하게 하고, 업데이트 파일은 이 앱 저장소 주소에서만 받아요'] },
  { v: 'v1.8', d: '2026.11.05', items: ['프리셋 묶음 「한국 단위」: 근↔g(고기 600g·채소 375g), 돈↔g, cm→인치, km→마일, kg→파운드', '왼쪽 아래 버전 → 화면: 밝게·어둡게 직접 고르기, 글자 크게·아주 크게'] },
  { v: 'v1.7', d: '2026.11.05', items: ['내 데이터 백업: 계산 기록·프리셋·통화 목록을 파일로 저장했다가 새 폰에서 불러오기 (왼쪽 아래 버전)'] },
  { v: 'v1.6', d: '2026.11.01', items: ['환율 탭에도 복사 버튼: "100 USD = 133,804원 = 15,788 JPY"처럼 한 번에 복사'] },
  { v: 'v1.5', d: '2026.11.01', items: ['16자리가 넘는 아주 큰 수도 끝자리까지 정확하게 계산해요 (99,999,999×99,999,999 = 9,999,999,800,000,001)', '계산 기록을 길게 누르면 그 계산을 계산식으로 바로 저장해요'] },
  { v: 'v1.4', d: '2026.11.01', items: ['새 버전이 나오면 왼쪽 아래 버전 글자가 노란색으로 바뀌어요', '버전 정보 창을 다른 앱들과 같은 모양으로 맞췄어요'] },
  { v: 'v1.3', d: '2026.11.01', items: ['처음 열 때 예시 숫자 없이 빈 화면으로 시작'] },
  { v: 'v1.2', d: '2026.11.01', items: ['식 속 숫자를 눌러 그 숫자만 고치기, 결과 위 식을 눌러 다시 고치기', '괄호 ( ) 키', '프리셋 묶음 5가지: 여행·쇼핑·부동산·금융·직장인', '프리셋 공유: 카톡으로 보내면 받은 사람이 눌러서 바로 넣기'] },
  { v: 'v1.0', d: '2026.10.31', items: ['계산기, 환율, 계산식 프리셋', '같은 계산을 3번 하면 자주 쓰는 계산으로 자동 추천', '환율 자동 업데이트, 인터넷이 없으면 저장된 환율로 계산'] }
];
try { const v = NATIVE && NATIVE.version(); if (v && /^\d+(\.\d+)*$/.test(v)) APP.version = v; } catch (e) { /* 웹 */ }
if (!APP.version) APP.version = /^\d+(\.\d+)*$/.test(BUILD) ? BUILD : NOTES[0].v.replace(/^v/, '');
APP.label = 'v' + APP.version;
const STORE = 'ganeum-v1';

/*ENGINE-START*/
/* ───── 계산 엔진: eval 없이 직접 해석하는 안전한 계산기 ───── */
class CalcError extends Error {}
const FN = { round: Math.round, floor: Math.floor, ceil: Math.ceil, abs: Math.abs, sqrt: Math.sqrt, min: Math.min, max: Math.max, '반올림': Math.round, '올림': Math.ceil, '내림': Math.floor };
const SYM = { '+': '+', '-': '−', '*': '×', '/': '÷', '^': '^' };
const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const ID0 = /[\p{L}_□㎀-㏿]/u;
const ID1 = /[\p{L}\p{N}\p{M}_□㎀-㏿]/u;
const NUM = /^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/;

function normalize(src) {
  return String(src)
    .replace(/[×✕✖∗＊]/g, '*').replace(/[÷／]/g, '/')
    .replace(/[−–—‒﹣－]/g, '-').replace(/＋/g, '+')
    .replace(/（/g, '(').replace(/）/g, ')').replace(/％/g, '%')
    .replace(/(\d),(?=\d{3}(?!\d))/g, '$1');
}

function tokenize(src) {
  const s = normalize(src), out = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if ((c >= '0' && c <= '9') || c === '.') {
      const m = NUM.exec(s.slice(i));
      if (!m) throw new CalcError('숫자를 확인해 주세요');
      i += m[0].length;
      if (s[i] === '.') throw new CalcError('소수점이 두 번 들어갔어요');
      out.push({ t: 'n', v: parseFloat(m[0]), raw: m[0] });
      continue;
    }
    if ('+-*/^'.includes(c)) { out.push({ t: 'o', v: c }); i++; continue; }
    if ('()%,'.includes(c)) { out.push({ t: c }); i++; continue; }
    if (ID0.test(c)) {
      let j = i + 1;
      while (j < s.length && ID1.test(s[j])) j++;
      out.push({ t: 'id', v: s.slice(i, j) });
      i = j;
      continue;
    }
    throw new CalcError(`'${c}' 기호는 쓸 수 없어요`);
  }
  return out;
}

function parse(tokens) {
  let i = 0;
  const peek = () => tokens[i];
  const isOp = (t, ops) => !!t && t.t === 'o' && ops.includes(t.v);
  const close = () => { if (!(peek() && peek().t === ')')) throw new CalcError('괄호가 닫히지 않았어요'); i++; };
  function expr() {
    let n = term();
    while (isOp(peek(), '+-')) { const op = tokens[i++].v; n = { k: 'b', op, l: n, r: term() }; }
    return n;
  }
  function term() {
    let n = unary();
    for (;;) {
      const p = peek();
      if (isOp(p, '*/')) { i++; n = { k: 'b', op: p.v, l: n, r: unary() }; continue; }
      if (p && (p.t === '(' || p.t === 'n' || p.t === 'id')) {
        const pt = tokens[i - 1] && tokens[i - 1].t;
        const ok = p.t === '(' || (p.t === 'id' && (pt === 'n' || pt === ')' || pt === '%')) || (p.t === 'n' && (pt === ')' || pt === '%'));
        if (!ok) throw new CalcError('숫자나 이름 사이에 + − × ÷ 기호가 필요해요');
        n = { k: 'b', op: '*', l: n, r: unary() };
        continue;
      }
      return n;
    }
  }
  function unary() {
    const p = peek();
    if (isOp(p, '+-')) { i++; const a = unary(); return p.v === '-' ? { k: 'neg', a } : a; }
    return power();
  }
  function power() {
    const b = postfix();
    if (isOp(peek(), '^')) { i++; return { k: 'b', op: '^', l: b, r: unary() }; }
    return b;
  }
  function postfix() {
    let n = primary();
    while (peek() && peek().t === '%') { i++; n = { k: 'pct', a: n }; }
    return n;
  }
  function primary() {
    const p = tokens[i++];
    if (!p) throw new CalcError('식이 덜 끝났어요');
    if (p.t === 'n') return { k: 'n', v: p.v, raw: p.raw };
    if (p.t === 'id') {
      const f = p.v.toLowerCase();
      if (hasOwn(FN, f) && peek() && peek().t === '(') {
        i++;
        const args = [];
        if (!(peek() && peek().t === ')')) {
          args.push(expr());
          while (peek() && peek().t === ',') { i++; args.push(expr()); }
        }
        close();
        return { k: 'f', f, args };
      }
      return { k: 'v', name: p.v };
    }
    if (p.t === '(') { const n = expr(); close(); return n; }
    if (p.t === ')') throw new CalcError('괄호 짝이 맞지 않아요');
    throw new CalcError('식을 확인해 주세요');
  }
  if (!tokens.length) throw new CalcError('식이 비어 있어요');
  const ast = expr();
  if (i < tokens.length) throw new CalcError(tokens[i].t === ')' ? '괄호 짝이 맞지 않아요' : '식을 확인해 주세요');
  return ast;
}

/* 0.1 + 0.2 = 0.3 처럼 덧셈·뺄셈의 부동소수점 찌꺼기를 지운다 */
function fixAdd(v, a, b) {
  const m = Math.max(Math.abs(a), Math.abs(b));
  if (!isFinite(v) || m === 0 || v === 0) return v;
  const d = 14 - Math.floor(Math.log10(m));
  if (d <= 0 || d > 300) return v;
  const p = Math.pow(10, d), r = Math.round(v * p) / p;
  return isFinite(r) ? r : v;
}

function ev(n, vars) {
  switch (n.k) {
    case 'n': return n.v;
    case 'v': {
      if (!vars || !hasOwn(vars, n.name)) throw new CalcError(`‘${n.name}’ 값을 넣어 주세요`);
      const x = vars[n.name];
      if (typeof x !== 'number' || !isFinite(x)) throw new CalcError(`‘${n.name}’ 값을 넣어 주세요`);
      return x;
    }
    case 'neg': return -ev(n.a, vars);
    case 'pct': return ev(n.a, vars) / 100;
    case 'f': {
      if (!n.args.length) throw new CalcError('괄호 안에 값이 필요해요');
      return FN[n.f].apply(null, n.args.map(a => ev(a, vars)));
    }
    case 'b': {
      const l = ev(n.l, vars);
      if ((n.op === '+' || n.op === '-') && n.r.k === 'pct') {
        const d = l * ev(n.r.a, vars) / 100;
        return fixAdd(n.op === '+' ? l + d : l - d, l, d);
      }
      const r = ev(n.r, vars);
      switch (n.op) {
        case '+': return fixAdd(l + r, l, r);
        case '-': return fixAdd(l - r, l, r);
        case '*': return l * r;
        case '/': if (r === 0) throw new CalcError('0으로 나눌 수 없어요'); return l / r;
        case '^': return Math.pow(l, r);
      }
    }
  }
  throw new CalcError('식을 확인해 주세요');
}

function finish(x) {
  if (typeof x !== 'number' || isNaN(x)) throw new CalcError('계산할 수 없는 식이에요');
  if (!isFinite(x)) throw new CalcError('숫자가 너무 커요');
  const r = +x.toPrecision(15);
  return r === 0 ? 0 : r;
}

const _cache = new Map();
function compile(src) {
  let c = _cache.get(src);
  if (!c) {
    const ast = parse(tokenize(src)), vars = [];
    (function walk(n) {
      if (!n) return;
      if (n.k === 'v') { if (!vars.includes(n.name)) vars.push(n.name); return; }
      walk(n.l); walk(n.r); walk(n.a);
      if (n.args) n.args.forEach(walk);
    })(ast);
    c = { ast, vars };
    if (_cache.size > 300) _cache.clear();
    _cache.set(src, c);
  }
  return c;
}
function calc(src, vars) { return finish(ev(compile(src).ast, vars || {})); }

/* 아주 큰 수(15자리 넘음)는 보통 계산으로는 끝자리가 틀려서, 덧셈·뺄셈·곱셈·나누어떨어지는 나눗셈은
   자릿수 제한 없는 정수(BigInt)로 다시 계산해 정확한 값을 글자로 돌려준다. 못 하면 null */
function exactCalc(src) {
  if (typeof BigInt !== 'function') return null;
  const T = BigInt(10);
  const dec = (raw) => { const m = /^(\d*)(?:\.(\d*))?$/.exec(raw || ''); if (!m) return null; const f = m[2] || ''; return { i: BigInt((m[1] || '0') + f), s: f.length }; };
  const up = (a, s) => ({ i: a.i * T ** BigInt(s - a.s), s });
  const al = (a, b) => { const s = Math.max(a.s, b.s); return [up(a, s), up(b, s), s]; };
  const div = (a, b) => {
    if (b.i === BigInt(0)) return null;
    for (let k = 0; k <= 20; k++) { const num = a.i * T ** BigInt(b.s + k), den = b.i * T ** BigInt(a.s); if (num % den === BigInt(0)) return { i: num / den, s: k }; }
    return null;
  };
  const go = (n) => {
    if (!n) return null;
    switch (n.k) {
      case 'n': return dec(n.raw);
      case 'neg': { const a = go(n.a); return a && { i: -a.i, s: a.s }; }
      case 'pct': { const a = go(n.a); return a && { i: a.i, s: a.s + 2 }; }
      case 'b': {
        const l = go(n.l); if (!l) return null;
        if ((n.op === '+' || n.op === '-') && n.r.k === 'pct') {
          const q = go(n.r.a); if (!q) return null;
          const d = { i: l.i * q.i, s: l.s + q.s + 2 }, [x, y, s] = al(l, d);
          return { i: n.op === '+' ? x.i + y.i : x.i - y.i, s };
        }
        const r = go(n.r); if (!r) return null;
        if (n.op === '+' || n.op === '-') { const [x, y, s] = al(l, r); return { i: n.op === '+' ? x.i + y.i : x.i - y.i, s }; }
        if (n.op === '*') return { i: l.i * r.i, s: l.s + r.s };
        if (n.op === '/') return div(l, r);
        if (n.op === '^' && r.s === 0 && r.i >= BigInt(0) && r.i <= BigInt(64)) return { i: l.i ** r.i, s: l.s * Number(r.i) };
        return null;
      }
    }
    return null;
  };
  let v;
  try { v = go(compile(src).ast); } catch (e) { return null; }
  if (!v) return null;
  const neg = v.i < BigInt(0); let d = (neg ? -v.i : v.i).toString();
  if (v.s > 0) { d = d.padStart(v.s + 1, '0'); d = d.slice(0, -v.s) + '.' + d.slice(-v.s); d = d.replace(/0+$/, '').replace(/\.$/, ''); }
  if (d.replace('.', '').length > 40) return null;
  return (neg && d !== '0' ? '-' : '') + d;
}

/* 입력 중인 식: 끝의 연산자를 떼고, 괄호를 닫아서 미리 계산 */
function tryEval(s) {
  if (!s) return null;
  let t = s.replace(/[+\-*/^(.]+$/, '');
  if (!t || t === '-') return null;
  const open = (t.match(/\(/g) || []).length - (t.match(/\)/g) || []).length;
  if (open > 0) t += ')'.repeat(open);
  try { return calc(t); } catch (e) { return null; }
}

/* 키패드 입력 규칙 (null = 무시) */
function applyKey(s, k) {
  const last = s.slice(-1);
  const curNum = () => (s.match(/[0-9.]*$/) || [''])[0];
  const openCount = t => (t.match(/\(/g) || []).length - (t.match(/\)/g) || []).length;
  /* ( ) 한 키: 열린 괄호가 있고 숫자 뒤면 닫고, 아니면 연다 */
  if (k === '()') k = openCount(s) > 0 && /[0-9)%]/.test(last) ? ')' : '(';
  if (k === '(') {
    if (last === '.') s = s.slice(0, -1);
    return /[0-9)%]$/.test(s) ? s + '*(' : s + '(';
  }
  if (k === ')') {
    if (last === '.') s = s.slice(0, -1);
    return openCount(s) > 0 && /[0-9)%]$/.test(s) ? s + ')' : null;
  }
  if (/^\d$/.test(k) || k === '00') {
    if (last === ')' || last === '%') s += '*';
    const c = curNum();
    if (k === '00' && (c === '' || c === '0')) k = '0';
    if (c === '0') { if (k === '0') return s; s = s.slice(0, -1); }
    if (c.replace('.', '').length + k.length > 15) return null;
    return s + k;
  }
  if (k === '.') {
    const c = curNum();
    if (c.includes('.')) return null;
    if (last === ')' || last === '%') s += '*';
    return s + (c === '' ? '0.' : '.');
  }
  if ('+-*/'.includes(k) && k.length === 1) {
    if (s === '') return k === '-' ? '-' : null;
    if (last === '(') return k === '-' ? s + '-' : null;
    if ('+-*/'.includes(last)) {
      if (k === '-' && (last === '*' || last === '/')) return s + '-';
      const base = s.replace(/[+\-*/]+$/, '');
      if (base === '' || base.slice(-1) === '(') return k === '-' ? base + '-' : null;
      return base + k;
    }
    if (last === '.') s = s.slice(0, -1);
    return s + k;
  }
  if (k === '%') {
    if (/[0-9)]/.test(last)) return s + '%';
    if (last === '.') return s.slice(0, -1) + '%';
    return null;
  }
  return null;
}

/* ───── 숫자 표시 ───── */
const NF = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 10 });
function fmt(x) {
  if (x == null || !isFinite(x)) return '–';
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e16 || a < 1e-10)) return x.toExponential(5).replace(/\.?0+e/, 'e').replace('e+', 'e');
  return NF.format(x).replace(/^-/, '−');
}
function fmtMoney(x, d) {
  if (x == null || !isFinite(x)) return '–';
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e16) return fmt(x);
  if (a < 1) return x.toLocaleString('ko-KR', { maximumSignificantDigits: 3 }).replace(/^-/, '−');
  const p = Math.pow(10, d), r = Math.round(x * p) / p;
  const frac = d > 0 && Math.abs(r - Math.round(r)) > 1e-9;
  return r.toLocaleString('ko-KR', { minimumFractionDigits: frac ? d : 0, maximumFractionDigits: d }).replace(/^-/, '−');
}
function groupNum(t) {
  const m = /^(\d*)(\.\d*)?([eE].*)?$/.exec(t);
  if (!m) return t;
  const ip = m[1].length > 3 ? m[1].replace(/\B(?=(\d{3})+(?!\d))/g, ',') : m[1];
  return ip + (m[2] || '') + (m[3] ? m[3].replace('-', '−').replace('+', '') : '');
}
/* 받침이 있으면 '을', 없으면 '를' (숫자·영어 끝도 읽는 소리로) */
function eul(w) {
  const t = String(w).trim().replace(/[\s'"’‘)\]]+$/, ''), c = t.slice(-1);
  if (!c) return '을';
  const code = c.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 ? '을' : '를';
  if (/\d/.test(c)) return '013678'.includes(c) ? '을' : '를';
  if (/[a-z]/i.test(c)) return 'lmnr'.includes(c.toLowerCase()) ? '을' : '를';
  return '을';
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
/* 내부 식(12900*3) → 보기 좋은 식(12,900×3) */
function prettyExpr(s, html) {
  let out = '', m;
  const re = /(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+)|([+\-*/^])|([\s\S])/g;
  while ((m = re.exec(s))) {
    if (m[1]) out += groupNum(m[1]);
    else if (m[2]) out += html ? '<span class="op">' + SYM[m[2]] + '</span>' : SYM[m[2]];
    else out += html ? esc(m[3]) : m[3];
  }
  return out;
}
/* 프리셋 계산식 → 띄어쓰기 맞춘 보기 좋은 식 */
function prettyFormula(f) {
  let toks;
  try { toks = tokenize(f); } catch (e) { return String(f); }
  let out = '', prev = null;
  for (const t of toks) {
    if (t.t === 'n') out += fmt(t.v);
    else if (t.t === 'id') out += t.v;
    else if (t.t === 'o') {
      const unary = (t.v === '-' || t.v === '+') && (!prev || prev.t === 'o' || prev.t === '(' || prev.t === ',');
      out += unary ? SYM[t.v] : ' ' + SYM[t.v] + ' ';
    } else if (t.t === ',') out += ', ';
    else out += t.t;
    prev = t;
  }
  return out.replace(/\s+/g, ' ').trim();
}
/* 1234567 → 123만 4,567 */
function korUnits(x) {
  if (x == null || !isFinite(x)) return '';
  const n = Math.floor(Math.abs(x));
  if (n < 10000 || n >= 1e16) return '';
  const U = ['', '만', '억', '조'], parts = [];
  let v = n, i = 0;
  while (v > 0 && i < U.length) {
    const c = v % 10000;
    if (c) parts.unshift(c.toLocaleString('ko-KR') + U[i]);
    v = Math.floor(v / 10000); i++;
  }
  return (x < 0 ? '−' : '') + parts.join(' ');
}
/*ENGINE-END*/

/* ───── 통화 [이름, 국기, 소수 자릿수, 원화 표시 단위] ───── */
const CUR = {
  KRW: ['한국 원', '🇰🇷', 0, 1], USD: ['미국 달러', '🇺🇸', 2, 1], JPY: ['일본 엔', '🇯🇵', 0, 100], EUR: ['유로', '🇪🇺', 2, 1], CNY: ['중국 위안', '🇨🇳', 2, 1],
  HKD: ['홍콩 달러', '🇭🇰', 2, 1], TWD: ['대만 달러', '🇹🇼', 2, 1], VND: ['베트남 동', '🇻🇳', 0, 100], THB: ['태국 바트', '🇹🇭', 2, 1], PHP: ['필리핀 페소', '🇵🇭', 2, 1],
  SGD: ['싱가포르 달러', '🇸🇬', 2, 1], MYR: ['말레이시아 링깃', '🇲🇾', 2, 1], IDR: ['인도네시아 루피아', '🇮🇩', 0, 100], GBP: ['영국 파운드', '🇬🇧', 2, 1], AUD: ['호주 달러', '🇦🇺', 2, 1],
  CAD: ['캐나다 달러', '🇨🇦', 2, 1], NZD: ['뉴질랜드 달러', '🇳🇿', 2, 1], CHF: ['스위스 프랑', '🇨🇭', 2, 1], INR: ['인도 루피', '🇮🇳', 2, 1], MNT: ['몽골 투그릭', '🇲🇳', 0, 1],
  AED: ['UAE 디르함', '🇦🇪', 2, 1], TRY: ['튀르키예 리라', '🇹🇷', 2, 1], RUB: ['러시아 루블', '🇷🇺', 2, 1], MXN: ['멕시코 페소', '🇲🇽', 2, 1], BRL: ['브라질 헤알', '🇧🇷', 2, 1],
  SEK: ['스웨덴 크로나', '🇸🇪', 2, 1], NOK: ['노르웨이 크로네', '🇳🇴', 2, 1], DKK: ['덴마크 크로네', '🇩🇰', 2, 1], CZK: ['체코 코루나', '🇨🇿', 2, 1], HUF: ['헝가리 포린트', '🇭🇺', 0, 1],
  PLN: ['폴란드 즈워티', '🇵🇱', 2, 1], KHR: ['캄보디아 리엘', '🇰🇭', 0, 100], LAK: ['라오스 킵', '🇱🇦', 0, 100], MOP: ['마카오 파타카', '🇲🇴', 2, 1], UZS: ['우즈베키스탄 숨', '🇺🇿', 0, 100],
  KZT: ['카자흐스탄 텡게', '🇰🇿', 2, 1], NPR: ['네팔 루피', '🇳🇵', 2, 1], LKR: ['스리랑카 루피', '🇱🇰', 2, 1], MMK: ['미얀마 짯', '🇲🇲', 0, 1], ILS: ['이스라엘 셰켈', '🇮🇱', 2, 1],
  SAR: ['사우디 리얄', '🇸🇦', 2, 1], QAR: ['카타르 리얄', '🇶🇦', 2, 1], EGP: ['이집트 파운드', '🇪🇬', 2, 1], ZAR: ['남아공 랜드', '🇿🇦', 2, 1], CLP: ['칠레 페소', '🇨🇱', 0, 1],
  ARS: ['아르헨티나 페소', '🇦🇷', 2, 1], PEN: ['페루 솔', '🇵🇪', 2, 1], COP: ['콜롬비아 페소', '🇨🇴', 0, 1], ISK: ['아이슬란드 크로나', '🇮🇸', 0, 1]
};
/* 인터넷이 없을 때 쓰는 저장 환율 (1달러 기준, 2026-10-30 09:02 KST) */
const RATE_SNAPSHOT = { at: 1793318551000, src: 'er', r: {
  USD: 1, KRW: 1338.041489, JPY: 157.881601, EUR: 0.895934, CNY: 6.676858, HKD: 7.846081, TWD: 32.55178, VND: 25792.38678, THB: 33.734156, PHP: 63.813809,
  SGD: 1.280873, MYR: 4.059557, IDR: 18150.373413, GBP: 0.749154, AUD: 1.422859, CAD: 1.398868, NZD: 1.777818, CHF: 0.826113, INR: 95.292116, MNT: 3612.300435,
  AED: 3.6725, TRY: 49.917487, RUB: 80.572954, MXN: 18.833591, BRL: 5.362061, SEK: 9.866495, NOK: 9.266066, DKK: 6.71395, CZK: 21.827169, HUF: 327.833216,
  PLN: 3.937333, KHR: 4066.609151, LAK: 22371.798811, MOP: 8.081468, UZS: 11986.508283, KZT: 452.944731, NPR: 152.471738, LKR: 332.165068, MMK: 2098.455541, ILS: 3.115141,
  SAR: 3.75, QAR: 3.64, EGP: 56.042101, ZAR: 16.618705, CLP: 987.71255, ARS: 1539.593, PEN: 3.4535, COP: 3164.112219, ISK: 121.942023
} };
/* 환율 받는 곳 (앞에서부터 차례로 시도) */
const readFa = j => {
  if (!j || !j.usd) return null;
  const r = { USD: 1 };
  for (const k in j.usd) { const K = k.toUpperCase(); if (hasOwn(CUR, K)) r[K] = j.usd[k]; }
  return { r, at: Date.parse(j.date + 'T00:00:00Z') || Date.now() };
};
const RATE_SOURCES = [
  { id: 'er', url: 'https://open.er-api.com/v6/latest/USD', read: j => (j && j.result === 'success' && j.rates) ? { r: j.rates, at: j.time_last_update_unix * 1000 } : null },
  { id: 'fa', url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json', read: readFa },
  { id: 'fa', url: 'https://latest.currency-api.pages.dev/v1/currencies/usd.min.json', read: readFa }
];

/* 폰 시간대 → 그 나라 통화 (해외에 가면 환율 탭 맨 위에 넣어 줘요) */
const TZ_CUR = { 'Asia/Tokyo': 'JPY', 'Asia/Shanghai': 'CNY', 'Asia/Chongqing': 'CNY', 'Asia/Harbin': 'CNY', 'Asia/Urumqi': 'CNY', 'Asia/Hong_Kong': 'HKD', 'Asia/Taipei': 'TWD',
  'Asia/Ho_Chi_Minh': 'VND', 'Asia/Saigon': 'VND', 'Asia/Bangkok': 'THB', 'Asia/Manila': 'PHP', 'Asia/Singapore': 'SGD', 'Asia/Kuala_Lumpur': 'MYR', 'Asia/Kuching': 'MYR',
  'Asia/Jakarta': 'IDR', 'Asia/Makassar': 'IDR', 'Asia/Jayapura': 'IDR', 'Asia/Pontianak': 'IDR', 'Europe/London': 'GBP', 'Pacific/Auckland': 'NZD', 'Europe/Zurich': 'CHF',
  'Asia/Kolkata': 'INR', 'Asia/Calcutta': 'INR', 'Asia/Ulaanbaatar': 'MNT', 'Asia/Dubai': 'AED', 'Europe/Istanbul': 'TRY', 'Europe/Moscow': 'RUB', 'America/Mexico_City': 'MXN',
  'America/Cancun': 'MXN', 'America/Tijuana': 'MXN', 'America/Sao_Paulo': 'BRL', 'Europe/Stockholm': 'SEK', 'Europe/Oslo': 'NOK', 'Europe/Copenhagen': 'DKK', 'Europe/Prague': 'CZK',
  'Europe/Budapest': 'HUF', 'Europe/Warsaw': 'PLN', 'Asia/Phnom_Penh': 'KHR', 'Asia/Vientiane': 'LAK', 'Asia/Macau': 'MOP', 'Asia/Tashkent': 'UZS', 'Asia/Samarkand': 'UZS',
  'Asia/Almaty': 'KZT', 'Asia/Kathmandu': 'NPR', 'Asia/Colombo': 'LKR', 'Asia/Yangon': 'MMK', 'Asia/Rangoon': 'MMK', 'Asia/Jerusalem': 'ILS', 'Asia/Riyadh': 'SAR', 'Asia/Qatar': 'QAR',
  'Africa/Cairo': 'EGP', 'Africa/Johannesburg': 'ZAR', 'America/Santiago': 'CLP', 'America/Argentina/Buenos_Aires': 'ARS', 'America/Buenos_Aires': 'ARS', 'America/Lima': 'PEN',
  'America/Bogota': 'COP', 'Atlantic/Reykjavik': 'ISK', 'Pacific/Honolulu': 'USD', 'Pacific/Guam': 'USD', 'Pacific/Saipan': 'USD', 'America/Toronto': 'CAD', 'America/Vancouver': 'CAD',
  'America/Edmonton': 'CAD', 'America/Winnipeg': 'CAD', 'America/Halifax': 'CAD', 'America/Montreal': 'CAD' };
const EURO_TZ = ['Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Brussels', 'Vienna', 'Lisbon', 'Athens', 'Dublin', 'Helsinki', 'Luxembourg', 'Monaco', 'Bratislava', 'Ljubljana', 'Tallinn', 'Riga', 'Vilnius', 'Malta', 'Zagreb', 'Nicosia', 'Vatican', 'San_Marino', 'Andorra'];
function tzCode() {
  let tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ['', '']; }
  let c = TZ_CUR[tz];
  if (!c && /^Europe\//.test(tz) && EURO_TZ.includes(tz.slice(7))) c = 'EUR';
  if (!c && /^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Indiana\/.+|Kentucky\/.+)$/.test(tz)) c = 'USD';
  if (!c && /^Australia\//.test(tz)) c = 'AUD';
  return [tz, c || ''];
}

const BUILTIN = [
  { id: 'b-vat', name: '부가세 포함', f: '금액 × 1.1', pin: true },
  { id: 'b-net', name: '부가세 빼기', f: '금액 ÷ 1.1', pin: true, note: '부가세 10%를 뺀 공급가액' },
  { id: 'b-off', name: '할인가', f: '가격 × (1 − 할인율 ÷ 100)', vals: { '할인율': 30 }, chip: '할인 {할인율}%', pin: true },
  { id: 'b-split', name: 'N빵', f: '금액 ÷ 인원', vals: { '인원': 4 }, chip: 'N빵 ÷{인원}', pin: true },
  { id: 'b-py', name: '평 → 제곱미터', f: '평 × 3.305785', pin: true },
  { id: 'b-m2', name: '제곱미터 → 평', f: '제곱미터 × 0.3025', pin: false },
  { id: 'b-chg', name: '증감률 %', f: '(이후 − 이전) ÷ 이전 × 100', order: ['이전', '이후'], pin: false, note: '이전 값보다 몇 % 오르거나 내렸는지' },
  { id: 'b-unit', name: '100g당 가격', f: '가격 ÷ 용량 × 100', vals: { '용량': 500 }, chip: '100g당 ({용량}g)', pin: false, note: 'ml로 넣어도 똑같이 계산돼요' },
  { id: 'b-tip', name: '팁 포함', f: '금액 × (1 + 팁 ÷ 100)', vals: { '팁': 15 }, chip: '팁 {팁}%', pin: false },
  { id: 'b-int', dp: 0, name: '예금 이자', f: '원금 × 연이율 ÷ 100 × 개월 ÷ 12 × 0.846', vals: { '연이율': 3, '개월': 12 }, chip: '이자 {연이율}% {개월}개월', pin: false, note: '단리, 이자소득세 15.4%를 뺀 금액' }
];

/* ───── 프리셋 묶음 (눌러서 한 번에 넣기) ───── */
const PACKS = [
  { id: 'trip', name: '여행', desc: '화씨·마일·파운드 같은 해외 단위', items: [
    { id: 'k-f2c', name: '화씨 → 섭씨', f: '(화씨 − 32) × 5 ÷ 9' },
    { id: 'k-c2f', name: '섭씨 → 화씨', f: '섭씨 × 9 ÷ 5 + 32' },
    { id: 'k-mi', name: '마일 → km', f: '마일 × 1.609344' },
    { id: 'k-lb', name: '파운드 → kg', f: '파운드 × 0.45359237' },
    { id: 'k-oz', name: '온스 → g', f: '온스 × 28.349523' },
    { id: 'k-in', name: '인치 → cm', f: '인치 × 2.54' },
    { id: 'k-gal', name: '갤런 → L', f: '갤런 × 3.785412', note: '미국 갤런 기준' }
  ] },
  { id: 'unit', name: '한국 단위', desc: '근·돈·평·인치를 g·㎡·cm로, 거꾸로도', items: [
    { id: 'k-geun', name: '근 → g (고기)', f: '근 × 600', note: '고기 한 근 = 600g' },
    { id: 'k-g2geun', name: 'g → 근 (고기)', f: '그램 ÷ 600' },
    { id: 'k-geunv', name: '근 → g (채소·과일)', f: '근 × 375', note: '채소·과일 한 근 = 375g' },
    { id: 'k-don', name: '돈 → g (금)', f: '돈 × 3.75', note: '금 한 돈 = 3.75g' },
    { id: 'k-g2don', name: 'g → 돈 (금)', f: '그램 ÷ 3.75' },
    { id: 'k-cm2in', name: 'cm → 인치', f: '센티 ÷ 2.54', note: 'TV·모니터·바지 사이즈' },
    { id: 'k-km2mi', name: 'km → 마일', f: '킬로미터 ÷ 1.609344' },
    { id: 'k-kg2lb', name: 'kg → 파운드', f: '킬로그램 ÷ 0.45359237' }
  ] },
  { id: 'shop', name: '쇼핑', desc: '개당 가격, 할인에 추가 할인', items: [
    { id: 'k-each', name: '개당 가격', f: '가격 ÷ 개수' },
    { id: 'k-dd', name: '할인 + 추가 할인', f: '가격 × (1 − 할인율 ÷ 100) × (1 − 추가할인 ÷ 100)', vals: { '할인율': 30, '추가할인': 10 }, chip: '할인 {할인율}%+{추가할인}%', note: '30% 할인 뒤 10% 더 할인하면 40%가 아니라 37% 할인이에요' },
    { id: 'k-rate', name: '몇 % 할인인지', f: '(정가 − 판매가) ÷ 정가 × 100', order: ['정가', '판매가'] },
    { id: 'k-pt', name: '적립 빼면 실제 가격', f: '가격 × (1 − 적립률 ÷ 100)', vals: { '적립률': 5 }, chip: '적립 {적립률}% 빼면' },
    { id: 'k-2p1', name: '2+1 한 개 값', f: '가격 × 2 ÷ 3', note: '한 개 가격을 넣으면 3개 살 때 한 개당 값' }
  ] },
  { id: 'home', name: '부동산', desc: '보증금↔월세 전환, 평당 가격', items: [
    { id: 'k-j2w', dp: 0, name: '보증금 → 월세', f: '보증금 × 전환율 ÷ 100 ÷ 12', note: '전환율(%)은 계약마다 달라요. 법정 상한은 한국은행 기준금리 + 2%' },
    { id: 'k-w2j', dp: 0, name: '월세 → 보증금', f: '월세 × 12 ÷ 전환율 × 100', note: '월세를 보증금으로 바꾸면 얼마인지' },
    { id: 'k-ppy', name: '평당 가격', f: '가격 ÷ 평' }
  ] },
  { id: 'money', name: '금융', desc: '대출 월 상환액, 적금 만기, 할부', items: [
    { id: 'k-loan', dp: 0, name: '대출 월 상환액', f: '대출금 × 연이율 ÷ 1200 × (1 + 연이율 ÷ 1200) ^ 개월 ÷ ((1 + 연이율 ÷ 1200) ^ 개월 − 1)', vals: { '연이율': 4, '개월': 360 }, chip: '대출 {연이율}% {개월}개월', note: '원리금균등, 매달 같은 금액을 갚는 방식' },
    { id: 'k-sav', dp: 0, name: '적금 만기 금액', f: '월납입 × 개월 + 월납입 × 개월 × (개월 + 1) ÷ 2 × 연이율 ÷ 1200 × 0.846', vals: { '연이율': 3.5, '개월': 12 }, chip: '적금 {연이율}% {개월}개월', note: '단리, 이자소득세 15.4%를 뺀 금액' },
    { id: 'k-yld', name: '수익률 %', f: '(판매가 − 구매가) ÷ 구매가 × 100', order: ['구매가', '판매가'] },
    { id: 'k-inst', dp: 0, name: '할부 한 달 금액', f: '금액 ÷ 개월', vals: { '개월': 3 }, chip: '{개월}개월 할부', note: '무이자 할부 기준' }
  ] },
  { id: 'work', name: '직장인', desc: '시급↔월급, 일당, 연장 수당', items: [
    { id: 'k-h2m', dp: 0, name: '시급 → 월급', f: '시급 × 209', note: '주 40시간 + 주휴수당, 한 달 209시간 기준' },
    { id: 'k-m2h', dp: 0, name: '월급 → 시급', f: '월급 ÷ 209', note: '한 달 209시간 기준' },
    { id: 'k-y2m', dp: 0, name: '연봉 → 월급', f: '연봉 ÷ 12', note: '세금·4대보험을 빼기 전 금액' },
    { id: 'k-day', dp: 0, name: '일당', f: '시급 × 시간', vals: { '시간': 8 }, chip: '일당 {시간}시간' },
    { id: 'k-ot', dp: 0, name: '연장 근무 수당', f: '시급 × 1.5 × 시간', vals: { '시간': 2 }, chip: '연장 {시간}시간', note: '시급의 1.5배' }
  ] }
];

const sv = (d, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  x: sv('<path d="M6 6l12 12M18 6L6 18"/>'),
  star: sv('<path d="M12 3.6l2.55 5.17 5.7.83-4.12 4.02.97 5.68L12 16.6l-5.1 2.7.97-5.68L3.75 9.6l5.7-.83z"/>'),
  edit: sv('<path d="M4 20h4.2L19.3 8.9a2.2 2.2 0 0 0-3.1-3.1L5 16.9V20z"/><path d="M14.5 7.5l3 3"/>'),
  swap: sv('<path d="M7 4L3.5 7.5 7 11M3.5 7.5H17M17 13l3.5 3.5L17 20M20.5 16.5H7"/>'),
  plus: sv('<path d="M12 5v14M5 12h14"/>', 2.2),
  share: sv('<path d="M12 14.5V3.5M7.5 8L12 3.5 16.5 8"/><path d="M5 12.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6.5"/>'),
  check: sv('<path d="M5 12.5l4.2 4.2L19 7"/>', 2.8)
};
const CLOSE = `<button class="iconbtn x" type="button" data-act="close" aria-label="닫기">${ICON.x}</button>`;

/* ───── 상태 저장·불러오기 (이 기기에만 저장) ───── */
const clone = o => JSON.parse(JSON.stringify(o));
function defaults() {
  return {
    v: 1, tab: 'calc',
    calc: { expr: '', done: false, prev: null },
    fx: { list: ['KRW', 'USD', 'JPY', 'EUR', 'CNY'], active: 'USD', expr: '', done: false },
    cx: { on: true, from: 'KRW', to: 'USD' },
    rates: { r: clone(RATE_SNAPSHOT.r), at: RATE_SNAPSHOT.at, src: RATE_SNAPSHOT.src, got: 0 },
    presets: clone(BUILTIN), learned: {}, hist: [], fxHist: [], tz: '', upd: 0
  };
}
const HIST_MAX = 200;
function load() {
  const o = defaults();
  let s = null;
  try { s = JSON.parse(localStorage.getItem(STORE) || localStorage.getItem('ddoksem-v1') || 'null'); } catch (e) { s = null; }
  if (!s || s.v !== 1) return o;
  try {
    if (['calc', 'fx', 'preset'].includes(s.tab)) o.tab = s.tab;
    if (s.calc && typeof s.calc.expr === 'string') {
      const pv = s.calc.prev;
      o.calc = { expr: s.calc.expr.slice(0, 120), done: !!s.calc.done, prev: pv && (typeof pv.e === 'string' || typeof pv.l === 'string') ? pv : null };
    }
    if (s.fx && Array.isArray(s.fx.list)) {
      const list = s.fx.list.filter(c => hasOwn(CUR, c));
      if (list.length) {
        o.fx.list = list;
        o.fx.active = list.includes(s.fx.active) ? s.fx.active : list[0];
        o.fx.expr = typeof s.fx.expr === 'string' ? s.fx.expr.slice(0, 120) : '';
        o.fx.done = !!s.fx.done;
      }
    }
    if (s.cx && hasOwn(CUR, s.cx.from) && hasOwn(CUR, s.cx.to)) o.cx = { on: s.cx.on !== false, from: s.cx.from, to: s.cx.to };
    if (s.rates && s.rates.r && s.rates.r.KRW > 0 && s.rates.r.USD > 0 && s.rates.at >= o.rates.at) o.rates = s.rates;
    if (Array.isArray(s.presets)) o.presets = s.presets.filter(p => p && typeof p.f === 'string' && typeof p.name === 'string' && typeof p.id === 'string').slice(0, 100);
    if (s.learned && typeof s.learned === 'object') o.learned = s.learned;
    if (Array.isArray(s.hist)) o.hist = s.hist.filter(h => h && typeof h.r === 'number').slice(-HIST_MAX);
    if (Array.isArray(s.fxHist)) o.fxHist = s.fxHist.filter(h => h && typeof h.a === 'number' && isFinite(h.a) && hasOwn(CUR, h.c)).slice(0, 12);
    if (typeof s.tz === 'string') o.tz = s.tz.slice(0, 60);
    o.presets.forEach(p => { if (p.id === 'b-py' && p.name === '평 → ㎡') p.name = '평 → 제곱미터'; if (p.id === 'b-m2' && p.name === '㎡ → 평') p.name = '제곱미터 → 평'; });
    if (typeof s.upd === 'number') o.upd = s.upd;
    if (o.calc.expr === '38700' && o.calc.prev && o.calc.prev.e === '12900*3') o.calc = { expr: '', done: false, prev: null };
    if (o.fx.expr === '100' && o.fx.done && o.fx.active === 'USD') { o.fx.expr = ''; o.fx.done = false; }
  } catch (e) { return defaults(); }
  return o;
}
const S = load();
let saveTimer = 0;
let bkLock = false;
let saveWarned = 0, DEMO = null;
function flush() {
  clearTimeout(saveTimer);
  if (bkLock || DEMO) return;
  try { const c = Object.assign({}, S, { calc: Object.assign({}, S.calc, { err: undefined }) }); localStorage.setItem(STORE, JSON.stringify(c)); saveWarned = 0; } catch (e) { saveFail(); }
}
/* 저장 공간이 꽉 차서 저장하지 못하면 조용히 넘어가지 않고 알려 줘요 (1분에 한 번만) */
function saveFail() {
  if (Date.now() - saveWarned < 60e3) return;
  saveWarned = Date.now();
  setTimeout(() => toast('폰 저장 공간이 부족해서 저장하지 못했어요. 공간을 비운 뒤 다시 해 주세요'), 0);
}
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(flush, 250); }
function changed() { save(); render(); }

/* ───── 화면 요소 ───── */
const $ = (sel, root) => (root || document).querySelector(sel);
const el = {
  vCalc: $('#vCalc'), vFx: $('#vFx'), vPreset: $('#vPreset'), hist: $('#hist'), histIn: $('#histIn'),
  prevline: $('#prevline'), expr: $('#expr'), preview: $('#preview'), meta: $('#meta'),
  fxstatus: $('#fxstatus'), fxlist: $('#fxlist'), fxRefresh: $('#fxRefresh'), fxAdd: $('#fxAdd'), plist: $('#plist'), pQ: $('#pQ'), newPreset: $('#newPreset'),
  pad: $('#pad'), strip: $('#strip'), keys: $('#keys'), tabs: $('#tabs'), ver: $('#ver'),
  toast: $('#toast'), sheetWrap: $('#sheetWrap'), sheet: $('#sheet')
};
el.ver.textContent = APP.label;

/* ───── 환율 도우미 ───── */
const curDec = c => (hasOwn(CUR, c) ? CUR[c][2] : 2);
const money = (x, c) => fmtMoney(x, curDec(c));
function conv(x, a, b) {
  const R = S.rates.r;
  if (x == null || !R[a] || !R[b]) return null;
  return x / R[a] * R[b];
}
function roundCur(x, c) {
  if (x == null || !isFinite(x)) return x;
  if (x !== 0 && Math.abs(x) < 1) return +x.toPrecision(4);
  const p = Math.pow(10, curDec(c));
  return Math.round(x * p) / p;
}

/* ───── 입력 ───── */
const editor = () => (S.tab === 'fx' ? S.fx : S.calc);
const edValue = ed => (ed.expr ? tryEval(ed.expr) : null);

function clearCur() { S.calc.cur = null; S.calc.sel = null; }
function press(k) {
  const ed = editor(), isCalc = ed === S.calc;
  const hadErr = isCalc && !!S.calc.err;
  if (isCalc) S.calc.err = '';
  if (hadErr && (/^\d$/.test(k) || k === '00' || k === '.')) { ed.expr = ''; ed.done = false; S.calc.prev = null; clearCur(); }
  const mid = isCalc && !ed.done && (ed.sel || ed.cur != null);
  if (k === '=') { if (isCalc) clearCur(); return equals(ed); }
  if (k === 'AC') { ed.expr = ''; ed.done = false; if (isCalc) { S.calc.prev = null; clearCur(); } return changed(); }
  if (mid) return pressMid(k);
  if (k === 'BS') { ed.expr = ed.expr.slice(0, -1); ed.done = false; if (isCalc) S.calc.prev = null; return changed(); }
  const fresh = ed.done && (/^\d$/.test(k) || k === '00' || k === '.');
  const out = applyKey(fresh ? '' : ed.expr, k);
  if (out == null) return;
  if (out.length > 120) return toast('식이 너무 길어요');
  ed.expr = out; ed.done = false;
  if (isCalc) S.calc.prev = null;
  changed();
}

/* 식 중간(누른 숫자나 커서 자리)에서 입력 */
function pressMid(k) {
  const c = S.calc, s = c.expr;
  const a = c.sel ? c.sel[0] : c.cur, b = c.sel ? c.sel[1] : c.cur;
  let left = s.slice(0, a), right = s.slice(b);
  if (k === 'BS') {
    if (!c.sel) left = left.slice(0, -1);
  } else {
    /* 고른 숫자는 숫자 키로 바꾸고, 기호 키면 그 숫자 뒤에 넣는다 */
    if (c.sel && !(/^\d$/.test(k) || k === '00' || k === '.')) { left = s.slice(0, b); right = s.slice(b); }
    const out = applyKey(left, k);
    if (out == null) return;
    left = out;
  }
  const ne = left + right;
  if (ne.length > 120) return toast('식이 너무 길어요');
  c.expr = ne; c.sel = null; c.cur = left.length >= ne.length ? null : left.length;
  c.prev = null;
  changed();
}

function equals(ed) {
  const isCalc = ed === S.calc;
  if (ed.done || !ed.expr) return;
  let s = ed.expr.replace(/[+\-*/^(.]+$/, '');
  const open = (s.match(/\(/g) || []).length - (s.match(/\)/g) || []).length;
  if (open > 0) s += ')'.repeat(open);
  if (!s || s === '-') return;
  let r;
  try { r = calc(s); } catch (e) {
    if (isCalc) { S.calc.err = e.message || '계산할 수 없어요'; renderCalc(); } else toast(e.message || '계산할 수 없어요');
    return;
  }
  const plain = !/[+\-*/%^(]/.test(s.replace(/^-/, ''));
  if (!isCalc) r = roundCur(r, S.fx.active);
  if (!isCalc) setTimeout(fxRemember, 0);
  const xs = isCalc && Math.abs(r) >= 1e15 ? exactCalc(s) : null;
  if (isCalc && !plain) { S.calc.prev = { e: s }; pushHist(xs ? { e: s, r, xs } : { e: s, r }); learn(s); }
  ed.expr = xs || String(r); ed.done = true;
  changed();
}

/* 프리셋·자주 쓴 계산 결과를 화면에 넣고, 되돌리기 함수를 돌려준다 */
function commit(ed, r, meta) {
  const isCalc = ed === S.calc;
  const before = { expr: ed.expr, done: ed.done, prev: isCalc ? S.calc.prev : null };
  if (isCalc) clearCur();
  if (!isCalc) r = roundCur(r, S.fx.active);
  ed.expr = String(r); ed.done = true;
  let entry = null;
  if (isCalc) {
    S.calc.prev = meta.e ? { e: meta.e } : { l: meta.l, x: meta.x };
    entry = Object.assign({}, meta, { r });
    pushHist(entry);
  }
  changed();
  return function undo() {
    ed.expr = before.expr; ed.done = before.done;
    if (isCalc) {
      S.calc.prev = before.prev;
      const i = S.hist.lastIndexOf(entry);
      if (i >= 0) S.hist.splice(i, 1);
    }
    changed();
  };
}

function pushHist(h) {
  h.t = Date.now();
  S.hist.push(h);
  if (S.hist.length > HIST_MAX) S.hist.splice(0, S.hist.length - HIST_MAX);
}

/* 같은 꼬리 계산(예: ×1.1+3000)을 세다가 3번이면 칩으로 올린다 */
const LEARN_RE = /^(\d+(?:\.\d+)?)([+\-*/].*)$/;
function learn(s) {
  const m = LEARN_RE.exec(s);
  if (!m || m[2].length > 40) return;
  const tail = m[2];
  try { compile('□' + tail); } catch (e) { return; }
  const L = S.learned;
  const it = hasOwn(L, tail) ? L[tail] : (L[tail] = { n: 0, t: 0 });
  it.n++; it.t = Date.now();
  const keys = Object.keys(L);
  if (keys.length > 40) {
    keys.sort((a, b) => (L[a].n - L[b].n) || (L[a].t - L[b].t));
    keys.slice(0, keys.length - 40).forEach(k => { delete L[k]; });
  }
  if (it.n === 3 && !it.hide) setTimeout(() => toast(`자주 하는 계산(${prettyExpr(tail)})을 칩으로 올렸어요`), 50);
}

/* ───── 프리셋 ───── */
const varLabel = v => (v === '□' ? '값' : v);
function presetInfo(p) {
  try {
    let vars = compile(p.f).vars.slice();
    if (Array.isArray(p.order)) vars = p.order.filter(v => vars.includes(v)).concat(vars.filter(v => !p.order.includes(v)));
    return { vars, primary: vars[0], secondary: vars.slice(1) };
  } catch (e) { return { err: e.message, vars: [], secondary: [] }; }
}
function chipLabel(p, vals) {
  vals = vals || p.vals || {};
  if (p.chip) return p.chip.replace(/\{([^}]+)\}/g, (m, v) => (typeof vals[v] === 'number' ? fmt(vals[v]) : '?'));
  return p.name;
}
/* 원 단위 프리셋은 결과를 반올림 (dp = 소수 자릿수) */
const presetRound = (p, r) => (typeof p.dp === 'number' && isFinite(r) ? Math.round(r * Math.pow(10, p.dp)) / Math.pow(10, p.dp) : r);
/* 기록에 남길 이름: 직접 만든 프리셋은 미리 채운 값도 같이 (예: 택배비 포함 · 배송비 3,000) */
function recLabel(p, vals) {
  if (p.chip) return chipLabel(p, vals);
  const sec = presetInfo(p).secondary.filter(v => typeof vals[v] === 'number');
  return sec.length ? p.name + ' · ' + sec.map(v => varLabel(v) + ' ' + fmt(vals[v])).join(', ') : p.name;
}

function chipTap(btn) {
  if (btn.dataset.more) return setTab('preset');
  const ed = editor(), x = edValue(ed);
  if (btn.dataset.auto != null) {
    const tail = btn.dataset.auto;
    if (x == null) return toast('먼저 숫자를 넣어 주세요');
    let r;
    try { r = calc('□' + tail, { '□': x }); } catch (e) { return toast(e.message); }
    const L = S.learned[tail];
    if (L) { L.n++; L.t = Date.now(); }
    const undo = commit(ed, r, { e: String(x) + tail });
    return toast('자주 쓴 계산 적용', ['되돌리기', undo]);
  }
  const p = S.presets.find(q => q.id === btn.dataset.pid);
  if (!p) return;
  const info = presetInfo(p);
  if (info.err) return sheetPresetEdit(p);
  const vals = Object.assign({}, p.vals);
  /* 나머지 값이 다 채워져 있으면 창 없이 바로 계산 (값은 알림의 '값 바꾸기'로 고침) */
  if (info.secondary.some(v => typeof vals[v] !== 'number')) return sheetPresetCalc(p, x);
  if (info.vars.length && x == null) return toast('먼저 숫자를 넣어 주세요');
  if (info.primary) vals[info.primary] = x;
  let r;
  try { r = presetRound(p, calc(p.f, vals)); } catch (e) { return sheetPresetCalc(p, x); }
  const label = chipLabel(p, vals);
  const undo = commit(ed, r, { l: recLabel(p, vals), x: info.primary ? x : null });
  const where = ed === S.fx ? ` · ${S.fx.active} 금액에 계산했어요` : '';
  if (info.secondary.length) toast(label + ' 적용' + where, ['값 바꾸기', () => { undo(); sheetPresetCalc(p, x); }]);
  else toast(label + ' 적용' + where, ['되돌리기', undo]);
}

function keepLearned(k) {
  S.presets.push({ id: 'u' + Date.now().toString(36), name: prettyExpr(k), f: prettyFormula('□' + k), vals: {}, pin: true });
  if (S.learned[k]) S.learned[k].hide = true;
  changed();
  toast('계산식으로 저장했어요 · 계산기 칩에 나와요');
}

function lastLearnable() {
  for (let i = S.hist.length - 1; i >= 0; i--) {
    const h = S.hist[i];
    const m = h.e && LEARN_RE.exec(h.e);
    if (m) { try { compile('□' + m[2]); return { e: h.e, tail: m[2] }; } catch (e) { /* 다음 기록 */ } }
  }
  return null;
}

/* ───── 찾기: 띄어 쓴 단어가 모두 들어 있으면 보여 줘요 (대소문자·쉼표·띄어쓰기 무시) ───── */
const qNorm = t => String(t || '').toLowerCase().replace(/[,\s]+/g, '').replace(/[−–]/g, '-').replace(/×/g, '*').replace(/÷/g, '/');
function qMatch(q, text) {
  const words = String(q || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const t = qNorm(text);
  return words.every(w => t.includes(qNorm(w)));
}
const histText = h => (h.e ? prettyExpr(h.e) + ' ' + h.e : (h.x != null ? fmt(h.x) + ' ' : '') + (h.l || '')) + ' ' + (h.xs || fmt(h.r)) + ' ' + h.r;

/* ───── 화면 그리기 ───── */
function setTab(t) {
  if (S.tab === t) return;
  if (S.tab === 'fx') fxRemember();
  S.tab = t;
  changed();
  if (t === 'fx') { autoRefresh(); tzCurrency(); }
}

function render() {
  const t = S.tab;
  el.tabs.querySelectorAll('[data-tab]').forEach(b => {
    if (b.dataset.tab === t) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  el.vCalc.hidden = t !== 'calc';
  el.vFx.hidden = t !== 'fx';
  el.vPreset.hidden = t !== 'preset';
  el.pad.hidden = t === 'preset';
  if (t === 'calc') renderCalc(); else if (t === 'fx') renderFX(); else renderPresets();
  if (t !== 'preset') renderStrip();
}

/* 입력 중인 식: 숫자마다 눌러서 고를 수 있게 칸을 나누고, 커서를 그린다 */
const CARET = '<i class="caret" aria-hidden="true"></i>';
function exprHTML(s, cur, sel) {
  const re = /(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+)|([+\-*/^])|([\s\S])/g;
  let out = '', m, placed = cur == null;
  while ((m = re.exec(s))) {
    const a = m.index, b = a + m[0].length;
    if (!placed && cur <= a) { out += CARET; placed = true; }
    if (m[1]) out += `<span class="tn${sel && sel[0] === a ? ' sel' : ''}" data-a="${a}" data-b="${b}">${groupNum(m[1])}</span>`;
    else if (m[2]) out += `<span class="op" data-a="${a}" data-b="${b}">${SYM[m[2]]}</span>`;
    else out += `<span data-a="${a}" data-b="${b}">${esc(m[3])}</span>`;
    if (!placed && cur < b) { out += CARET; placed = true; }
  }
  return out;
}

function sizeClass(n) { return n <= 9 ? 50 : n <= 12 ? 44 : n <= 15 ? 38 : n <= 19 ? 32 : n <= 25 ? 27 : 23; }

function renderCalc() {
  renderHist();
  const c = S.calc;
  let val = null;
  if (c.done) {
    val = c.expr ? tryEval(c.expr) : null;
    const canFix = !!(c.prev && c.prev.e);
    el.prevline.innerHTML = c.prev ? (c.prev.e ? prettyExpr(c.prev.e, true) : esc((c.prev.x != null ? fmt(c.prev.x) + ' → ' : '') + c.prev.l)) + ' =' + (canFix ? '<span class="fix">고치기</span>' : '') : '';
    el.prevline.classList.toggle('can', canFix);
    /* 큰 수를 정확히 계산한 결과(글자)는 그대로 쉼표만 넣어 보여 준다 */
    const exact = val != null && Math.abs(val) >= 1e15 && /^-?\d+(\.\d+)?$/.test(c.expr) && c.expr.replace(/^-|\./g, '').length > 15;
    const txt = val == null ? '0' : exact ? (c.expr[0] === '-' ? '−' + groupNum(c.expr.slice(1)) : groupNum(c.expr)) : fmt(val);
    el.expr.textContent = txt;
    el.expr.classList.add('done');
    el.expr.style.setProperty('--fs', sizeClass(txt.length) + 'px');
    el.preview.textContent = '';
    el.preview.className = 'preview';
  } else {
    el.prevline.textContent = '';
    el.prevline.classList.remove('can');
    el.expr.classList.remove('done');
    const shown = c.expr ? prettyExpr(c.expr) : '0';
    el.expr.innerHTML = c.expr ? exprHTML(c.expr, c.cur, c.sel) : '<span class="ph">0</span>';
    el.expr.style.setProperty('--fs', sizeClass(shown.length) + 'px');
    if (c.err) {
      el.preview.textContent = c.err;
      el.preview.className = 'preview err';
    } else {
      val = c.expr ? tryEval(c.expr) : null;
      const hasOp = /[+\-*/%^(]/.test(c.expr.replace(/^-/, ''));
      el.preview.textContent = hasOp && val != null ? '= ' + fmt(val) : '';
      el.preview.className = 'preview';
    }
  }
  renderMeta(val);
}

let histSig = '';
function renderHist() {
  const H = S.hist.slice(-40);
  const sig = S.hist.length + ':' + (H.length ? H[H.length - 1].t : 0);
  if (sig === histSig) return;
  histSig = sig;
  if (!H.length) {
    el.histIn.innerHTML = '<div class="tips"><b>이렇게 쓰면 편해요</b><span>아래 칩을 누르면 부가세·할인·N빵이 바로 계산돼요</span><span>식 속 숫자를 누르면 그 숫자만 고칠 수 있어요</span><span>같은 계산을 3번 하거나 기록을 길게 누르면 자주 쓰는 계산이 돼요</span><span>결과 숫자를 누르면 복사, ⌫를 길게 누르면 모두 지우기</span><button class="tryex" type="button" data-act="demo">예시로 둘러보기</button></div>';
    return;
  }
  const off = S.hist.length - H.length;
  el.histIn.innerHTML = '<div class="hbar">' + (DEMO ? '' : '<button class="hclear" type="button" data-act="hclear">기록 지우기</button>') + `<button class="hclear" type="button" data-act="hfind">🔎 기록 찾기${S.hist.length > H.length ? ` (전체 ${S.hist.length}개)` : ''}</button></div>` + H.map((h, i) =>
    `<button class="hrow" type="button" data-hi="${off + i}"><span>${h.e ? prettyExpr(h.e, true) : esc((h.x != null ? fmt(h.x) + ' → ' : '') + h.l)}</span><b>= ${esc(h.xs ? (h.xs[0] === '-' ? '−' + groupNum(h.xs.slice(1)) : groupNum(h.xs)) : fmt(h.r))}</b></button>`).join('');
  el.hist.scrollTop = el.hist.scrollHeight;
}

function renderMeta(val) {
  const cx = S.cx;
  if (val == null || val === 0 || !isFinite(val)) { el.meta.innerHTML = ''; return; }
  let h = '';
  if (cx.from === 'KRW') { const k = korUnits(val); if (k) h += `<span class="kor">${k}원</span>`; }
  if (cx.on && cx.from !== cx.to) {
    const cv = conv(val, cx.from, cx.to);
    if (cv != null) {
      const txt = cx.to === 'KRW' ? (korUnits(cv) || money(cv, 'KRW')) + '원' : money(cv, cx.to) + ' ' + cx.to;
      h += `<button class="cxbtn" type="button" data-act="cx" aria-label="환율 표시 바꾸기"><small>${cx.from}→</small>≈ ${esc(txt)}</button><button class="cxswap" type="button" data-act="cxswap" aria-label="통화 방향 바꾸기">${ICON.swap}</button>`;
    }
  } else {
    h += '<button class="cxbtn off" type="button" data-act="cx">환율 보기</button>';
  }
  el.meta.innerHTML = h;
}

let stripSig = '';
function renderStrip() {
  const L = S.learned;
  const autos = Object.keys(L).filter(k => L[k].n >= 3 && !L[k].hide).sort((a, b) => (L[b].n - L[a].n) || (L[b].t - L[a].t)).slice(0, 3);
  const pins = S.presets.filter(p => p.pin);
  const parts = autos.map(k => `<button class="chip auto" type="button" data-auto="${esc(k)}"><i class="coin" aria-hidden="true"></i>${esc(prettyExpr(k))}</button>`)
    .concat(pins.map(p => `<button class="chip" type="button" data-pid="${esc(p.id)}">${esc(chipLabel(p))}</button>`));
  parts.push(`<button class="chip more" type="button" data-more="1">${parts.length ? '고치기' : '계산식 넣기'}</button>`);
  const html = parts.join('');
  if (html !== stripSig) { stripSig = html; el.strip.innerHTML = html; }
  stripMore();
}
/* 칩이 화면 밖까지 있으면 오른쪽에 › 표시 */
function stripMore() {
  const st = el.strip, m = $('#smore');
  if (m) m.hidden = !(st.scrollWidth - st.clientWidth - st.scrollLeft > 6);
}

let fxBusy = false;
function renderFxStatus() {
  const d = new Date(S.rates.at), p2 = n => String(n).padStart(2, '0');
  const when = `${d.getMonth() + 1}월 ${d.getDate()}일 ${p2(d.getHours())}:${p2(d.getMinutes())} 기준`;
  const fresh = S.rates.got && Date.now() - S.rates.got < 864e5;
  el.fxstatus.innerHTML = `<i class="dot${fresh ? ' live' : ''}" aria-hidden="true"></i>${fxBusy ? '최신 환율 받는 중…' : when + (fresh ? ' · 자동 업데이트' : APP.preview ? ' · 미리보기용 저장 환율' : ' · 저장된 환율')}`;
  el.fxRefresh.classList.toggle('spin', fxBusy);
}

/* 환율 탭도 계산기처럼 결과를 복사: "100 USD = 133,804원 = 15,788 JPY …" */
function fxText() {
  const fx = S.fx, v = edValue(fx);
  if (v == null || !isFinite(v) || v === 0) return null;
  return fx.list.map(c => money(conv(v, fx.active, c), c) + ' ' + (c === 'KRW' ? '원' : c)).join(' = ').replace(/ 원/g, '원');
}
function renderFX() {
  renderFxStatus();
  const fx = S.fx;
  if (!fx.list.includes(fx.active)) fx.active = fx.list[0];
  const v = edValue(fx), base = v == null ? 0 : v;
  const sc = el.fxlist.scrollTop;
  const credit = S.rates.src === 'fa'
    ? '환율 정보 출처: <a href="https://github.com/fawazahmed0/exchange-api" target="_blank" rel="noopener">Exchange API</a>'
    : '환율 정보 출처: <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener">Rates By Exchange Rate API</a>';
  el.fxlist.innerHTML = fx.list.map(c => {
    const info = CUR[c], on = c === fx.active;
    let amt, len;
    if (on) {
      amt = (fx.expr ? prettyExpr(fx.expr, true) : '<span class="ph">0</span>') + '<i class="caret" aria-hidden="true"></i>';
      len = fx.expr ? prettyExpr(fx.expr).length + 2 : 1;
    } else {
      const t = money(conv(base, fx.active, c), c);
      amt = esc(t); len = t.length;
    }
    const sz = len > 17 ? ' s' : len > 12 ? ' m' : '';
    const rate = c === 'KRW' ? '' : `<span class="rate">${info[3]} ${c} = ${money(conv(info[3], c, 'KRW'), 'KRW')}원</span>`;
    return `<li class="fxrow${on ? ' on' : ''}" data-code="${c}" role="button" tabindex="0" aria-label="${info[0]}${on ? ' 입력 중' : ''}"><span class="flag" aria-hidden="true">${info[1]}</span><span class="cinfo"><span class="code">${c}</span><span class="cname">${info[0]}</span></span><span class="cval"><span class="amt${sz}">${amt}</span>${rate}</span></li>`;
  }).join('') + `<li class="fxfoot">${S.fxHist.length ? `<p class="sect" style="margin:6px 0 2px">최근 환산<small>누르면 그 금액으로 다시 계산해요</small></p><div class="fxrecent">${S.fxHist.map((h, i) => `<button class="chip" type="button" data-fh="${i}">${CUR[h.c][1]} ${esc(money(h.a, h.c))} ${h.c === 'KRW' ? '원' : h.c}</button>`).join('')}</div>` : ''}<button class="addcur" type="button" data-act="cur">${ICON.plus}통화 추가·빼기</button><p class="credit">${credit} · 하루 한 번 바뀌는 기준 환율이라, 은행에서 실제로 바꿀 땐 수수료만큼 차이가 나요.</p></li>`;
  el.fxlist.scrollTop = sc;
}

/* 환율 탭에서 계산한 금액을 '최근 환산'에 남겨요 (같은 금액은 맨 앞으로, 12개까지) */
function fxRemember() {
  if (DEMO) return;
  const fx = S.fx, v = edValue(fx);
  if (v == null || !isFinite(v) || v === 0) return;
  const a = roundCur(v, fx.active), L = S.fxHist;
  const i = L.findIndex(h => h.c === fx.active && h.a === a);
  if (i === 0) return;
  if (i > 0) L.splice(i, 1);
  L.unshift({ a, c: fx.active, t: Date.now() });
  if (L.length > 12) L.length = 12;
  save();
  if (S.tab === 'fx') renderFX();
}
function fxSelect(code, force) {
  const fx = S.fx;
  if (code === fx.active && !force) return;
  const v = edValue(fx);
  const nv = v == null ? null : conv(v, fx.active, code);
  fx.active = code;
  fx.expr = nv == null ? '' : String(roundCur(nv, code));
  fx.done = true;
  changed();
}

function renderPresets() {
  const L = S.learned;
  const autos = Object.keys(L).filter(k => L[k].n >= 2 && !L[k].hide).sort((a, b) => L[b].n - L[a].n).slice(0, 8);
  const sc = el.plist.scrollTop;
  const q = el.pQ ? el.pQ.value : '';
  const autosQ = autos.filter(k => qMatch(q, prettyExpr(k) + ' ' + k));
  let h = q && !autosQ.length ? '' : '<p class="sect">알아서 찾은 계산<small>같은 계산을 3번 하면 올라와요</small></p>';
  h += autosQ.length ? autosQ.map(k => `<div class="prow lrow"><div class="pmain"><span class="pname"><i class="coin" aria-hidden="true"></i>${esc(prettyExpr(k))}</span><span class="pnote">${L[k].n}번 계산함 · ${L[k].n >= 3 ? '계산기 칩에 나와요' : '한 번 더 하면 칩에 나와요'}</span></div><div class="pact"><button class="btn sec sm" type="button" data-act="keep" data-k="${esc(k)}">저장</button><button class="iconbtn" type="button" data-act="hide" data-k="${esc(k)}" aria-label="숨기기">${ICON.x}</button></div></div>`).join('')
    : q ? '' : '<p class="empty">같은 계산을 3번 하면 여기와 계산기 칩에 자동으로 올라와요. 예를 들어 가격마다 × 1.1 + 3,000을 계속 계산하면 칩 하나로 끝나요.</p>';
  if (!q) h += '<p class="sect">계산식 묶음<small>눌러서 한 번에 넣기</small></p><div class="packs">' + PACKS.map(k => {
    const n = k.items.filter(i => S.presets.some(p => p.id === i.id)).length;
    return `<button class="pack" type="button" data-act="pack" data-pk="${k.id}"><b>${k.name}</b><span>${k.desc}</span><small>${n ? `${n}/${k.items.length}개 넣음` : `${k.items.length}개`}</small></button>`;
  }).join('') + '<button class="pack imp" type="button" data-act="import"><b>공유받은 계산식</b><span>카톡으로 받은 링크를 붙여 넣어 넣기</span><small>붙여 넣기</small></button></div>';
  const isB = p => /^b-/.test(p.id);
  const row = p => `<div class="prow"><button class="pmain" type="button" data-act="pcalc" data-pid="${esc(p.id)}"><span class="pname">${esc(p.name)}</span><span class="pform">${esc(prettyFormula(p.f))}</span>${p.note ? `<span class="pnote">${esc(p.note)}</span>` : ''}</button><div class="pact"><button class="iconbtn star" type="button" data-act="pin" data-pid="${esc(p.id)}" aria-pressed="${!!p.pin}" aria-label="계산기 칩에 표시">${ICON.star}</button><button class="iconbtn" type="button" data-act="pshare" data-pid="${esc(p.id)}" aria-label="공유">${ICON.share}</button><button class="iconbtn" type="button" data-act="pedit" data-pid="${esc(p.id)}" aria-label="고치기">${ICON.edit}</button></div></div>`;
  const shown = S.presets.filter(p => qMatch(q, p.name + ' ' + prettyFormula(p.f) + ' ' + p.f + ' ' + (p.note || '')));
  const mine = shown.filter(p => !isB(p)), base = shown.filter(isB);
  if (!q || mine.length) h += '<p class="sect">내가 넣은 계산식<small>★ 켜면 계산기 칩에 보여요</small></p>';
  h += mine.length ? mine.map(row).join('') : q ? '' : '<p class="empty">아직 없어요. 위의 ‘새 계산식’으로 만들거나, 계산 기록을 길게 눌러 만들어 보세요.</p>';
  if (base.length) h += '<p class="sect">기본 계산식<small>가늠에 들어 있는 계산이에요</small></p>' + base.map(row).join('');
  if (q && !autosQ.length && !shown.length) h += `<p class="qnone">‘${esc(q)}’${eul(q)} 찾지 못했어요. 다른 단어로 찾아 보세요.</p>`;
  if (!q && BUILTIN.some(b => !S.presets.find(p => p.id === b.id))) h += '<button class="linkbtn" type="button" data-act="restore">기본 계산식 다시 넣기</button>';
  el.plist.innerHTML = h;
  el.plist.scrollTop = sc;
}

/* ───── 아래에서 올라오는 창 ───── */
let sheetOpen = false, lastFocus = null;
function openSheet(html, mount) {
  lastFocus = document.activeElement;
  el.sheet.innerHTML = '<div class="sheet-in">' + html + '</div>';
  el.sheet.scrollTop = 0;
  el.sheetWrap.hidden = false;
  sheetOpen = true;
  requestAnimationFrame(() => requestAnimationFrame(() => el.sheetWrap.classList.add('on')));
  if (mount) mount(el.sheet.firstElementChild);
  try { el.sheet.focus({ preventScroll: true }); } catch (e) { /* 무시 */ }
}
function closeSheet() {
  if (!sheetOpen) return;
  sheetOpen = false;
  el.sheetWrap.classList.remove('on');
  setTimeout(() => { if (!sheetOpen) { el.sheetWrap.hidden = true; el.sheet.innerHTML = ''; } }, 200);
  if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* 무시 */ } }
}

function sheetPresetCalc(p, x0) {
  const info = presetInfo(p);
  if (info.err) return sheetPresetEdit(p);
  const fromPreset = S.tab === 'preset', target = S.tab === 'fx' ? S.fx : S.calc;
  const xv = x0 != null ? x0 : edValue(target);
  const vals = Object.assign({}, p.vals);
  if (info.primary && xv != null) vals[info.primary] = xv;
  const fields = info.vars.map((v, i) => `<div class="field"><label for="pv${i}">${esc(varLabel(v))}${i === 0 && xv != null ? `<small>${S.tab === 'fx' ? '환율 화면 값' : '계산기 값'}</small>` : ''}</label><input class="inp" id="pv${i}" data-var="${esc(v)}" inputmode="decimal" autocomplete="off" enterkeyhint="done" value="${typeof vals[v] === 'number' ? esc(String(vals[v])) : ''}"></div>`).join('');
  openSheet(`<div class="grab"></div>
    <div class="shead"><div><h2>${esc(p.name)}</h2>${p.note ? `<p class="hint">${esc(p.note)}</p>` : ''}</div>${CLOSE}</div>
    <p class="pform">${esc(prettyFormula(p.f))}</p>
    ${fields}
    <div class="res"><span>결과</span><b id="pres">–</b></div>
    <div class="btns"><button class="btn sec" type="button" data-act="pcopy">복사</button><button class="btn pri" type="button" data-act="papply">${S.tab === 'fx' ? '환율에 넣기' : '계산기에 넣기'}</button></div>`, sh => {
    const inputs = Array.from(sh.querySelectorAll('input[data-var]'));
    const out = $('#pres', sh);
    let result = null, cur = {};
    const upd = () => {
      cur = {}; let bad = '';
      inputs.forEach(inp => {
        const raw = inp.value.trim(), name = varLabel(inp.dataset.var);
        if (!raw) { bad = bad || `${name} 값을 넣어 주세요`; return; }
        try { cur[inp.dataset.var] = calc(raw); } catch (e) { bad = bad || `${name}: ${e.message}`; }
      });
      if (!bad) { try { result = presetRound(p, calc(p.f, cur)); } catch (e) { bad = e.message; } }
      if (bad) { result = null; out.textContent = bad; out.className = 'bad'; } else { out.textContent = fmt(result); out.className = ''; }
    };
    inputs.forEach(i => i.addEventListener('input', upd));
    upd();
    $('[data-act="papply"]', sh).addEventListener('click', () => {
      if (result == null) { const empty = inputs.find(i => !i.value.trim()); if (empty) empty.focus(); return; }
      /* 미리 채워 둔 값(할인율·인원·배송비 등)만 이번 값으로 기억. 계산기 숫자나 매번 넣는 값은 기억하지 않아요 */
      info.secondary.forEach(v => { if (p.vals && typeof p.vals[v] === 'number') p.vals[v] = cur[v]; });
      const label = recLabel(p, cur), r = result;
      closeSheet();
      if (fromPreset) S.tab = 'calc';
      commit(fromPreset ? S.calc : editor(), r, { l: label, x: info.primary ? cur[info.primary] : null });
    });
    $('[data-act="pcopy"]', sh).addEventListener('click', () => { if (result != null) copyText(String(result)); });
    const empty = inputs.find(i => !i.value.trim());
    if (empty) setTimeout(() => empty.focus(), 230);
  });
}

function sheetPresetEdit(p, seed) {
  const sug = p ? null : (seed || lastLearnable());
  const symMap = { '□': '□', '×': ' × ', '÷': ' ÷ ', '+': ' + ', '−': ' − ', '(': '(', ')': ')', '%': '%' };
  openSheet(`<div class="grab"></div>
    <div class="shead"><h2>${p ? '계산식 고치기' : '새 계산식'}</h2>${CLOSE}</div>
    ${sug ? `<button class="suggest" type="button" data-act="sug"><span>방금 한 계산으로 만들기</span><b>${esc(prettyExpr(sug.e))}</b><span>앞 숫자 자리에 어떤 값이든 넣어 쓸 수 있게 바꿔 줘요</span></button>` : ''}
    <label class="lbl" for="peF">계산식</label>
    <input class="inp txt" id="peF" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="120" placeholder="예: 가격 × (1 − 할인율 ÷ 100)" value="${p ? esc(p.f) : ''}">
    <div class="syms" id="peSyms">${Object.keys(symMap).map(c => `<button class="sym" type="button" data-sym="${c}">${c}</button>`).join('')}</div>
    <p class="hint">가격·인원처럼 이름을 쓰면 입력칸이 저절로 생겨요. 첫 번째 이름에는 계산기 숫자가 들어가요. □는 ‘지금 숫자’라는 뜻이에요.</p>
    <div id="peVars"></div>
    <label class="lbl" for="peName">이름 <small>비워 두면 계산식으로 지어요</small></label>
    <input class="inp txt" id="peName" maxlength="20" autocomplete="off" placeholder="예: 택배비 포함" value="${p ? esc(p.name) : ''}">
    <p class="hint" id="peCheck" aria-live="polite"></p>
    <div class="btns">${p ? '<button class="btn danger" type="button" data-act="pdel">지우기</button>' : ''}<button class="btn pri" type="button" data-act="psave">저장</button></div>`, sh => {
    const fIn = $('#peF', sh), nIn = $('#peName', sh), box = $('#peVars', sh), chk = $('#peCheck', sh);
    const dv = Object.assign({}, p ? p.vals : {});
    let vars = null, sig = null;
    const readDefaults = () => box.querySelectorAll('input[data-var]').forEach(i => {
      const raw = i.value.trim();
      if (!raw) delete dv[i.dataset.var];
      else { try { dv[i.dataset.var] = calc(raw); } catch (e) { /* 입력 중 */ } }
    });
    const say = (msg, bad) => { chk.textContent = msg; chk.className = bad ? 'hint err' : 'hint'; };
    function upd() {
      readDefaults();
      const f = fIn.value.trim();
      if (!f) { vars = null; sig = ''; box.innerHTML = ''; say(''); return; }
      try { vars = compile(f).vars; } catch (e) { vars = null; say(e.message, true); return; }
      const sec = vars.slice(1), nsig = sec.join('\u0001');
      if (nsig !== sig) {
        sig = nsig;
        box.innerHTML = sec.length ? '<p class="lbl">미리 채워 둘 값 <small>계산할 때 바꿀 수 있어요</small></p>' + sec.map((v, i) => `<div class="field"><label for="pd${i}">${esc(varLabel(v))}</label><input class="inp" id="pd${i}" data-var="${esc(v)}" inputmode="decimal" autocomplete="off" value="${typeof dv[v] === 'number' ? esc(String(dv[v])) : ''}"></div>`).join('') : '';
      }
      const x = edValue(S.calc), sample = x != null && x !== 0 ? x : 10000;
      const vals = Object.assign({}, dv);
      if (vars[0]) vals[vars[0]] = sample;
      const missing = sec.filter(v => typeof vals[v] !== 'number');
      if (missing.length) return say(`✓ 계산식 확인 · ${missing.map(varLabel).join(', ')} 값은 계산할 때 넣어요`);
      try {
        const r = calc(f, vals);
        say(vars.length ? `✓ 예) ${varLabel(vars[0])} ${fmt(sample)} → ${fmt(r)}` : `✓ 결과 ${fmt(r)}`);
      } catch (e) { say(e.message, true); }
    }
    fIn.addEventListener('input', upd);
    box.addEventListener('input', upd);
    const syms = $('#peSyms', sh);
    syms.addEventListener('pointerdown', e => { if (e.target.closest('[data-sym]')) e.preventDefault(); });
    syms.addEventListener('click', e => {
      const b = e.target.closest('[data-sym]');
      if (!b) return;
      const t = symMap[b.dataset.sym], s = fIn.selectionStart == null ? fIn.value.length : fIn.selectionStart, en = fIn.selectionEnd == null ? s : fIn.selectionEnd;
      fIn.value = fIn.value.slice(0, s) + t + fIn.value.slice(en);
      fIn.focus();
      try { fIn.setSelectionRange(s + t.length, s + t.length); } catch (er) { /* 무시 */ }
      upd();
    });
    const sb = $('[data-act="sug"]', sh);
    if (sb) sb.addEventListener('click', () => {
      fIn.value = prettyFormula('□' + sug.tail);
      if (!nIn.value.trim()) nIn.value = prettyExpr(sug.tail);
      sb.remove();
      upd();
    });
    if (sb && seed) sb.click();
    $('[data-act="psave"]', sh).addEventListener('click', () => {
      upd();
      const f = fIn.value.trim();
      if (!f) { say('계산식을 넣어 주세요', true); fIn.focus(); return; }
      if (!vars) { fIn.focus(); return; }
      const vals = {};
      vars.slice(1).forEach(v => { if (typeof dv[v] === 'number') vals[v] = dv[v]; });
      const name = (nIn.value.trim() || prettyFormula(f)).slice(0, 24);
      if (p) {
        if (p.f !== f) { delete p.chip; delete p.order; delete p.note; }
        p.f = f; p.name = name; p.vals = vals;
      } else S.presets.push({ id: 'u' + Date.now().toString(36), name, f, vals, pin: true });
      closeSheet();
      changed();
      toast(p ? '고쳤어요' : '저장했어요 · 계산기 칩에 나와요');
    });
    const del = $('[data-act="pdel"]', sh);
    if (del) {
      let armed = false, t = 0;
      del.addEventListener('click', () => {
        if (!armed) { armed = true; del.textContent = '한 번 더 누르면 지워요'; t = setTimeout(() => { armed = false; del.textContent = '지우기'; }, 3000); return; }
        clearTimeout(t);
        const i = S.presets.indexOf(p);
        if (i >= 0) S.presets.splice(i, 1);
        closeSheet();
        changed();
        toast('지웠어요');
      });
    }
    upd();
    if (!p && (!sug || seed)) setTimeout(() => fIn.focus(), 230);
  });
}

function sheetPack(k) {
  const has = it => S.presets.some(p => p.id === it.id);
  openSheet(`<div class="grab"></div>
    <div class="shead"><div><h2>${esc(k.name)} 묶음</h2><p class="hint">넣은 계산식은 ★를 켜면 계산기 칩에 나와요.</p></div>${CLOSE}</div>
    <div id="pkList"></div>
    <div class="btns"><button class="btn pri" type="button" data-act="pkall"></button></div>`, sh => {
    const draw = () => {
      $('#pkList', sh).innerHTML = k.items.map(i => `<div class="prow"><div class="pmain"><span class="pname">${esc(i.name)}</span><span class="pform">${esc(prettyFormula(i.f))}</span>${i.note ? `<span class="pnote">${esc(i.note)}</span>` : ''}</div><div class="pact">${has(i) ? '<span class="added">넣음</span>' : `<button class="btn sec sm" type="button" data-add="${i.id}">넣기</button>`}</div></div>`).join('');
      const left = k.items.filter(i => !has(i)).length, all = $('[data-act="pkall"]', sh);
      all.disabled = !left;
      all.textContent = left ? `${left}개 모두 넣기` : '모두 넣었어요';
    };
    const add = it => { if (!has(it)) S.presets.push(Object.assign(clone(it), { pin: false })); };
    sh.addEventListener('click', e => {
      const b = e.target.closest('[data-add]');
      if (b) { add(k.items.find(i => i.id === b.dataset.add)); changed(); draw(); return toast('넣었어요 · ★를 켜면 칩에 나와요'); }
      if (e.target.closest('[data-act="pkall"]')) { k.items.forEach(add); changed(); draw(); toast(`${k.name} 묶음을 넣었어요`); }
    });
    draw();
  });
}

/* 시간대가 바뀌어 해외로 보이면 그 나라 통화를 환율 맨 위에 (한 번만, 되돌리기 가능) */
function tzCurrency() {
  if (DEMO) return;
  const [tz, c] = tzCode();
  if (!tz || tz === S.tz) return;
  const first = !S.tz;
  S.tz = tz; save();
  if (first || !c || c === 'KRW' || !hasOwn(CUR, c) || !S.rates.r[c]) return;
  const L = S.fx.list, before = L.slice(), was = S.fx.active;
  const i = L.indexOf(c);
  if (i === 0) return;
  if (i > 0) L.splice(i, 1);
  L.unshift(c);
  changed();
  toast(`지금 있는 곳의 통화(${CUR[c][1]} ${CUR[c][0]})를 맨 위에 넣었어요`, ['되돌리기', () => { S.fx.list = before; S.fx.active = was; changed(); }]);
}

/* ───── 프리셋 공유: 링크 하나에 계산식을 담는다 ───── */
function encPreset(p) {
  const o = { n: p.name, f: p.f }, v = {};
  presetInfo(p).secondary.forEach(k => { if (p.vals && typeof p.vals[k] === 'number') v[k] = p.vals[k]; });
  if (Object.keys(v).length) o.v = v;
  if (p.chip) o.c = p.chip;
  if (typeof p.dp === 'number') o.d = p.dp;
  if (p.note) o.t = p.note;
  if (Array.isArray(p.order)) o.o = p.order;
  let bin = '';
  new TextEncoder().encode(JSON.stringify(o)).forEach(x => { bin += String.fromCharCode(x); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decPreset(text) {
  const m = /p\.html#([A-Za-z0-9_-]{8,2400})/.exec(text) || /^([A-Za-z0-9_-]{8,2400})$/.exec(String(text).trim());
  if (!m) return null;
  try {
    const b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(b64 + '='.repeat((4 - b64.length % 4) % 4)), c => c.charCodeAt(0));
    const o = JSON.parse(new TextDecoder().decode(bytes));
    if (!o || typeof o.n !== 'string' || typeof o.f !== 'string') return null;
    const name = o.n.trim().slice(0, 24), f = o.f.trim();
    if (!name || !f || f.length > 120) return null;
    const vars = compile(f).vars;
    const p = { id: 's' + Date.now().toString(36), name, f, vals: {}, pin: true };
    if (o.v && typeof o.v === 'object') vars.slice(1).forEach(k => { if (hasOwn(o.v, k) && typeof o.v[k] === 'number' && isFinite(o.v[k])) p.vals[k] = o.v[k]; });
    if (typeof o.c === 'string' && o.c.length <= 30) p.chip = o.c;
    if (o.d === 0 || o.d === 1 || o.d === 2) p.dp = o.d;
    if (typeof o.t === 'string') p.note = o.t.slice(0, 80);
    if (Array.isArray(o.o)) p.order = o.o.filter(x => typeof x === 'string' && vars.includes(x));
    return p;
  } catch (e) { return null; }
}
function shareText(p) {
  return `[${APP.name}] 계산식 ‘${p.name}’\n${prettyFormula(p.f)}\n\n눌러서 내 계산기에 넣기:\n${APP.shareBase}p.html#${encPreset(p)}`;
}
function sharePreset(p) {
  const text = shareText(p);
  if (NATIVE && NATIVE.shareText) { NATIVE.shareText(text); return; }
  try {
    if (navigator.share) { navigator.share({ text }).catch(e => { if (!e || e.name !== 'AbortError') sheetShare(p, text); }); return; }
  } catch (e) { /* 아래 창으로 */ }
  sheetShare(p, text);
}
function sheetShare(p, text) {
  openSheet(`<div class="grab"></div>
    <div class="shead"><div><h2>‘${esc(p.name)}’ 공유</h2><p class="hint">카톡이나 문자에 붙여넣으면 받은 사람이 링크를 눌러 바로 넣을 수 있어요.</p></div>${CLOSE}</div>
    <div class="sharebox">${esc(text)}</div>
    <div class="btns"><button class="btn pri" type="button" data-act="scopy">복사하기</button></div>`, sh => {
    $('[data-act="scopy"]', sh).addEventListener('click', () => copyText(text, '복사했어요. 카톡에 붙여 넣어 주세요'));
  });
}
function sheetImport(pre) {
  openSheet(`<div class="grab"></div>
    <div class="shead"><div><h2>공유받은 계산식 넣기</h2><p class="hint">받은 메시지를 통째로 붙여 넣어도 돼요.</p></div>${CLOSE}</div>
    <label class="lbl" for="imT">받은 링크</label>
    <textarea class="ta" id="imT" spellcheck="false" autocomplete="off" placeholder="여기에 붙여넣기">${esc(pre || '')}</textarea>
    <div id="imP"></div>
    <div class="btns"><button class="btn pri" type="button" data-act="imadd" disabled>넣기</button></div>`, sh => {
    const ta = $('#imT', sh), box = $('#imP', sh), btn = $('[data-act="imadd"]', sh);
    let got = null;
    const upd = () => {
      const v = ta.value.trim();
      got = v ? decPreset(v) : null;
      btn.disabled = !got;
      if (!v) { box.innerHTML = ''; return; }
      box.innerHTML = got
        ? `<div class="prow"><div class="pmain"><span class="pname">${esc(got.name)}</span><span class="pform">${esc(prettyFormula(got.f))}</span>${got.note ? `<span class="pnote">${esc(got.note)}</span>` : ''}</div></div>`
        : '<p class="hint err">계산식 링크를 찾지 못했어요. 받은 메시지를 통째로 붙여 넣어 보세요.</p>';
    };
    ta.addEventListener('input', upd);
    btn.addEventListener('click', () => {
      if (!got) return;
      closeSheet();
      if (S.presets.some(p => p.f === got.f && p.name === got.name)) return toast('이미 있는 계산식이에요');
      S.presets.push(got);
      changed();
      toast(`‘${got.name}’${eul(got.name)} 넣었어요 · 계산기 칩에 나와요`);
    });
    upd();
    if (!pre) setTimeout(() => ta.focus(), 230);
  });
}
/* 앱(APK)에서 공유 링크로 열렸을 때 부르는 입구 */
window.ddImportPreset = code => sheetImport(String(code || ''));
/* 웹 버전: 공유 링크 페이지에서 app.html#p=코드 로 넘어오면 바로 넣기 창 */
setTimeout(() => { try { const h = location.hash; if (/^#p=[A-Za-z0-9_-]{8,}$/.test(h)) { sheetImport(h.slice(3)); history.replaceState(null, '', location.pathname); } } catch (e) { /* 무시 */ } }, 300);

function sheetCx() {
  const list = Array.from(new Set(S.fx.list.concat([S.cx.from, S.cx.to])));
  const chips = key => list.map(c => `<button class="cchip" type="button" data-cx="${key}" data-code="${c}" aria-pressed="${S.cx[key] === c}">${CUR[c][1]} ${c}</button>`).join('');
  openSheet(`<div class="grab"></div>
    <div class="shead"><h2>계산기 환율 표시</h2>${CLOSE}</div>
    <button class="switch" type="button" role="switch" aria-checked="${S.cx.on}" data-act="cxon">계산 결과 아래에 환율 보기<i aria-hidden="true"></i></button>
    <p class="lbl">계산하는 돈</p><div class="chips">${chips('from')}</div>
    <p class="lbl">바꿔서 볼 돈</p><div class="chips">${chips('to')}</div>
    <p class="hint">통화는 환율 탭의 ‘통화 추가·빼기’에서 더 넣을 수 있어요.</p>`, sh => {
    sh.addEventListener('click', e => {
      const sw = e.target.closest('[data-act="cxon"]');
      if (sw) { S.cx.on = !S.cx.on; sw.setAttribute('aria-checked', String(S.cx.on)); changed(); return; }
      const b = e.target.closest('[data-cx]');
      if (!b) return;
      const key = b.dataset.cx, other = key === 'from' ? 'to' : 'from';
      if (S.cx[other] === b.dataset.code) S.cx[other] = S.cx[key];
      S.cx[key] = b.dataset.code;
      S.cx.on = true;
      sh.querySelectorAll('[data-cx]').forEach(x => x.setAttribute('aria-pressed', String(S.cx[x.dataset.cx] === x.dataset.code)));
      $('[data-act="cxon"]', sh).setAttribute('aria-checked', 'true');
      changed();
    });
  });
}

function sheetCurrencies() {
  const codes = Object.keys(CUR).filter(c => S.rates.r[c]);
  openSheet(`<div class="grab"></div>
    <div class="shead"><h2>통화 고르기</h2>${CLOSE}</div>
    <input class="inp txt" id="curQ" type="search" placeholder="나라나 통화 찾기 (예: 베트남, VND)" autocomplete="off">
    <ul class="curlist" id="curList">${codes.map(c => `<li><button class="curitem" type="button" data-code="${c}" aria-pressed="${S.fx.list.includes(c)}"><span class="flag" aria-hidden="true">${CUR[c][1]}</span><span class="code">${c}</span><span class="cname">${CUR[c][0]}</span><span class="ck">${ICON.check}</span></button></li>`).join('')}</ul>`, sh => {
    const q = $('#curQ', sh);
    q.addEventListener('input', () => {
      const t = q.value.trim();
      sh.querySelectorAll('#curList li').forEach(li => {
        const c = li.firstElementChild.dataset.code;
        li.hidden = !qMatch(t, c + ' ' + CUR[c][0]);
      });
    });
    $('#curList', sh).addEventListener('click', e => {
      const b = e.target.closest('[data-code]');
      if (!b) return;
      const c = b.dataset.code, L = S.fx.list, i = L.indexOf(c);
      if (i >= 0) {
        if (L.length <= 1) return toast('통화를 하나는 남겨 둬야 해요');
        const wasActive = S.fx.active === c;
        L.splice(i, 1);
        if (wasActive) fxSelect(L[0], true);
      } else L.push(c);
      b.setAttribute('aria-pressed', String(L.includes(c)));
      changed();
    });
  });
}

/* ───── 새 버전 확인 (앱: 폰이 GitHub에서 확인 · 웹: GitHub 공개 릴리스 정보만 읽음, 보내는 정보 없음) ───── */
const RELEASES = 'https://github.com/' + APP.repo + '/releases/';
const curNo = () => +(String(APP.version).split('.')[1] || 0);
const LATEST = { v: 0, cur: curNo(), url: '', checking: false, failed: false, at: 0 };
try { const o = JSON.parse(localStorage.getItem('ganeum-latest') || 'null'); if (o && !NATIVE && +o.v > 0) { LATEST.v = +o.v; LATEST.at = +o.at || 0; } } catch (e) { /* 무시 */ }
const hasNew = () => !!(LATEST.v && LATEST.v > LATEST.cur);
/* 새 버전이 있으면 왼쪽 아래 버전 글자를 노란색으로 */
function paintVer() {
  el.ver.classList.toggle('new', hasNew());
  el.ver.setAttribute('aria-label', hasNew() ? `버전 ${APP.label}, 새 버전(v1.${LATEST.v})이 나왔어요` : `버전 ${APP.label}, 앱 정보와 업데이트 내용`);
  updPaint();
}
window.onLatest = (v, cur) => { LATEST.v = +v || 0; LATEST.cur = +cur || LATEST.cur; LATEST.checking = false; LATEST.failed = false; LATEST.at = Date.now(); paintVer(); };
window.onLatestFail = () => { LATEST.checking = false; LATEST.failed = true; paintVer(); };
function updText() {
  if (APP.preview) return '미리보기에서는 새 버전을 확인하지 않아요. 앱에서는 자동으로 확인해요.';
  if (LATEST.checking) return '새 버전을 확인하는 중이에요…';
  if (hasNew()) return `새 버전(<b class="upv">v1.${LATEST.v}</b>)이 나왔어요.${APP.web ? ' 아래 버튼을 누르면 새 버전으로 바뀌어요.' : ''}`;
  if (LATEST.failed && !LATEST.v) return '새 버전을 확인하지 못했어요. 인터넷 연결을 확인해 주세요.';
  return LATEST.v ? '지금 쓰는 버전이 최신이에요.' : '새 버전 확인을 눌러 주세요.';
}
function updPaint() {
  if (!sheetOpen) return;
  const m = $('#updMsg', el.sheet), row = $('#updRow', el.sheet);
  if (m) m.innerHTML = updText();
  if (row) row.innerHTML = APP.preview ? '' : (hasNew() ? `<button class="btn main" type="button" data-upd="get">${APP.web ? '새 버전으로 바꾸기' : '업데이트 받기'}</button>` : '')
    + `<button class="btn sec" type="button" data-upd="check"${LATEST.checking ? ' disabled' : ''}>새 버전 확인</button>`;
}
function checkLatest() {
  if (APP.preview || LATEST.checking) return;
  if (NATIVE) { LATEST.checking = true; updPaint(); try { NATIVE.checkUpdate ? NATIVE.checkUpdate() : NATIVE.openUpdate(); } catch (e) { window.onLatestFail(); } if (!NATIVE.checkUpdate) LATEST.checking = false; return; }
  LATEST.checking = true; LATEST.failed = false; updPaint();
  fetchJSON('https://api.github.com/repos/' + APP.repo + '/releases/latest', 8000).then(j => {
    const n = +String(j && j.tag_name || '').replace(/\D/g, '');
    if (!n) throw new Error('tag');
    const u = String(j.html_url || '');
    LATEST.v = n; LATEST.url = u.indexOf(RELEASES) === 0 ? u : RELEASES + 'latest'; LATEST.at = Date.now();
    try { localStorage.setItem('ganeum-latest', JSON.stringify({ v: n, at: LATEST.at })); } catch (e) { /* 무시 */ }
    LATEST.checking = false; paintVer();
  }).catch(() => { LATEST.checking = false; LATEST.failed = true; paintVer(); });
}
function autoUpdateCheck() {
  if (!APP.web || DEMO) return;
  if (Date.now() - LATEST.at > 6 * 3600e3) checkLatest(); else paintVer();
}
/* 앱: 뒤로 가기 키 — 창을 닫고, 다른 탭이면 계산기로, 아니면 앱 종료 */
window.onBackKey = () => {
  if (sheetOpen) { closeSheet(); return true; }
  if (DEMO) { demoOff(); return true; }
  if (S.tab !== 'calc') { setTab('calc'); return true; }
  return false;
};
/* 앱: 다른 앱에서 '공유 → 가늠'으로 받은 글, 또는 공유 링크로 열림 */
window.onSharedText = t => { if (decPreset(String(t || ''))) sheetImport(String(t)); else toast('가늠 계산식 링크가 아니에요'); };
/* 버전 정보 창: 다른 앱들과 같은 순서 (상태·새 버전 확인 → 백업 → 화면 → 업데이트 내용 → 개인정보) */
function sheetVersion() {
  openSheet(`<div class="vsheet"><div class="grab"></div>
    <div class="shead"><h2>${APP.name}<span class="vtag${hasNew() ? ' up' : ''}">${APP.label}</span></h2>${CLOSE}</div>
    <p class="hint" id="updMsg" role="status"></p>
    <div class="row" id="updRow"></div>
    <p class="lbl">내 데이터 백업</p>
    <div id="bkBox"></div>
    <p class="lbl">화면</p>
    <div class="vset" id="vset">${viewHTML()}</div>
    <p class="lbl">업데이트 내용</p>
    <ul class="notes">${NOTES.map(n => `<li><b>${esc(n.v)}</b><span>${esc(n.d)}</span><ul>${n.items.map(t => `<li>${esc(t)}</li>`).join('')}</ul></li>`).join('')}</ul>
    <p class="lbl">개인정보</p>
    <p class="hint">계산 기록과 계산식은 ${NATIVE ? '이 폰' : '이 기기(브라우저)'}에만 저장돼요. 백업 파일은 내가 고른 곳에만 저장되고 인터넷으로 보내지 않아요. 인터넷은 환율을 받고 새 버전을 확인할 때만 쓰고, 내 정보는 보내지 않아요.</p></div>`, sh => {
    bkMount(sh); viewMount(sh); updPaint();
    $('#updRow', sh).addEventListener('click', e => {
      const b = e.target.closest('[data-upd]'); if (!b) return;
      if (b.dataset.upd === 'check') return checkLatest();
      if (NATIVE) { try { NATIVE.openUpdate(); } catch (er) { /* 무시 */ } }
      else { try { location.reload(); } catch (er) { /* 무시 */ } }
    });
    if (!APP.preview && !LATEST.checking && (NATIVE ? !LATEST.v : Date.now() - LATEST.at > 600e3)) checkLatest();
  });
}


/* ───── 화면: 밝게·어둡게, 글자 크기 (이 기기에만 저장) ───── */
const VIEW_KEY = 'ganeum-view';
const VIEW = (() => { try { const v = JSON.parse(localStorage.getItem(VIEW_KEY) || '{}'); return { theme: ['auto', 'light', 'dark'].includes(v.theme) ? v.theme : 'auto', size: [1, 1.1, 1.2].includes(v.size) ? v.size : 1 }; } catch (e) { return { theme: 'auto', size: 1 }; } })();
function viewApply() {
  const r = document.documentElement;
  if (VIEW.theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', VIEW.theme);
  document.body.style.zoom = VIEW.size === 1 ? '' : String(VIEW.size);
}
function viewHTML() {
  const b = (k, v, t) => `<button class="chip" type="button" data-vk="${k}" data-vv="${v}" aria-pressed="${String(VIEW[k]) === String(v)}">${t}</button>`;
  return `<div class="vrow"><span>테마</span>${b('theme', 'auto', '폰 설정대로')}${b('theme', 'light', '밝게')}${b('theme', 'dark', '어둡게')}</div>
    <div class="vrow"><span>글자 크기</span>${b('size', 1, '보통')}${b('size', 1.1, '크게')}${b('size', 1.2, '아주 크게')}</div>`;
}
function viewMount(sh) {
  const box = $('#vset', sh); if (!box) return;
  box.addEventListener('click', e => {
    const t = e.target.closest('[data-vk]'); if (!t) return;
    VIEW[t.dataset.vk] = t.dataset.vk === 'size' ? +t.dataset.vv : t.dataset.vv;
    try { localStorage.setItem(VIEW_KEY, JSON.stringify(VIEW)); } catch (er) { saveFail(); }
    viewApply(); box.innerHTML = viewHTML();
  });
}
viewApply();

/* ───── 내 데이터 백업: 계산 기록·계산식·통화 목록을 파일 하나로 저장하고 불러오기 (모든 앱 같은 방식) ───── */
/* 비밀번호 잠금(선택): 비밀번호로 만든 열쇠(PBKDF2 20만 번)로 AES-GCM 256 암호화. 비밀번호와 열쇠는 어디에도 저장하지 않아요 */
const PW_MIN = 6;
const LOCK = (() => {
  const ok = () => !!(window.crypto && crypto.subtle && crypto.getRandomValues && window.TextEncoder && window.TextDecoder);
  const b64 = u8 => { let t = ''; for (let i = 0; i < u8.length; i += 0x8000) t += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(t); };
  const unb64 = t => Uint8Array.from(atob(String(t || '')), c => c.charCodeAt(0));
  const key = (pw, salt) => crypto.subtle.importKey('raw', new TextEncoder().encode(String(pw)), 'PBKDF2', false, ['deriveKey'])
    .then(k => crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' }, k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']));
  const seal = (text, pw) => {
    const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    return key(pw, salt).then(k => crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(text)))
      .then(ct => ({ v: 1, s: b64(salt), i: b64(iv), d: b64(new Uint8Array(ct)) }));
  };
  const open = (o, pw) => {
    if (!o || typeof o.s !== 'string' || typeof o.i !== 'string' || typeof o.d !== 'string') return Promise.reject(new Error('bad'));
    return key(pw, unb64(o.s)).then(k => crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(o.i) }, k, unb64(o.d))).then(pt => new TextDecoder().decode(pt));
  };
  return { ok, seal, open };
})();
const BK = { msg: '', busy: false, pending: null, locked: null };
function bkHTML() {
  const p = BK.pending, d = p && p.at ? new Date(p.at) : null, dis = BK.busy ? ' disabled' : '';
  let h;
  if (p) {
    let cnt = '';
    try { const m = JSON.parse(p.ls[STORE]); cnt = ` · 계산 기록 ${Array.isArray(m.hist) ? m.hist.length : 0}개 · 계산식 ${Array.isArray(m.presets) ? m.presets.length : 0}개`; } catch (e) { /* 무시 */ }
    h = `<p class="hint">${esc((d && !isNaN(d) ? `${d.getMonth() + 1}월 ${d.getDate()}일 ` : '') + `백업 (v${p.version || '?'}${cnt})`)}을 불러오면 지금 기록과 계산식이 백업 내용으로 바뀌어요.</p>
      <div class="row"><button class="btn main" type="button" data-bk="apply"${dis}>불러오기</button><button class="btn sec" type="button" data-bk="cancel">취소</button></div>`;
  } else if (BK.locked) {
    h = `<p class="hint">🔒 비밀번호가 걸린 백업이에요.</p>
      <input class="pw" id="bkUpw" type="password" autocomplete="off" maxlength="40" placeholder="백업 비밀번호" aria-label="백업 비밀번호">
      <div class="row"><button class="btn main" type="button" data-bk="unlock"${dis}>열기</button><button class="btn sec" type="button" data-bk="cancel">취소</button></div>`;
  } else {
    h = `<p class="hint">폰을 바꾸거나 앱을 지우기 전에 파일로 저장해 두세요. 파일은 내가 고른 곳에만 저장되고 인터넷으로 보내지 않아요.</p>
      ${LOCK.ok() ? `<input class="pw" id="bkPw" type="password" autocomplete="new-password" maxlength="40" placeholder="비밀번호 (선택 · 넣으면 이 비밀번호로 잠가요)" aria-label="백업 비밀번호 (선택, ${PW_MIN}글자 이상)">` : ''}
      <div class="row"><button class="btn sec" type="button" data-bk="save"${dis}>백업 파일로 저장</button><button class="btn sec" type="button" data-bk="open"${dis}>백업 불러오기</button></div>`;
  }
  return h + (BK.msg ? `<p class="hint" role="status">${esc(BK.msg)}</p>` : '');
}
function bkMount(sh) {
  const box = $('#bkBox', sh || el.sheet); if (!box) return;
  box.innerHTML = bkHTML();
  box.querySelectorAll('[data-bk]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.bk;
    if (k === 'save') bkSave(); else if (k === 'open') bkOpen(); else if (k === 'apply') bkApply(); else if (k === 'unlock') bkUnlock(); else { BK.pending = null; BK.locked = null; bkSet(''); }
  }));
}
function bkSet(m, busy) { BK.msg = m; BK.busy = !!busy; if (sheetOpen) bkMount(); }
function bkSave() {
  if (BK.busy) return;
  if (DEMO) return bkSet('예시 화면에서는 백업하지 않아요. 예시를 닫은 뒤 해 주세요.');
  const pwEl = $('#bkPw', el.sheet), pw = pwEl ? pwEl.value : '';
  if (pw && pw.length < PW_MIN) { bkSet(`비밀번호는 ${PW_MIN}글자 이상 넣어 주세요.`); return; }
  flush();
  const d = new Date(), p = n => String(n).padStart(2, '0'), name = `${APP.name}-백업-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.json`;
  let data = null; try { data = localStorage.getItem(STORE); } catch (e) { /* 무시 */ }
  if (data == null) data = JSON.stringify(S);
  const head = { app: APP.name, repo: APP.repo, version: APP.version, at: d.toISOString() };
  const text = JSON.stringify(Object.assign({}, head, { ls: { [STORE]: data } }));
  const write = t => {
    if (NATIVE && NATIVE.backupSave) { bkSet('저장할 곳을 골라 주세요 (내 파일·드라이브 등)', true); NATIVE.backupSave(name, t); return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'application/json' })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); bkDone(true);
  };
  if (!pw) return write(text);
  bkSet('비밀번호로 잠근 백업 파일을 만드는 중이에요…', true);
  LOCK.seal(text, pw).then(o => write(JSON.stringify(Object.assign({}, head, { enc: 1, lock: o }))), () => bkDone(false));
}
function bkDone(ok, why) { bkSet(ok ? '백업 파일을 저장했어요. 새 폰에서는 이 화면의 "백업 불러오기"로 넣으면 돼요.' : why === 'cancel' ? '' : '백업 파일을 저장하지 못했어요. 다시 해 주세요.'); }
function bkOpen() {
  if (BK.busy) return;
  BK.pending = null; BK.locked = null;
  if (NATIVE && NATIVE.backupOpen) { bkSet('백업 파일을 골라 주세요', true); NATIVE.backupOpen(); return; }
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json,text/plain,application/octet-stream,.json'; inp.hidden = true; document.body.appendChild(inp);
  inp.addEventListener('change', () => { const f = inp.files && inp.files[0]; inp.remove(); if (!f) return; if (f.size > 20 * 1024 * 1024) { bkSet('파일이 너무 커요. 가늠 백업 파일을 골라 주세요.'); return; } const r = new FileReader(); r.onload = () => bkOpened(String(r.result)); r.onerror = () => bkOpened(null); r.readAsText(f); });
  inp.click();
}
function bkOpened(text) {
  if (text == null) { bkSet(''); return; }
  let o = null; try { o = JSON.parse(text); } catch (e) { o = null; }
  if (o && o.enc === 1 && o.lock && o.repo === APP.repo) { BK.locked = o; BK.pending = null; bkSet('저장할 때 넣은 비밀번호를 넣어 주세요.'); return; }
  if (!o || !o.ls || typeof o.ls !== 'object') { bkSet(o && o.enc === 1 ? '다른 앱의 백업이에요. 가늠 백업 파일을 골라 주세요.' : '이 파일은 백업 파일이 아니에요.'); return; }
  if (o.repo !== APP.repo || typeof o.ls[STORE] !== 'string') { bkSet(`이 파일은 ${o.app ? `“${String(o.app).slice(0, 20)}” 앱의` : '다른 앱의'} 백업이에요. 가늠 백업 파일을 골라 주세요.`); return; }
  let m = null; try { m = JSON.parse(o.ls[STORE]); } catch (e) { m = null; }
  if (!m || typeof m !== 'object' || m.v !== 1) { bkSet('백업 파일 안의 기록이 비어 있거나 망가졌어요. 지금 기록은 그대로예요.'); return; }
  BK.pending = o; bkSet('');
}
function bkUnlock() {
  const o = BK.locked, inp = $('#bkUpw', el.sheet), pw = inp ? inp.value : '';
  if (!o) return;
  if (!pw) { bkSet('비밀번호를 넣어 주세요.'); return; }
  if (!LOCK.ok()) { bkSet('이 기기에서는 비밀번호가 걸린 백업을 열 수 없어요.'); return; }
  bkSet('여는 중이에요…', true);
  LOCK.open(o.lock, pw).then(plain => { BK.locked = null; bkOpened(plain); }, () => bkSet('비밀번호가 맞지 않아요.'));
}
function bkApply() {
  const o = BK.pending; if (!o) return;
  let old = null; try { old = localStorage.getItem(STORE); } catch (e) { /* 무시 */ }
  try { localStorage.setItem(STORE, o.ls[STORE]); } catch (e) {
    try { if (old != null) localStorage.setItem(STORE, old); } catch (e2) { /* 무시 */ }
    BK.pending = null; bkSet('저장 공간이 부족해서 불러오지 못했어요. 지금 기록은 그대로예요.'); return;
  }
  DEMO = null;
  bkLock = true; bkSet('다 불러왔어요! 잠깐 뒤 다시 열려요.', true);
  setTimeout(() => { try { location.reload(); } catch (e) { /* 무시 */ } }, 700);
}
window.AppInfo = Object.assign(window.AppInfo || {}, { backupDone: (ok, why) => bkDone(!!ok, why), backupOpened: t => bkOpened(t) });

/* ───── 예시로 둘러보기: 저장하지 않는 예시 화면 (닫거나 다시 열면 원래대로) ───── */
function demoOn() {
  if (DEMO) return;
  flush();
  DEMO = clone(S);
  const t = Date.now();
  S.hist = [
    { e: '12900*3', r: 38700, t: t - 5e5 },
    { l: '부가세 포함', x: 43700, r: 48070, t: t - 4e5 },
    { l: 'N빵 ÷4', x: 87500, r: 21875, t: t - 3e5 },
    { l: '할인 30%', x: 59000, r: 41300, t: t - 2e5 },
    { e: '1500*12+3000', r: 21000, t: t - 1e5 }
  ];
  S.calc = { expr: '48070', done: true, prev: { l: '부가세 포함', x: 43700 } };
  S.fx = Object.assign({}, S.fx, { expr: '100', done: true, active: S.fx.list.includes('USD') ? 'USD' : S.fx.list[0] });
  S.fxHist = [{ a: 100, c: 'USD', t }, { a: 5000, c: 'JPY', t }];
  S.learned = Object.assign({}, S.learned, { '*1.1+3000': { n: 3, t } });
  S.tab = 'calc';
  $('#demoBar').hidden = false;
  histSig = ''; render();
  toast('예시 화면이에요. 마음껏 눌러 봐도 저장되지 않아요');
}
function demoOff() {
  if (!DEMO) return;
  const keep = DEMO; DEMO = null;
  Object.keys(S).forEach(k => { delete S[k]; });
  Object.assign(S, keep);
  $('#demoBar').hidden = true;
  histSig = ''; stripSig = ''; render();
  toast('예시를 닫았어요');
}

/* ───── 계산 기록 찾기 ───── */
function sheetHistFind() {
  openSheet(`<div class="grab"></div>
    <div class="shead"><div><h2>계산 기록 찾기</h2><p class="hint">숫자나 이름을 띄어 써서 넣으면 모두 들어 있는 기록만 보여요 (예: 부가 43700). 누르면 그 결과를 계산기에 넣어요.</p></div>${CLOSE}</div>
    <input class="qbox" id="hQ" type="search" placeholder="찾기" autocomplete="off" aria-label="계산 기록 찾기">
    <div id="hRes"></div>`, sh => {
    const q = $('#hQ', sh), box = $('#hRes', sh);
    const draw = () => {
      const v = q.value, list = [];
      for (let i = S.hist.length - 1; i >= 0 && list.length < 100; i--) if (qMatch(v, histText(S.hist[i]))) list.push(i);
      const day = t => { const d = new Date(t); return isNaN(d) ? '' : `${d.getMonth() + 1}월 ${d.getDate()}일`; };
      box.innerHTML = list.length ? list.map(i => { const h = S.hist[i]; return `<button class="hl" type="button" data-hi2="${i}">${h.e ? prettyExpr(h.e, true) : esc((h.x != null ? fmt(h.x) + ' → ' : '') + h.l)} <b>= ${esc(h.xs ? groupNum(h.xs.replace(/^-/, '')) : fmt(h.r))}</b><small>${day(h.t)}</small></button>`; }).join('')
        : `<p class="qnone">${S.hist.length ? '맞는 기록이 없어요. 다른 단어로 찾아 보세요.' : '아직 계산 기록이 없어요.'}</p>`;
    };
    q.addEventListener('input', draw);
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-hi2]'); if (!b) return;
      const h = S.hist[+b.dataset.hi2]; if (!h) return;
      closeSheet();
      S.tab = 'calc'; clearCur();
      S.calc.expr = h.xs || String(h.r); S.calc.done = true; S.calc.err = '';
      S.calc.prev = h.e ? { e: h.e } : { l: h.l, x: h.x };
      changed();
    });
    draw();
    setTimeout(() => q.focus(), 230);
  });
}

/* ───── 알림·복사 ───── */
let toastTimer = 0;
function toast(msg, action) {
  const t = el.toast;
  t.innerHTML = `<span>${esc(msg)}</span>` + (action ? `<button type="button">${esc(action[0])}</button>` : '');
  if (action) $('button', t).addEventListener('click', () => { hideToast(); action[1](); });
  t.hidden = false;
  requestAnimationFrame(() => t.classList.add('on'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, action ? 4200 : 2000);
}
function hideToast() {
  el.toast.classList.remove('on');
  setTimeout(() => { if (!el.toast.classList.contains('on')) el.toast.hidden = true; }, 200);
}
function copyText(text, msg) {
  const ok = () => toast(msg || `${fmt(+text)} 복사했어요`);
  if (NATIVE && NATIVE.copy) { try { NATIVE.copy(String(text)); return ok(); } catch (e) { /* 아래 방법으로 */ } }
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'offscreen';
    document.body.appendChild(ta); ta.select();
    let done = false;
    try { done = document.execCommand('copy'); } catch (e) { done = false; }
    ta.remove();
    if (done) ok(); else toast('이 화면에서는 복사가 안 돼요');
  };
  try { navigator.clipboard.writeText(text).then(ok, fallback); } catch (e) { fallback(); }
}

/* ───── 인터넷: 환율 받기 · 새 버전 확인 ───── */
const fxWait = {};
let fxSeq = 0;
window.__fetchDone = (id, text) => { const w = fxWait[id]; if (!w) return; delete fxWait[id]; try { if (text == null) throw new Error('fail'); w.res(JSON.parse(text)); } catch (e) { w.rej(e); } };
function fetchJSON(url, ms) {
  if (NATIVE && NATIVE.fetchAsync) return new Promise((res, rej) => { const id = 'f' + (++fxSeq); fxWait[id] = { res, rej }; NATIVE.fetchAsync(id, url); setTimeout(() => window.__fetchDone(id, null), (ms || 7000) + 3000); });
  const ctl = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = ctl ? setTimeout(() => ctl.abort(), ms || 7000) : 0;
  return fetch(url, { cache: 'no-store', credentials: 'omit', signal: ctl ? ctl.signal : undefined })
    .then(r => { clearTimeout(timer); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .catch(e => { clearTimeout(timer); throw e; });
}
async function refreshRates(manual) {
  if (APP.preview) { if (manual) toast('미리보기에서는 저장된 환율로 계산해요. 앱에서는 자동으로 새 환율을 받아요'); return; }
  if (fxBusy) return;
  fxBusy = true;
  if (S.tab === 'fx') renderFxStatus();
  let ok = false;
  for (const src of RATE_SOURCES) {
    try {
      const d = src.read(await fetchJSON(src.url, 7000));
      if (d && d.r && d.r.KRW > 0 && d.r.EUR > 0) {
        const r = {};
        Object.keys(d.r).forEach(k => { const v = +d.r[k]; if (hasOwn(CUR, k) && v > 0 && isFinite(v)) r[k] = v; });
        r.USD = 1;
        S.rates = { r, at: d.at || Date.now(), src: src.id, got: Date.now() };
        ok = true;
        break;
      }
    } catch (e) { /* 다음 곳에서 시도 */ }
  }
  fxBusy = false;
  if (ok) save();
  render();
  if (manual) toast(ok ? '최신 환율로 바꿨어요' : '지금은 새 환율을 못 받았어요. 저장된 환율로 계산해요');
}
let lastTry = 0;
function autoRefresh() {
  if (APP.preview || Date.now() - (S.rates.got || 0) < 3 * 3600e3 || Date.now() - lastTry < 10 * 60e3) return;
  lastTry = Date.now();
  refreshRates(false);
}
/* ───── 이벤트 ───── */
let holdTimer = 0, held = false;
el.keys.addEventListener('pointerdown', e => {
  if (!e.target.closest('[data-k="BS"]')) return;
  held = false;
  holdTimer = setTimeout(() => { held = true; press('AC'); }, 480);
});
['pointerup', 'pointerleave', 'pointercancel'].forEach(t => el.keys.addEventListener(t, () => clearTimeout(holdTimer)));
el.keys.addEventListener('contextmenu', e => e.preventDefault());
el.keys.addEventListener('click', e => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  if (b.dataset.k === 'BS' && held) { held = false; return; }
  press(b.dataset.k);
});
el.strip.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) chipTap(b); });
$('#parbtn').addEventListener('click', () => press('()'));
el.tabs.addEventListener('click', e => {
  const b = e.target.closest('[data-tab]');
  if (b) setTab(b.dataset.tab);
  else if (e.target.closest('#ver')) sheetVersion();
});
/* 계산 기록을 꾹 누르면 그 계산을 프리셋으로 (앞 숫자는 □ = 그때그때 넣는 숫자) */
let hHold = 0, hHeld = false;
el.vCalc.addEventListener('pointerdown', e => {
  const hr = e.target.closest('[data-hi]'); if (!hr) return;
  hHeld = false; clearTimeout(hHold);
  hHold = setTimeout(() => {
    const h = S.hist[+hr.dataset.hi]; if (!h || !h.e) return;
    const m = LEARN_RE.exec(h.e);
    let seed = null;
    if (m) { try { compile('□' + m[2]); seed = { e: h.e, tail: m[2] }; } catch (er) { seed = null; } }
    hHeld = true;
    if (!seed) { toast('숫자로 시작하는 계산만 계산식으로 만들 수 있어요'); return; }
    try { navigator.vibrate && navigator.vibrate(15); } catch (er) { /* 무시 */ }
    sheetPresetEdit(null, seed);
  }, 520);
});
['pointerup', 'pointerleave', 'pointercancel', 'pointermove'].forEach(t => el.vCalc.addEventListener(t, ev => { if (t !== 'pointermove' || Math.abs(ev.movementY) > 6) clearTimeout(hHold); }));
el.vCalc.addEventListener('contextmenu', e => { if (e.target.closest('[data-hi]')) e.preventDefault(); });
el.vCalc.addEventListener('click', e => {
  const t = e.target;
  const hr = t.closest('[data-hi]');
  if (hr && hHeld) { hHeld = false; return; }
  if (hr) {
    const h = S.hist[+hr.dataset.hi];
    if (!h) return;
    const c = S.calc, r = h.xs || String(h.r);
    clearCur();
    if (!c.done && /[+\-*/(]$/.test(c.expr)) { c.expr += r; S.calc.err = ''; }
    else { c.expr = r; c.done = true; c.prev = h.e ? { e: h.e } : { l: h.l, x: h.x }; }
    return changed();
  }
  if (t.closest('[data-act="demo"]')) return demoOn();
  if (t.closest('[data-act="hfind"]')) return sheetHistFind();
  const hc = t.closest('[data-act="hclear"]');
  if (hc) {
    if (!hc.classList.contains('armed')) {
      hc.classList.add('armed'); hc.textContent = '한 번 더 누르면 지워요';
      setTimeout(() => { if (hc.isConnected) { hc.classList.remove('armed'); hc.textContent = '기록 지우기'; } }, 3000);
      return;
    }
    S.hist = [];
    return changed();
  }
  /* 결과 위의 식을 누르면 다시 불러와 고치기 */
  if (t.closest('#prevline') && S.calc.done && S.calc.prev && S.calc.prev.e) {
    const c = S.calc;
    c.expr = c.prev.e; c.done = false; c.prev = null; c.err = ''; clearCur();
    changed();
    return toast('식을 다시 불러왔어요. 고칠 숫자를 눌러 주세요');
  }
  /* 입력 중인 식의 숫자를 누르면 그 숫자를 고른다 */
  const tk = t.closest('#expr [data-a]');
  if (tk && !S.calc.done) {
    const c = S.calc, a = +tk.dataset.a, b = +tk.dataset.b;
    if (tk.classList.contains('tn') && !(c.sel && c.sel[0] === a)) { c.sel = [a, b]; c.cur = null; }
    else { c.sel = null; c.cur = b >= c.expr.length ? null : b; }
    return renderCalc();
  }
  if (t.closest('#expr') && !S.calc.done && (S.calc.sel || S.calc.cur != null)) { clearCur(); return renderCalc(); }
  if (t.closest('[data-act="cx"]')) return sheetCx();
  if (t.closest('[data-act="cxswap"]')) { const c = S.cx, f = c.from; c.from = c.to; c.to = f; return changed(); }
  if (t.closest('#expr') && S.calc.done) { const v = edValue(S.calc); if (v != null) copyText(Math.abs(v) >= 1e15 && /^-?\d+(\.\d+)?$/.test(S.calc.expr) ? S.calc.expr : String(v)); }
});
el.fxlist.addEventListener('click', e => {
  if (e.target.closest('[data-act="cur"]')) return sheetCurrencies();
  const fh = e.target.closest('[data-fh]');
  if (fh) {
    const h = S.fxHist[+fh.dataset.fh]; if (!h) return;
    if (!S.fx.list.includes(h.c)) S.fx.list.push(h.c);
    S.fx.active = h.c; S.fx.expr = String(h.a); S.fx.done = true;
    return changed();
  }
  if (e.target.closest('a')) return;
  const r = e.target.closest('.fxrow');
  if (r) fxSelect(r.dataset.code);
});
el.fxlist.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('fxrow')) { e.preventDefault(); fxSelect(e.target.dataset.code); }
});
el.fxRefresh.addEventListener('click', () => refreshRates(true));
$('#fxCopy').addEventListener('click', () => { const t = fxText(); if (t) { fxRemember(); copyText(t, '복사했어요 · ' + t); } else toast('금액을 먼저 넣어 주세요'); });
el.pQ.addEventListener('input', () => renderPresets());
el.strip.addEventListener('scroll', stripMore, { passive: true });
window.addEventListener('resize', stripMore);
$('#demoOff').addEventListener('click', demoOff);
el.fxAdd.addEventListener('click', () => sheetCurrencies());
el.newPreset.addEventListener('click', () => sheetPresetEdit(null));
el.plist.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act, p = S.presets.find(q => q.id === b.dataset.pid);
  if (act === 'pcalc' && p) sheetPresetCalc(p);
  else if (act === 'pin' && p) { p.pin = !p.pin; changed(); toast(p.pin ? '계산기 칩에 보여요' : '칩에서 뺐어요'); }
  else if (act === 'pedit' && p) sheetPresetEdit(p);
  else if (act === 'pshare' && p) sharePreset(p);
  else if (act === 'pack') { const k = PACKS.find(x => x.id === b.dataset.pk); if (k) sheetPack(k); }
  else if (act === 'import') sheetImport('');
  else if (act === 'keep') keepLearned(b.dataset.k);
  else if (act === 'hide') { const L = S.learned[b.dataset.k]; if (L) { L.hide = true; changed(); toast('숨겼어요'); } }
  else if (act === 'restore') { BUILTIN.forEach(bp => { if (!S.presets.find(q => q.id === bp.id)) S.presets.push(clone(bp)); }); changed(); toast('기본 계산식을 다시 넣었어요'); }
});
el.sheetWrap.addEventListener('click', e => { if (e.target.closest('[data-act="close"]')) closeSheet(); });
document.addEventListener('keydown', e => {
  if (sheetOpen) { if (e.key === 'Escape') closeSheet(); return; }
  const tg = e.target;
  if (tg && tg.closest && tg.closest('input, textarea')) return;
  if (e.metaKey || e.ctrlKey || e.altKey || S.tab === 'preset') return;
  if ((e.key === 'Enter' || e.key === ' ') && tg && tg.closest && tg.closest('button, [role="button"]')) return;
  let k = e.key;
  if ((k === 'ArrowLeft' || k === 'ArrowRight') && S.tab === 'calc' && !S.calc.done && S.calc.expr) {
    const c = S.calc, L = k === 'ArrowLeft';
    let p = c.sel ? (L ? c.sel[0] : c.sel[1]) : (c.cur == null ? c.expr.length : c.cur);
    p = Math.max(0, Math.min(c.expr.length, p + (L ? -1 : 1)));
    c.sel = null; c.cur = p >= c.expr.length ? null : p;
    e.preventDefault();
    return renderCalc();
  }
  if (k === 'Enter') k = '='; else if (k === 'Backspace') k = 'BS'; else if (k === 'Escape' || k === 'Delete') k = 'AC'; else if (k === 'x' || k === 'X') k = '*';
  if (/^\d$/.test(k) || ['+', '-', '*', '/', '%', '.', '=', 'BS', 'AC', '(', ')'].includes(k)) {
    e.preventDefault();
    press(k);
    const b = el.keys.querySelector(`[data-k="${k}"]`);
    if (b) { b.classList.add('press'); setTimeout(() => b.classList.remove('press'), 110); }
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') { if (S.tab === 'fx') fxRemember(); flush(); }
  else { autoRefresh(); autoUpdateCheck(); }
});
window.addEventListener('pagehide', flush);

/* ───── 시작 ───── */
render();
setTimeout(() => { autoRefresh(); autoUpdateCheck(); if (S.tab === 'fx') tzCurrency(); }, 400);
})();
