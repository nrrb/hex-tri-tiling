import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  
  // State variables
  const [currentTiling, setCurrentTiling] = useState('triangular');
  const [currentMode, setCurrentMode] = useState('circles');
  const [circleRadius, setCircleRadius] = useState(3);
  const [circleColor, setCircleColor] = useState('#ADD8E6');
  const [lineColor, setLineColor] = useState('#ADD8E6');
  const [triSide, setTriSide] = useState(50);
  const [hexSize, setHexSize] = useState(30);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Resize canvas to fill viewport.
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawCanvas();
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTiling, currentMode, circleRadius, circleColor, lineColor, triSide, hexSize]);

  // Grid generation functions for on-screen drawing
  const generateTriangularGrid = (width, height) => {
    const side = triSide;
    const origin = { x: -side, y: -side };
    const v1 = { x: side, y: 0 };
    const v2 = { x: side / 2, y: side * Math.sqrt(3) / 2 };
    const cols = Math.round(width / side);
    const rows = Math.round(height * Math.sqrt(3) / side);
    let grid = [];
    for (let i = -cols; i <= cols; i++) {
      let row = [];
      for (let j = 0; j <= rows; j++) {
        const x = origin.x + i * v1.x + j * v2.x;
        const y = origin.y + i * v1.y + j * v2.y;
        row.push({ x, y });
      }
      grid.push(row);
    }
    return grid;
  };

  const generateHexagonalGrid = (width, height) => {
    const size = hexSize;
    const origin = { x: -size, y: -size };
    const v1 = { x: size * Math.sqrt(3), y: 0 };
    const v2 = { x: size * Math.sqrt(3) / 2, y: size * 3 / 2 };
    const cols = Math.round(width / size);
    const rows = Math.round(height / size);
    let grid = [];
    for (let i = -cols; i <= cols; i++) {
      let row = [];
      for (let j = -rows; j <= rows; j++) {
        const x = origin.x + i * v1.x + j * v2.x;
        const y = origin.y + i * v1.y + j * v2.y;
        row.push({ x, y });
      }
      grid.push(row);
    }
    return grid;
  };

  const getHexagonVertices = (center, size) => {
    let vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      vertices.push({
        x: center.x + size * Math.cos(angle),
        y: center.y + size * Math.sin(angle)
      });
    }
    return vertices;
  };

  const drawHexagon = (ctx, center, size) => {
    const vertices = getHexagonVertices(center, size);
    ctx.beginPath();
    vertices.forEach((v, index) => {
      if (index === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
    ctx.stroke();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const grid = currentTiling === 'triangular'
      ? generateTriangularGrid(width, height)
      : generateHexagonalGrid(width, height);
    ctx.clearRect(0, 0, width, height);

    // Draw lines if mode is 'lines' or 'combined'
    if (currentMode === 'lines' || currentMode === 'combined') {
      ctx.strokeStyle = lineColor;
      if (currentTiling === 'triangular') {
        for (let i = 0; i < grid.length - 1; i++) {
          for (let j = 0; j < grid[i].length - 1; j++) {
            const pA = grid[i][j],
              pB = grid[i+1][j],
              pC = grid[i][j+1],
              pD = grid[i+1][j+1];
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.lineTo(pC.x, pC.y);
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pB.x, pB.y);
            ctx.lineTo(pD.x, pD.y);
            ctx.lineTo(pC.x, pC.y);
            ctx.closePath();
            ctx.stroke();
          }
        }
      } else {
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[i].length; j++) {
            drawHexagon(ctx, grid[i][j], hexSize);
          }
        }
      }
    }

    // Draw circles if mode is 'circles' or 'combined'
    if (currentMode === 'circles' || currentMode === 'combined') {
      ctx.fillStyle = circleColor;
      if (currentTiling === 'triangular') {
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[i].length; j++) {
            const p = grid[i][j];
            ctx.beginPath();
            ctx.arc(p.x, p.y, circleRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else {
        const drawn = new Set();
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[i].length; j++) {
            const center = grid[i][j];
            const vertices = getHexagonVertices(center, hexSize);
            vertices.forEach(v => {
              const key = `${Math.round(v.x * 100) / 100},${Math.round(v.y * 100) / 100}`;
              if (!drawn.has(key)) {
                drawn.add(key);
                ctx.beginPath();
                ctx.arc(v.x, v.y, circleRadius, 0, Math.PI * 2);
                ctx.fill();
              }
            });
          }
        }
      }
    }
  };

  // PDF export functions using fixed letter dimensions (612 x 792 pt)
  const generateTriangularGridPDF = (width, height) => {
    const side = triSide;
    const origin = { x: -side, y: -side };
    const v1 = { x: side, y: 0 };
    const v2 = { x: side / 2, y: side * Math.sqrt(3) / 2 };
    const cols = Math.round(width / side);
    const rows = Math.round(height * Math.sqrt(3) / side);
    let grid = [];
    for (let i = -cols; i <= cols; i++) {
      let row = [];
      for (let j = 0; j <= rows; j++) {
        const x = origin.x + i * v1.x + j * v2.x;
        const y = origin.y + i * v1.y + j * v2.y;
        row.push({ x, y });
      }
      grid.push(row);
    }
    return grid;
  };

  const generateHexagonalGridPDF = (width, height) => {
    const size = hexSize;
    const origin = { x: -size, y: -size };
    const v1 = { x: size * Math.sqrt(3), y: 0 };
    const v2 = { x: size * Math.sqrt(3) / 2, y: size * 3 / 2 };
    const cols = Math.round(width / size);
    const rows = Math.round(height / size);
    let grid = [];
    for (let i = -cols; i <= cols; i++) {
      let row = [];
      for (let j = -rows; j <= rows; j++) {
        const x = origin.x + i * v1.x + j * v2.x;
        const y = origin.y + i * v1.y + j * v2.y;
        row.push({ x, y });
      }
      grid.push(row);
    }
    return grid;
  };

  const exportToVectorPDF = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let grid = currentTiling === 'triangular'
      ? generateTriangularGridPDF(pdfWidth, pdfHeight)
      : generateHexagonalGridPDF(pdfWidth, pdfHeight);

    if (currentMode === 'lines' || currentMode === 'combined') {
      const hexLine = lineColor.replace('#', '');
      const lr = parseInt(hexLine.substr(0, 2), 16),
            lg = parseInt(hexLine.substr(2, 2), 16),
            lb = parseInt(hexLine.substr(4, 2), 16);
      pdf.setDrawColor(lr, lg, lb);
      if (currentTiling === 'triangular') {
        for (let i = 0; i < grid.length - 1; i++) {
          for (let j = 0; j < grid[i].length - 1; j++) {
            const pA = grid[i][j],
                  pB = grid[i+1][j],
                  pC = grid[i][j+1],
                  pD = grid[i+1][j+1];
            pdf.line(pA.x, pA.y, pB.x, pB.y);
            pdf.line(pB.x, pB.y, pC.x, pC.y);
            pdf.line(pC.x, pC.y, pA.x, pA.y);
            pdf.line(pB.x, pB.y, pD.x, pD.y);
            pdf.line(pD.x, pD.y, pC.x, pC.y);
            pdf.line(pC.x, pC.y, pB.x, pB.y);
          }
        }
      } else {
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[i].length; j++) {
            const center = grid[i][j];
            const vertices = getHexagonVertices(center, hexSize);
            for (let k = 0; k < vertices.length; k++) {
              const v1 = vertices[k],
                    v2 = vertices[(k+1) % vertices.length];
              pdf.line(v1.x, v1.y, v2.x, v2.y);
            }
          }
        }
      }
    }

    if (currentMode === 'circles' || currentMode === 'combined') {
      const hexCircle = circleColor.replace('#', '');
      const r = parseInt(hexCircle.substr(0, 2), 16),
            g = parseInt(hexCircle.substr(2, 2), 16),
            b = parseInt(hexCircle.substr(4, 2), 16);
      pdf.setFillColor(r, g, b);
      if (currentTiling === 'triangular') {
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[i].length; j++) {
            const p = grid[i][j];
            pdf.circle(p.x, p.y, circleRadius, 'F');
          }
        }
      } else {
        const drawn = new Set();
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[i].length; j++) {
            const center = grid[i][j];
            const vertices = getHexagonVertices(center, hexSize);
            vertices.forEach(v => {
              const key = `${Math.round(v.x * 100) / 100},${Math.round(v.y * 100) / 100}`;
              if (!drawn.has(key)) {
                drawn.add(key);
                pdf.circle(v.x, v.y, circleRadius, 'F');
              }
            });
          }
        }
      }
    }
    pdf.save('vector-tiling.pdf');
  };

  return (
    <div className="App">
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Controls
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="tiling-select-label">Tiling</InputLabel>
              <Select
                labelId="tiling-select-label"
                value={currentTiling}
                label="Tiling"
                onChange={(e) => setCurrentTiling(e.target.value)}
              >
                <MenuItem value="triangular">Triangular</MenuItem>
                <MenuItem value="hexagonal">Hexagonal</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="mode-select-label">Mode</InputLabel>
              <Select
                labelId="mode-select-label"
                value={currentMode}
                label="Mode"
                onChange={(e) => setCurrentMode(e.target.value)}
              >
                <MenuItem value="circles">Circles</MenuItem>
                <MenuItem value="lines">Lines</MenuItem>
                <MenuItem value="combined">Combined</MenuItem>
              </Select>
            </FormControl>
            <Typography gutterBottom>Tile Size</Typography>
            <Slider
              value={currentTiling === 'triangular' ? triSide : hexSize}
              onChange={(e, newValue) => {
                if (currentTiling === 'triangular') setTriSide(newValue);
                else setHexSize(newValue);
              }}
              min={10}
              max={100}
            />
            <Typography>
              {currentTiling === 'triangular' ? triSide : hexSize} px
            </Typography>
            <Typography gutterBottom>Circle Size</Typography>
            <Slider
              value={circleRadius}
              onChange={(e, newValue) => setCircleRadius(newValue)}
              min={1}
              max={10}
            />
            <Typography>{circleRadius} px</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>Circle Color</Typography>
              <input
                type="color"
                value={circleColor}
                onChange={(e) => setCircleColor(e.target.value)}
                style={{ width: '100%', height: '40px', border: 'none', padding: 0 }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography>Line Color</Typography>
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                style={{ width: '100%', height: '40px', border: 'none', padding: 0 }}
              />
            </Box>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={exportToVectorPDF}>
              Export to PDF (Letter)
            </Button>
          </Box>
          <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #ccc' }}>
            <Typography variant="body2">Made by Nicholas Bennett. © 2025</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <IconButton
                component="a"
                href="https://www.linkedin.com/in/nicholasrrbennett/"
                target="_blank"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://github.com/nrrb/hex-tri-tiling"
                target="_blank"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://buymeacoffee.com/nrrb"
                target="_blank"
                aria-label="Buy me a coffee"
              >
                <LocalCafeIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 150,
          backgroundColor: '#fff'
        }}
      >
        <MenuIcon />
      </IconButton>
      <canvas id="canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
