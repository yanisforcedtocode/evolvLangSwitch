console.log(document.title)

const pickerOpts = {
    types: [
      {
        description: 'config filter',
        accept: {
          'config/*': ['.config']
        }
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false
  };

const newLang = 'abc'

async function getFile() {
  // open file picker, destructure the one element returned array
  const fileHandle = await window.showOpenFilePicker(pickerOpts);
  // run code with our fileHandle
  return fileHandle
}

const openDirBtn = document.querySelector("#openDirPicker01")
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
        let culture = xmlDoc.querySelector('[name="Culture"]')
        let value = culture.querySelector('value')
        // value = newLang
        value.textContent = newLang
        console.log(value.textContent)
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