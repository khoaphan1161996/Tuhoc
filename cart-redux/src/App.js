import Header from './components/Header'
import Products from './components/Products'
import Message from './components/Message'
import Cart from './components/Cart'
import Footer from './components/Footer'

function App() {
  return (
    <div>
        <div>
        <Header />
        
        <main id="mainContainer">
            <div className="container">
                <Products />
                <Message />
                <Cart />
            </div>
        </main>

        <Footer />
    </div>
    </div>
  );
}

export default App;