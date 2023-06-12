import React, { useState, ChangeEvent } from "react";
import { Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import AxiosInstance from "../../config/apiClient";
import Notification from "../Notification/Notification";

interface Props {
  getAllProducts: () => Promise<void>;
}

const ExcelReader: React.FC<Props> = ({ getAllProducts }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [sheetsData, setSheetsData] = useState<
    { sheetName: string; data: string[][] }[]
  >([]);

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
        const sheetsData: { sheetName: string; data: string[][] }[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });

          const uniqueRows: string[][] = [];
          const rowSet: Set<string> = new Set();

          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.length !== 0) console.log(row[0]);

            const rowKey = row[0];

            const undefinedRow = typeof jsonData[i][0] === "undefined";

            if (!rowSet.has(rowKey) && !undefinedRow) {
              rowSet.add(rowKey);
              uniqueRows.push(row);
            }
          }

          /* for (let i = 2; i < jsonData.length; i++) {
            const row = jsonData[i];
            const singleProduct = row[8] === 1;
            const rowKey = `${row[6]}-${row[7]}`;
            const undefinedRow =
              typeof row[6] === "undefined" || typeof row[7] === "undefined";

            if (!rowSet.has(rowKey) && !undefinedRow && singleProduct) {
              rowSet.add(rowKey);
              uniqueRows.push(row);
            }
          } */

          sheetsData.push({ sheetName, data: uniqueRows });
        });

        setSheetsData(sheetsData);
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleBulkUpload = async () => {
    const formattedData = sheetsData.flatMap((sheet) =>
      sheet.data.map((row) => ({
        description: `${row[6]} ${row[7]}`,
        price: row[10] || 0,
      }))
    );
    setIsLoading(true);
    try {
      const response = await AxiosInstance.post(
        "/products/addBulk",
        formattedData
      );
      if (response.status === 200) {
        Notification.fire({
          icon: "success",
          position: "bottom",
          title: "Productos ingresados exitosamente!",
        });
        getAllProducts();
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
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
        {isLoading ? <h5 className="text-center">Guardando Datos...</h5> : null}
        {file && (
          <Button variant="light" onClick={handleFileRead}>
            Leer Archivo
          </Button>
        )}
        {sheetsData.length > 0 && (
          <Button className="" variant="info" onClick={handleBulkUpload}>
            {isLoading ? <>Guardando Datos...</> : <>Ingresar productos</>}
          </Button>
        )}
        <hr className="border-info" />
        {sheetsData.map((sheet, index) => (
          <div key={index} className="table-responsive">
            <table className="table table-dark m-auto w-auto">
              <thead>
                <tr>
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
                {sheet.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
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
        ))}
      </div>
    </div>
  );
};

export default ExcelReader;
