export interface LigneMiseAJour {
    id: string,
    texteMisAjour: string
}

export class EditeurService {
    
    insertionDeTexte(caractèreAInsérer: string): LigneMiseAJour {
        let curseur = window.getSelection() as Selection 
        const ligne = this.retourneLaLigneModifiée(curseur.focusNode as HTMLElement)    
        let currentOffset = curseur.focusOffset;
        let currentNode = (curseur.focusNode as HTMLElement)
        currentNode = (currentNode.parentElement?.tagName !== 'P' ? currentNode.parentElement : currentNode) as HTMLElement
        let currentNodeIndex = Array.prototype.indexOf.call(ligne.childNodes, currentNode)

        let nextOffset: number; 
        let nextCurrentNodeIndex: number;
        let parentContainerCurseur: Node;
        const insChild = document.createElement("del");
        insChild.textContent = caractèreAInsérer

        if (this.lOffsetEstEnPremièrePositionDeSonElement(currentOffset) && !this.estDansUnIns(currentNode)) {
            const oldCurrentSpanValue = currentNode.innerHTML;
            currentNode.outerHTML = `<ins>${caractèreAInsérer}</ins><span>${oldCurrentSpanValue}</span>`
            this.optimisationDesDelIns(ligne)
            nextOffset = 0
            nextCurrentNodeIndex = currentNodeIndex === 0 ? 1 : currentNodeIndex
            parentContainerCurseur = ligne.childNodes[nextCurrentNodeIndex] as Node
        } else if (!this.lOffsetEstEnDernièrePosition(currentNode, currentOffset) && !this.estDansUnIns(currentNode)) {
            const oldCurrentSpanValue = currentNode.innerHTML;
            currentNode.outerHTML = `<span>${oldCurrentSpanValue.slice(0, currentOffset)}</span><ins>${caractèreAInsérer}</ins><span>${oldCurrentSpanValue.slice(currentOffset)}</span>`
            this.optimisationDesDelIns(ligne)
            nextOffset = 0
            nextCurrentNodeIndex = currentNodeIndex + 2
            parentContainerCurseur = ligne.childNodes[nextCurrentNodeIndex] as Node
        } else if (this.lOffsetEstEnDernièrePosition(currentNode, currentOffset) && !this.estDansUnIns(currentNode) && this.estLeDernierElementDeLEditeur(currentNode, ligne)) {
            const oldCurrentSpanValue = currentNode.innerHTML;
            currentNode.outerHTML = `<span>${oldCurrentSpanValue.slice(0, currentOffset)}</span><ins>${caractèreAInsérer}</ins>`
            nextOffset = ((ligne.childNodes[currentNodeIndex + 1] as HTMLElement).textContent as string).length
            nextCurrentNodeIndex = currentNodeIndex + 1
            parentContainerCurseur = ligne.childNodes[nextCurrentNodeIndex] as Node
        } else {
            const oldCurrentValue = currentNode.innerHTML;
            currentNode.innerHTML = `${oldCurrentValue.slice(0, currentOffset)}${caractèreAInsérer}${oldCurrentValue.slice(currentOffset)}`
            if (oldCurrentValue.length === currentOffset) {
                nextOffset = (currentNode.textContent as string).length
            } else {
                nextOffset = currentOffset + 1
            }
            nextCurrentNodeIndex = 0
            parentContainerCurseur = currentNode.childNodes[0] as Node
        }
        this.repositionnmentDuCurseur(nextOffset, parentContainerCurseur)
        return {id: ligne.id, texteMisAjour: ligne.innerHTML.replace(/<\/?span>/g, '')}
    }

    retourneLaLigneModifiée(elementNode: HTMLElement): HTMLElement {
        return elementNode.tagName === 'P' ? elementNode : this.retourneLaLigneModifiée(elementNode.parentNode as HTMLElement)
    }
    
    optimisationDesDelIns(element: HTMLElement): void {
        element.innerHTML = element.innerHTML
            .replaceAll('</ins><ins>', '')
            .replaceAll('</span><span>', '')
            .replaceAll('<span></span>', '')
    }

    repositionnmentDuCurseur(offset: number, element: Node): void {
        let nouvellePositionDuCurseur = (document.getSelection() as Selection)
        nouvellePositionDuCurseur.removeAllRanges()
        let range = document.createRange()
        range.setStart(element, offset)
        nouvellePositionDuCurseur.addRange(range)
    }

    estDansUnIns(htmlElement: HTMLElement): boolean {
        return htmlElement.tagName === 'INS'
    }

    estLeDernierElementDeLEditeur(htmlElement: HTMLElement, ligne: HTMLElement): boolean {
        const ancienNombreDeNodes = ligne.childNodes.length
        let currentNodeIndex = Array.prototype.indexOf.call(ligne.childNodes, htmlElement)
        return currentNodeIndex + 1 === ancienNombreDeNodes
    }

    lOffsetEstEnDernièrePosition(htmlElement: HTMLElement, currentOffset: number): boolean {
        return currentOffset === (htmlElement.textContent as string).length
    }

    lOffsetEstEnPremièrePositionDeSonElement(currentOffset: number): boolean {
        return currentOffset === 0
    }
}