const names = ["Matthew Kerr", "Tamara Lim"];
const dates = ["Jan 12, 2020", "Feb 1, 2020"];
const emails = ["theresa.l.morelli@gmail.com"];

const getPdf = async () => {
  // place name/date content in DOM
  const nameDiv = document.getElementById("name");
  const dateDiv = document.getElementById("date");
  for (let i = 0; i < names.length; i++) {
    nameDiv.innerHTML = names[i];
    dateDiv.innerHTML = dates[i];
    let name = names[i];
    // convert to canvas
    const canvas = await html2canvas(document.getElementById("page"));

    // create blank pdf
    let pdf = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: "letter"
    });

    // embed image in pdf
    await pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 11, 8.5);

    let filename = name.split(" ").join("-");
    
  // save locally
    await pdf.save(filename);
  }
};

getPdf();
