import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Alert,
  Tooltip,
} from "@mui/material";

// ✅ Direct Path Imports: These are the safest for Vite 8 / Rollup resolution
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DeleteIcon from "@mui/icons-material/Delete";

import * as XLSX from "xlsx";

function Uploads() {
  const [data, setData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsValidated(false);
    setErrors({});

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const convertedData: any[] = XLSX.utils.sheet_to_json(ws);
        setData(convertedData);
      } catch (err) {
        console.error("Excel Error:", err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const validateData = () => {
    const newErrors: Record<number, string> = {};

    data.forEach((row, index) => {
      // Logic: Flag empty rows
      if (Object.values(row).every((v) => v === null || v === "")) {
        newErrors[index] = "Empty row detected";
      }

      // Logic: Email validation if column exists
      if (row.Email && !String(row.Email).includes("@")) {
        newErrors[index] = "Invalid email format";
      }

      // Logic: Numeric check for Amount
      if (row.Amount && isNaN(Number(row.Amount))) {
        newErrors[index] = "Amount must be a number";
      }
    });

    setErrors(newErrors);
    setIsValidated(true);
  };

  const clearFile = () => {
    setData([]);
    setFileName(null);
    setIsValidated(false);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Universal Excel Upload
        </Typography>

        {/* Drag & Drop / Click Zone */}
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            border: "2px dashed",
            borderColor: isValidated
              ? hasErrors
                ? "error.light"
                : "success.light"
              : "#ccc",
            backgroundColor: "#fafafa",
            cursor: "pointer",
            mb: 4,
            transition: "background-color 0.2s",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
          />
          <CloudUploadIcon
            sx={{ fontSize: 50, color: "primary.main", mb: 1 }}
          />
          <Typography variant="h6">
            {fileName
              ? `File Selected: ${fileName}`
              : "Click to select Excel or CSV"}
          </Typography>
        </Paper>

        {data.length > 0 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            {/* Replace the Controls Bar Stack with this */}
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  Preview ({data.length} rows)
                </Typography>
                {isValidated && (
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ color: hasErrors ? "error.main" : "success.main" }}
                  >
                    {hasErrors
                      ? `Validation Failed: ${Object.keys(errors).length} issues`
                      : "Validation Passed"}
                  </Typography>
                )}
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={clearFile}
                >
                  Clear
                </Button>
                <Button variant="outlined" onClick={validateData}>
                  Validate
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={!isValidated || hasErrors}
                  onClick={() => console.log("Uploading:", data)}
                >
                  Confirm Upload
                </Button>
              </Stack>
            </Stack>
            {isValidated && hasErrors && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Please correct the red rows below before proceeding.
              </Alert>
            )}

            <TableContainer
              sx={{
                maxHeight: 500,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ bgcolor: "#f5f5f5", fontWeight: "bold", width: 80 }}
                    >
                      Status
                    </TableCell>
                    {Object.keys(data[0]).map((key) => (
                      <TableCell
                        key={key}
                        sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
                      >
                        {key}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => {
                    const errorMsg = errors[index];
                    return (
                      <TableRow
                        key={index}
                        hover
                        sx={{ bgcolor: errorMsg ? "#fff5f5" : "inherit" }}
                      >
                        <TableCell>
                          {isValidated ? (
                            errorMsg ? (
                              <Tooltip title={errorMsg}>
                                <ErrorOutlineIcon
                                  color="error"
                                  fontSize="small"
                                />
                              </Tooltip>
                            ) : (
                              <CheckCircleOutlineIcon
                                color="success"
                                fontSize="small"
                              />
                            )
                          ) : (
                            "Pending"
                          )}
                        </TableCell>
                        {Object.values(row).map((val: any, i) => (
                          <TableCell key={i}>{String(val)}</TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </div>
  );
}

export default Uploads;
