
import './home.css'
const menu = ['Home', 'About', 'Contact', 'Login', 'Register'];

export default function Home () {
  return (
    <main className='grid-container'>
      <header className='header'>
        <section>
          <img src='./logo.jpg' height='100px' width='100px' />
        </section>
        <section className='section-nav'>
          <nav>
            <ul>
              {menu.map((item, index) => (
                <li><a key={index} href={`${item}`}>{item}</a></li>
              ))}
            </ul>
          </nav>
        </section>
      </header>
      <section className='section-aside'>
        imagen
        <div id="circulo"> </div>
      </section>
      <footer>FOOTER</footer>

    </main>
  )
}