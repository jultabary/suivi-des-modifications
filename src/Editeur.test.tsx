import { render } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Editeur from "./Editeur";



describe('Ajout de modification au texte inital', () => {

    test("Quand j'ajoute des caractères en début de texte, alors une balise <ins> avec le texte ajouté est concaténé au texte intial.", async() => {
        // Given
        const modification = new Array<{ligne: string, texte: string}>()
        const modificationRecue = (ligne: string, texte: string) => {
            modification.push({ligne, texte})
        }
        const articleId = 'article1'
        const texteAModifié = [
            {id: 'alinea_1', texteInitial: 'Une première ligne.'},
            {id: 'alinea_2', texteInitial: 'Une deuxième ligne.'}
        ]
        let article = {id: articleId, lignes: texteAModifié}

        const { getByRole } = render(<Editeur data-testid="article1" texteAEdité={article} notifierDeLaMiseAJour={modificationRecue} />);

        // When
        const element = getByRole('article').childNodes[0] as HTMLElement;
        await userEvent.click(element as HTMLElement)
        await userEvent.type(element, "Insertion")

        // Then
        expect(modification.length).not.toBe(0)
        expect(modification[modification.length - 1]).toStrictEqual({ligne: 'alinea_1', texte: 'Une première ligne.<ins>Insertion</ins>'})
    });    
})
  