import { SyntheticEvent } from "react";
import { useLayoutEffect, useRef } from "react";
import { Article } from "./Article";

interface EditeurProps {
    texteAEdité: Article[]
    notifierDeLaMiseAJour: (ligne: string, texte: string) => void
}

interface CustomEvent extends SyntheticEvent {
    data ?: string
  }

function Editeur(props: EditeurProps) {
    const texteAEdité = props.texteAEdité

    useLayoutEffect(() => {
        for (const ligne of texteAEdité) {
            const ligneHTMLElement = document.getElementById(ligne.id) as  HTMLElement
            ligneHTMLElement.innerHTML = `<span>${ligne.texteInital}</span>`
        }
    })

    const retourneLaLigneModifiée = (elementNode: HTMLElement): HTMLElement => {
        return elementNode.tagName === 'P' ? elementNode : retourneLaLigneModifiée(elementNode.parentNode as HTMLElement)
    }
    
    const optimisationDesDelIns = (element: HTMLElement) => {
        element.innerHTML = element.innerHTML
            .replaceAll('</ins><ins>', '')
            .replaceAll('</span><span>', '')
            .replaceAll('<span></span>', '')
    }

    const repositionnmentDuCurseur = (offset: number, element: Node) => {
        let nouvellePositionDuCurseur = (document.getSelection() as Selection)
        nouvellePositionDuCurseur.removeAllRanges()
        let range = document.createRange()
        range.setStart(element, offset)
        nouvellePositionDuCurseur.addRange(range)
    }

    const estDansUnIns = (htmlElement: HTMLElement) => {
        return htmlElement.tagName === 'INS'
    }

    const estLeDernierElementDeLEditeur = (htmlElement: HTMLElement, ligne: HTMLElement) => {
        const ancienNombreDeNodes = ligne.childNodes.length
        let currentNodeIndex = Array.prototype.indexOf.call(ligne.childNodes, htmlElement)
        return currentNodeIndex + 1 === ancienNombreDeNodes
    }

    const lOffsetEstEnDernièrePosition = (htmlElement: HTMLElement, currentOffset: number) => {
        return currentOffset === (htmlElement.textContent as string).length
    }

    const lOffsetEstEnPremièrePositionDeSonElement = (currentOffset: number) => {
        return currentOffset === 0
    }

    const onBeforeInputHandle = (event: CustomEvent) => {
        let curseur = window.getSelection() as Selection 
        const ligne = retourneLaLigneModifiée(curseur.focusNode as HTMLElement)
        
        if (event.data) {
            let currentOffset = curseur.focusOffset;
            let currentNode = (curseur.focusNode as HTMLElement)
            currentNode = (currentNode.parentElement?.tagName !== 'P' ? currentNode.parentElement : currentNode) as HTMLElement
            let currentNodeIndex = Array.prototype.indexOf.call(ligne.childNodes, currentNode)

            let nextOffset: number; 
            let nextCurrentNodeIndex: number;
            let parentContainerCurseur: Node;
            const insChild = document.createElement("del");
            insChild.textContent = event.data

            if (lOffsetEstEnPremièrePositionDeSonElement(currentOffset) && !estDansUnIns(currentNode)) {
                const oldCurrentSpanValue = currentNode.innerHTML;
                currentNode.outerHTML = `<ins>${event.data}</ins><span>${oldCurrentSpanValue}</span>`
                optimisationDesDelIns(ligne)
                nextOffset = 0
                nextCurrentNodeIndex = currentNodeIndex === 0 ? 1 : currentNodeIndex
                parentContainerCurseur = ligne.childNodes[nextCurrentNodeIndex] as Node
            } else if (!lOffsetEstEnDernièrePosition(currentNode, currentOffset) && !estDansUnIns(currentNode)) {
                const oldCurrentSpanValue = currentNode.innerHTML;
                currentNode.outerHTML = `<span>${oldCurrentSpanValue.slice(0, currentOffset)}</span><ins>${event.data}</ins><span>${oldCurrentSpanValue.slice(currentOffset)}</span>`
                optimisationDesDelIns(ligne)
                nextOffset = 0
                nextCurrentNodeIndex = currentNodeIndex + 2
                parentContainerCurseur = ligne.childNodes[nextCurrentNodeIndex] as Node
            } else if (lOffsetEstEnDernièrePosition(currentNode, currentOffset) && !estDansUnIns(currentNode) && estLeDernierElementDeLEditeur(currentNode, ligne)) {
                const oldCurrentSpanValue = currentNode.innerHTML;
                currentNode.outerHTML = `<span>${oldCurrentSpanValue.slice(0, currentOffset)}</span><ins>${event.data}</ins>`
                nextOffset = ((ligne.childNodes[currentNodeIndex + 1] as HTMLElement).textContent as string).length
                nextCurrentNodeIndex = currentNodeIndex + 1
                parentContainerCurseur = ligne.childNodes[nextCurrentNodeIndex] as Node
            } else {
                const oldCurrentValue = currentNode.innerHTML;
                currentNode.innerHTML = `${oldCurrentValue.slice(0, currentOffset)}${event.data}${oldCurrentValue.slice(currentOffset)}`
                if (oldCurrentValue.length === currentOffset) {
                    nextOffset = (currentNode.textContent as string).length
                } else {
                    nextOffset = currentOffset + 1
                }
                nextCurrentNodeIndex = 0
                parentContainerCurseur = currentNode.childNodes[0] as Node
            }
            event.preventDefault()
            repositionnmentDuCurseur(nextOffset, parentContainerCurseur)
            const ligneAEnvoyer = ligne.innerHTML.replace(/<\/?span>/g, '')
            props.notifierDeLaMiseAJour(ligne.id, ligneAEnvoyer)
        }
    };

    return (
        <article contentEditable="true" onBeforeInput={onBeforeInputHandle}>
            {(
                () => {
                    let lignes = []
                    for (let i = 0; i < texteAEdité.length; i++) {
                        lignes.push(<p className="ligne" key={props.texteAEdité[i].id} id={props.texteAEdité[i].id} ></p>)
                    }
                    return lignes
                }
            )()}
        </article>
    );
}

export default Editeur; 