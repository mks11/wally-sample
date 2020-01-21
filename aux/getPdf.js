const names = ["Tamara Lim", "Matt Kerr"];
const dates = ["Jan 12, 2020", "Feb 1, 2020"];

const getPdf = async () => {
  const nameDiv = document.getElementById("name");
  const dateDiv = document.getElementById("date");

  for (let i = 0; i < names.length; i++) {
		// place name/date content in DOM
    nameDiv.innerHTML = names[i];
    dateDiv.innerHTML = dates[i];

		// convert to canvas
    const canvas = await html2canvas(document.getElementById("page"));

		// create blank pdf
    let pdf = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: "letter"
    });

		// embed image in pdf
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 11, 8.5);

    // save locally
    const filename = `${names[i]}.pdf`;
		pdf.save(filename);
  }
};

getPdf();
