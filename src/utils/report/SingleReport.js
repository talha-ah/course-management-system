import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function buildTableBody(data, headers, columns) {
  var body = [];

  body.push(headers);
  var sr = 1;
  data.forEach(function (row) {
    var dataRow = [];

    dataRow.push(sr.toString());
    sr++;

    columns.forEach(function (column) {
      dataRow.push(row[column].toString());
    });

    body.push(dataRow);
  });

  return body;
}

const generatePdfReport = (info, dataRecieved) => {
  var dd = {
    pageSize: 'A4',
    content: [
      {
        columns: [
          {
            text: [
              { text: 'GC University Lahore', fontSize: 16 },
              { text: '\nDepartment of Computer Science', fontSize: 14 },
              { text: `\nBSCS Session - ${info.batch}`, fontSize: 14 },
              { text: `\n${info.materialTitle}`, fontSize: 10 },
              { text: `\nSemester ${info.semester}`, fontSize: 10 },
            ],
            width: '100%',
            alignment: 'center',
            bold: true,
          },
        ],
      },
      {
        columns: [
          {
            columns: [
              {
                text: 'Title:',
                width: '20%',
                alignment: 'left',
                bold: true,
              },
              {
                text: info.title,
                width: 'auto',
                alignment: 'center',
              },
            ],
            width: '30%',
            alignment: 'left',
          },
          {
            text: `Section ${info.section}`,
            width: '27%',
            alignment: 'right',
            bold: true,
          },
          {
            columns: [
              {
                text: 'Course Code:',
                width: '75%',
                alignment: 'right',
                bold: true,
              },
              {
                text: info.code,
                width: '25%',
                alignment: 'left',
                margin: [3, 0, 0, 0],
              },
            ],
            width: '43%',
            alignment: 'right',
          },
        ],
        margin: [0, 5, 0, 0],
      },
      {
        style: 'tableExample',
        headerRows: 1,
        table: {
          widths: ['5%', '15%', '*', '15%'],
          body: buildTableBody(
            dataRecieved,
            [
              { text: 'Sr. #', alignment: 'center' },
              { text: 'Roll Number' },
              { text: 'Student Name' },
              {
                text: `Marks / ${info.totalMarks}`,
                alignment: 'center',
              },
            ],
            ['rollNumber', 'studentName', 'marks']
          ),
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex === 0 ? '#CCCCCC' : null;
          },
        },
      },
      {
        text: "Teacher's Signature: ________________________",
        margin: [40, 20, 0, 0],
        fontSize: 10,
      },
    ],
    styles: {
      header: {
        fontSize: 17,
        bold: true,
        margin: [0, 0, 0, 0],
        alignment: 'center',
      },
      tableExample: {
        fontSize: 8,
        margin: [0, 10, 0, 0],
      },
    },
    defaultStyle: {
      // alignment: 'justify',
    },
  };

  var mypdf = pdfMake.createPdf(dd);
  mypdf.open();
};

export default generatePdfReport;
