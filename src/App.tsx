import './App.css';
import Editeur from './Editeur';

function App() {
  const texteAEdité = ['Une première ligne à éditer', 'Une seconde ligne à éditer'];
  const miseAJour = (ligne: string, texteMisAJour: string) => {
    console.log(`Texte mis à jour: ${ligne} ${texteMisAJour}`)
  };
  return (
      <header role="banner" className="App-header">
        <main>
          <Editeur texteAEdité={texteAEdité} notifierDeLaMiseAJour={miseAJour} />
        </main>
      </header>
  );
}

export default App;
