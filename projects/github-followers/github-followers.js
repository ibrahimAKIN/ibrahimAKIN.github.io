const input = document.querySelector('input[type=search]');
const table = document.getElementsByTagName('table')[0];
const p = document.getElementsByTagName('p')[0];
const lcl = { b: 'github_blocked', c: 'github_checked' };
const cbx = { b: document.forms[0][4], c: document.forms[0][3] };
const elm = { b: document.getElementById('blocked'), c: document.getElementById('checked') };
const lst = { b: localStorage.getItem(lcl.b)?.split(',') || [], c: localStorage.getItem(lcl.c)?.split(',') || [] };
const txt = { b: elm.b.children[1], c: elm.c.children[1] };
const clr = { b: '#f00', c: '#0f0' };
let newtab = false, cu = '';   // current user

function display(place, data, type, pre) {
    const ul = document.getElementById(type + '_' + place);
    for (const item of data) {
        const b = document.createElement('button');
        const c = document.createElement('button');
        const s = document.createElement('button');
        const d = document.createElement('div');
        const img = document.createElement('img');
        const li = document.createElement('li');
        const a = document.createElement('a');
        b.onclick = e => handleBlock(e, 'b');
        c.onclick = e => handleBlock(e, 'c');
        s.onclick = handleSearch;
        img.src = item.avatar_url;
        a.innerText = item.login;
        a.href = item.html_url;
        b.value = item.login;
        c.value = item.login;
        s.value = item.login;
        img.alt = 'avatar';
        a.target = '_blank';
        b.setAttribute('lang-tag', 'block');
        c.setAttribute('lang-tag', 'check');
        s.setAttribute('lang-tag', 'search');
        b.title = lang_obj[current]['block'];
        c.title = lang_obj[current]['check'];
        s.title = lang_obj[current]['search'];
        if (lst.b.includes(item.login)) b.style.color = clr.b;
        if (lst.c.includes(item.login)) c.style.color = clr.c;
        b.innerText = '⨯';
        c.innerText = '✔';
        s.innerText = '.';
        a.prepend(img);
        d.appendChild(s);
        d.appendChild(c);
        d.appendChild(b);
        li.appendChild(a);
        li.appendChild(d);
        if (pre) ul.prepend(li);
        else ul.appendChild(li);
    }
}

function counts(place, data, type) {
    const span = document.getElementById('c_' + type + '_' + place);
    span.innerText = ` (${data})`;
}

function play(scene) {
    if (scene === 1) {
        table.removeAttribute('style');
        p.style.display = 'none';
    }
    else if (scene === 0) {
        table.style.display = 'none';
        p.removeAttribute('style');
    }
}

function clear() {
    for (const c of ['', 'c_']) {
        for (const type of ['all', 'dif']) {
            for (const place of ['followers', 'following']) {
                document.getElementById(c + type + '_' + place).innerHTML = '';
            }
        }
    }
}

async function fetchData(user) {
    const res = { followers: [], following: [] };
    const blocked_following = [];
    for (const key in res) {
        let url = `https://api.github.com/users/${user}/${key}?per_page=100&page=`;
        let data = [], len = 0, i = 0;
        do {
            data = await (await fetch(url + ++i)).json();
            if (!Array.isArray(data)) {
                p.innerText = data.message;
                play(0);
                return;
            }
            else if (newtab) {
                window.open('https://github.com/' + user, '_blank');
                newtab = false;
                return;
            }
            else if (i === 1 && key === Object.keys(res)[0]) {
                clear();
                play(1);
            }
            len = data.length;
            if (key === Object.keys(res)[1]) {
                for (let j = 0; j < data.length; j++) {
                    if (lst.b.includes(data[j].login)) {
                        blocked_following.push(data.splice(j, 1)[0]);
                    }
                }
            }
            display(key, data, 'all');
            res[key].push(...data);
        } while (len === 100);
        if (key === Object.keys(res)[1] && blocked_following.length > 0) {
            display(key, blocked_following, 'all', true);
            res[key].unshift(...blocked_following);
        }
        counts(key, res[key].length, 'all');
    }

    // Get items that only occur in the left array,
    // using the compare function to determine equality.
    const compare = (left, right) => left.filter(a => !right.some(b => a.login === b.login));

    const result = { followers: [], following: [] };
    result.followers = compare(res.followers, res.following);
    result.following = compare(res.following, res.followers);
    for (const key in result) {
        counts(key, result[key].length, 'dif');
        display(key, result[key], 'dif');
    }
}

function setURL(user) {
    if (cu != user) {
        const url = new URL(window.location);
        url.searchParams.set('user', user);
        window.history.pushState({}, '', url);
        cu = user;
    }
}

function loadPage() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (search, prop) => search.get(prop)
    });
    const value = params.user;
    if (value) {
        input.value = value;
        fetchData(value);
        cu = value;
    }
}

function handleSearch(e) {
    newtab = false;
    const value = e.target.value;
    input.value = value;
    fetchData(value);
    setURL(value);
}

function handleBlock(e, v) {
    const value = e.target.value;
    const index = lst[v].indexOf(value);
    if (index > -1) {
        e.target.removeAttribute('style');
        lst[v].splice(index, 1);
    }
    else {
        e.target.style.color = clr[v];
        lst[v].push(value);
    }
    elm[v].setAttribute('count', lst[v].length);
    if (lst[v].length < 1) localStorage.removeItem(lcl[v]);
    else localStorage.setItem(lcl[v], lst[v]);
    txt[v].value = lst[v];
}

function handleSubmit(e) {
    e.preventDefault();
    const value = e.target[0].value;
    if (!newtab) setURL(value);
    fetchData(value);
}

function handleChange(v) {
    if (cbx[v].checked) {
        if (lst[v].length > 0) txt[v].value = lst[v];
        elm[v].style.display = 'flex';
    }
    else {
        elm[v].removeAttribute('style');
    }
}

function handleClick(e, v, t) {
    if (t) {
        txt[v].select();
        document.execCommand('copy');
    }
    else {
        const value = txt[v].value;
        if (value.trim()) {
            localStorage.setItem(lcl[v], value);
            lst[v] = value.split(',');
        }
        else {
            localStorage.removeItem(lcl[v]);
            lst[v] = [];
        }
        elm[v].setAttribute('count', lst[v].length);
    }
    const text = e.nextElementSibling;
    text.style.visibility = 'unset';
    setTimeout(() => text.removeAttribute('style'), 1000);
}

elm.b.setAttribute('count', lst.b.length);

elm.c.setAttribute('count', lst.c.length);

window.addEventListener('load', () => handleChange('b'));

window.addEventListener('load', () => handleChange('c'));

window.addEventListener('popstate', loadPage);

loadPage();