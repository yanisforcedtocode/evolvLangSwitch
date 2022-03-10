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
        console.log(handle.name)
    }
}
)