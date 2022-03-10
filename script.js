'usestrict'
console.log(document.title)



const pickerOpts = {

  };

const newLang = 'abc'






openDirBtn.addEventListener("click", async(e)=>{
    console.log("open dir picker")
    const handles = await getFile()
  // run code for dirHandle
    for (let handle of handles){
        console.log(handle)
        const file = await handle.getFile();
        const contents = await file.text();

        //console.log(contents)
        const parser = new DOMParser();
        let xmlDoc = parser.parseFromString(contents,"text/xml");
        // 
        let culture = xmlDoc.querySelector('[name="Culture"]')
        let value = culture.querySelector('value')
        // value = newLang
        value.textContent = newLang
        console.log(value.textContent)
        //
        const xmlSerializer = new XMLSerializer();
        const str = xmlSerializer.serializeToString(xmlDoc);
        console.log(str)

        // Create a FileSystemWritableFileStream to write to.
        const writable = await handle.createWritable();
        // Write the contents of the file to the stream.
        await writable.write(str);
        // Close the file and write the contents to disk.
        await writable.close();
    }
}
)

class LangChanger {
  constructor(params) {
    this.langs = params.langs
    this.pickerOpts = params.pickerOpts
    this.openDirBtn = document.querySelector("#openDirPicker01")
    // this.zhCNBtn = document.querySelector("#zhCNBtn")
    // this.zhTWBtn = document.querySelector("#zhTWBtn")
    // this.enGBBtn = document.querySelector("#enGBBtn")
    this.iniState = {
      isPickedFile:false,
      isSelectedLang:false,
      isSavedFile:false,
    }
  }
  // Handlers
  async getFile() {
    // open file picker, destructure the one element returned array
    const fileHandles = await window.showOpenFilePicker(this.pickerOpts);
    // run code with our fileHandle
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

}

const langChanger = new LangChanger({
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
});