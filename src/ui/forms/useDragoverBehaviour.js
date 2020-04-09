import { useEffect } from 'react'

const useDragoverBehaviour = dropFileRef => {
  useEffect(() => {
    const dropFileElement = dropFileRef.current

    const preventBehaviour = e => {
      e.preventDefault()
      e.stopPropagation()
    }

    const addDragoverClass = event => {
      preventBehaviour(event)
      dropFileElement.classList.add('is-dragover')
    }

    const removeDragoverClass = event => {
      preventBehaviour(event)
      dropFileElement.classList.remove('is-dragover')
    }

    dropFileElement.addEventListener('dragover', addDragoverClass)
    dropFileElement.addEventListener('dragenter', addDragoverClass)

    dropFileElement.addEventListener('dragleave', removeDragoverClass)
    dropFileElement.addEventListener('dragend', removeDragoverClass)
    dropFileElement.addEventListener('drop', removeDragoverClass)

    return () => {
      dropFileElement.removeEventListener('dragover', addDragoverClass)
      dropFileElement.removeEventListener('dragenter', addDragoverClass)

      dropFileElement.removeEventListener('dragleave', removeDragoverClass)
      dropFileElement.removeEventListener('dragend', removeDragoverClass)
      dropFileElement.removeEventListener('drop', removeDragoverClass)
    }
  }, [dropFileRef])
}

export default useDragoverBehaviour
