import React, { useState, useRef } from "react";
import * as MUI from "@mui/material";
import * as Icons from "@mui/icons-material";
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

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const validateData = async () => {
    const newErrors: Record<number, string> = {};
    data.forEach((row, index) => {
      if (Object.values(row).every((v) => v === null || v === ""))
        newErrors[index] = "Empty row detected";
      if (row.Email && !String(row.Email).includes("@"))
        newErrors[index] = "Invalid email format";
      if (row.Amount && isNaN(Number(row.Amount)))
        newErrors[index] = "Amount must be a number";
    });

    setErrors(newErrors);
    setIsValidated(true);
    if (Object.keys(newErrors).length > 0 || !selectedFile) return;

    try {
      setIsUploading(true);
      await UploadService.validateExcelUpload(selectedFile);
    } catch (error) {
      alert("Backend validation failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinalUpload = async () => {
    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
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

  return (
    <div style={{ display: "flex" }}>
      <MUI.Box sx={{ p: 4, width: "100%" }}>
        {/* HEADER SECTION */}
        <MUI.Stack
          direction="row"
          spacing={1}
          sx={{ mb: 3, alignItems: "center" }}
        >
          <MUI.Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold" }}
          >
            Universal Excel Upload
          </MUI.Typography>

          <MUI.Tooltip title="Templates">
            <MUI.IconButton onClick={handleMenuClick}>
              <Icons.MoreVert />
            </MUI.IconButton>
          </MUI.Tooltip>

          <MUI.Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MUI.MenuItem onClick={handleMenuClose}>
              <a
                href="/assets/Investor_Template.xlsx"
                download="Investor_Template.xlsx"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Icons.FileDownload fontSize="small" sx={{ mr: 1 }} />
                Investor Template (.xlsx)
              </a>
            </MUI.MenuItem>
          </MUI.Menu>
        </MUI.Stack>

        {/* UPLOAD ZONE */}
        <MUI.Paper
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
          <Icons.CloudUpload
            sx={{ fontSize: 50, color: "primary.main", mb: 1 }}
          />
          <MUI.Typography variant="h6">
            {fileName
              ? `Selected: ${fileName}`
              : "Click to select Excel or CSV"}
          </MUI.Typography>
        </MUI.Paper>

        {data.length > 0 && (
          <MUI.Paper elevation={3} sx={{ p: 3 }}>
            <MUI.Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <MUI.Box>
                <MUI.Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Data Preview ({data.length} rows)
                </MUI.Typography>
                {isValidated && (
                  <MUI.Typography
                    variant="body2"
                    sx={{ color: hasErrors ? "error.main" : "success.main" }}
                  >
                    {hasErrors
                      ? `Validation Failed: ${Object.keys(errors).length} errors`
                      : "Ready for upload"}
                  </MUI.Typography>
                )}
              </MUI.Box>

              <MUI.Stack direction="row" spacing={2}>
                <MUI.Button
                  variant="text"
                  color="error"
                  startIcon={<Icons.Delete />}
                  onClick={clearFile}
                  disabled={isUploading}
                >
                  Clear
                </MUI.Button>
                <MUI.Button
                  variant="outlined"
                  onClick={validateData}
                  disabled={isUploading}
                >
                  Validate Data
                </MUI.Button>
                <MUI.Button
                  variant="contained"
                  color="success"
                  disabled={!isValidated || hasErrors || isUploading}
                  onClick={handleFinalUpload}
                  startIcon={
                    isUploading ? (
                      <MUI.CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {isUploading ? "Uploading..." : "Confirm & Upload"}
                </MUI.Button>
              </MUI.Stack>
            </MUI.Stack>

            {isValidated && hasErrors && (
              <MUI.Alert severity="error" sx={{ mb: 2 }}>
                Please correct the highlighted errors before the final upload.
              </MUI.Alert>
            )}

            <MUI.TableContainer
              sx={{
                maxHeight: 450,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
              }}
            >
              <MUI.Table stickyHeader size="small">
                <MUI.TableHead>
                  <MUI.TableRow>
                    <MUI.TableCell
                      sx={{ bgcolor: "#f5f5f5", fontWeight: "bold", width: 80 }}
                    >
                      Status
                    </MUI.TableCell>
                    {Object.keys(data[0]).map((key) => (
                      <MUI.TableCell
                        key={key}
                        sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
                      >
                        {key}
                      </MUI.TableCell>
                    ))}
                  </MUI.TableRow>
                </MUI.TableHead>
                <MUI.TableBody>
                  {data.map((row, index) => {
                    const errorMsg = errors[index];
                    return (
                      <MUI.TableRow
                        key={index}
                        hover
                        sx={{ bgcolor: errorMsg ? "#fff5f5" : "inherit" }}
                      >
                        <MUI.TableCell>
                          {isValidated ? (
                            errorMsg ? (
                              <MUI.Tooltip title={errorMsg}>
                                <Icons.ErrorOutlined
                                  color="error"
                                  fontSize="small"
                                />
                              </MUI.Tooltip>
                            ) : (
                              <Icons.CheckCircleOutlined
                                color="success"
                                fontSize="small"
                              />
                            )
                          ) : (
                            <MUI.Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Pending
                            </MUI.Typography>
                          )}
                        </MUI.TableCell>
                        {Object.values(row).map((val: any, i) => (
                          <MUI.TableCell key={i}>{String(val)}</MUI.TableCell>
                        ))}
                      </MUI.TableRow>
                    );
                  })}
                </MUI.TableBody>
              </MUI.Table>
            </MUI.TableContainer>
          </MUI.Paper>
        )}
      </MUI.Box>
    </div>
  );
}

export default Uploads;
