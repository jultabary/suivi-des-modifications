import './App.css';
import Editeur from './Editeur';

function App() {
  const article = {
    id: 'unarticle',
    lignes: [{id: 'article1_1', texteInitial: 'Une première ligne à éditer'}, {id: 'article1_2', texteInitial: 'Une seconde ligne à éditer'}]
  };
  const miseAJour = (ligne: string, texteMisAJour: string) => {
    console.log(`Texte mis à jour: ${ligne} ${texteMisAJour}`)
  };
  return (
      <header role="banner" className="App-header">
        <main>
          <Editeur texteAEdité={article} notifierDeLaMiseAJour={miseAJour} />
        </main>
      </header>
  );
}

export default App;
