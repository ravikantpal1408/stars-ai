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
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import {
  CloudUpload as CloudUploadIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
  ErrorOutlined as ErrorOutlineIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";

import * as XLSX from "xlsx";
import UploadService from "../../services/uploads/upload.service";

function Uploads() {
  const [data, setData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
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
    reader.readAsArrayBuffer(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const validateData = async () => {
    const newErrors: Record<number, string> = {};

    data.forEach((row, index) => {
      // 1. Empty Row Check
      if (Object.values(row).every((v) => v === null || v === "")) {
        newErrors[index] = "Empty row detected";
      }

      // 2. Email validation
      if (row.Email && !String(row.Email).includes("@")) {
        newErrors[index] = "Invalid email format";
      }

      // 3. Amount check
      if (row.Amount && isNaN(Number(row.Amount))) {
        newErrors[index] = "Amount must be a number";
      }
    });

    setErrors(newErrors);
    setIsValidated(true);

    // 2. Stop if local validation fails
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    formData.append("file", selectedFile); // Matches FastAPI's: file: UploadFile

    try {
      setIsUploading(true);

      // Call your new service method
      const result = await UploadService.validateExcelUpload(selectedFile);

      console.log("Backend response:", result);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Backend validation failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinalUpload = async () => {
    setIsUploading(true);
    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Pushing to database:", data);
    alert("Upload Successful!");
    setIsUploading(false);
    clearFile();
  };

  const clearFile = () => {
    setData([]);
    setFileName(null);
    setIsValidated(false);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasErrors = Object.keys(errors).length > 0;

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ p: 4, width: "100%" }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center", // Moving alignment here solves the TS error
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Universal Excel Upload
          </Typography>

          <Tooltip title="Templates">
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>
              <a
                href="/assets/Investor_Template.xlsx" // Path to your file in the public folder
                download="Investor_Template.xlsx"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FileDownloadIcon fontSize="small" sx={{ mr: 1 }} />
                Investor Template (.xlsx)
              </a>
            </MenuItem>
            {/* You can add more templates here easily */}
          </Menu>
        </Stack>
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
            transition: "0.2s",
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
          <Typography variant="h6" component="div">
            {fileName
              ? `Selected: ${fileName}`
              : "Click to select Excel or CSV"}
          </Typography>
        </Paper>

        {data.length > 0 && (
          <Paper elevation={3} sx={{ p: 3 }}>
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
                  Data Preview ({data.length} rows)
                </Typography>
                {isValidated && (
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ color: hasErrors ? "error.main" : "success.main" }}
                  >
                    {hasErrors
                      ? `Validation Failed: ${Object.keys(errors).length} errors`
                      : "Ready for upload"}
                  </Typography>
                )}
              </Box>

              {/* ACTION BUTTONS */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="text"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={clearFile}
                  disabled={isUploading}
                >
                  Clear
                </Button>

                <Button
                  variant="outlined"
                  onClick={validateData}
                  disabled={isUploading}
                >
                  Validate Data
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  disabled={!isValidated || hasErrors || isUploading}
                  onClick={handleFinalUpload}
                  startIcon={
                    isUploading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {isUploading ? "Uploading..." : "Confirm & Upload"}
                </Button>
              </Stack>
            </Stack>

            {isValidated && hasErrors && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Please correct the highlighted errors before the final upload.
              </Alert>
            )}

            <TableContainer
              sx={{
                maxHeight: 450,
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
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Pending
                            </Typography>
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
