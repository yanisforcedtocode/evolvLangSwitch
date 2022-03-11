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
  // set states
  setIsFileHandle(){}
  setIsSetLang(){}

  // event-Listeners
  listenFilePicker(fn){
    this.openDirBtn.addEventListener('click', (e)=>{
      fn()
    })
  }
  listenLangChangers(fn, dataArr){
    console.log(dataArr)
    for (let data of dataArr){
      const btn = document.querySelector(`#change_${data.value}`)
      console.log(btn)
      btn.addEventListener('click', (e)=>{
        console.log('click')
        //fn()
      })
    }
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
  async init(){
    const self = this
    console.log(this.langs)
    // add file picker listener
    this.listenFilePicker(self.getFile.bind(self))
    // create buttons to change lang by params input
    this.createChgBtns(this.btnTarget, this.langs)
    // listen to change lang buttons
    this.listenLangChangers(function(){console.log("click")}, this.langs)

  }
}
const langChangerParams = {
  btnTargetId:btnTarget,
  langs: [
    { name: "English", value: "en-GB" },
    { name: "繁體中文", value: "zh-TW" },
    { name: "簡體中文", value: "zh-CN" },
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