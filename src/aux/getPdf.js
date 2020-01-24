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
    // const data = await pdf.output("arraybuffer"); // after passing to back end, this looks like an empty object
    // const data = await pdf.output("blob");     // after passing to back end, this looks like an empty object
    // const data = await pdf.output("datauri");  // too large - causes 'about:blank#blocked'
    // const base64 = window.btoa(data);
    // console.log('data', data)

    // Perhaps data needs to be chunked, but I'm not sure how to do that with JS

    // try {
    //   axios.post("https://localhost:4001/api/admin/certificate", {
    //     name: names[i],
    //     email: emails[i],
    //     data,
    //   });
    // } catch (err) {
    //   console.error(err)
    // }
    
  // save locally
    console.log(filename);
    await pdf.save(filename);
  }
};

getPdf();
