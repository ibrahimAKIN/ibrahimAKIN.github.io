class Topnav extends HTMLElement {
    connectedCallback() {
        const lang_support = typeof lang_obj === 'undefined' ? 'disabled' : '';
        const color = typeof colors === 'undefined' ? null : colors.pop();
        this.innerHTML = `
            <div id="topnav" class="main">
                <div>
                    <a title="Home" class="filled home" href="/" lang-tag="nav_home"></a>
                    <span lang-tag="nav_home">Home</span>
                </div>
                <div></div>
                <div class="menu hvr">
                    <div title="Projects" class="filled project" lang-tag="projects"></div>
                    <span lang-tag="projects">Projects</span>
                    <div class="expand">
                        <div>
                            <a title="Search YouTube" class="filled search" href="/projects/search-youtube"></a>
                            <span>Search YouTube</span>
                        </div>
                        <div>
                            <a title="Language App" class="filled smile-n" href="/projects/language-app"></a>
                            <span>Language App</span>
                        </div>
                        <div>
                            <a title="Code Playground" class="filled code" href="/projects/code-playground"></a>
                            <span>Code Playground</span>
                        </div>
                        <div>
                            <a title="Face Detector" class="filled face" href="/projects/face-detector" lang-tag="face_detector"></a>
                            <span lang-tag="face_detector">Face Detector</span>
                        </div>
                        <div>
                            <a title="Movies" class="filled movies" href="/projects/movies" lang-tag="nav_movies"></a>
                            <span lang-tag="nav_movies">Movies</span>
                        </div>
                        <div>
                            <a title="LCD Character Generator" class="filled iicon" href="/projects/lcd-character-generator" lang-tag="lcd"></a>
                            <span lang-tag="lcd">LCD Character Generator</span>
                        </div>
                    </div>
                </div>
                <div class="menu hvr">
                    <div title="Games" class="filled games" lang-tag="games"></div>
                    <span lang-tag="games">Games</span>
                    <div class="expand">
                        <div>
                            <a title="Tetris" class="filled tetris" href="/games/tetris"></a>
                            <span>Tetris</span>
                        </div>
                        <div>
                            <a title="Snake" class="filled snake" href="/games/snake"></a>
                            <span>Snake</span>
                        </div>
                        <div>
                            <a title="Bird" class="filled bird" href="/games/bird"></a>
                            <span>Bird</span>
                        </div>
                        <div>
                            <a title="Tic Tac Toe" class="filled tic-tac-toe" href="/games/tic-tac-toe" lang-tag="xox"></a>
                            <span lang-tag="xox">Tic Tac Toe</span>
                        </div>
                        <div>
                            <a title="Ping Pong" class="filled pong" href="/games/pong" lang-tag="pong"></a>
                            <span lang-tag="pong">Ping Pong</span>
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
                    <div title="Settings" class="filled settings" lang-tag="settings"></div>
                    <span lang-tag="settings">Settings</span>
                    <div class="expand">
                        <div>
                            <div title="Türkçe" lang-name="tr" class="filled tr lang-button" tabindex="0" ${lang_support}></div>
                            <span>${lang_support ? 'Türkçe' : lang_obj.tr.nav_turkish}</span>
                        </div>
                        <div>
                            <div title="English" lang-name="en" class="filled en lang-button" tabindex="0" ${lang_support}></div>
                            <span>English</span>
                        </div>
                        ${color ?
                            `<div>
                                <div title="Colors" lang-tag="colors" class="filled color">
                                    ${colors.map(i => `<button aria-label="Color" value="${i}" style="--color:${i}"></button>`).join('')}
                                </div>
                            </div>` : ''
                        }
                    </div>
                </div>
            </div>
        `;
        const pins = this.getElementsByClassName('menu');
        for (const pin of pins) {
            pin.addEventListener('touchstart', e => {
                if (e.target.open) {
                    e.target.parentElement.classList.remove('hvr');
                    delete e.target.open;
                }
                else {
                    e.target.parentElement.classList.add('hvr');
                    e.target.open = true;
                }
            }, { passive: true });
            pin.addEventListener('mouseleave', e => {
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
        }
    }
}
customElements.define('top-nav', Topnav);