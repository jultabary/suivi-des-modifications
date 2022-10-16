import { SyntheticEvent } from "react";
import { useLayoutEffect } from "react";
import { Article } from "./Article";
import { EditeurService } from "./EditeurService";

interface EditeurProps {
    texteAEdité: Article
    notifierDeLaMiseAJour: (ligne: string, texte: string) => void
}

interface CustomEvent extends SyntheticEvent {
    shiftKey ?: boolean
    ctrlKey ?: boolean
    key ?: string
    code ?: string
  }

function Editeur(props: EditeurProps) {
    const article = props.texteAEdité
    const service = new EditeurService()

    useLayoutEffect(() => {
        for (const ligne of article.lignes) {
            const ligneHTMLElement = document.getElementById(ligne.id) as  HTMLElement
            ligneHTMLElement.innerHTML = `<span>${ligne.texteInitial}</span>`
        }
    })

    const onKeyDownHandle = (event: CustomEvent) => {
        if (event.key && (event.key.length === 1 || event.code === 'Space')) {
            const ligneModifiée = service.insertionDeTexte(event.key)
            event.preventDefault()
            props.notifierDeLaMiseAJour(ligneModifiée.id, ligneModifiée.texteMisAjour)
        }
    };

    return (
        <article id={article.id} contentEditable="true" onKeyDown={onKeyDownHandle} >
            {(
                () => {
                    let lignes = []
                    for (let i = 0; i < article.lignes.length; i++) {
                        lignes.push(<p className="ligne" key={article.lignes[i].id} id={article.lignes[i].id} ></p>)
                    }
                    return lignes
                }
            )()}
        </article>
    );
}

export default Editeur; 