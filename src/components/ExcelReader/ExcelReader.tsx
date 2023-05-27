import React, { useState, ChangeEvent } from "react";
import { Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx";

const ExcelReader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uniqueRows, setUniqueRows] = useState<string[][]>([]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setFile(file);
  };

  const handleFileRead = () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const workbook = XLSX.read(e.target?.result as ArrayBuffer, {
          type: "binary",
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        const uniqueRows: string[][] = [];
        const rowSet: Set<string> = new Set();

        for (let i = 2; i < jsonData.length; i++) {
          const row = jsonData[i];

          let singleProduct = row[8] === 1;

          const rowKey = `${row[6]}-${row[7]}`;
          let undefinedRow = rowKey.split("-")[0] === "undefined";

          if (!rowSet.has(rowKey) && !undefinedRow && singleProduct) {
            rowSet.add(rowKey);
            uniqueRows.push(row);
          }
        }
        uniqueRows.sort((a, b) => a[6].localeCompare(b[6]));
        setUniqueRows(uniqueRows);
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleBulkUpload = () => {
    const formattedData = uniqueRows.map((product) => ({
      description: `${product[6]} ${product[7]}`,
      price: product[10],
    }));

    console.log(formattedData);
  };

  return (
    <div className="row my-5">
      <div className="col-12 m-auto gap-4 d-flex flex-column">
        <Form>
          <Form.Group controlId="bulkUpload">
            <input
              style={{ maxWidth: 600 }}
              className="form-control"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </Form.Group>
        </Form>

        {file && (
          <Button variant="light" onClick={handleFileRead}>
            Leer Archivo
          </Button>
        )}

        {uniqueRows.length > 0 && (
          <Button className="w-25" variant="info" onClick={handleBulkUpload}>
            Ingresar productos
          </Button>
        )}
        <hr className="border-info" />
        {uniqueRows.length > 0 && (
          <div className="table-responsive">
            <table className="table table-dark m-auto w-auto">
              <thead>
                <tr>
                  {/*    <th className="text-info" style={{ fontWeight: 500 }}>
                    #
                  </th> */}
                  <th className="text-info" style={{ fontWeight: 500 }}>
                    Producto
                  </th>
                  <th className="text-info" style={{ fontWeight: 500 }}>
                    Descripción
                  </th>
                  <th
                    className="text-info"
                    style={{ fontWeight: 500, textAlign: "center" }}
                  >
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody>
                {uniqueRows.map((row, index, arr) => (
                  <tr key={index}>
                    {/* <td>{index + 1}</td> */}
                    <td>{row[6]}</td>
                    <td>{row[7]}</td>
                    <td style={{ textAlign: "right", minWidth: "12ch" }}>
                      $ {row[10]},00
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelReader;
