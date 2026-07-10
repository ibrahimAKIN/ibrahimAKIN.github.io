class Sidenav extends HTMLElement {
    connectedCallback() {
        const lang_support = typeof lang_obj === 'undefined' ? 'disabled' : '';
        const color = typeof colors === 'undefined' ? null : colors.pop();
        this.innerHTML = `
            <div id="sidenav">
                <div class="main">
                    <div>
                        <a title="Home" class="filled home" href="/" lang-tag="nav_home"></a>
                        <span lang-tag="nav_home">Home</span>
                    </div>
                    <div></div>
                    <div class="menu hvr">
                        <input title="Projects" class="pin-menu" type="checkbox" lang-tag="projects" tabindex="-1">
                        <div class="filled project" tabindex="0"></div>
                        <span lang-tag="projects">Projects</span>
                        <div class="expand more">
                            <div class="up">
                                <a title="Search YouTube" class="filled search" href="/projects/search-youtube"></a>
                                <span>Search YouTube</span>
                            </div>
                            <div>
                                <a title="Language App" class="filled smile-n" href="/projects/language-app"></a>
                                <span>Language App</span>
                                <div>
                                    <a title="Code Playground" class="filled code" href="/projects/code-playground"></a>
                                    <span>Code Playground</span>
                                    <div>
                                        <a title="Face Detector" class="filled face" href="/projects/face-detector" lang-tag="face_detector"></a>
                                        <span lang-tag="face_detector">Face Detector</span>
                                        <div>
                                            <a title="Movies" class="filled movies" href="/projects/movies" lang-tag="nav_movies"></a>
                                            <span lang-tag="nav_movies">Movies</span>
                                            <div>
                                                <a title="LCD Character Generator" class="filled iicon" href="/projects/lcd-character-generator" lang-tag="lcd"></a>
                                                <span lang-tag="lcd">LCD Character Generator</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="menu hvr">
                        <input title="Games" class="pin-menu" type="checkbox" lang-tag="games" tabindex="-1">
                        <div class="filled games" tabindex="0"></div>
                        <span lang-tag="games">Games</span>
                        <div class="expand more">
                            <div class="up">
                                <a title="Tetris" class="filled tetris" href="/games/tetris"></a>
                                <span>Tetris</span>
                            </div>
                            <div>
                                <a title="Snake" class="filled snake" href="/games/snake"></a>
                                <span>Snake</span>
                                <div>
                                    <a title="Bird" class="filled bird" href="/games/bird"></a>
                                    <span>Bird</span>
                                    <div>
                                        <a title="Tic Tac Toe" class="filled tic-tac-toe" href="/games/tic-tac-toe" lang-tag="xox"></a>
                                        <span lang-tag="xox">Tic Tac Toe</span>
                                        <div>
                                            <a title="Ping Pong" class="filled pong" href="/games/pong" lang-tag="pong"></a>
                                            <span lang-tag="pong">Ping Pong</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <a title="Resume" class="filled resume" href="/resume" lang-tag="resume"></a>
                        <span lang-tag="resume">Resume</span>
                    </div>
                    <div>
                        <a title="Blog" class="filled blog" href="/blog"></a>
                        <span>Blog</span>
                    </div>
                    <div class="menu hvr">
                        <input title="Settings" class="pin-menu" type="checkbox" lang-tag="settings" tabindex="-1">
                        <div class="filled settings" tabindex="0"></div>
                        <span lang-tag="settings">Settings</span>
                        <div class="expand more">
                            <div class="up">
                                ${color ?
                                    `<div class="up">
                                        <div title="Colors" lang-tag="colors" class="filled color">
                                            ${colors.map(i => `<button aria-label="Color" value="${i}" style="--color:${i}"></button>`).join('')}
                                        </div>
                                    </div>` : ''
                                }
                                <div title="Türkçe" lang-name="tr" class="filled tr lang-button" tabindex="0" ${lang_support}></div>
                                <span>${lang_support ? 'Türkçe' : lang_obj.tr.nav_turkish}</span>
                            </div>
                            <div>
                                <div title="English" lang-name="en" class="filled en lang-button" tabindex="0" ${lang_support}></div>
                                <span>English</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const pins = this.getElementsByClassName('pin-menu');
        for (const pin of pins) {
            pin.addEventListener('touchstart', e => {
                if (e.target.open || e.target.checked) {
                    e.target.parentElement.classList.remove('hvr');
                    e.target.open = 0;
                }
                else {
                    e.target.parentElement.classList.add('hvr');
                    e.target.open = 1;
                }
            }, { passive: true });
            pin.addEventListener('change', e => {
                for (const p of pins) if (e.target.open >= 0 || e.target !== p) p.checked = false;
                e.target.blur();
            });
            pin.parentElement.addEventListener('mouseleave', e => {
                delete e.target.firstElementChild.open;
                e.target.classList.add('hvr');
            });
        }
        if (color) {
            for (const b of this.getElementsByClassName('color')[0].children) {
                b.addEventListener('click', e => {
                    document.querySelector(':root').style.setProperty(color, e.target.value);
                    document.querySelector('meta[name="theme-color"]').setAttribute('content', e.target.value);
                    e.target.blur();
                });
            }
            colors.push(color);
        }
    }
}
customElements.define('side-nav', Sidenav);