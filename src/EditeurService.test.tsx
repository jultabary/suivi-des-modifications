import { EditeurService } from "./EditeurService";

describe("Mise à jour d'un paragraphe suite à une insertion", () => {

    test("Quand j'ajoute des caractères en début de texte, alors une balise <ins> avec le texte ajouté est concaténé au texte intial.", async() => {
        // Given
        const service = new EditeurService()
        const article = document.createElement('article')
        article.id = 'article'
        article.contentEditable = 'true'
        document.body.appendChild(article)

        const premièreLigne = document.createElement('p')
        premièreLigne.id = 'ligne1'
        premièreLigne.innerHTML = '<span>Texte initial</span>'
        article.appendChild(premièreLigne)

        // When
        const ligneModifiée = service.insertionDeTexte("A", premièreLigne.childNodes[0] as HTMLElement, 0)
        
        
        // Then
        expect(ligneModifiée.id).toBe('ligne1')
        expect(ligneModifiée.texteMisAjour).toBe('<ins>A</ins>Texte initial')
    });    
})
  