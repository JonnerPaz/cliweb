export class NavBar extends HTMLElement {
  connectedCallback() {
    this.buildDOM();
    this.updateActiveLink();
    window.addEventListener('hashchange', () => this.updateActiveLink());
  }

  buildDOM() {
    const nav = document.createElement('nav');
    nav.id = 'navbar';

    const logo = document.createElement('div');
    logo.className = 'logo';
    const logoLink = document.createElement('a');
    logoLink.href = '#home';
    logoLink.textContent = 'MetHub';
    logo.appendChild(logoLink);

    const ul = document.createElement('ul');
    ul.className = 'nav-links';
    const links = [
      { href: '#explore', label: 'Explorar' },
      { href: '#departments', label: 'Departamentos' },
      { href: '#compare', label: 'Comparador' },
    ];
    links.forEach(({ href, label }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.appendChild(logo);
    nav.appendChild(ul);
    this.appendChild(nav);
  }

  updateActiveLink() {
    const currentHash = window.location.hash || '#home';
    const links = this.querySelectorAll('nav a');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentHash) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
}
customElements.define('nav-bar', NavBar);
