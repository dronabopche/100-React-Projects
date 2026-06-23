/**
 * Client-side CSV parser and normalizer for AI/ML visualizers
 */

// Simple robust CSV parser
export function parseCSV(text) {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map(c => c.trim());
    if (cells.length >= 2) {
      rows.push(cells);
    }
  }
  
  return { headers, rows };
}

// Convert parsed CSV rows into normalized numerical arrays
// For Neural Network: scales features x1, x2 to [-1, 1]
// For K-Means: scales features x1, x2 to [0.1, 0.9]
export function processCSVData(parsedData, scaleType = 'nn') {
  const { rows } = parsedData;
  if (rows.length === 0) return { X: [], y: [] };
  
  // Extract numerical values
  const dataset = rows.map(row => {
    const x1 = parseFloat(row[0]) || 0;
    const x2 = parseFloat(row[1]) || 0;
    const label = row[2] !== undefined ? parseInt(row[2]) : 0;
    return { x1, x2, label };
  });
  
  // Find min and max for normalization
  const x1Vals = dataset.map(d => d.x1);
  const x2Vals = dataset.map(d => d.x2);
  
  const minX1 = Math.min(...x1Vals);
  const maxX1 = Math.max(...x1Vals);
  const minX2 = Math.min(...x2Vals);
  const maxX2 = Math.max(...x2Vals);
  
  const rangeX1 = maxX1 - minX1 || 1;
  const rangeX2 = maxX2 - minX2 || 1;
  
  // Normalize
  const X = [];
  const y = [];
  
  dataset.forEach(d => {
    // Standard normalize [0, 1]
    const normX1 = (d.x1 - minX1) / rangeX1;
    const normX2 = (d.x2 - minX2) / rangeX2;
    
    if (scaleType === 'nn') {
      // Scale to [-1, 1] for neural network classification inputs
      X.push([normX1 * 2 - 1, normX2 * 2 - 1]);
      // Binary classification label [0 or 1]
      y.push(d.label === 1 ? 1 : 0);
    } else {
      // Scale to [0.1, 0.9] for K-Means clustering coordinate canvas mapping
      X.push({
        x: 0.1 + normX1 * 0.8,
        y: 0.1 + normX2 * 0.8,
        centroidId: -1
      });
    }
  });
  
  return scaleType === 'nn' ? { X, y } : { points: X };
}

// Built-in sample datasets as CSV strings

// Sample 1: Ad purchases (Age, Income, Purchased)
export const SAMPLE_ADS_CSV = `Age,EstimatedSalary,Purchased
19,19000,0
35,20000,0
26,43000,0
27,57000,0
19,76000,0
27,58000,0
27,84000,0
32,150000,1
25,33000,0
35,65000,0
26,80000,0
26,52000,0
20,86000,0
32,18000,0
18,82000,0
29,80000,0
47,25000,1
45,26000,1
46,28000,1
48,29000,1
45,22000,1
47,49000,1
48,41000,1
45,22000,1
47,20000,1
49,36000,1
45,45000,1
46,23000,1
48,30000,1
45,22000,1
38,50000,0
37,33000,0
42,80000,1
35,91000,0
27,54000,0
37,71000,0
37,72000,0
35,27000,0
35,15000,0
28,33000,0
30,17000,0
28,49000,0
49,150000,1
41,39000,0
35,38000,0
36,34000,0
39,71000,0
41,72000,0
58,144000,1
45,32000,1
37,79000,0
48,74000,1
37,137000,1
41,87000,1
56,104000,1
42,104000,1
59,102000,1
35,31000,0
47,113000,1
46,117000,1
37,93000,1
46,96000,1
35,72000,0
52,150000,1
30,87000,0
20,74000,0
58,38000,1
35,19000,0
22,63000,0
58,101000,1
49,110000,1
29,28000,0
25,87000,0
59,88000,1
21,72000,0
48,119000,1
44,139000,1
32,27000,0
55,125000,1
26,84000,0
52,143000,1
22,81000,0
32,86000,0
38,61000,0
39,134000,1
41,45000,0
37,144000,1
38,59000,0
56,75000,1
54,104000,1
35,57000,0
36,63000,0
40,31000,0
58,101000,1
47,43000,1
35,88000,0
36,86000,0
42,90000,1
40,60000,0
57,60000,1`;

// Sample 2: Customer Segments (Income, SpendingScore)
export const SAMPLE_CUSTOMERS_CSV = `AnnualIncome,SpendingScore
15,39
15,81
16,6
16,77
17,40
17,76
18,6
18,94
19,3
19,72
19,14
19,99
20,15
20,77
20,13
20,79
21,35
21,66
23,29
23,98
24,35
24,73
25,5
25,73
28,82
28,32
28,91
29,31
29,87
29,35
30,4
30,73
33,4
33,92
33,14
33,81
34,17
34,73
37,26
37,75
38,35
38,76
39,28
39,65
40,29
40,55
42,47
42,42
43,86
43,41
44,44
44,49
46,41
46,54
47,40
47,42
48,47
48,59
49,52
49,55
50,40
50,56
54,24
54,42
54,59
54,55
57,56
57,41
59,55
60,40
60,49
60,42
60,49
60,56
62,42
62,56
62,54
62,56
63,48
63,52
63,59`;
