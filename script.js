'usestrict'
console.log(document.title)

// openDirBtn.addEventListener("click", async(e)=>{
//     console.log("open dir picker")
//     const handles = await getFile()
//   // run code for dirHandle
//     for (let handle of handles){
//         console.log(handle)
//         const file = await handle.getFile();
//         const contents = await file.text();

//         //console.log(contents)
//         const parser = new DOMParser();
//         let xmlDoc = parser.parseFromString(contents,"text/xml");
//         // 
//         let culture = xmlDoc.querySelector('[name="Culture"]')
//         let value = culture.querySelector('value')
//         // value = newLang
//         value.textContent = newLang
//         console.log(value.textContent)
//         //
//         const xmlSerializer = new XMLSerializer();
//         const str = xmlSerializer.serializeToString(xmlDoc);
//         console.log(str)

//         // Create a FileSystemWritableFileStream to write to.
//         const writable = await handle.createWritable();
//         // Write the contents of the file to the stream.
//         await writable.write(str);
//         // Close the file and write the contents to disk.
//         await writable.close();
//     }
// }
// )

class LangChanger {
  constructor(params) {
    this.langs = params.langs
    this.btnTarget = params.btnTargetId
    this.pickerOpts = params.pickerOpts
    this.openDirBtn = document.querySelector("#openDirPicker01")
    this.iniState = {
      isPickedFile:false,
      isSelectedLang:false,
      isSavedFile:false,
    }
  }
  // Handlers
  async getFile() {
    const fileHandles = await window.showOpenFilePicker(this.pickerOpts);
    return fileHandles
  }
  async returnTxtContent(handles){
    let contents = []
    for (let handle of handles){
      console.log(handle)
      const file = await handle.getFile();
      const contents = await file.text();
      contents.push(contents)
    }
    return contents[0]
  }
  returnXMLDoc(content){
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content,"text/xml");
    return xmlDoc
  }
  changeLangValue(xmlDoc, newLang){
    let culture = xmlDoc.querySelector('[name="Culture"]')
    let value = culture.querySelector('value')
    value.textContent = newLang
    console.log(value.textContent)
  }
  serializeXML(xmlDoc){
    const xmlSerializer = new XMLSerializer();
    const str = xmlSerializer.serializeToString(xmlDoc);
    console.log(str)
    return str
  }
  async saveFile(str, handle){
    const writable = await handle.createWritable();
    await writable.write(str);
    await writable.close();
  }
  // event-Listeners
  listenFilePicker(fn){
    this.openDirBtn.addEventListener('click', (e)=>{
      fn()
    })
  }
  listenLangChangers(fn, data){
    data.forEach((el)=>{
      const btn = document.querySelector(`#change_${el.value}`)
      btn.addEventListener('click', (e)=>{
        fn()
      })
    })
  }
  // Side-Effects
  createChgBtns(target, data){
    data.forEach((el)=>{
      target.insertAdjacentHTML('beforeend',`
      <button id = 'change_${el.value}' data-value = '${el.value}'>${el.name}</button>
      `)
    })
  }
  // init
  init(){
    const self = this
    console.log(this.langs)
    this.listenFilePicker(self.getFile.bind(self))
    this.createChgBtns
  }
}
const langChangerParams = {
  btnTargetId:btnTarget,
  langs: [
    { name: "English", value: "en-GB" },
    { name: "繁體中文", value: "zh-TW" },
    { name: "簡體中文", value: "zh-TW" },
  ],
  pickerOpts: {
    types: [
      {
        description: "config filter",
        accept: {
          "config/*": [".config"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  },
}
const langChanger = new LangChanger(langChangerParams);
langChanger.init()