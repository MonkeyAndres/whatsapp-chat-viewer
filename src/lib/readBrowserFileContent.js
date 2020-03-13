const readBrowserFileContent = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = ev => {
      resolve(ev.target.result)
    }

    reader.onerror = ev => {
      reject(ev.target.error)
    }

    reader.readAsText(file)
  })
}

export default readBrowserFileContent
