'usestrict'
console.log(document.title)

class LangChanger {
  constructor(params) {
    this.langs = params.langs
    this.btnTarget = params.btnTargetId
    this.pickerOpts = params.pickerOpts
    this.openDirBtn = document.querySelector("#openDirPicker01")
    this.completeMsg = document.querySelector("#completeMsg")
    this.filePickerMsg = document.querySelector("#filePickerMsg")
    this.iniState = {
      isReadFile:false,
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
      const file = await handle.getFile();
      const content = await file.text();
      contents.push({
        name: handle.name,
        handle: handle,
        content: content,
      })
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
  }
  serializeXML(xmlDoc){
    const xmlSerializer = new XMLSerializer();
    const str = xmlSerializer.serializeToString(xmlDoc);
    return str
  }
  async saveFile(str, handle){
    try{
      const writable = await handle.createWritable();
      await writable.write(str);
      await writable.close();
      return "success"
    }catch(err){
      console.log(err)
      return "fail"
    }
  }
  // set states
  setIsReadFile(content){
    if(content){
      this.currentState.isReadFile = content
      this.evoke(this.currentState)
    }else{
      this.currentState.isReadFile = "wrongFile"
      this.evoke(this.currentState)
    }
  }
  setIsSetLang(lang){
    if(lang){
      this.currentState.isSelectedLang = lang
    } else {
      this.currentState.isSelectedLang = false
    }
    this.evoke(this.currentState)
  }
  setIsSavedFile(result){
    if(result === "success" && this.currentState.isSavedFile !== this.currentState.isSelectedLang){
      this.currentState.isSavedFile = this.currentState.isSelectedLang
      this.evoke(this.currentState)
    } else {
      this.currentState.isSavedFile = false
      this.evoke(this.currentState)
    }
  }

  // event-Listeners
  listenFilePicker(fn){
    this.openDirBtn.addEventListener('click', (e)=>{
      fn()
    })
  }
  listenLangChangers(fn, dataArr){
    for (let data of dataArr){
      const btn = document.querySelector(`#change_${data.value}`)
      btn.addEventListener('click', (e)=>{
        fn(e.target.dataset.value)
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
  showCompleteMsg(lang){
    this.completeMsg.style.display = "block"
    this.completeMsg.innerText = `Language is changed to ${lang}.`
  }
  showWarningMsg(msg){
    this.completeMsg.style.display = "block"
    this.completeMsg.innerText = msg
  }
  showFilePickerMsg(msg){
    this.filePickerMsg.style.display = 'block'
    this.filePickerMsg.innerText = msg
  }
  hideFilePickerMsg(){
    this.filePickerMsg.style.display = 'none'
  }
  hideCompleteMsg(){
    this.completeMsg.style.display = "none"
  }
  hideReadFileBtn(){
    this.openDirBtn.style.display = "none"
  }
  // conditions
  isEvolvConfig(content){
    if(content.name === "EvolvRehab.exe.config"){
      return content
    } else {
      return false
    }
  }
  // evoke
  evoke(currentState){
    console.log(currentState)
    if(currentState.isReadFile && currentState.isReadFile !== "wrongFile"){
      this.hideReadFileBtn()
      this.showFilePickerMsg('Config file is successfully loaded. Please proceed to choose the language.')
    }
    if(currentState.isReadFile && currentState.isReadFile === "wrongFile"){
      this.showFilePickerMsg('An incorrect .config file is loaded! Please find the correct file and load again.')
    }
    if(currentState.isReadFile && currentState.isReadFile !== "wrongFile" && !currentState.isSelectedLang){
      const self = this
      this.createChgBtns(this.btnTarget, this.langs)
      this.listenLangChangers(self.setIsSetLang.bind(self), this.langs)
    }
    if(currentState.isSelectedLang && this.currentState.isSavedFile !== this.currentState.isSelectedLang){
      this.saveLangCompo(this.currentState.isSelectedLang, this.currentState.isReadFile)
    }
    if(currentState.isSavedFile && currentState.isReadFile !== "wrongFile"){
      this.showCompleteMsg(this.currentState.isSavedFile)
    }

  }
  // composition
  async returnContentCompo(){
    // getFile
    const handles = await this.getFile()
    const content = await this.returnTxtContent(handles)
    // returnTxtContent if handle.name = fileName || false
    this.setIsReadFile(this.isEvolvConfig(content))
  }
  
  async saveLangCompo(lang, content){
    const xmlDoc = this.returnXMLDoc(content.content)
    this.changeLangValue(xmlDoc, lang)
    const result = await this.saveFile(this.serializeXML(xmlDoc), content.handle)
    this.setIsSavedFile(result)
  }

  // init
  async init(){
    const self = this
    // mount current states
    this.currentState = this.iniState
    this.evoke(this.currentState)
    // add file picker listener
    this.listenFilePicker(self.returnContentCompo.bind(self))
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